import React from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Features from './components/Features.jsx';
import ValidationTool from './components/ValidationTool.jsx';
import MentorSection from './components/MentorSection.jsx';
import DataEcosystem from './components/DataEcosystem.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <ValidationTool />
        <MentorSection />
        <DataEcosystem />
      </main>
      <Footer />
    </>
  );
}

export default App;