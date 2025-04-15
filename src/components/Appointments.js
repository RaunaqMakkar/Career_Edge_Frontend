import React, { useEffect, useState } from "react";
import axios from "../api";
import "../styles/Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    mentor: "",
    mentee: "",
    appointmentDate: "",
    message: ""
  });

  // Fetch current user profile first
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("/api/users/profile");
        setCurrentUser(res.data);
        
        // Pre-fill the appropriate field based on user role
        if (res.data.role === "mentor") {
          setNewAppointment(prev => ({
            ...prev,
            mentor: res.data._id
          }));
        } else if (res.data.role === "mentee") {
          setNewAppointment(prev => ({
            ...prev,
            mentee: res.data._id
          }));
        }
        
        console.log("Current user:", res.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Fetch appointments for the logged-in user
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/api/appointments/me");
        console.log("Appointments data:", res.data);
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  // Handle new appointment creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating appointment with data:", newAppointment);
      const res = await axios.post("/api/appointments", newAppointment);
      console.log("Appointment created:", res.data);
      
      // Refresh appointments list after creating a new one
      const updatedAppointments = await axios.get("/api/appointments/me");
      setAppointments(updatedAppointments.data);
      
      // Reset form
      setNewAppointment({
        mentor: currentUser?.role === "mentor" ? currentUser._id : "",
        mentee: currentUser?.role === "mentee" ? currentUser._id : "",
        appointmentDate: "",
        message: ""
      });
      setError("");
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Failed to create appointment: " + (err.response?.data?.message || err.message));
    }
  };

  // Handle appointment deletion
  const handleDelete = async (appointmentId) => {
    try {
      // Changed from "token" to "authToken" to match what's used in AuthContext
      await axios.delete(`/api/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setAppointments(appointments.filter((app) => app._id !== appointmentId)); // Update state
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Failed to delete appointment.");
    }
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="appointments-list">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <li key={appointment._id} className="appointment-item">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(appointment.appointmentDate).toLocaleString()}
                  <br />
                  <strong>Status:</strong> {appointment.status}
                  <br />
                  <strong>Message:</strong> {appointment.message}
                </p>
                <button onClick={() => handleDelete(appointment._id)}>
                  Cancel Appointment
                </button>
              </li>
            ))
          ) : (
            <p>No appointments found. Create one below!</p>
          )}
        </ul>
      )}

      <h3>Schedule a New Appointment</h3>
      <form className="appointment-form" onSubmit={handleSubmit}>
        {currentUser?.role === "mentee" ? (
          <>
            <input
              type="text"
              name="mentor"
              placeholder="Mentor ID"
              value={newAppointment.mentor}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mentee"
              placeholder="Your ID (Mentee)"
              value={newAppointment.mentee}
              onChange={handleChange}
              disabled
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="mentor"
              placeholder="Your ID (Mentor)"
              value={newAppointment.mentor}
              onChange={handleChange}
              disabled
            />
            <input
              type="text"
              name="mentee"
              placeholder="Mentee ID"
              value={newAppointment.mentee}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="datetime-local"
          name="appointmentDate"
          value={newAppointment.appointmentDate}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={newAppointment.message}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Create Appointment</button>
      </form>
    </div>
  );
};

export default Appointments;
