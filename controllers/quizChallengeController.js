const AIModule = require('../models/AIModule');
const QuizAttempt = require('../models/quizAttemptModel');

// Get a specific quiz challenge from a module
exports.getQuizByChallengeId = async (req, res) => {
  try {
    const { moduleId, challengeId } = req.params;
    const module = await AIModule.findById(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });


    const question = module.challenges.find(
      ch => ch.challengeId === challengeId && ch.type === 'quiz'
    );

    if (!question) return res.status(404).json({ message: 'Quiz not found in this module' });

    res.status(200).json({ success: true, question });
  } catch (err) {
    console.error('Fetch quiz error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit answer for specific quiz in a module
exports.submitQuizAnswer = async (req, res) => {
  try {
    const { moduleId, challengeId } = req.params;
    const userId = req.user.id;
    const { selectedOption } = req.body;

    const module = await AIModule.findById(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const question = module.challenges.find(
      ch => ch.challengeId === challengeId && ch.type === 'quiz'
    );
    if (!question) return res.status(404).json({ message: 'Quiz not found in this module' });

    const isCorrect = selectedOption === question.correctAnswer;
    const score = isCorrect ? question.points : 0;

    const attempt = new QuizAttempt({
      userId,
      moduleId: module._id,
      answers: [{
        challengeId,
        selectedOption,
        correctAnswer: question.correctAnswer,
        isCorrect
      }],
      score,
      totalQuestions: 1
    });

    await attempt.save();

    res.status(201).json({
      success: true,
      message: 'Answer submitted',
      isCorrect,
      score,
      correctAnswer: question.correctAnswer
    });
  } catch (err) {
    console.error('Submit quiz answer error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user's submitted answers for a challenge
exports.getUserAnswersForChallenge = async (req, res) => {
  try {
    const { moduleId, challengeId } = req.params;
    const userId = req.user.id;

    const attempts = await QuizAttempt.find({
      userId,
      moduleId,
      'answers.challengeId': challengeId
    });

    const responses = attempts.map(attempt =>
      attempt.answers.find(ans => ans.challengeId === challengeId)
    );

    res.status(200).json({ success: true, answers: responses });
  } catch (err) {
    console.error('Error fetching user answers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users' answers for each challenge in a module
exports.getAllAnswersInModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const attempts = await QuizAttempt.find({ moduleId });

    const resultMap = {};
    attempts.forEach(attempt => {
      attempt.answers.forEach(ans => {
        if (!resultMap[ans.challengeId]) resultMap[ans.challengeId] = [];
        resultMap[ans.challengeId].push({
          userId: attempt.userId,
          selectedOption: ans.selectedOption,
          correctAnswer: ans.correctAnswer,
          isCorrect: ans.isCorrect
        });
      });
    });

    res.status(200).json({ success: true, answersByChallenge: resultMap });
  } catch (err) {
    console.error('Error fetching all challenge answers:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

