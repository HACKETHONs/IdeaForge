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
    "innovation_uniqueness": "How innovative or unique is it in the industry?",
    "feasibility": "Is it technically and financially feasible?",
    "risks_competition": "What are the risks and competition?"
}
WEIGHTS = {k: 0.2 for k in QUESTIONS}

class CriterionEvaluation(BaseModel):
    explanation: str
    score: int = Field(..., ge=1, le=10)

class IdeaEvaluation(BaseModel):
    problem_solved: CriterionEvaluation
    target_market_fit: CriterionEvaluation
    innovation_uniqueness: CriterionEvaluation
    feasibility: CriterionEvaluation
    risks_competition: CriterionEvaluation

def validate_idea_gemini_optimized(description: str, target_market: str, industry: str, max_retries=3):
    prompt = f"""Startup Idea:
Description: {description}
Target Market: {target_market}
Industry: {industry}

Please evaluate this idea on the following five criteria with clear distinctions:
- Provide a brief 2-3 line explanation for each criterion.
- Assign a score from 1 to 10 for each criterion reflecting strengths and weaknesses.
- Do NOT give the same score to all criteria unless fully justified in the explanation.
- Output ONLY a valid JSON object with this exact structure:
{{
  "problem_solved": {{"explanation": "...", "score": ...}},
  "target_market_fit": {{"explanation": "...", "score": ...}},
  "innovation_uniqueness": {{"explanation": "...", "score": ...}},
  "feasibility": {{"explanation": "...", "score": ...}},
  "risks_competition": {{"explanation": "...", "score": ...}}
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

            final_score = round(sum(scores.values()) * 10, 2)

            unique_scores = set(criterion.score for criterion in evaluation.__dict__.values())
            if len(unique_scores) == 1:
                print(f"Warning: uniform scores {unique_scores} detected, retrying prompt (attempt {attempt+1})")
                time.sleep(1)
                continue

            return final_score, explanations

        except (json.JSONDecodeError, ValidationError) as e:
            print(f"Validation or JSON parse failed on attempt {attempt+1}: {e}")
            time.sleep(1)
        except Exception as e:
            print(f"An error occurred during API call on attempt {attempt+1}: {e}")
            time.sleep(1)

    return 0, {"Error": "Failed to obtain valid varied scoring response after retries."}