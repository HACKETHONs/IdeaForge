import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from pydantic import BaseModel, Field, ValidationError
import time

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("Please set GEMINI_API_KEY in your environment variables.")

genai.configure(api_key=API_KEY)

QUESTIONS = {
    "problem_solved": "What problem does this idea solve?",
    "target_market_fit": "How well does it fit the target market?",
    "innovation_uniqueness": "How innovative or unique is it in the industry? (List top 2-4 global/Indian competitors if any, and explain how this stands out)",
    "feasibility": "Is it technically and financially feasible?",
    "risks_competition": "What are the main risks and competition?",
    "existing_market_presence": "How new is this in the current market? (1: crowded, 10: not done before—include brand names if idea already exists)"
}

WEIGHTS = {
    "problem_solved": 0.15,
    "target_market_fit": 0.15,
    "innovation_uniqueness": 0.3,  # Uniqueness favored!
    "feasibility": 0.15,
    "risks_competition": 0.15,
    "existing_market_presence": 0.1
}

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
    suggestions: str
    improvement: str
    success_rate: int  # 0-100

def validate_idea_gemini_optimized(description: str, target_market: str, industry: str, max_retries=3):
    prompt = f"""Startup Idea:
Description: {description}
Target Market: {target_market}
Industry: {industry}

Evaluate this startup idea strictly using these criteria:
- For 'innovation_uniqueness', name 2-4 real brands/global competitors (if any), and explain how this is new or different.
- For 'existing_market_presence', provide a clear rating: 1 (saturated) to 10 (never done before), include brand names if already exists.
- Offer practical 'suggestions' (2-3 points) to make it more unique, feasible, or competitive.
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
  "suggestions": "...",
  "improvement": "...",
  "success_rate": ...
}}
"""

    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    for attempt in range(max_retries):
        try:
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.5,
                    response_mime_type='application/json'
                )
            )
            print("RAW GEMINI RESPONSE:", response.text)
            results_json = json.loads(response.text)
            evaluation = IdeaEvaluation.model_validate(results_json)
            scores = {}
            explanations = {}

            for key, description in QUESTIONS.items():
                criterion = getattr(evaluation, key)
                scores[description] = criterion.score * WEIGHTS[key]
                explanations[description] = criterion.explanation

            final_score = round(sum(scores.values()) * 10, 2)  # Scale to percentage
            unique_scores = set(criterion.score for criterion in evaluation.__dict__.values() if hasattr(criterion, "score"))
            if len(unique_scores) == 1:
                print(f"Warning: uniform scores {unique_scores} detected, retrying prompt (attempt {attempt+1})")
                time.sleep(1)
                continue

            explanations["suggestions"] = evaluation.suggestions
            explanations["improvement"] = evaluation.improvement
            explanations["success_rate"] = f'{evaluation.success_rate}%'
            return final_score, explanations

        except (json.JSONDecodeError, ValidationError) as e:
            print(f"Validation or JSON parse failed on attempt {attempt+1}: {e}")
            time.sleep(1)
        except Exception as e:
            print(f"An error occurred during API call on attempt {attempt+1}: {e}")
            time.sleep(1)

    return 0, {"Error": "Failed to obtain valid varied scoring response after retries."}