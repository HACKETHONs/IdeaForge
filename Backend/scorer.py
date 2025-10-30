import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError
import time
import re # Added for robust string parsing

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("Please set GEMINI_API_KEY in your environment variables.")

genai.configure(api_key=API_KEY)

QUESTIONS = {
    "problem_solved": "What problem does this idea solve? (Score 1-10)",
    "target_market_fit": "How well does it fit the target market? (Score 1-10)",
    "innovation_uniqueness": "How innovative or unique is it in the industry? (Score 1-10)",
    "feasibility": "Is it technically and financially feasible? (Score 1-10)",
    "risks_competition": "What are the main risks and competition? (Score 1-10)",
    "existing_market_presence": "How new is this in the current market? (1: crowded, 10: not done before) (Score 1-10)"
}

WEIGHTS = {
    "problem_solved": 0.15,
    "target_market_fit": 0.15,
    "innovation_uniqueness": 0.3,
    "feasibility": 0.15,
    "risks_competition": 0.15,
    "existing_market_presence": 0.1
}

# Adjusted Pydantic models to expect list[str] for dynamic fields
class CriterionEvaluation(BaseModel):
    explanation: str
    score: int = Field(..., ge=1, le=10)

class IdeaEvaluation(BaseModel):
    problem_solved: CriterionEvaluation
    target_market_fit: CriterionEvaluation
    innovation_uniqueness: CriterionEvaluation
    feasibility: CriterionEvaluation
    risks_competition: CriterionEvaluation
    existing_market_presence: CriterionEvaluation
    suggestions: list[str] # Changed to list[str]
    improvement: str
    success_rate: int  # 0-100

def validate_idea_gemini_optimized(description: str, target_market: str, industry: str, max_retries=5):
    # Increased max_retries for better success rate
    prompt = f"""Startup Idea:
Description: {description}
Target Market: {target_market}
Industry: {industry}

Evaluate this startup idea strictly using these criteria. **CRITICAL: Ensure the six scores are NOT all the same number.**

- For 'innovation_uniqueness', name 2-4 real brands/global competitors (if any), and explain in detail how this is new or different.
- For 'existing_market_presence', provide a clear rating: 1 (saturated) to 10 (never done before), include brand names if already exists.
- Offer practical 'suggestions' (2-3 points) as a list to make it more unique, feasible, or competitive.
- Add a brief 'improvement' summary (1-2 lines) on boosting the overall score.
- Estimate the 'success_rate' as an integer percentage (0-100) based on market potential and readiness.
- Output ONLY valid JSON:

{{
  "problem_solved": {{"explanation": "...", "score":...}},
  "target_market_fit": {{"explanation": "...", "score":...}},
  "innovation_uniqueness": {{"explanation": "...", "score":...}},
  "feasibility": {{"explanation": "...", "score":...}},
  "risks_competition": {{"explanation": "...", "score":...}},
  "existing_market_presence": {{"explanation": "...", "score":...}},
  "suggestions": ["...", "..."],
  "improvement": "...",
  "success_rate": ...
}}
"""

    model = genai.GenerativeModel('models/gemini-2.5-flash-lite')
    for attempt in range(max_retries):
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7 + (attempt * 0.1), # Increase temperature on retries to force varied output
                    response_mime_type='application/json'
                )
            )
            
            # Use regex to clean up potential triple backticks or extra text
            clean_text = re.sub(r"```json|```", "", response.text.strip(), flags=re.IGNORECASE)
            
            results_json = json.loads(clean_text)
            evaluation = IdeaEvaluation.model_validate(results_json)
            scores = {}
            explanations = {}

            # Check for non-uniform scores before proceeding
            unique_scores = set(criterion.score for criterion in evaluation.__dict__.values() if hasattr(criterion, "score"))
            
            if len(unique_scores) == 1:
                print(f"Warning: uniform scores {unique_scores} detected, retrying prompt (attempt {attempt+1})")
                time.sleep(1)
                continue
            
            # Calculation and structuring the final output
            for key in QUESTIONS.keys():
                criterion = getattr(evaluation, key)
                scores[key] = criterion.score * WEIGHTS[key]
                explanations[key] = {"explanation": criterion.explanation, "score": criterion.score} # Structure for frontend

            final_score = round(sum(scores.values()) * 10, 2)  # Scale to percentage

            # Convert list of suggestions back to a single string separated by periods
            explanations["suggestions"] = ". ".join(evaluation.suggestions) 
            explanations["improvement"] = evaluation.improvement
            explanations["success_rate"] = f'{evaluation.success_rate}%'
            
            # This is the final structured data passed to FastAPI
            return final_score, explanations

        except (json.JSONDecodeError, ValidationError) as e:
            print(f"Validation or JSON parse failed on attempt {attempt+1}: {e}")
            time.sleep(1)
        except Exception as e:
            print(f"An error occurred during API call on attempt {attempt+1}: {e}")
            time.sleep(1)

    return 0, {"Error": "AI Scoring Failed: Failed to obtain valid varied scoring response after retries."}
