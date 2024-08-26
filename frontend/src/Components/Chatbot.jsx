import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import ReactMarkdown from "react-markdown";
import "./Chatbot.css"; // Import the CSS file

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ sender: "GMentor", text: "How can I help you?" }]);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(uuidv4()); // Generate a unique session ID
  const [recognitionActive, setRecognitionActive] = useState(false); // State to track recognition status
  const [speechSupported, setSpeechSupported] = useState(true); // State to track speech recognition support

  const chatWindowRef = useRef(null);
  const recognitionRef = useRef(null); // Reference to speech recognition instance

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setSpeechSupported(false); // Update state if speech recognition is not supported
      console.log("Speech recognition not supported");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // Set the input text to recognized speech
      await handleSend(transcript); // Send the recognized text as a message
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      setRecognitionActive(false);
    };

    recognition.onend = () => {
      setRecognitionActive(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleSend = async (inputText) => {
    const textToSend = inputText || input; // Use the provided text or current input

    if (!textToSend.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { sender: "User", text: textToSend }]);
    setIsTyping(true);
    setInput(""); // Clear the input field

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        input: textToSend,
        sessionId, // Send the session ID with each message
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "GMentor", text: response.data.message },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsTyping(false);
  };

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (!recognitionActive) {
        recognitionRef.current.start();
        setRecognitionActive(true);
      } else {
        recognitionRef.current.stop();
        setRecognitionActive(false);
      }
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="chat-container">
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${
                msg.sender === "User" ? "user-message" : "bot-message"
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
          <button onClick={() => handleSend()} className="chat-send-button">
            Send
          </button>
          {speechSupported ? (
            <button onClick={handleVoiceInput} className="chat-send-button">
              {recognitionActive ? "Stop" : "Speak"}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatbot;





// const handleSend = async () => {
//   if (!input.trim()) return;

//   setMessages([...messages, { sender: "User", text: input }]);
//   setIsTyping(true);
//   setInput("");

//   try {
//     const response = await axios.post("http://localhost:5000/api/chat", {
//       input,
//       sessionId, // Send the session ID with each message
//     });

//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { sender: "G-Mentor", text: response.data.message },
//     ]);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }

//   setIsTyping(false);
// };
