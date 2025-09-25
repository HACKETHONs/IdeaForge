import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="hero" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
      <div className="hero-content">
        <h1>Validate. Connect. Succeed.</h1>
        <p>AI-powered platform that validates your startup ideas, connects you with expert mentors, and creates a trusted data ecosystem to accelerate your entrepreneurial journey.</p>
        <div className="cta-buttons">
          <a href="#validate" className="btn-primary">Validate Your Idea</a>
          <a href="#mentors" className="btn-secondary">Find Mentors</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;