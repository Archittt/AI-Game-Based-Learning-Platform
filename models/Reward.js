const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  points: { type: Number, default: 0 },
  badges: [String],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reward", rewardSchema);
