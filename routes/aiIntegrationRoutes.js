const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const axios = require("axios");

const AI_API_BASE = "http://localhost:5001";

// Sentiment Analysis
router.post("/sentiment", authenticate, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const response = await axios.post(`${AI_API_BASE}/api/sentiment`, {
      student_id: userId,
      message
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Sentiment analysis error:", err.message);
    res.status(500).json({ message: "Sentiment analysis failed." });
  }
});

// Get Adaptive Difficulty
router.get("/difficulty", authenticate, async (req, res) => {
  const userId = req.user.id;

  try {
    const response = await axios.get(`${AI_API_BASE}/api/difficulty/${userId}`);
    res.status(200).json(response.data);
  } catch (err) {
    console.error("Difficulty fetch error:", err.message);
    res.status(500).json({ message: "Difficulty level fetch failed." });
  }
});

// Update Performance
router.post("/performance", authenticate, async (req, res) => {
  const { score } = req.body;
  const userId = req.user.id;

  try {
    const response = await axios.post(`${AI_API_BASE}/api/performance`, {
      student_id: userId,
      score
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Performance update error:", err.message);
    res.status(500).json({ message: "Performance update failed." });
  }
});

// Fruit Classifier Proxy (example: forward request)
router.post("/game/fruit/classify", authenticate, async (req, res) => {
  const userId = req.user.id;
  const input = req.body.input;

  try {
    const response = await axios.post(`${AI_API_BASE}/api/game/fruit/classify`, {
      student_id: userId,
      input
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Fruit classifier error:", err.message);
    res.status(500).json({ message: "Fruit classification failed." });
  }
});

module.exports = router;