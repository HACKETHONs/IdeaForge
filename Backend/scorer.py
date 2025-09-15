import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

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

def validate_idea_gemini_optimized(idea: str, target_market: str, industry: str):
    prompt = (
        f"Idea: {idea}\n"
        f"Target Market: {target_market}\n"
        f"Industry: {industry}\n\n"
        "Please evaluate this idea based on the following criteria. For each criterion, provide a short explanation (2-3 lines) and a score from 1 to 10. "
        "Format the entire response as a single, valid JSON object. Do not include any extra text or markdown before or after the JSON.\n\n"
        "The JSON object should have these keys:\n"
        f'"problem_solved": {{"explanation": "...", "score": "..."}}\n'
        f'"target_market_fit": {{"explanation": "...", "score": "..."}}\n'
        f'"innovation_uniqueness": {{"explanation": "...", "score": "..."}}\n'
        f'"feasibility": {{"explanation": "...", "score": "..."}}\n'
        f'"risks_competition": {{"explanation": "...", "score": "..."}}\n'
    )

    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.3,
                response_mime_type='application/json'
            )
        )
        print("RAW GEMINI RESPONSE:", response.text)  # <--- Debugging output

        try:
            results = json.loads(response.text)
        except Exception as e:
            print(f"JSON decode failed. Output was:\n{response.text}\nError: {e}")
            return 0, {"Error": f"Could not parse Gemini output: {e}. Raw: {response.text}"}

        scores = {}
        explanations = {}
        for key, q_text in QUESTIONS.items():
            item = results.get(key, {})
            score = item.get("score", 5)
            explanation = item.get("explanation", "No explanation provided.")
            try:
                scores[q_text] = int(score) * WEIGHTS[key]
            except (ValueError, TypeError):
                scores[q_text] = 5 * WEIGHTS[key]
            explanations[q_text] = explanation
        final_score = round(sum(scores.values()) * 10, 2)
        return final_score, explanations

    except Exception as e:
        print(f"An error occurred: {e}")
        return 0, {"Error": f"Could not get a valid response from the API. {str(e)}"}
