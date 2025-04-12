// src/components/Login.js
import React, { useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = ({ loggedIn, setLoggedIn, setUserRole }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", formData);
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userRole", res.data.role.toLowerCase());
        setMessage("Login successful!");
        setLoggedIn(true);
        setUserRole(res.data.role.toLowerCase());
        navigate("/dashboard");
      } else {
        setMessage("No token received. Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data);
      setMessage(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
