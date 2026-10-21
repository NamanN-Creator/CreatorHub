const express = require('express');
const Proposal = require('../models/Proposal');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/proposals — only a Creator sends a proposal
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'creator') {
      return res.status(403).json({ message: 'Only creators can send proposals' });
    }
    const proposal = await Proposal.create({ ...req.body, creator: req.user.id });
    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/proposals
// creator -> only their own (this is "My Proposals")
// brand   -> all proposals (this is "Proposal Management")
router.get('/', protect, async (req, res) => {
  try {
    let proposals;
    if (req.user.role === 'creator') {
      proposals = await Proposal.find({ creator: req.user.id }).populate('campaign');
    } else {
      proposals = await Proposal.find().populate('campaign').populate('creator', 'name email');
    }
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/proposals/:id — brand accepts / rejects / negotiates
router.put('/:id', protect, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    proposal.status = req.body.status;
    await proposal.save();
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
