const express = require('express');
const router = express.Router();
const Module = require('../models/module');

// GET /api/modules - fetch all modules
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find().sort({ createdAt: -1 });
    res.json(modules);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// POST /api/modules - add a new module
router.post('/', async (req, res) => {
  try {
    const { title, pdfUrl } = req.body;
    if (!title || !pdfUrl) {
      return res.status(400).json({ error: 'Title and PDF URL are required' });
    }

    const newModule = new Module({ title, pdfUrl });
    await newModule.save();

    res.status(201).json({ message: 'Module created', module: newModule });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add module' });
  }
});

module.exports = router;
