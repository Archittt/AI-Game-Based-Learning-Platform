const mongoose = require("mongoose");

const aiModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  gradeLevel: { type: String, required: true },
  content: { type: String },
  questions: [{
    question: String,
    options: [String],
    answer: String
  }]
});

module.exports = mongoose.model("AIModule", aiModuleSchema);
