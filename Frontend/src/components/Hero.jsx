import React from "react";

const Hero = ({ openAuth }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Validate. Connect. Succeed.</h1>
        <p>AI-powered platform that validates your startup ideas, connects you with expert mentors, and creates a trusted data ecosystem to accelerate your entrepreneurial journey.</p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={openAuth}>
            Get Started
          </button>
          <button className="btn-secondary" onClick={openAuth}>
            Find Mentors
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
