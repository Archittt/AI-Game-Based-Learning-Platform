const mongoose = require("mongoose");

const gameProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "AIModule", required: true },
  score: { type: Number, default: 0 },
  challengeId: { type: String }, // Unique ID for challenge
  status: { type: String, enum: ['in_progress', 'completed', 'failed'], required: true },
  completed: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  completedAt: { type: Date },
  progressData: {
    answers: [{ type: String }], // User inputs
    timeSpent: { type: Number } // Seconds
  },
  adaptivePath: {
    nextChallengeId: { type: String },
    difficultyLevel: { type: Number, min: 1, max: 10 }
  },
  updatedAt: { type: Date, default: Date.now }
},{ timestamps: true });

// Indexes
gameProgressSchema.index({ userId: 1, moduleId: 1 });

module.exports = mongoose.model("GameProgress", gameProgressSchema);
