// src/components/Matchmaking.js
import React, { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Matchmaking.css";

const Matchmaking = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("https://career-edge-backend.vercel.app/api/matchmaking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Sort recommendations by overall match (descending)
        const sorted = res.data.sort(
          (a, b) =>
            b.similarity.overallSimilarity - a.similarity.overallSimilarity
        );
        setRecommendations(sorted);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading recommendations...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="matchmaking-container">
      <h2 className="matchmaking-title">Mentor Matchmaking</h2>
      <div className="mentor-grid">
        {recommendations.length === 0 ? (
          <p>No mentors found matching your preferences.</p>
        ) : (
          recommendations.map((mentor) => (
            <div key={mentor.id} className="mentor-card">
              <h3>{mentor.name}</h3>
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
              <div className="progress-group">
                <label>
                  Preferred Skills Match: {mentor.similarity.skillSimilarity}%
                </label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${mentor.similarity.skillSimilarity}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="progress-group">
                <label>
                  Experience Match: {mentor.similarity.experienceSimilarity}%
                </label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${mentor.similarity.experienceSimilarity}%`,
                    }}
                  ></div>
                </div>
              </div>
              {mentor.similarity.goalSimilarity !== undefined && (
                <div className="progress-group">
                  <label>
                    Goal Match: {mentor.similarity.goalSimilarity}%
                  </label>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${mentor.similarity.goalSimilarity}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="progress-group">
                <label>
                  Overall Match: {mentor.similarity.overallSimilarity}%
                </label>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${mentor.similarity.overallSimilarity}%`,
                    }}
                  ></div>
                </div>
              </div>
              <button
                className="connect-btn"
                onClick={() => navigate(`/mentor/${mentor.id}`)}
              >
                Connect
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Matchmaking;
