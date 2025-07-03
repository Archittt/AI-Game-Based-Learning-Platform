const mongoose = require("mongoose");

const xpLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  xp: { type: Number, default: 0 },
  challenge: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("XPLog", xpLogSchema);