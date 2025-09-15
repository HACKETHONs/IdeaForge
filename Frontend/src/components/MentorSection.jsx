import React, { useState } from 'react';

const mentorsData = [
  { avatar: 'SJ', name: 'Sarah Johnson', expertise: 'FinTech Expert', bio: 'Former VP at Goldman Sachs, Founded 2 successful FinTech startups. 15+ years in financial services.' },
  { avatar: 'MR', name: 'Mark Rodriguez', expertise: 'AI/ML Specialist', bio: 'Lead AI Engineer at Google, Expert in machine learning and product development. 10+ years experience.' },
  { avatar: 'LK', name: 'Lisa Kim', expertise: 'Growth Marketing', bio: 'Growth strategist who scaled 5 startups to $10M+ revenue. Expert in customer acquisition and retention.' },
  { avatar: 'DA', name: 'David Anderson', expertise: 'E-commerce', bio: 'Built and sold 3 e-commerce companies. Expert in supply chain, logistics, and online marketplace strategy.' },
];

const MentorSection = () => {
  const [connections, setConnections] = useState({});

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
        <div className="mentor-grid">
          {mentorsData.map((mentor, index) => (
            <div className="mentor-card" key={index}>
              <div className="mentor-avatar">{mentor.avatar}</div>
              <h4>{mentor.name}</h4>
              <p className="expertise">{mentor.expertise}</p>
              <p>{mentor.bio}</p>
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