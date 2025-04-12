// src/components/HomePage.js
import React from "react";
import { Link } from "react-router-dom";
import "../styles/homepage.css";

const HomePage = () => {
  return (
    <section className="home-section">
      <div className="home-content">
        <h1>Welcome to Career Edge</h1>
        <p>Your AI-powered career enhancement platform</p>
        <p>
          At Career Edge, we believe that career success shouldn't be left to chance.
          Our platform leverages AI, machine learning, and industry expertise
          to provide personalized career guidance.
        </p>
        <p>Join thousands of professionals using Career Edge to shape their future!</p>

        {/* "Get Started" links to the combined login/signup */}
        <Link to="/login" className="get-started-btn">
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default HomePage;
