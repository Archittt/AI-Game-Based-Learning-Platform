const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ['points', 'badge', 'trophy'], required: true },
  name: { type: String, required: true },
  description: { type: String },
  points: { type: Number }, // For points type
  icon: { type: String }, // URL to icon
  awardedAt: { type: Date, default: Date.now },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIModule' },
  challengeId: { type: String }
}, { timestamps: true });

// Indexes
rewardSchema.index({ userId: 1 });

module.exports = mongoose.model("Reward", rewardSchema);
