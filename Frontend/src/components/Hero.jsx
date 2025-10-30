import React from "react";

const Hero = ({ openAuth, user }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Validate. Connect. Succeed.</h1>
        <p>AI-powered platform that validates your startup ideas, connects you with expert mentors, and creates a trusted data ecosystem to accelerate your entrepreneurial journey.</p>
        <div className="cta-buttons">
          {user ? (
            // Buttons for Logged-In User
            <>
              <a href="#validate" className="btn-primary">
                Validate Your Idea
              </a>
              <a href="#mentors" className="btn-secondary">
                Find Mentors
              </a>
            </>
          ) : (
            // Buttons for Logged-Out User
            <>
              <button className="btn-primary" onClick={openAuth}>
                Get Started
              </button>
              <a href="#features" className="btn-secondary">
                Learn More
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
