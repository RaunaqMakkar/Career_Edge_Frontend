// FrontEnd/src/components/Chatbot.js
import React, { useState, useRef, useEffect } from "react";
import axios from "../api";
import "../styles/Chatbot.css";

const Chatbot = () => {
  const [conversation, setConversation] = useState([]); // stores chat history
  const [input, setInput] = useState(""); // stores current input message
  const [loading, setLoading] = useState(false); // shows a loading indicator
  const [error, setError] = useState("");
  const chatboxRef = useRef(null);

  // Auto-scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [conversation]);

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
      // Make the POST request to the chat endpoint (backend baseURL should be set in axios instance)
      const response = await axios.post("https://career-edge-backend.vercel.app/api/chat", {
        message: input.trim(),
        conversation: updatedConversation, // optional conversation context
      });
      
      // Append the chatbot reply to the conversation history
      const botReply = { role: "bot", content: response.data.reply };
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
      <div className="chatbox" ref={chatboxRef}>
        {conversation.length === 0 && (
          <div className="welcome-message">
            <p>Hello! I'm your AI career assistant. How can I help you today?</p>
            <p>You can ask me about:</p>
            <ul>
              <li>Career path recommendations</li>
              <li>Resume and interview tips</li>
              <li>Skill development advice</li>
              <li>Job search strategies</li>
            </ul>
          </div>
        )}
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
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
