import React, { useState, useEffect } from "react";

const Header = ({ openAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <nav className="nav">
        <a href="/" className="logo">IdeaForge</a>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#validate">Validate</a></li>
          <li><a href="#mentors">Mentors</a></li>
          <li><a href="#data">Data</a></li>
        </ul>
        <button
          className="nav-btn"
          onClick={openAuth}
          style={{ cursor: "pointer" }}
        >
          Get Started
        </button>
      </nav>
    </header>
  );
};

export default Header;
