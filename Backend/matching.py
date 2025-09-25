import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def recommend_mentors(idea_industry, target_market=None, top_n=3):
    # Load mentor dataset
    try:
        mentors = pd.read_csv('mentors.csv')
    except FileNotFoundError:
        return [{"error": "mentors.csv not found"}]

    # If target_market is used as a filter, you can implement that here as well.
    # If you want to filter on industry:
    filtered = mentors[mentors['industry'].str.lower().str.contains(idea_industry.lower())]

    if filtered.empty:
        return []

    mentor_tags = filtered['expertise'].fillna('')

    # Combine mentor tags and the idea industry for fitting the vectorizer
    combined_tags = list(mentor_tags) + [idea_industry]
    vectorizer = TfidfVectorizer().fit(combined_tags)

    mentor_vecs = vectorizer.transform(mentor_tags)
    idea_vec = vectorizer.transform([idea_industry])

    # Calculate cosine similarity between idea and mentors
    similarities = cosine_similarity(idea_vec, mentor_vecs).flatten()
    if len(similarities) == 0:
        return []

    # Get top N mentor indices by similarity
    top_indices = similarities.argsort()[-top_n:][::-1]
    recommended = filtered.iloc[top_indices]

    # Ensure these columns exist in mentors.csv:
    columns = [col for col in ['id', 'name', 'expertise', 'industry', 'location'] if col in recommended.columns]
    return recommended[columns].to_dict(orient='records')