import React, { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/ConnectionRequests.css";

const ConnectionRequests = () => {
  const [connections, setConnections] = useState({ received: [], sent: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        console.log("Fetching connection requests...");
        // Use relative URL with axios instance
        const response = await axios.get("https://career-edge-backend.vercel.app/api/connections");
        console.log("Response:", response.data);
        setConnections(response.data);
      } catch (err) {
        console.error("Error fetching connection requests:", err);
        setError("Failed to load connection requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);
  
  const handleAccept = async (connectionId) => {
    try {
      // Use relative URL with axios instance
      await axios.put(`https://career-edge-backend.vercel.app/api/connections/${connectionId}`, { 
        status: 'accepted' 
      });
      
      // Update the local state to reflect the change
      setConnections(prev => {
        const updatedReceived = prev.received.filter(r => r._id !== connectionId);
        return { ...prev, received: updatedReceived };
      });
    } catch (err) {
      console.error("Error accepting request:", err);
      setError("Failed to accept the connection request.");
    }
  };

  const handleDecline = async (connectionId) => {
    try {
      // Use relative URL with axios instance
      await axios.put(`https://career-edge-backend.vercel.app/api/connections/${connectionId}`, { 
        status: 'rejected' 
      });
      
      // Update the local state to reflect the change
      setConnections(prev => {
        const updatedReceived = prev.received.filter(r => r._id !== connectionId);
        return { ...prev, received: updatedReceived };
      });
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
      
      <div className="connections-section">
        <h3>Received Requests</h3>
        {connections.received && connections.received.length === 0 ? (
          <p>No pending requests received.</p>
        ) : (
          <ul className="requests-list">
            {connections.received && connections.received.map((conn) => (
              <li key={conn._id} className="request-item">
                <p><strong>From:</strong> {conn.mentee?.name || "Unknown"}</p>
                <p><strong>Message:</strong> {conn.message}</p>
                <p><strong>Date:</strong> {new Date(conn.createdAt).toLocaleDateString()}</p>
                <div className="request-actions">
                  <button onClick={() => handleAccept(conn._id)}>Accept</button>
                  <button onClick={() => handleDecline(conn._id)}>Decline</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="connections-section">
        <h3>Sent Requests</h3>
        {connections.sent && connections.sent.length === 0 ? (
          <p>No requests sent.</p>
        ) : (
          <ul className="requests-list">
            {connections.sent && connections.sent.map((conn) => (
              <li key={conn._id} className="request-item">
                <p><strong>To:</strong> {conn.mentor?.name || "Unknown"}</p>
                <p><strong>Message:</strong> {conn.message}</p>
                <p><strong>Status:</strong> <span className={`status-${conn.status}`}>{conn.status}</span></p>
                <p><strong>Date:</strong> {new Date(conn.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionRequests;

