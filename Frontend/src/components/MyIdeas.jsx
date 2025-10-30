import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the criteria order for display consistency
const CRITERIA_KEYS = [
  "problem_solved", 
  "target_market_fit", 
  "innovation_uniqueness", 
  "feasibility", 
  "risks_competition", 
  "existing_market_presence"
];

const IdeaCard = ({ idea }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Ensure we use the correct keys from the backend response
  const { title, description, score, ai_feedback, matched_mentors } = idea;

  return (
    <div 
      style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '15px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem'
      }}
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h3 style={{ color: 'var(--primary)', margin: 0 }}>{title}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '1.2rem' }}>
            Score: {score}%
          </span>
          <span style={{ fontSize: '1.5rem', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
            &#9660; {/* Down Arrow */}
          </span>
        </div>
      </div>
      
      <p style={{ color: 'var(--gray)', marginTop: '0.5rem', marginBottom: '1rem' }}>
        {description.substring(0, 100)}{description.length > 100 ? '...' : ''}
      </p>

      {/* Expanded Details Section */}
      {isExpanded && ai_feedback && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <h4 style={{ color: 'var(--dark)', marginBottom: '1rem' }}>Detailed AI Analysis:</h4>
          
          {/* AI Score Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {CRITERIA_KEYS.map((key) => {
              const criterion = ai_feedback[key];
              if (!criterion) return null;

              return (
                <div key={key} style={{ padding: '0.8rem', background: '#f8f8f8', borderRadius: '8px', borderLeft: `3px solid ${criterion.score >= 8 ? '#4CAF50' : criterion.score >= 5 ? '#FFC107' : '#F44336'}` }}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--primary)' }}>
                    {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </div>
                  <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{criterion.score}/10</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '0.3rem' }}>
                    {criterion.explanation.substring(0, 50)}...
                  </p>
                </div>
              );
            })}
          </div>

          {/* Matched Mentors List */}
          <h4 style={{ color: 'var(--dark)', marginTop: '1.5rem', marginBottom: '1rem' }}>Matched Mentors ({matched_mentors.length}):</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {matched_mentors.map((mentor) => (
              <li key={mentor.id} style={{ background: 'var(--light)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                {mentor.name} ({mentor.expertise})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const MyIdeas = ({ user }) => {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Redirect to home if not logged in
      navigate('/');
      return;
    }

    const fetchMyIdeas = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/ideas/me/${user.username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user ideas.');
        }
        const data = await response.json();
        setIdeas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyIdeas();
  }, [user, navigate]);

  if (!user) {
    return null; // Will be redirected
  }

  return (
    <section style={{ padding: '8rem 2rem 4rem', minHeight: '80vh', background: 'var(--light)' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--dark)', marginBottom: '2rem', textAlign: 'center' }}>
          My Validated Ideas
        </h1>
        
        {isLoading && <p style={{ textAlign: 'center' }}>Loading your ideas...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}
        
        {!isLoading && ideas.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--gray)' }}>
            You haven't submitted any ideas yet. Validate your first idea on the homepage!
          </p>
        )}
        
        <div style={{ marginTop: '1rem' }}>
          {ideas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MyIdeas;
