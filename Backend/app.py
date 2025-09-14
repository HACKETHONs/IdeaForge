from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

from matching import recommend_mentors  # Make sure this file exists and is correct

app = FastAPI()

engine = create_engine('sqlite:///./test.db', connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Database Models
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)

class Idea(Base):
    __tablename__ = 'ideas'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String)
    description = Column(String)
    stage = Column(String)
    tags = Column(String)
    submission_date = Column(DateTime, default=datetime.datetime.utcnow)

class Milestone(Base):
    __tablename__ = 'milestones'
    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey('ideas.id'))
    description = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String)

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class IdeaCreate(BaseModel):
    user_id: int
    title: str
    description: str
    stage: str
    tags: str

class IdeaOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    stage: str
    tags: str
    submission_date: datetime.datetime

    class Config:
        orm_mode = True

# API Endpoints
@app.get("/")
def root():
    return {"message": "Welcome to SIH Backend"}

@app.post('/submit-idea', response_model=IdeaOut)
def submit_idea(idea: IdeaCreate):
    db = SessionLocal()
    db_idea = Idea(
        user_id=idea.user_id,
        title=idea.title,
        description=idea.description,
        stage=idea.stage,
        tags=idea.tags
    )
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    db.close()
    return db_idea

@app.get('/ideas', response_model=List[IdeaOut])
def list_ideas():
    db = SessionLocal()
    ideas = db.query(Idea).all()
    db.close()
    return ideas

@app.get('/get-mentors/{idea_id}')
def get_mentors(idea_id: int, top_n: int = 3):
    db = SessionLocal()
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        db.close()
        raise HTTPException(status_code=404, detail="Idea not found")
    # Use saved tags for matching
    mentors = recommend_mentors(idea_tags=idea.tags, idea_stage=idea.stage, top_n=top_n)
    db.close()
    return {"mentors": mentors}