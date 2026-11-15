import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .. import schemas, models
from ..database import get_db
from ..services.youtube import get_transcript, TranscriptError
from ..services.llm import generate_notes as make_notes, LLMError

router = APIRouter(prefix="/api", tags=["Notes"])

VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
MAX_TRANSCRIPT_CHARS = 400_000


@router.post("/generate-notes", response_model=schemas.VideoNotes)
def generate_notes(req: schemas.GenerateNotesRequest, db: Session = Depends(get_db)):
    if not VIDEO_ID_RE.match(req.video_id):
        raise HTTPException(status_code=400, detail="That is not a valid YouTube video ID.")

    cached = (
        db.query(models.Note)
        .join(models.Video, models.Note.video_id == models.Video.id)
        .filter(models.Video.youtube_id == req.video_id)
        .first()
    )
    if cached:
        return cached.content

    try:
        transcript = get_transcript(req.video_id)
    except TranscriptError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    if len(transcript) > MAX_TRANSCRIPT_CHARS:
        raise HTTPException(status_code=413, detail="This video is too long to process.")

    try:
        notes = make_notes(transcript)
    except LLMError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    try:
        video = models.Video(youtube_id=req.video_id, title=notes.title)
        db.add(video)
        db.flush()
        db.add(models.Note(video_id=video.id, content=notes.model_dump()))
        db.commit()
    except IntegrityError:
        db.rollback()  # another request saved this video first

    return notes