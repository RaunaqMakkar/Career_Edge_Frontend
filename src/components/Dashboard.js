// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "../api"; // Axios instance with JWT interceptor
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = ({ userRole }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(userRole);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRole(storedRole);
    }

    // In the fetchProfile function
    const fetchProfile = async () => {
      try {
        // Use the axios instance without manually adding headers
        const res = await axios.get("/api/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };
    
    // In the fetchAppointments function
    const fetchAppointments = async () => {
      try {
        // Add debugging to check token
        const token = localStorage.getItem("authToken");
        console.log("Using token:", token ? "Token exists" : "No token found");
        
        // Use the axios instance without manually adding headers
        const res = await axios.get("/api/appointments/me");
        console.log("Appointments data:", res.data);
        console.log("Response status:", res.status);
        
        // Check if data is an array
        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        } else {
          console.error("Unexpected data format:", res.data);
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        console.error("Error response:", err.response ? err.response.data : "No response data");
        setError("Failed to fetch appointments.");
      }
    };

    Promise.all([fetchProfile(), fetchAppointments()]).finally(() => {
      setLoading(false);
    });
  }, [navigate]);

  if (loading) {
    return <p className="dashboard-loading">Loading Dashboard...</p>;
  }

  return (
    <div className="dashboard-page">
      {role === "mentor" ? (
        <section className="dashboard-section">
          <h2>Mentoring Tools</h2>
          <p>
            Manage your mentoring sessions, update your expertise, and track
            progress of your mentees.
          </p>
        </section>
      ) : (
        <section className="dashboard-section">
          <h2>Mentor Suggestions</h2>
          <p>
            Based on your career goals, discover recommended mentors and match
            with industry experts.
          </p>
        </section>
      )}

      <section className="dashboard-section" id="appointments-section">
        <h2>Appointments</h2>
        <p>
          View your scheduled sessions and availability. Integrate with Calendly
          or Google Calendar.
        </p>
        {error && <p className="error">{error}</p>}
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appointment) => (
              <li key={appointment._id}>
                <strong>{appointment.status}</strong> —{" "}
                {new Date(appointment.appointmentDate).toLocaleString()}
                <br />
                {appointment.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No appointments found.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
