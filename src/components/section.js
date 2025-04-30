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
        <h2 className="shiny">Success Stories</h2>
        <div className="reviews">
          <div className="review-card">
            <p>★★★★★</p>
            <h3>"Career transformation!"</h3>
            <p>
              "Career Edge helped me identify my strengths and connect with a mentor who guided me to a 40% salary increase within 6 months."
            </p>
            <p>
              <strong>Priya Sharma, Delhi</strong>
            </p>
          </div>
          <div className="review-card">
            <p>★★★★★</p>
            <h3>"Found my dream job"</h3>
            <p>
              "The AI recommendations were spot-on! I discovered opportunities I never would have found on traditional job boards."
            </p>
            <p>
              <strong>Rahul Verma, Mumbai</strong>
            </p>
          </div>
          <div className="review-card">
            <p>★★★★★</p>
            <h3>"Invaluable mentorship"</h3>
            <p>
              "The mentor matching algorithm connected me with an industry leader who helped me navigate a challenging career transition."
            </p>
            <p>
              <strong>Ananya Patel, Bangalore</strong>
            </p>
          </div>
          <div className="review-card">
            <p>★★★★★</p>
            <h3>"Skills that matter"</h3>
            <p>
              "The personalized learning paths helped me focus on developing skills that actually made a difference in my job search."
            </p>
            <p>
              <strong>Vikram Singh, Jaipur</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="section contact">
        <div className="overlay">
          <h2>Contact Us</h2>
          <p>📍 Location: Jaipur, India</p>
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
