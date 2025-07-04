const mongoose = require('mongoose');

const aiModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  gradeLevel: [{ type: Number, min: 5, max: 10 }],
  concepts: [{ type: String }], // e.g., ["classification", "neural networks"]
  challenges: [{
    challengeId: { type: String, required: true },
    type: { type: String, enum: ['puzzle', 'quiz', 'coding', 'interactive', 'drag_drop', 'simulation'], required: true },
    question: { type: String, required: true },
    options: [{ type: String }], // For quizzes
    correctAnswer: { type: String },
    difficulty: { type: Number, min: 1, max: 10, required: true },
    hints: [{ type: String }],
    totalQuestions: { type: Number, min: 1 }, // Number of questions in the quiz
    points: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
aiModuleSchema.index({ gradeLevel: 1 });
aiModuleSchema.index({ concepts: 1 });

module.exports = mongoose.model('AIModule', aiModuleSchema);
