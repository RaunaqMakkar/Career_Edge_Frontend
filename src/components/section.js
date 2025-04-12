// src/components/section.js
import React from "react";
import "../styles/sections.css";
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
// IMPORT LINK
import { Link } from "react-router-dom";

const Sections = () => {
  return (
    <div>
      {/* Home Section */}
      <section id="home" className="section home">
        <div className="overlay">
          <h1>Welcome to Career Edge</h1>
          <p>Your AI-powered career enhancement platform</p>
          <p>
            At Career Edge, we believe that career success shouldn't be left to chance. Our platform leverages AI, machine
            learning, and industry expertise to provide personalized career guidance.
          </p>
          <p>Join thousands of professionals using Career Edge to shape their future!</p>

          {/* USE LINK INSTEAD OF ANCHOR TAG */}
          <Link to="/login" className="btn">
            Get Started
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section services">
        <div className="overlay">
          <h2>Our Services – Empowering Your Career Growth</h2>
          <ul>
            <li>
              <strong>Career Assessment:</strong> Discover your strengths and ideal career path.
            </li>
            <li>
              <strong>AI Recommendations:</strong> Personalized job and mentorship suggestions.
            </li>
            <li>
              <strong>Learning Paths:</strong> Curated courses for skill enhancement.
            </li>
            <li>
              <strong>Find Mentors:</strong> Connect with industry experts.
            </li>
            <li>
              <strong>Job Board:</strong> Access exclusive job opportunities.
            </li>
          </ul>
        </div>
      </section>

      <section id="about" className="about">
        <h2 className="shiny">Shiny Happy Clients</h2>
        <div className="reviews">
          <div className="review-card">
            <p>★★★★★</p>
            <h3>“I'm addicted to the Cleanic!”</h3>
            <p>
              “I'm a testimonial. Click to edit me and add text that says something nice about you and your services.”
            </p>
            <p>
              <strong>Jane Deirs, AR</strong>
            </p>
          </div>
          <div className="review-card">
            <p>★★★★★</p>
            <h3>“My flat looks like a boutique hotel”</h3>
            <p>
              “I'm a testimonial. Click to edit me and add text that says something nice about you and your services.”
            </p>
            <p>
              <strong>Eric Laguardia, CA</strong>
            </p>
          </div>
          <div className="review-card">
            <p>★★★★★</p>
            <h3>“Soft perfection”</h3>
            <p>
              “I'm a testimonial. Click to edit me and add text that says something nice about you and your services.”
            </p>
            <p>
              <strong>Lena Rogel, RI</strong>
            </p>
          </div>
          <div className="review-card">
            <p>★★★★★</p>
            <h3>“I'm obsessed”</h3>
            <p>
              “I'm a testimonial. Click to edit me and add text that says something nice about you and your services.”
            </p>
            <p>
              <strong>Jean McDermott, CT</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="section contact">
        <div className="overlay">
          <h2>Contact Us</h2>
          <p>📍 Location: [Jaipur, India]</p>
          <p>📧 Email: raunaq.makkarpc@gmail.com</p>
          <p>📞 Phone: +91 1234506789</p>
          <div className="social-icons">
            <a href="https://www.instagram.com/">
              <FaInstagram />
            </a>
            <a href="https://x.com/?lang=en&mx=2">
              <FaTwitter />
            </a>
            <a href="https://in.linkedin.com/">
              <FaLinkedin />
            </a>
            <a href="https://github.com/">
              <FaGithub />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>© 2025 Career Edge. All rights reserved.</footer>
    </div>
  );
};

export default Sections;
