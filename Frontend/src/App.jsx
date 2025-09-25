import React, { useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AuthModel from "./components/AuthModel.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  const openAuth = () => setAuthOpen(true);
  const closeAuth = () => setAuthOpen(false);

  return (
    <Router>
      <Header openAuth={openAuth} />
      <main>
        <Routes>
          <Route path="/" element={<Landing openAuth={openAuth} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
      <AuthModel isOpen={authOpen} onClose={closeAuth} />
    </Router>
  );
}

export default App;
