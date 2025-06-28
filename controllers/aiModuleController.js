const AIModule = require('../models/AIModule');

// Create a new AI Module
exports.createAIModule = async (req, res) => {
  try {
    const { title, description } = req.body;

    const module = new AIModule({
      title,
      description,
      challenges: []
    });

    await module.save();
    res.status(201).json({ success: true, module });
  } catch (err) {
    console.error('Create module error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add quiz question to a module
exports.addQuizToModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const {
      challengeId,
      question,
      options,
      correctAnswer,
      difficulty,
      points,
      hints
    } = req.body;

    const module = await AIModule.findById(moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    const newQuiz = {
      challengeId,
      type: 'quiz',
      question,
      options,
      correctAnswer,
      difficulty,
      points,
      hints
    };

    module.challenges.push(newQuiz);
    await module.save();

    res.status(201).json({ success: true, message: 'Quiz added', quiz: newQuiz });
  } catch (err) {
    console.error('Add quiz error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
