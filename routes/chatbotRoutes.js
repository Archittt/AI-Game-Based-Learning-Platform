// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const ChatSession = require("../models/chatSession");
const axios = require("axios");

const AI_API_BASE = "http://localhost:5001"; // Your custom chatbot base URL

router.post("/chat", authenticate, async (req, res) => {
  const { message, topic = "general" } = req.body;
  const userId = req.user.id;

  try {
    // 1. Call your AI chatbot API
    const response = await axios.post(`${AI_API_BASE}/api/chatbot`, {
      student_id: userId,
      message,
      topic
    });

    const { reply, emotion_detected, tone } = response.data;

    // 2. Save to session history
    const session = await ChatSession.findOneAndUpdate(
      { userId },
      {
        $push: {
          history: [
            { role: "user", message },
            { role: "bot", message: reply }
          ]
        }
      },
      { new: true, upsert: true }
    );

    // 3. Respond with the AI's reply and context
    res.status(200).json({
      reply,
      emotion: emotion_detected,
      tone,
      history: session.history.slice(-6)
    });
  } catch (err) {
    console.error("Chatbot integration error:", err.message);
    res.status(500).json({ message: "Chatbot service failed." });
  }
});

module.exports = router;
