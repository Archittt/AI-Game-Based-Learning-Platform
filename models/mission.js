const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  userId: String,
  missionId: String,
  status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
  progress: { type: Number, default: 0 },
  rewards: {
    xp: Number,
    badges: [String]
  },
  updatedAt: Date
});

module.exports = mongoose.model('Mission', missionSchema);
