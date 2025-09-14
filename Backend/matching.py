import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Function to recommend mentors based on expertise tags and stage
def recommend_mentors(idea_tags, idea_stage, top_n=3):
    # Load mentor dataset (fresh each time, so new mentors are seen)
    try:
        mentors = pd.read_csv('mentors.csv')
    except FileNotFoundError:
        return [{"error": "mentors.csv not found"}]

    # Filter mentors matching the idea stage
    filtered = mentors[mentors['stage'].str.lower() == idea_stage.lower()]
    if filtered.empty:
        return []

    mentor_tags = filtered['tags'].fillna('')

    # Combine mentor tags and the idea tags for fitting the vectorizer
    combined_tags = list(mentor_tags) + [idea_tags]
    vectorizer = TfidfVectorizer().fit(combined_tags)
    mentor_vecs = vectorizer.transform(mentor_tags)
    idea_vec = vectorizer.transform([idea_tags])

    # Calculate cosine similarity between idea and mentors
    similarities = cosine_similarity(idea_vec, mentor_vecs).flatten()

    if len(similarities) == 0:
        return []

    # Get top N mentor indices by similarity
    top_indices = similarities.argsort()[-top_n:][::-1]
    recommended = filtered.iloc[top_indices]
    # Adjust columns as per your actual mentors.csv headers!
    return recommended[['id', 'name', 'expertise', 'stage', 'location', 'tags']].to_dict(orient='records')