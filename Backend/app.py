from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import motor.motor_asyncio
from bson import ObjectId
from scorer import validate_idea_gemini_optimized
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS Middleware to allow communication from your frontend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_DETAILS = "mongodb://localhost:27017"
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client["SIH2025"]
ideas_collection = database.get_collection("ideas")
mentors_collection = database.get_collection("mentors")
users_collection = database.get_collection("users")
# ========== SCHEMAS ==========

class UserModel(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str

class IdeaModel(BaseModel):
    user_id: str
    title: str
    description: str
    target_market: str
    industry: str

class MentorModel(BaseModel):
    name: str
    expertise: str
    description: str
    email: EmailStr

def serialize_mentor(doc):
    return {
        "id": str(doc["_id"]),
        "name": doc.get("name", ""),
        "expertise": doc.get("expertise", ""),
        "description": doc.get("description", ""),
        "email": doc.get("email", "")
    }

def serialize_doc(doc):
    doc["id"] = str(doc["_id"])
    doc.pop("_id")
    return doc

# ========== ENDPOINTS ==========

@app.get("/")
async def root():
    return {"message": "Welcome to SIH MongoDB Backend (AI Scoring enabled)"}

@app.post("/register")
async def register_user(user: UserModel):
    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already registered")
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    await users_collection.insert_one(user.dict())
    return {"msg": "User registered successfully"}

@app.post("/login")
async def login(login_req: LoginModel):
    found = await users_collection.find_one({"email": login_req.email})
    if not found or found.get("password") != login_req.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"msg": "Login successful", "username": found["username"], "email": found["email"]}

@app.post('/submit-idea')
async def submit_idea(idea: IdeaModel):
    # Restrict to registered users only
    user = await users_collection.find_one({"username": idea.user_id})
    if not user:
        raise HTTPException(status_code=403, detail="User not registered. Please login or register first.")
    new_idea = idea.dict()
    score, explanations = validate_idea_gemini_optimized(
        new_idea["description"], new_idea["target_market"], new_idea["industry"]
    )
    new_idea["score"] = score
    new_idea["ai_feedback"] = explanations
    result = await ideas_collection.insert_one(new_idea)
    inserted_doc = await ideas_collection.find_one({"_id": result.inserted_id})
    return serialize_doc(inserted_doc)

@app.put("/edit-idea/{idea_id}")
async def edit_idea(idea_id: str, updated_idea: IdeaModel):
    # Optional: Only allow edit if user exists
    user = await users_collection.find_one({"username": updated_idea.user_id})
    if not user:
        raise HTTPException(status_code=403, detail="User not registered. Please login or register first.")
    result = await ideas_collection.update_one(
        {"_id": ObjectId(idea_id)},
        {"$set": updated_idea.dict()}
    )
    if result.modified_count:
        return {"msg": "Idea updated"}
    raise HTTPException(status_code=404, detail="Idea not found or unchanged")

@app.delete("/delete-idea/{idea_id}")
async def delete_idea(idea_id: str):
    result = await ideas_collection.delete_one({"_id": ObjectId(idea_id)})
    if result.deleted_count:
        return {"msg": "Idea deleted"}
    raise HTTPException(status_code=404, detail="Idea not found")

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
    return serialize_mentor(inserted_doc)

@app.get("/mentors")
async def list_mentors():
    mentors = []
    async for doc in mentors_collection.find():
        mentors.append(serialize_mentor(doc))
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
            matches.append(serialize_mentor(mentor))
    return matches

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
                matches.append(serialize_mentor(mentor))
        idea["matched_mentors"] = matches
        results.append(idea)
    return results