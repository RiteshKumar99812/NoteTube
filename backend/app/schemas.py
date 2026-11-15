from pydantic import BaseModel , EmailStr
from typing import Optional
  
class UserCreate(BaseModel):
  email : EmailStr
  password : str

class UserLogin(BaseModel):
  email : EmailStr
  password : str
  phone_number: str 

class UserOut(BaseModel):
  id : int 
  email : EmailStr
  class Config : 
    orm_mode = True

class GenerateNotesRequest(BaseModel):
    video_id: str

class ConceptSection(BaseModel):
    heading: str
    timestamp: str | None = None
    bullets: list[str]

class GlossaryItem(BaseModel):
    term: str
    definition: str

class QuizItem(BaseModel):
    question: str
    answer: str

class VideoNotes(BaseModel):
    title: str
    tldr: str
    key_concepts: list[ConceptSection]
    glossary: list[GlossaryItem]
    revision_questions: list[QuizItem]

class Token(BaseModel):
  access_token : str
  token_type : str

class TokenData(BaseModel):
  id : Optional[str] = None 