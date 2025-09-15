# -*- coding: utf-8 -*-
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

# Step 1: Set up the environment and API key
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("Please set GEMINI_API_KEY in your environment variables.")

genai.configure(api_key=API_KEY)

# Predefined evaluation questions with their respective weights
QUESTIONS = {
    "problem_solved": "What problem does this idea solve?",
    "target_market_fit": "How well does it fit the target market?",
    "innovation_uniqueness": "How innovative or unique is it in the industry?",
    "feasibility": "Is it technically and financially feasible?",
    "risks_competition": "What are the risks and competition?"
}
WEIGHTS = {
    "problem_solved": 0.2,
    "target_market_fit": 0.2,
    "innovation_uniqueness": 0.2,
    "feasibility": 0.2,
    "risks_competition": 0.2
}

def validate_idea_gemini_optimized(idea: str, target_market: str, industry: str):
    """
    Evaluates an idea by sending a single, structured prompt to the Gemini API.
    """
    prompt = (
        f"Idea: {idea}\n"
        f"Target Market: {target_market}\n"
        f"Industry: {industry}\n\n"
        "Please evaluate this idea based on the following criteria. For each criterion, provide a short explanation (2-3 lines) and a score from 1 to 10. Format the entire response as a single, valid JSON object. Do not include any extra text or markdown before or after the JSON.\n\n"
        "The JSON object should have these keys:\n"
        f'"{list(QUESTIONS.keys())[0]}": {{"explanation": "...", "score": "..."}}\n'
        f'"{list(QUESTIONS.keys())[1]}": {{"explanation": "...", "score": "..."}}\n'
        f'"{list(QUESTIONS.keys())[2]}": {{"explanation": "...", "score": "..."}}\n'
        f'"{list(QUESTIONS.keys())[3]}": {{"explanation": "...", "score": "..."}}\n'
        f'"{list(QUESTIONS.keys())[4]}": {{"explanation": "...", "score": "..."}}\n'
    )
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                response_mime_type='application/json' # Ensures JSON output for easier parsing
            )
        )
        
        # Parse the JSON response
        results = json.loads(response.text)
        
        scores = {}
        explanations = {}
        
        # Extract and calculate the weighted scores
        for key, q_text in QUESTIONS.items():
            item = results.get(key, {})
            score = item.get("score", 5) # Default to 5 if score is missing
            explanation = item.get("explanation", "No explanation provided.")
            
            # The API may return scores as strings, so convert them to int
            try:
                scores[q_text] = int(score) * WEIGHTS[key]
            except (ValueError, TypeError):
                scores[q_text] = 5 * WEIGHTS[key] # Fallback if score is not a number
            
            explanations[q_text] = explanation
            
        final_score = round(sum(scores.values()) * 10, 2)
        return final_score, explanations

    except Exception as e:
        print(f"An error occurred: {e}")
        return 0, {"Error": "Could not get a valid response from the API."}

if __name__ == "__main__":
    print("--- Idea Validator ---")
    idea = input("Enter idea description: ")
    target_market = input("Enter target market: ")
    industry = input("Enter industry: ")

    score, details = validate_idea_gemini_optimized(idea, target_market, industry)

    print("\n--- Evaluation Results ---")
    if "Error" in details:
        print(details["Error"])
    else:
        print(f"\nFinal Success Score: {score}/100\n")
        for q, explanation in details.items():
            print(f"\n- {q}\n{explanation}")