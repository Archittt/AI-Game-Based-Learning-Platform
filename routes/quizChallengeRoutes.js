const express = require('express');
const router = express.Router();
const quizChallengeController = require('../controllers/quizChallengeController');
const authenticate = require('../middlewares/authenticate');


// Get quiz challenge by challengeId within module
router.get('/:moduleId/challenge/:challengeId', authenticate, quizChallengeController.getQuizByChallengeId);

// Submit quiz answer
router.post('/:moduleId/challenge/:challengeId/submit', authenticate, quizChallengeController.submitQuizAnswer);

// Get logged-in user's answers for a specific challenge
router.get('/:moduleId/challenge/:challengeId/my-answers', authenticate, quizChallengeController.getUserAnswersForChallenge);

// Get all users' answers grouped by challengeId for a module
router.get('/:moduleId/all-answers', authenticate, quizChallengeController.getAllAnswersInModule);

module.exports = router;
