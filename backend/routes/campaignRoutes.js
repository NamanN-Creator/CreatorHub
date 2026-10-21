const express = require('express');
const Campaign = require('../models/Campaign');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/campaigns — only a Brand Representative can create one
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'brand') {
      return res.status(403).json({ message: 'Only brands can create campaigns' });
    }
    const campaign = await Campaign.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/campaigns
// brand  -> only the campaigns they created (draft + published)
// creator -> only published campaigns (this is "Discover Campaigns")
// talent / finance -> every campaign, so they can assign tasks / invoices
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'brand') query = { createdBy: req.user.id };
    else if (req.user.role === 'creator') query = { status: 'published' };

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/campaigns/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/campaigns/:id — e.g. flipping status from draft -> published,
// or published -> completed. Only the owning brand can edit it.
router.put('/:id', protect, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    if (String(campaign.createdBy) !== req.user.id) {
      return res.status(403).json({ message: 'Not your campaign' });
    }
    Object.assign(campaign, req.body);
    await campaign.save();
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
