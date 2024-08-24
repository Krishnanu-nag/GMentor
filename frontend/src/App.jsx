import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import "./App.css"; // Import the CSS file

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setIsTyping(true);

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        input,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Gmentor", text: response.data.message },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
    setIsTyping(false);
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === "user" && <br /> ? "user-message" : "bot-message"
              }`}
            >
              <strong>{msg.sender}:</strong>{" "}
              {msg.sender === "Gmentor" && <br />}{" "}
              {/* Add a line break after 'Gmentor:' */}
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot-message">
              <strong>Gmentor is typing</strong>
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="chat-input"
          />
          <button onClick={handleSend} className="chat-send-button">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
