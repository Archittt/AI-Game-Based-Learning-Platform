const express = require('express');
const router = express.Router();
const quizChallengeController = require('../controllers/quizChallengeController');
const authenticate = require('../middlewares/authenticate');
const QuizAttempt = require('../models/quizAttemptModel');
const GameProgress = require('../models/gameProgress');
const User = require('../models/userModel');
const AIModule = require('../models/AIModule');

// Get quiz challenge by challengeId within module
router.get('/:moduleId/challenge/:challengeId', authenticate, quizChallengeController.getQuizByChallengeId);

// Submit quiz answer
router.post('/:moduleId/challenge/:challengeId/submit', authenticate, async (req, res) => {
  try {
    const { moduleId, challengeId } = req.params;
    const userId = req.user.id;
    const { answer } = req.body;

    // Call controller to handle quiz answer submission
    const result = await quizChallengeController.submitQuizAnswer(req, res);

    // Update GameProgress to track attempt
    const module = await AIModule.findById(moduleId);
    if (!module) throw new Error('Module not found');

    const quiz = module.challenges.find(ch => ch.challengeId === challengeId && ch.type === 'quiz');
    if (!quiz) throw new Error('Quiz not found');

    // Get total questions from AIModule
    const totalQuestions = quiz.totalQuestions || 1; // Fallback to 1 if not set

    // Get all quiz attempts for this challenge
    const quizAttempts = await QuizAttempt.find({
      userId,
      moduleId,
      'answers.challengeId': challengeId
    });

    const totalScore = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);

    // Update GameProgress
    const gameProgress = await GameProgress.findOneAndUpdate(
      { userId, moduleId, challengeId },
      {
        $inc: { attempts: 1 },
        $set: {
          score: totalScore,
          completed: quizAttempts.length >= totalQuestions,
          status: quizAttempts.length >= totalQuestions ? 'completed' : 'in_progress',
          updatedAt: new Date()
        }
      },
      { new: true, upsert: true }
    );

    // Emit notifications if quiz is completed
    if (gameProgress.completed || gameProgress.status === 'completed') {
      const points = totalScore * 5;
      const io = req.app.get('io');

      // Notify the user
      io.to(userId).emit('achievement', {
        type: 'quiz_completed',
        moduleId,
        challengeId,
        points
      });

      // Notify peers in the classroom room
      const user = await User.findById(userId).select('name');
      const name = user ? user.name : 'A user';
      io.to('classroom').emit('peer_achievement', {
        type: 'quiz_completed',
        name,
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
