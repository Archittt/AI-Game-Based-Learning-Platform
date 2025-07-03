const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  history: [
    {
      role: { type: String, enum: ["user", "bot"], required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model("ChatSession", chatSessionSchema);