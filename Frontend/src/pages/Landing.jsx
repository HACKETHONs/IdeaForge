import React from "react";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import ValidationTool from "../components/ValidationTool.jsx";
import MentorSection from "../components/MentorSection.jsx";
import DataEcosystem from "../components/DataEcosystem.jsx";

const Landing = ({ openAuth }) => {
  return (
    <>
      <Hero openAuth={openAuth} />
      <Features />
      {/* Wrap ValidationTool button click to open auth */}
      <div>
        <ValidationTool openAuth={openAuth} />
      </div>
      <MentorSection />
      <DataEcosystem />
    </>
  );
};

export default Landing;
