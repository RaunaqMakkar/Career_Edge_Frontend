import React, { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/ConnectionRequests.css";

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log("Fetching connection requests...");
        // Use the relative path with the axios instance
        const res = await axios.get("/api/connections/requests");
        console.log("Response:", res.data);
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching connection requests:", err);
        setError("Failed to load connection requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);
  
  const handleAccept = async (requestId) => {
    try {
      // Use the relative path with the axios instance
      await axios.put(`/api/connections/accept/${requestId}`);
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Error accepting request:", err);
      setError("Failed to accept the connection request.");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      // Use the relative path with the axios instance
      await axios.put(`/api/connections/decline/${requestId}`);
      setRequests(requests.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Error declining request:", err);
      setError("Failed to decline the connection request.");
    }
  };

  if (loading) return <p>Loading connection requests...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="requests-container">
      <h2>Connection Requests</h2>
      {requests.length === 0 ? (
        <p>No connection requests at the moment.</p>
      ) : (
        <ul className="requests-list">
          {requests.map((req) => (
            <li key={req._id} className="request-item">
              <p><strong>Mentee:</strong> {req.menteeName || "Unknown"}</p>
              <p><strong>Message:</strong> {req.message}</p>
              <div className="request-actions">
                <button onClick={() => handleAccept(req._id)}>Accept</button>
                <button onClick={() => handleDecline(req._id)}>Decline</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConnectionRequests;

