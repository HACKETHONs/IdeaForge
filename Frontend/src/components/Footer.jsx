import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>StartupForge</h4>
          <p>Empowering entrepreneurs with AI-driven insights, expert mentorship, and trusted data to build successful startups.</p>
        </div>
        <div className="footer-section">
          <h4>Platform</h4>
          <a href="#">Idea Validation</a>
          <a href="#">Mentor Network</a>
          <a href="#">Data Analytics</a>
          <a href="#">Funding Hub</a>
        </div>
        <div className="footer-section">
          <h4>Resources</h4>
          <a href="#">Success Stories</a>
          <a href="#">Blog</a>
          <a href="#">API Documentation</a>
          <a href="#">Help Center</a>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} StartupForge. All rights reserved. Built with ❤️ for entrepreneurs.</p>
      </div>
    </footer>
  );
};

export default Footer;