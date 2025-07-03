const express = require("express");
const router = express.Router();
const AIModule = require("../models/AIModule");
const aiModuleController = require('../controllers/aiModuleController');


router.get("/modules", async (req, res) => {
  try {
    const modules = await AIModule.find();
    res.status(200).json({ success: true, data: modules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// Create a new AI module
// this creates a basic module i made this as i needed an module to work with you may modify it or even change it if you want
router.post('/create', aiModuleController.createAIModule);

// Add a quiz to a specific module
router.post('/:moduleId/add-quiz',aiModuleController.addQuizToModule);

module.exports = router;

