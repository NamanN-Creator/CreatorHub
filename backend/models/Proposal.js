const mongoose = require('mongoose');

// A Creator sends this against a Campaign. A Brand accepts / rejects /
// negotiates it.
const proposalSchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rate: { type: Number, required: true },
    deliverables: { type: String },
    message: { type: String },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'negotiating'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Proposal', proposalSchema);
