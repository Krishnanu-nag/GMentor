import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar";
import ReactMarkdown from "react-markdown";
import "./App.css"; // Import the CSS file

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Reference to the chat window
  const chatWindowRef = useRef(null);

  // Function to handle sending a message
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

  // Scroll to the bottom of the chat window whenever a new message is added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              <strong className="G-mentor-msg">{msg.sender}</strong>{" "}
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message bot-message">
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
