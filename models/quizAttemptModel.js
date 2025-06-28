const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "AIModule", required: true },
  answers: [
    {
      challengeId: { type: String, required: true },
      selectedOption: { type: String, required: true },
      correctAnswer: { type: String },
      isCorrect: { type: Boolean }
    }
  ],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  attemptedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);