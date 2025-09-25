import React from 'react';

const featuresData = [
  { icon: '🤖', title: 'AI-Powered Validation', description: 'Advanced algorithms analyze market trends, competition, and viability to provide data-driven insights on your startup idea\'s potential for success.' },
  { icon: '🤝', title: 'Mentor Matching', description: 'Connect with industry experts and successful entrepreneurs who align with your vision, industry, and stage of development.' },
  { icon: '📊', title: 'Trusted Data Ecosystem', description: 'Access verified market data, funding insights, and success metrics to make informed decisions about your startup strategy.' },
  { icon: '💰', title: 'Funding Readiness', description: 'Get actionable recommendations to improve your funding prospects and connect with relevant investors and funding opportunities.' },
  { icon: '🎯', title: 'Market Intelligence', description: 'Real-time market analysis, competitor tracking, and customer insight tools to help you stay ahead of the curve.' },
  { icon: '🚀', title: 'Growth Acceleration', description: 'Personalized roadmaps and milestone tracking to accelerate your startup\'s growth from idea to market success.' },
];

const Features = () => {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="section-title">
          <h2>Empowering Entrepreneurs</h2>
          <p>Comprehensive tools and insights to transform your startup ideas into successful ventures</p>
        </div>
        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;