const express = require('express');
const router = express.Router();
const quizChallengeController = require('../controllers/quizChallengeController');
const authenticate = require('../middleware/auth');
const QuizAttempt = require('../models/quizAttemptModel');
const GameProgress = require('../models/gameProgress');
const User = require('../models/userModel');

// Get quiz challenge by challengeId within module
router.get('/:moduleId/challenge/:challengeId', authenticate, quizChallengeController.getQuizByChallengeId);

// Submit quiz answer
router.post('/:moduleId/challenge/:challengeId/submit', authenticate, async (req, res) => {
  try {
    const { moduleId, challengeId } = req.params;
    const userId = req.user.id;
    const { answer } = req.body; // Assuming answer is sent in request body

    // Call controller to handle quiz answer submission
    const result = await quizChallengeController.submitQuizAnswer(req, res);

    // Check if quiz is completed using GameProgress
    const gameProgress = await GameProgress.findOne({
      userId,
      moduleId,
      challengeId
    }).sort({ updatedAt: -1 });

    if (gameProgress && (gameProgress.completed || gameProgress.status === 'completed')) {
      // Get score from QuizAttempt for points calculation
      const quizAttempt = await QuizAttempt.findOne({
        userId,
        moduleId,
        'answers.challengeId': challengeId
      }).sort({ attemptedAt: -1 });

      const points = quizAttempt ? quizAttempt.score * 5 : 0; // Fallback to 0 if no quizAttempt

      const io = req.app.get('io');
      io.to(userId).emit('achievement', {
        type: 'quiz_completed',
        moduleId,
        challengeId,
        points
      });

      //Notify peer in classroom room
      const user = await User.findById(userId).select('username');
      const username = user ? user.username : ' A user';
      io.to('classroom').emit('peer_acheivememt', {
        type : 'quiz_completed',
        username, 
        moduleId,
        challengeId,
        points
      });   
    } 

    // Controller handles response, fallback if no response sent
    if (!res.headersSent) {
      res.status(200).json({ success: true, data: result });
    }
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
});

// Get logged-in user's answers for a specific challenge
router.get('/:moduleId/challenge/:challengeId/my-answers', authenticate, quizChallengeController.getUserAnswersForChallenge);

// Get all users' answers grouped by challengeId for a module
router.get('/:moduleId/all-answers', authenticate, quizChallengeController.getAllAnswersInModule);

module.exports = router;
