const express = require("express");
const router = express.Router();
const AIModule = require("../models/AIModule");

router.get("/modules", async (req, res) => {
  try {
    const modules = await AIModule.find();
    res.status(200).json({ success: true, data: modules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
