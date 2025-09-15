from fastapi import FastAPI, HTTPException, Body
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

from scorer import validate_idea_gemini_optimized

app = FastAPI()

engine = create_engine('sqlite:///./test.db', connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Models
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
    score = Column(Float)

class Mentor(Base):
    __tablename__ = 'mentors'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    expertise = Column(String)  # e.g. "HealthTech,AI"
    email = Column(String, unique=True)

class Investor(Base):
    __tablename__ = 'investors'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)

class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey('ideas.id'))
    investor_id = Column(Integer, ForeignKey('investors.id'))
    rating = Column(Float)
    comments = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

Base.metadata.create_all(bind=engine)

# Schemas
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
    score: float
    class Config:
        from_attributes = True

class MentorOut(BaseModel):
    id: int
    name: str
    expertise: str
    email: str
    class Config:
        from_attributes = True

class InvestorOut(BaseModel):
    id: int
    name: str
    email: str
    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    idea_id: int
    investor_id: int
    rating: float
    comments: str

class ReviewOut(BaseModel):
    id: int
    idea_id: int
    investor_id: int
    rating: float
    comments: str
    created_at: datetime.datetime
    class Config:
        from_attributes = True

# Endpoints

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
    tag_list = idea.tags.split(',') if idea.tags else []
    target_market = tag_list[1].strip() if len(tag_list) > 1 else "General"
    industry = tag_list[0].strip() if tag_list else "General"
    score, explanations = validate_idea_gemini_optimized(
        db_idea.description, target_market, industry
    )
    db_idea.score = score
    db.commit()
    db.refresh(db_idea)
    response = IdeaOut.from_orm(db_idea)
    db.close()
    return response

@app.get('/ideas', response_model=List[IdeaOut])
def list_ideas():
    db = SessionLocal()
    ideas = db.query(Idea).all()
    responses = [IdeaOut.from_orm(idea) for idea in ideas]
    db.close()
    return responses

@app.post("/create-mentor", response_model=MentorOut)
def create_mentor(
    name: str = Body(...),
    expertise: str = Body(...),
    email: str = Body(...)
):
    db = SessionLocal()
    mentor = Mentor(name=name, expertise=expertise, email=email)
    db.add(mentor)
    db.commit()
    db.refresh(mentor)
    result = MentorOut.from_orm(mentor)
    db.close()
    return result

@app.get("/mentors", response_model=List[MentorOut])
def list_mentors():
    db = SessionLocal()
    mentors = db.query(Mentor).all()
    results = [MentorOut.from_orm(m) for m in mentors]
    db.close()
    return results

@app.get("/match-mentors/{idea_id}", response_model=List[MentorOut])
def match_mentors(idea_id: int):
    db = SessionLocal()
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        db.close()
        raise HTTPException(status_code=404, detail="Idea not found")
    idea_tags = set(t.strip().lower() for t in idea.tags.split(",") if t.strip())
    mentors = db.query(Mentor).all()
    matches = []
    for mentor in mentors:
        mentor_tags = set(t.strip().lower() for t in mentor.expertise.split(",") if t.strip())
        if idea_tags & mentor_tags:
            matches.append(MentorOut.from_orm(mentor))
    db.close()
    return matches

@app.post("/create-investor", response_model=InvestorOut)
def create_investor(name: str = Body(...), email: str = Body(...)):
    db = SessionLocal()
    investor = Investor(name=name, email=email)
    db.add(investor)
    db.commit()
    db.refresh(investor)
    result = InvestorOut.from_orm(investor)
    db.close()
    return result

@app.get("/investors", response_model=List[InvestorOut])
def list_investors():
    db = SessionLocal()
    investors = db.query(Investor).all()
    results = [InvestorOut.from_orm(i) for i in investors]
    db.close()
    return results

@app.post("/ideas/{idea_id}/review", response_model=ReviewOut)
def submit_review(idea_id: int, review: ReviewCreate):
    db = SessionLocal()
    db_review = Review(
        idea_id=idea_id,
        investor_id=review.investor_id,
        rating=review.rating,
        comments=review.comments
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    response = ReviewOut.from_orm(db_review)
    db.close()
    return response

@app.get("/ideas/{idea_id}/reviews", response_model=List[ReviewOut])
def list_reviews(idea_id: int):
    db = SessionLocal()
    reviews = db.query(Review).filter(Review.idea_id == idea_id).all()
    results = [ReviewOut.from_orm(r) for r in reviews]
    db.close()
    return results

@app.get("/investor-dashboard", response_model=List[IdeaOut])
def investor_dashboard(stage: str = None, sort_by: str = "score"):
    db = SessionLocal()
    query = db.query(Idea)
    if stage:
        query = query.filter(Idea.stage == stage)
    if sort_by == "score":
        query = query.order_by(Idea.score.desc())
    ideas = query.all()
    result = [IdeaOut.from_orm(i) for i in ideas]
    db.close()
    return result
