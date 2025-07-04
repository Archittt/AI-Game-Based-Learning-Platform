const express = require('express');
const Mission = require('../models/mission');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/start', authMiddleware, async (req, res) => {
  const { missionId } = req.body;
  try {
    const mission = new Mission({
      userId: req.userId,
      missionId,
      status: 'active',
      rewards: { xp: 0, badges: [] },
      updatedAt: new Date()
    });
    await mission.save();
    
    const io = req.app.get('io');
    io.to(req.userId).emit('mission_update', { missionId, status: 'started' });
    res.json({ message: 'Mission started' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start mission' });
  }
});

router.post('/update', authMiddleware, async (req, res) => {
  const { missionId, progress, status, rewards } = req.body;
  try {
    const mission = await Mission.findOne({ userId: req.userId, missionId });
    if (!mission) return res.status(404).json({ error: 'Mission not found' });
    
    mission.progress = progress;
    mission.status = status;
    mission.rewards = rewards;
    mission.updatedAt = new Date();
    await mission.save();
    
    if (status === 'completed') {
      const user = await User.findById(req.userId);
      user.progress.points += rewards.xp;
      user.progress.badges.push(...rewards.badges.map(b => ({ badgeId: b, earnedAt: new Date() })));
      await user.save();
      
      const io = req.app.get('io');
      io.to(req.userId).emit('achievement', {
        type: 'mission_completed',
        missionId,
        rewards
      });
    }
    
    res.json({ message: 'Mission updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mission' });
  }
});

module.exports = router;
