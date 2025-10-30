import React, { useState } from "react";
import "./../App.css";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      (!isLogin && (!form.username || !form.email || !form.password)) ||
      (isLogin && (!form.email || !form.password))
    ) {
      setError("Please fill all fields.");
      return;
    }

    const endpoint = isLogin ? "login" : "register";
    const body = isLogin
      ? { email: form.email, password: form.password }
      : { username: form.username, email: form.email, password: form.password };

    try {
      const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.msg);
        if (isLogin) {
          // Direct login, no alert, and close modal
          onLogin({ username: data.username, email: data.email });
        }
      } else {
        setError(data.detail || "Something went wrong.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Could not connect to the server.");
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
        {success && (
          <div style={{
            color: "green",
            marginBottom: "1rem",
            textAlign: "center"
          }}>
            {success}
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