import React, { useState, useEffect } from 'react';

const MentorSection = () => {
  const [mentorsData, setMentorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connections, setConnections] = useState({});

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/mentors');
        if (!response.ok) {
          throw new Error('Failed to fetch mentors.');
        }
        const data = await response.json();
        setMentorsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentors();
  }, []);

  const handleConnect = (mentorName) => {
    setConnections(prev => ({ ...prev, [mentorName]: true }));
    setTimeout(() => {
      alert(`Connection request sent to ${mentorName}! They will contact you within 24 hours.`);
    }, 500);
  };

  return (
    <section className="mentor-section" id="mentors">
      <div className="container">
        <div className="section-title">
          <h2>Connect with Expert Mentors</h2>
          <p>Get guidance from successful entrepreneurs and industry experts</p>
        </div>
        {isLoading && <p>Loading mentors...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {!isLoading && mentorsData.length === 0 && <p>No mentors found. Please add some via the API.</p>}
        <div className="mentor-grid">
          {!isLoading && mentorsData.map((mentor, index) => (
            <div className="mentor-card" key={index}>
              <div className="mentor-avatar">{mentor.name.slice(0, 2).toUpperCase()}</div>
              <h4>{mentor.name}</h4>
              <p className="expertise">{mentor.expertise}</p>
              <p>{mentor.description}</p>
              <button 
                className="connect-btn" 
                onClick={() => handleConnect(mentor.name)}
                disabled={connections[mentor.name]}
              >
                {connections[mentor.name] ? 'Connected!' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorSection;