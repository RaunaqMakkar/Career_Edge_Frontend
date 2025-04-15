// src/components/MentorProfileDetails.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api";
import "../styles/MentorProfileDetails.css";

const MentorProfileDetails = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [error, setError] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        // Ensure the mentorId is valid and the token is in localStorage
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("You must be logged in to view mentor details.");
          return;
        }
        const res = await axios.get(`https://career-edge-backend.vercel.app/mentors/${mentorId}`);
        setMentor(res.data);
      } catch (err) {
        console.error("Error fetching mentor:", err);
        setError("Failed to load mentor details.");
      }
    };
    fetchMentor();
  }, [mentorId]);

  const handleConnect = async (e) => {
    e.preventDefault();
    console.log("Mentor ID being sent:", mentorId); // Debugging

    try {
      await axios.post("https://career-edge-backend.vercel.app/connections", {
        mentorId, // Make sure this is the correct mentorId
        message: requestMessage,
      });

      setNotification("Connection request sent! Wait for mentor approval.");
    } catch (err) {
      console.error("Error sending connection request:", err);
      setError("Failed to send connection request.");
    }
  };



  if (error) {
    return <p className="error">{error}</p>;
  }
  if (!mentor) {
    return <p>Loading mentor details...</p>;
  }

  return (
    <div className="mentor-profile-container">
      <h2>{mentor.user.name}'s Profile</h2>
      <p>
        <strong>Expertise:</strong> {mentor.expertise}
      </p>
      <p>
        <strong>Skills:</strong> {mentor.skills.join(", ")}
      </p>
      <p>
        <strong>Bio:</strong> {mentor.bio}
      </p>
      <p>
        <strong>Experience:</strong> {mentor.experience} years
      </p>
      <p>
        <strong>Rates:</strong> ${mentor.rates}/hour
      </p>
      <form onSubmit={handleConnect} className="connection-form">
        <textarea
          placeholder="Write a message to the mentor..."
          value={requestMessage}
          onChange={(e) => setRequestMessage(e.target.value)}
          required
        ></textarea>
        <button type="submit">Connect</button>
      </form>
      {notification && <p className="notification">{notification}</p>}
    </div>
  );
};

export default MentorProfileDetails;
