const mongoose = require("mongoose");

const UserEngagementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  action: String, // "login", "start_game", etc.
  timestamp: { type: Date, default: Date.now },
  metadata: Object,
  sessionDuration: Number // Optional
});

module.exports = mongoose.model("UserEngagement", UserEngagementSchema);
