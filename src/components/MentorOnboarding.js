// src/components/MentorOnboarding.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";

const MentorOnboarding = () => {
  const [formData, setFormData] = useState({
    expertise: "",
    skills: "",
    availability: "",
    bio: "",
    experience: 0,
    rates: 0,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally, you might fetch current mentor info here to prefill fields.
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Retrieve mentorId from localStorage or your authentication context.
      // Ensure this is the User's _id (if your Appointment schema references the User model)
      const mentorId = localStorage.getItem("mentorId") || "replace_with_logic";
      const skillsArray = formData.skills.split(",").map((s) => s.trim());

      await axios.put(`https://career-edge-backend.vercel.app/mentors/${mentorId}`, {
        expertise: formData.expertise,
        skills: skillsArray,
        availability: formData.availability,
        bio: formData.bio,
        experience: Number(formData.experience),
        rates: Number(formData.rates),
      });
      setMessage("Mentor details saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessage("Error saving mentor details.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mentor Onboarding</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <label>Expertise</label>
        <input
          type="text"
          name="expertise"
          value={formData.expertise}
          onChange={handleChange}
        />

        <label>Skills (comma-separated)</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
        />

        <label>Availability</label>
        <input
          type="text"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
        />

        <label>Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        />

        <label>Experience (years)</label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />

        <label>Rates (USD/hour)</label>
        <input
          type="number"
          name="rates"
          value={formData.rates}
          onChange={handleChange}
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          Save
        </button>
      </form>
    </div>
  );
};

export default MentorOnboarding;
