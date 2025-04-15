// src/components/Profile.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api"; // Your Axios instance with JWT interceptor
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [mentee, setMentee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Combined form state for user and role-specific data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Mentor fields
    expertise: "",
    skills: [],
    availability: "",
    bio: "",
    experience: 0,
    rates: 0,
    // Mentee fields
    interests: [],
    goals: "",
    preferredSkills: [] // NEW: Preferred Skills field for mentees
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    setLoading(true);
    setMessage("");
    try {
      // 1) Get base user info (name, email, role)
      const userRes = await axios.get("https://career-edge-backend.vercel.app/api/users/profile");
      setUser(userRes.data);
      setFormData((prev) => ({
        ...prev,
        name: userRes.data.name || "",
        email: userRes.data.email || "",
      }));
  
      // 2) If user is a mentor, fetch mentor doc
      if (userRes.data.role === "mentor") {
        const mentorRes = await axios.get("https://career-edge-backend.vercel.app/api/mentors");
        const foundMentor = mentorRes.data.find(
          (m) => m.user._id === userRes.data._id
        );
        if (foundMentor) {
          setMentor(foundMentor);
          setFormData((prev) => ({
            ...prev,
            expertise: foundMentor.expertise || "",
            skills: foundMentor.skills || [],
            availability: foundMentor.availability || "",
            bio: foundMentor.bio || "",
            experience: foundMentor.experience || 0,
            rates: foundMentor.rates || 0,
          }));
        }
      }
      // 3) If user is a mentee, fetch mentee doc
      else if (userRes.data.role === "mentee") {
        const menteeRes = await axios.get("https://career-edge-backend.vercel.app/api/mentees");
        const foundMentee = menteeRes.data.find(
          (mn) => mn.user._id === userRes.data._id
        );
        if (foundMentee) {
          setMentee(foundMentee);
          setFormData((prev) => ({
            ...prev,
            interests: foundMentee.interests || [],
            goals: foundMentee.goals || "",
            preferredSkills: foundMentee.preferredSkills || [],
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      skills: e.target.value.split(",").map((skill) => skill.trim()),
    }));
  };

  const handleInterestsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      interests: e.target.value.split(",").map((i) => i.trim()),
    }));
  };

  const handlePreferredSkillsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      preferredSkills: e.target.value.split(",").map((s) => s.trim()),
    }));
  };

  // NEW: Function to add a suggested skill into preferredSkills (limit to 10)
  const handleAddSuggestedSkill = (skill) => {
    if (!formData.preferredSkills.includes(skill) && formData.preferredSkills.length < 10) {
      setFormData((prev) => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, skill],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // 1) Update the user (name, email, password)
      await axios.put("https://career-edge-backend.vercel.app/api/users/profile", {
        name: formData.name,
        email: formData.email,
        password: formData.password ? formData.password : undefined,
      });
  
      // 2) If mentor, update mentor fields
      if (user?.role === "mentor" && mentor) {
        await axios.put(`https://career-edge-backend.vercel.app/api/mentors/${mentor._id}`, {
          expertise: formData.expertise,
          skills: formData.skills,
          availability: formData.availability,
          bio: formData.bio,
          experience: formData.experience,
          rates: formData.rates,
        });
      }
  
      // 3) If mentee, update mentee fields (including preferredSkills)
      if (user?.role === "mentee" && mentee) {
        await axios.put(`https://career-edge-backend.vercel.app/api/mentees/${mentee._id}`, {
          interests: formData.interests,
          goals: formData.goals,
          preferredSkills: formData.preferredSkills,
        });
      }

      setMessage("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      setMessage("Account deletion route not implemented in backend.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/signup");
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage("Error deleting account.");
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading Profile...</p>;
  }

  if (!user) {
    return <p style={{ padding: "20px" }}>No user data found.</p>;
  }

  // Define an array of available suggested skills.
  const availableSuggestedSkills = [
    "Python",
    "JavaScript",
    "Machine Learning",
    "Data Science",
    "Cloud Computing",
    "Cybersecurity",
    "Blockchain",
    "Web Development",
    "AI",
    "React",
    "Node.js",
  ];
  // Get 10 random suggestions
  const randomSuggestedSkills = availableSuggestedSkills
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile Page</h2>
      {message && <p className="profile-message">{message}</p>}

      <form className="profile-form" onSubmit={handleSubmit}>
        {/* SECTION: Basic Information */}
        <div className="profile-section">
          <h3 className="section-title">Basic Information</h3>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password (leave blank to keep existing):</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <p className="role-display"><strong>Role:</strong> {user.role}</p>
        </div>

        {/* SECTION: Mentor Details */}
        {user.role === "mentor" && (
          <div className="profile-section">
            <h3 className="section-title">Mentor Details</h3>
            <div className="form-group">
              <label>Expertise:</label>
              <input type="text" name="expertise" value={formData.expertise} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Skills (comma-separated):</label>
              <input type="text" name="skills" value={formData.skills.join(", ")} onChange={handleSkillsChange} />
            </div>
            <div className="form-group">
              <label>Availability:</label>
              <input type="text" name="availability" value={formData.availability} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Bio:</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Experience (years):</label>
              <input type="number" name="experience" value={formData.experience} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Rates (USD/hour):</label>
              <input type="number" name="rates" value={formData.rates} onChange={handleChange} />
            </div>
          </div>
        )}

        {/* SECTION: Mentee Details */}
        {user.role === "mentee" && (
          <div className="profile-section">
            <h3 className="section-title">Mentee Details</h3>
            <div className="form-group">
              <label>Interests (comma-separated):</label>
              <input type="text" name="interests" value={formData.interests.join(", ")} onChange={handleInterestsChange} />
            </div>
            <div className="form-group">
              <label>Goals:</label>
              <textarea name="goals" value={formData.goals} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Preferred Skills (comma-separated):</label>
              <input type="text" name="preferredSkills" value={formData.preferredSkills.join(", ")} onChange={handlePreferredSkillsChange} />
            </div>
            {/* NEW: Section for manually adding suggested skills */}
            <div className="form-group">
              <label>Suggested Skills (click to add):</label>
              <div className="suggested-skills">
                {randomSuggestedSkills.map((skill, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => handleAddSuggestedSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="update-btn">Update Profile</button>
      </form>

      <button className="delete-account-btn" onClick={handleDeleteAccount}>Delete Account</button>
    </div>
  );
};

export default Profile;



