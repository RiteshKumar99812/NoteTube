from sqlalchemy import Column , Integer , String , Boolean , ForeignKey , text
from sqlalchemy.sql.sqltypes import TIMESTAMP 
from sqlalchemy.orm import relationship 
from sqlalchemy.sql.expression import text
from .database import Base

from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql.sqltypes import TIMESTAMP

class User(Base):
  __tablename__ = "users"
  id = Column(Integer , primary_key = True , nullable = False )
  email = Column(String ,nullable = False ,unique = True )
  password = Column(String, nullable = False)
  created_at = Column(TIMESTAMP(timezone = True) , nullable = False , server_default = text('now()'))
  phone_number = Column(String , nullable = False)

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, nullable=False)
    youtube_id = Column(String, unique=True, nullable=False, index=True)
    title = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text("now()"))


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id", ondelete="CASCADE"),
                      nullable=False, unique=True)
    content = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False,
                        server_default=text("now()"))