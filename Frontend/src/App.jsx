import React, { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import MyIdeas from "./components/MyIdeas.jsx"; // Import the new component
import AuthModel from "./components/AuthModel.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  const openAuth = () => setAuthOpen(true);
  const closeAuth = () => setAuthOpen(false);

  const handleLogin = (userData) => {
    setUser(userData);
    closeAuth();
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Header openAuth={openAuth} user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Landing openAuth={openAuth} user={user} />} />
          {/* New route for My Ideas */}
          <Route path="/my-ideas" element={<MyIdeas user={user} />} />
        </Routes>
      </main>
      <Footer />
      <AuthModel isOpen={authOpen} onClose={closeAuth} onLogin={handleLogin} />
    </Router>
  );
}

export default App;
