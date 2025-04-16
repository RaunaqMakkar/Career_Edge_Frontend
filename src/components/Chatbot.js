// FrontEnd/src/components/Chatbot.js
import React, { useState } from "react";
import axios from "../api";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [conversation, setConversation] = useState([]); // stores chat history
  const [input, setInput] = useState(""); // stores current input message
  const [loading, setLoading] = useState(false); // shows a loading indicator
  const [error, setError] = useState("");
  // Add debug state to display API response details
  const [debugInfo, setDebugInfo] = useState(null);

  // Sends a message to the backend chat endpoint
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Append the user's message to the conversation history
    const userMessage = { role: "user", content: input.trim() };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setLoading(true);
    setError("");
    setDebugInfo(null); // Reset debug info

    // Debug: Log the request being sent
    console.log("Sending request to:", "/api/chat");
    console.log("Request payload:", { message: input.trim() });

    try {
      // Using axios instance with proper headers
      const response = await axios.post("/api/chat", {
        message: input.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Debug: Log the full response
      console.log("Full API response:", response);
      setDebugInfo({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      });

      // Check if we have a valid response
      if (response.data && (response.data.response || response.data.reply)) {
        const botReply = { 
          role: "bot", 
          content: response.data.response || response.data.reply 
        };
        setConversation([...updatedConversation, botReply]);
      } else {
        console.error("Invalid response format:", response.data);
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      // Debug: Log more detailed error information
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        console.error("Error response headers:", err.response.headers);
        setDebugInfo({
          error: true,
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data
        });
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setDebugInfo({
          error: true,
          message: "No response received from server",
          request: err.request
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        setDebugInfo({
          error: true,
          message: err.message
        });
      }
      setError("Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  // Allow pressing Enter to send the message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <h2>AI-Powered Career Guidance Chatbot</h2>
      <div className="chatbox">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="loading">Thinking...</div>}
        {error && <div className="error">{error}</div>}
        
        {/* Debug information section - remove this in production */}
        {debugInfo && (
          <div className="debug-info" style={{ 
            margin: '10px', 
            padding: '10px', 
            border: '1px solid #ccc',
            background: '#f5f5f5',
            fontSize: '12px',
            whiteSpace: 'pre-wrap'
          }}>
            <h4>Debug Information:</h4>
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for career guidance..."
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
