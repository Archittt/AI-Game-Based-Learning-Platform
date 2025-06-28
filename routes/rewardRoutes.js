const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const Reward = require("../models/Reward");

router.post("/rewards", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      type,
      name,
      description,
      points,
      icon,
      moduleId,
      challengeId
    } = req.body;

    const newReward = new Reward({
      userId,
      type,
      name,
      description,
      points,
      icon,
      moduleId,
      challengeId
    });

    await newReward.save();

    res.status(201).json({ success: true, data: newReward });
  } catch (err) {
    console.error("❌ Error creating reward:", err);
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
