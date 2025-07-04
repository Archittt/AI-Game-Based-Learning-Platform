const express = require('express');
const router = express.Router();
const quizChallengeController = require('../controllers/quizChallengeController');
const authenticate = require('../middleware/auth');


// Get quiz challenge by challengeId within module
router.get('/:moduleId/challenge/:challengeId', authenticate, quizChallengeController.getQuizByChallengeId);

// Submit quiz answer
router.post('/:moduleId/challenge/:challengeId/submit', authenticate, async (req, res) => {
  try {
    const { moduleId, challengeId } = req.params;
    const userId = req.user.id;

    // Call controller to handle quiz answer submission
    const result = await quizChallengeController.submitQuizAnswer(req, res);

    // Check if the quiz is completed (assuming controller returns a 'completed' status or score)
    if (result && result.completed) {
      const io = req.app.get('io');
      io.to(userId).emit('achievement', {
        type: 'quiz_completed',
        moduleId,
        challengeId,
        points: result.score * 5 // Example: 5 points per score, adjust based on your logic
      });
    }

    // Controller handles the response, so no need to res.json here unless it doesn't
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
