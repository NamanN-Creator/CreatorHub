const express = require('express');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/tasks — only a Talent Manager assigns a task
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'talent') {
      return res.status(403).json({ message: 'Only talent managers can assign tasks' });
    }
    const task = await Task.create({ ...req.body, assignedBy: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks
// creator -> tasks assigned to them
// talent  -> tasks they assigned (this is "Task Tracking")
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'creator') {
      tasks = await Task.find({ creator: req.user.id }).populate('campaign');
    } else {
      tasks = await Task.find({ assignedBy: req.user.id })
        .populate('campaign')
        .populate('creator', 'name');
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id — creator updates their own progress, or talent
// manager marks it reviewed / completed
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.status = req.body.status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
