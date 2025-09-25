import React, { useState } from 'react';

const generateValidationResults = (title, industry, market) => {
  const marketScore = Math.floor(Math.random() * 30) + 70;
  const competitionScore = Math.floor(Math.random() * 40) + 60;
  const viabilityScore = Math.floor(Math.random() * 35) + 65;
  const overallScore = Math.floor((marketScore + competitionScore + viabilityScore) / 3);
  
  const recommendations = [
    "Consider conducting user interviews to validate market demand",
    "Research key competitors and identify your unique value proposition",
    "Develop a minimum viable product (MVP) to test core assumptions",
    "Explore potential funding sources in the " + industry + " sector",
    "Connect with mentors experienced in " + industry + " industry"
  ];
  
  const selectedRecommendations = recommendations.slice(0, 3);
  
  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Overall Validation Score: {overallScore}%</h4>
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-number">{marketScore}%</div>
            <div className="stat-label">Market Opportunity</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{competitionScore}%</div>
            <div className="stat-label">Competition Analysis</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{viabilityScore}%</div>
            <div className="stat-label">Business Viability</div>
          </div>
        </div>
        <h4 style={{ color: 'var(--dark)', marginBottom: '1rem' }}>Key Recommendations:</h4>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          {selectedRecommendations.map((rec, index) => <li key={index}>{rec}</li>)}
        </ul>
        <div className="cta-box">
          <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>Ready to take the next step?</h4>
          <p style={{ marginBottom: '1rem', opacity: '0.9' }}>Connect with our expert mentors to refine your idea and develop a go-to-market strategy.</p>
          <button onClick={() => window.location.href = '#mentors'}>Find Mentors</button>
        </div>
      </div>
    </>
  );
};

const ValidationTool = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    market: '',
    industry: '',
  });
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const generatedResults = generateValidationResults(formData.title, formData.industry, formData.market);
      setResults(generatedResults);
      setIsLoading(false);
      
      const resultsSection = document.getElementById('validation-results');
      if (resultsSection) {
        resultsSection.classList.add('visible');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);
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
              <label htmlFor="idea-title">Startup Idea Title</label>
              <input type="text" id="idea-title" value={formData.title} onChange={handleChange} placeholder="e.g., AI-powered fitness coach app" required />
            </div>
            <div className="form-group">
              <label htmlFor="idea-description">Describe Your Idea</label>
              <textarea id="idea-description" rows="4" value={formData.description} onChange={handleChange} placeholder="Explain your startup idea, target market, and value proposition..." required></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="target-market">Target Market</label>
              <input type="text" id="target-market" value={formData.market} onChange={handleChange} placeholder="e.g., Health-conscious millennials in urban areas" required />
            </div>
            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <input type="text" id="industry" value={formData.industry} onChange={handleChange} placeholder="e.g., HealthTech, FinTech, EdTech" required />
            </div>
            <button type="submit" className="validate-btn" disabled={isLoading}>
              {isLoading ? '🤖 Analyzing...' : '🤖 Validate with AI'}
            </button>
          </form>
          
          <div id="validation-results" className="validation-results">
            <h3>🎯 Validation Results</h3>
            {results}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidationTool;