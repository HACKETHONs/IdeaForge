import React from "react";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import ValidationTool from "../components/ValidationTool.jsx";
import MentorSection from "../components/MentorSection.jsx";
import DataEcosystem from "../components/DataEcosystem.jsx";

const Landing = ({ openAuth, user }) => { // User prop received here
  return (
    <>
      <Hero openAuth={openAuth} user={user} /> {/* User prop passed here */}
      <Features />
      <ValidationTool openAuth={openAuth} user={user} />
      <MentorSection />
      <DataEcosystem />
    </>
  );
};

export default Landing;
