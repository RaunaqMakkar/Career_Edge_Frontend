// src/components/AuthPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api"; // Your Axios instance
import "../styles/AuthPage.css";

const AuthPage = ({
  loggedIn,
  setLoggedIn,
  setUserRole,
  defaultTab = "login", // fallback if not provided
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // If we want to ensure the tab updates if defaultTab changes
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  // -------------------------
  // Login form state
  // -------------------------
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // -------------------------
  // Signup form state
  // -------------------------
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    role: "mentee", // default
  });

  // Switch tab
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setMessage("");
  };

  // -------------------------
  // Handle Login
  // -------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", loginData);
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userRole", res.data.role.toLowerCase());
        setMessage("Login successful!");
        setLoggedIn(true);
        setUserRole(res.data.role.toLowerCase());
        if (res.data.role === "mentee" && res.data.menteeId) {
          localStorage.setItem("menteeId", res.data.menteeId);
        }
        navigate("/dashboard");
      } else {
        setMessage("No token received. Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  // -------------------------
  // Handle Signup
  // -------------------------
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/signup", signupData);
      setMessage("Signup successful! Please log in.");
      // Optionally redirect to login or do mentor onboarding
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data);
      setMessage(error.response?.data?.message || "Signup failed.");
    }
  };

  // Input changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page-container">
      <div className="auth-box">
        <div className="tabs">
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => handleTabSwitch("login")}
          >
            Login
          </button>
          <button
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => handleTabSwitch("signup")}
          >
            Signup
          </button>
        </div>

        {/* ------------------- Login Form ------------------- */}
        {activeTab === "login" && (
          <form className="form" onSubmit={handleLoginSubmit}>
            <h2>Login Form</h2>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Login</button>
            {message && <p className="message">{message}</p>}
          </form>
        )}

        {/* ------------------- Signup Form ------------------- */}
        {activeTab === "signup" && (
          <form className="form" onSubmit={handleSignupSubmit}>
            <h2>Signup Form</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={signupData.role}
                onChange={handleSignupChange}
              >
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
              </select>
            </div>
            <button type="submit" className="submit-btn">Signup</button>
            {message && <p className="message">{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
