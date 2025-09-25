from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import motor.motor_asyncio
from bson import ObjectId

from scorer import validate_idea_gemini_optimized

app = FastAPI()

MONGO_DETAILS = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client["SIH2025"]
ideas_collection = database.get_collection("ideas")
mentors_collection = database.get_collection("mentors")

# SCHEMAS

class IdeaModel(BaseModel):
    user_id: str                # Use a fixed value like 'demo_user' for prototype
    title: str                  # Startup Idea Title
    description: str            # Describe Your Idea
    target_market: str          # Target Market
    industry: str               # Industry

class MentorModel(BaseModel):
    name: str
    expertise: str              # Comma-separated domains (e.g. "AI,FinTech")
    email: EmailStr

def serialize_doc(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id")
    return doc

@app.get("/")
async def root():
    return {"message": "Welcome to SIH MongoDB Backend (AI Scoring enabled)"}

@app.post('/submit-idea')
async def submit_idea(idea: IdeaModel):
    new_idea = idea.dict()
    score, explanations = validate_idea_gemini_optimized(
        new_idea["description"], new_idea["target_market"], new_idea["industry"]
    )
    new_idea["score"] = score
    new_idea["ai_feedback"] = explanations
    result = await ideas_collection.insert_one(new_idea)
    inserted_doc = await ideas_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted_doc)

@app.get('/ideas')
async def list_ideas():
    ideas = []
    async for doc in ideas_collection.find():
        ideas.append(serialize_doc(doc))
    return ideas

@app.post("/create-mentor")
async def create_mentor(mentor: MentorModel):
    new_mentor = mentor.dict()
    result = await mentors_collection.insert_one(new_mentor)
    inserted_doc = await mentors_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted_doc)

@app.get("/mentors")
async def list_mentors():
    mentors = []
    async for doc in mentors_collection.find():
        mentors.append(serialize_doc(doc))
    return mentors

@app.get("/match-mentors/{idea_id}")
async def match_mentors(idea_id: str):
    try:
        idea = await ideas_collection.find_one({"_id": ObjectId(idea_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid idea_id format")
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    idea_industries = set(t.strip().lower() for t in idea.get("industry", "").split(",") if t.strip())
    matches = []
    async for mentor in mentors_collection.find():
        mentor_tags = set(t.strip().lower() for t in mentor.get("expertise", "").split(",") if t.strip())
        if idea_industries & mentor_tags:
            matches.append(serialize_doc(mentor))
    return matches

# Optional: show all ideas for a user w/ matched mentors
@app.get("/ideas/me/{user_id}")
async def get_my_ideas_with_mentors(user_id: str):
    results = []
    async for doc in ideas_collection.find({"user_id": user_id}):
        idea = serialize_doc(doc)
        idea_industries = set(t.strip().lower() for t in idea.get("industry", "").split(",") if t.strip())
        matches = []
        async for mentor in mentors_collection.find():
            mentor_tags = set(t.strip().lower() for t in mentor.get("expertise", "").split(",") if t.strip())
            if idea_industries & mentor_tags:
                matches.append(serialize_doc(mentor))
        idea["matched_mentors"] = matches
        results.append(idea)
    return results