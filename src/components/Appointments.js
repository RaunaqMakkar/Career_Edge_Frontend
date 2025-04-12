// src/components/Appointments.js
import React, { useEffect, useState } from "react";
import axios from "../api";
import "../styles/Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    mentor: "",
    mentee: "",
    appointmentDate: "",
    message: ""
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get("/appointments/me");
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

  const handleChange = (e) => {
    setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/appointments", newAppointment);
      setAppointments([...appointments, res.data]);
      setNewAppointment({
        mentor: "",
        mentee: "",
        appointmentDate: "",
        message: ""
      });
      setError("");
    } catch (err) {
      console.error("Error creating appointment:", err);
      setError("Failed to create appointment.");
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`/appointments/${appointmentId}`);
      setAppointments(appointments.filter(app => app._id !== appointmentId));
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
          {appointments.map((appointment) => (
            <li key={appointment._id} className="appointment-item">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(appointment.appointmentDate).toLocaleString()}
                <br />
                <strong>Message:</strong> {appointment.message}
              </p>
              <button onClick={() => handleDelete(appointment._id)}>
                Cancel Appointment
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Schedule a New Appointment</h3>
      <form className="appointment-form" onSubmit={handleSubmit}>
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
          placeholder="Mentee ID"
          value={newAppointment.mentee}
          onChange={handleChange}
          required
        />
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
