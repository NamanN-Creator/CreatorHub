const express = require('express');
const Invoice = require('../models/Invoice');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/invoices — only a Finance Manager generates an invoice
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'finance') {
      return res.status(403).json({ message: 'Only finance managers can generate invoices' });
    }
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/invoices
// creator -> their own invoices
// finance -> every invoice (this is "Invoice Management" / "Payment Tracking")
router.get('/', protect, async (req, res) => {
  try {
    let invoices;
    if (req.user.role === 'creator') {
      invoices = await Invoice.find({ creator: req.user.id }).populate('campaign');
    } else {
      invoices = await Invoice.find().populate('campaign').populate('creator', 'name');
    }
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/invoices/:id — finance manager updates payment status
router.put('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    invoice.status = req.body.status;
    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
