const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const Reward = require("../models/Reward");

router.get("/leaderboard", authenticate, async (req, res) => {
  try {
    const topUsers = await Reward.find()
      .sort({ points: -1 })
      .limit(10)
      .populate("userId", "name email"); // show name & email

    res.status(200).json({ success: true, data: topUsers });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
