import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import ValidationTool from './components/ValidationTool';
import MentorSection from './components/MentorSection';
import DataEcosystem from './components/DataEcosystem';
import Footer from './components/Footer';

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