const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const Reward = require("../models/Reward");

router.post("/rewards", authenticate, async (req, res) => {
  try {
    const { points, badge } = req.body;
    const userId = req.user.id;

    const reward = await Reward.findOneAndUpdate(
      { userId },
      {
        $inc: { points: points || 0 },
        $addToSet: { badges: badge },
        lastUpdated: new Date()
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data: reward });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/rewards/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const reward = await Reward.findOne({ userId });
    res.status(200).json({ success: true, data: reward });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
