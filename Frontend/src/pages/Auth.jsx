import React, { useState } from "react";
import "./../App.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (!isLogin && (!form.username || !form.email || !form.password)) ||
      (isLogin && (!form.email || !form.password))
    ) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    if (isLogin) {
      alert(`Logging in as ${form.email}`);
    } else {
      alert(`Registering user: ${form.username}`);
    }
  };

  return (
    <div className="auth-container" style={{
      background: "var(--light)",
      borderRadius: "1rem",
      maxWidth: "400px",
      margin: "4rem auto",
      boxShadow: "0 8px 32px rgba(8,33,109,0.12)",
      padding: "2.5rem"
    }}>
      <h2 style={{
        color: "var(--primary)",
        textAlign: "center",
        marginBottom: "1rem"
      }}>
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group" style={{ marginBottom: "0.9rem" }}>
            <label htmlFor="username" style={{ color: "var(--primary-dark)" }}>
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="Enter your username"
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--gray)",
                marginTop: "0.2rem"
              }}
            />
          </div>
        )}
        <div className="form-group" style={{ marginBottom: "0.9rem" }}>
          <label htmlFor="email" style={{ color: "var(--primary-dark)" }}>Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--gray)",
              marginTop: "0.2rem"
            }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: "1.2rem" }}>
          <label htmlFor="password" style={{ color: "var(--primary-dark)" }}>Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            autoComplete={isLogin ? "current-password" : "new-password"}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--gray)",
              marginTop: "0.2rem"
            }}
          />
        </div>
        {error && (
          <div style={{
            color: "var(--accent)",
            marginBottom: "1rem",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          className="btn-primary"
          style={{
            width: "100%",
            padding: "0.7rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <div style={{
        marginTop: "1.4rem",
        textAlign: "center",
        color: "var(--gray)"
      }}>
        {isLogin
          ? <>Don't have an account?{" "}
              <span
                style={{ color: "var(--accent)", cursor: "pointer" }}
                onClick={() => setIsLogin(false)}
              >Sign Up</span>
            </>
          : <>Already have an account?{" "}
              <span
                style={{ color: "var(--accent)", cursor: "pointer" }}
                onClick={() => setIsLogin(true)}
              >Login</span>
            </>
        }
      </div>
    </div>
  );
};

export default Auth;
