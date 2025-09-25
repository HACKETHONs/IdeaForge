import React from "react";
import Auth from "../pages/Auth.jsx";

const AuthModel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="auth-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
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
          backgroundColor: "var(--light)",
          borderRadius: "1rem",
          boxShadow: "0 12px 32px rgba(8,33,109,0.15)",
          maxWidth: "460px",
          width: "90%",
          padding: "2.5rem 2.5rem",
          position: "relative",
          fontFamily: "'Inter', sans-serif",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            fontSize: "2.25rem",
            fontWeight: "bold",
            color: "var(--primary)",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          &times;
        </button>
        <Auth />
      </div>
    </div>
  );
};

export default AuthModel;
