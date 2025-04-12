import React from "react";
import { Link } from "react-router-dom";
import "../styles/DashboardNavbar.css";

const DashboardNavbar = ({ user }) => {
  // 'user' here is actually the user role passed from App.js, e.g., "mentor" or "mentee"
  const isMentor = user.toLowerCase() === "mentor";
  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-logo">Career Edge</div>
      <ul className="dashboard-nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        <li><Link to="/appointments">Appointments</Link></li>
        <li><Link to="/chat">Chat</Link></li>
        {isMentor ? (
          <li><Link to="/requests">Requests</Link></li>
        ) : (
          <li><Link to="/matchmaking">Matchmaking</Link></li>
        )}
        <li>
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userRole");
              localStorage.removeItem("menteeId");
              // Optionally redirect after logout:
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default DashboardNavbar;
