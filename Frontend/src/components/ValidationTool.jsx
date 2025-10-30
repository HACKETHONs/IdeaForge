import React, { useState } from 'react';

// Define the criteria order for display
const CRITERIA_KEYS = [
  "problem_solved", 
  "target_market_fit", 
  "innovation_uniqueness", 
  "feasibility", 
  "risks_competition", 
  "existing_market_presence"
];

const ValidationTool = ({ openAuth, user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    market: '',
    industry: '',
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // New state to track connections within the validation results
  const [connections, setConnections] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults(null);
    setConnections({}); // Reset connections when submitting new idea

    if (!user) {
      alert("Please log in to validate your idea.");
      openAuth();
      return;
    }

    setIsLoading(true);

    const ideaData = {
      user_id: user.username,
      title: formData.title,
      description: formData.description,
      target_market: formData.market,
      industry: formData.industry,
    };

    try {
      // 1. Submit Idea for AI Scoring
      const validationResponse = await fetch('http://127.0.0.1:8000/submit-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ideaData),
      });

      const validationData = await validationResponse.json();

      if (!validationResponse.ok) {
        throw new Error(validationData.Error || validationData.detail || 'Failed to validate idea.');
      }

      // Check for AI error, which returns score 0 and an error explanation object
      if (validationData.score === 0 && validationData.ai_feedback.Error) {
        throw new Error(`AI Scoring Failed: ${validationData.ai_feedback.Error}`);
      }

      // 2. Fetch matched mentors using the new idea's ID
      const mentorsResponse = await fetch(`http://127.0.0.1:8000/match-mentors/${validationData.id}`);
      const mentorsData = await mentorsResponse.json();

      setResults({ ...validationData, matched_mentors: mentorsData });
    } catch (err) {
      console.error("Validation Error:", err);
      setError(`Validation failed: ${err.message}. Please check your backend terminal for detailed AI errors.`);
    } finally {
      setIsLoading(false);
    }
  };

  // New function to handle the connect button click
  const handleConnect = (mentorName) => {
    setConnections(prev => ({ ...prev, [mentorName]: true }));
    setTimeout(() => {
      // Note: alert() should ideally be replaced with a custom modal UI
      alert(`Connection request sent to ${mentorName}! They will contact you within 24 hours.`);
    }, 500);
  };

  const renderResults = () => {
    if (!results || !results.ai_feedback) return null;

    const { ai_feedback, score, matched_mentors } = results;

    // Calculate sum of scores for the stat grid
    const totalScore = CRITERIA_KEYS.reduce((sum, key) => sum + (ai_feedback[key]?.score || 0), 0);
    const averageScore = CRITERIA_KEYS.length > 0 ? Math.round(totalScore / CRITERIA_KEYS.length) * 10 : 0;
    
    // Use the score returned from the backend (which is the final weighted score)
    const finalScoreDisplay = score || averageScore; 

    return (
      <>
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Overall Validation Score: {finalScoreDisplay}%</h4>
          
          {/* Detailed Criteria Scores */}
          <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {CRITERIA_KEYS.map((key) => {
              const criterion = ai_feedback[key];
              if (!criterion) return null;

              return (
                <div 
                  className="stat-card" 
                  key={key}
                  style={{ 
                    // Adjusted inline styles for better visibility and consistency
                    borderLeft: `4px solid ${criterion.score >= 8 ? '#4CAF50' : criterion.score >= 5 ? '#FFC107' : '#F44336'}`,
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    textAlign: 'left'
                  }}
                >
                  <div className="stat-label" style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                    {key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </div>
                  <div className="stat-number" style={{ fontSize: '2rem', color: 'var(--accent)', fontWeight: 'bold' }}>{criterion.score}/10</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray)', marginTop: '0.5rem' }}>
                    {criterion.explanation}
                  </p>
                </div>
              );
            })}
          </div>

          <h4 style={{ color: 'var(--dark)', marginTop: '2rem', marginBottom: '1rem' }}>AI Recommendations & Summary:</h4>
          
          {/* Suggestions */}
          <div style={{ padding: '1rem', background: '#f1f5f9', borderRadius: '10px', marginBottom: '1.5rem' }}>
            <h5 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Suggestions to Improve:</h5>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              {ai_feedback.suggestions.split(/(?<=\.)\s+/).filter(s => s.trim()).map((rec, index) => (
                <li key={index}>
                  {rec.trim().endsWith('.') ? rec.trim() : rec.trim() + '.'}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvement Summary */}
          <div style={{ padding: '1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '2rem' }}>
            <h5 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Improvement Summary:</h5>
            <p>{ai_feedback.improvement}</p>
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>Estimated Success Rate: {ai_feedback.success_rate}%</p>
          </div>
          
        </div>
        
        {/* Matched Mentors Section - Styled to match MentorSection.jsx */}
        {matched_mentors && matched_mentors.length > 0 && (
          <div style={{ padding: '2rem', background: 'var(--primary)', borderRadius: '15px' }}>
            <h4 style={{ color: 'white', marginBottom: '1rem', textAlign: 'center' }}>🤝 Your Matched Mentors:</h4>
            <p style={{ marginBottom: '2rem', opacity: '0.9', color: 'white', textAlign: 'center' }}>
              Connect with these experts based on your industry ({formData.industry}).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {matched_mentors.map((mentor, index) => (
                <div 
                  key={index} 
                  className="mentor-card" // Reusing the class for styling consistency
                  style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                  }}
                >
                  <div 
                    className="mentor-avatar"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      margin: '0 auto 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: 'white',
                      fontWeight: '600',
                    }}
                  >
                    {mentor.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.2rem', color: 'var(--dark)' }}>{mentor.name}</h4>
                  <p className="expertise" style={{ color: 'var(--primary)', fontWeight: '500', marginBottom: '0.5rem' }}>{mentor.expertise}</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>{mentor.description}</p>
                  <button 
                    className="connect-btn" 
                    onClick={() => handleConnect(mentor.name)} // Added handler
                    disabled={connections[mentor.name]} // Added disabled state
                    style={{
                      marginTop: '1rem',
                      background: connections[mentor.name] ? 'var(--primary)' : 'var(--accent)', // Style based on state
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      opacity: connections[mentor.name] ? 0.6 : 1,
                    }}
                  >
                    {connections[mentor.name] ? 'Connected!' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="validation-tool" id="validate">
      <div className="container">
        <div className="section-title">
          <h2>Validate Your Startup Idea</h2>
          <p>Get AI-powered insights and validation for your startup concept</p>
        </div>
        <div className="tool-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Startup Idea Title</label>
              <textarea id="title" value={formData.title} onChange={handleChange} placeholder="e.g., AI-powered fitness coach app" required ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="description">Describe Your Idea</label>
              <textarea id="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Explain your startup idea, target market, and value proposition..." required></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="market">Target Market</label>
              <textarea id="market" value={formData.market} onChange={handleChange} placeholder="e.g., Health-conscious millennials in urban areas" required ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="industry">Industry (Comma separated: e.g., FinTech, AI)</label>
              <textarea id="industry" value={formData.industry} onChange={handleChange} placeholder="e.g., HealthTech, FinTech, EdTech" required ></textarea>
            </div>
            <button type="submit" className="validate-btn" disabled={isLoading}>
              {isLoading ? '🤖 Analyzing...' : '🤖 Validate with AI'}
            </button>
          </form>
          {error && <div style={{ color: 'red', marginTop: '1rem', fontWeight: 'bold' }}>{error}</div>}
          <div id="validation-results" className={`validation-results ${results ? 'visible' : ''}`}>
            <h3>🎯 AI Validation Report</h3>
            {renderResults()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidationTool;
