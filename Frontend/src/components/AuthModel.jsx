import React from "react";
import Auth from "../pages/Auth.jsx";

const AuthModel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.08)", // Subtle backdrop only
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
    >
      <div
        className="auth-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 8px 32px rgba(8,33,109,0.14)",
          maxWidth: "440px",
          width: "90%",
          padding: "2rem 2.5rem 2.5rem 2.5rem",
          position: "relative",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Close button inside the box at the top right */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1.2rem",
            right: "1.3rem",
            background: "none",
            border: "none",
            fontSize: "2rem",
            color: "#161616",
            cursor: "pointer",
            zIndex: 1
          }}
        >
          &times;
        </button>
        {/* Auth form goes here */}
        <Auth />
      </div>
    </div>
  );
};

export default AuthModel;
