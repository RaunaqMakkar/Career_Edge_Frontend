// FrontEnd/src/components/Chatbot.js
import React, { useState } from "react";
import axios from "../api";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [conversation, setConversation] = useState([]); // stores chat history
  const [input, setInput] = useState(""); // stores current input message
  const [loading, setLoading] = useState(false); // shows a loading indicator
  const [error, setError] = useState("");

  // Sends a message to the backend chat endpoint
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Append the user's message to the conversation history
    const userMessage = { role: "user", content: input.trim() };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setLoading(true);
    setError("");

    try {
      // Update the URL to use the correct endpoint with /api prefix
      const response = await axios.post("https://career-edge-backend.vercel.app/api/chat", {
        message: input.trim(),
        conversation: updatedConversation, // optional conversation context
      });
      // Update to handle both possible response formats
      const botReply = { 
        role: "bot", 
        content: response.data.response || response.data.reply 
      };
      setConversation([...updatedConversation, botReply]);
    } catch (err) {
      console.error("Error sending message:", err);
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
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for career guidance..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
