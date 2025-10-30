import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = ({ openAuth, user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        {user ? (
          <div 
            className="profile-menu" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              backgroundColor: dropdownOpen ? 'rgba(22, 22, 22, 0.1)' : 'transparent',
              transition: 'background-color 0.3s'
            }}
          >
            <div 
              className="profile-avatar"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '1rem',
                marginRight: '0.5rem',
              }}
            >
              {user.username.slice(0, 1).toUpperCase()}
            </div>
            <span 
              className="profile-name"
              style={{ fontWeight: '600', color: 'var(--dark)' }}
            >
              {user.username}
            </span>
            {dropdownOpen && (
              <div 
                className="dropdown-content"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  backgroundColor: 'white',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  borderRadius: '10px',
                  minWidth: '150px',
                  zIndex: 10,
                  overflow: 'hidden',
                  border: '1px solid #eee'
                }}
              >
                <Link 
                  to="/my-ideas" 
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    textDecoration: 'none',
                    color: 'var(--dark)',
                    borderBottom: '1px solid #f7f7f7'
                  }}
                >
                  My Ideas
                </Link>
                <div 
                  onClick={onLogout}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    color: 'var(--dark)',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="nav-btn"
            onClick={openAuth}
            style={{ cursor: "pointer" }}
          >
            Get Started
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
