from fastapi import FastAPI
from app.routers import ideas, mentors, progress

# Create FastAPI app instance
app = FastAPI(
    title="Entrepreneur Trust Platform API",
    description="API layer for Idea Submission, Mentor Matching, and Progress Tracking",
    version="1.0.0"
)

# Register routers
app.include_router(ideas.router, prefix="/ideas", tags=["Ideas"])
app.include_router(mentors.router, prefix="/mentors", tags=["Mentors"])
app.include_router(progress.router, prefix="/progress", tags=["Progress"])

# Health check / Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to Entrepreneur Trust Platform 🚀"}
