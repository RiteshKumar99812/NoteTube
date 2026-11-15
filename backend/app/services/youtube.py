from youtube_transcript_api import (
    YouTubeTranscriptApi,
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)


class TranscriptError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message


def format_ts(seconds: float) -> str:
    s = int(seconds)
    h, rem = divmod(s, 3600)
    m, sec = divmod(rem, 60)
    return f"{h}:{m:02d}:{sec:02d}" if h else f"{m:02d}:{sec:02d}"


def get_transcript(video_id: str) -> str:
    try:
        fetched = YouTubeTranscriptApi().fetch(video_id, languages=["en", "hi"])
    except TranscriptsDisabled:
        raise TranscriptError(404, "This video has captions turned off.")
    except NoTranscriptFound:
        raise TranscriptError(404, "No English or Hindi captions found for this video.")
    except VideoUnavailable:
        raise TranscriptError(404, "Video is unavailable or private.")
    except Exception as e:
        raise TranscriptError(502, f"Could not fetch transcript: {e}")

    # One line per caption chunk, with its start time
    return "\n".join(f"[{format_ts(s.start)}] {s.text}" for s in fetched)