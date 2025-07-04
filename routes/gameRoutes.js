const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const GameProgress = require("../models/GameProgress");

router.post("/progress", authenticate, async (req, res) => {
  try {
    const { moduleId, score, completed } = req.body;
    const userId = req.user.id;

    const progress = await GameProgress.findOneAndUpdate(
      { userId, moduleId },
      { score, completed, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    // Emit real time notification
    // if module is completed
    if(completed) {
      const io = req.app.get('io');
      io.to(userId).emit
      ('achievement', {
        type: 'module_completed',
        moduleId,
        points: score * 10
      });
    }
      
    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/progress/:userId", authenticate, async (req, res) => {
  try {
    const userId = req.params.userId;
    const progress = await GameProgress.find({ userId }).populate("moduleId");
    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
