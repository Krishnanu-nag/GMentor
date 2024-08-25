import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let conversationHistory = {}; // In-memory store for conversations

app.post('/api/chat', async (req, res) => {
    const userInput = req.body.input;
    const sessionId = req.body.sessionId; // Expect sessionId from client

    // Initialize conversation history for new sessions
    if (!conversationHistory[sessionId]) {
        conversationHistory[sessionId] = [];
    }

    // Add user input to conversation history
    conversationHistory[sessionId].push({ sender: 'user', text: userInput });

    try {
        // Use the conversation history as context
        const messages = conversationHistory[sessionId].map(msg => msg.text);
        const response = await model.generateContent(messages);
        const message = response.response.text();

        // Add bot response to conversation history
        conversationHistory[sessionId].push({ sender: 'Gmentor', text: message });

        res.json({ message, name: 'Gmentor' });
    } catch (error) {
        console.error('Error interacting with Google Gemini:', error);
        res.status(500).json({ message: 'Server error: Unable to fetch response from Google Gemini' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import dotenv from 'dotenv';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// app.post('/api/chat', async (req, res) => {
//     const userInput = req.body.input;

//     try {
//         const response = await model.generateContent([userInput]);
//         const message = response.response.text();
//         res.json({ message, name: 'Gmentor' });
//     } catch (error) {
//         console.error('Error interacting with Google Gemini:', error);
//         res.status(500).json({ message: 'Server error: Unable to fetch response from Google Gemini' });
//     }
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
