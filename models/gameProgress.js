const mongoose = require("mongoose");

const gameProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "AIModule", required: true },
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GameProgress", gameProgressSchema);
