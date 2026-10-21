const mongoose = require('mongoose');

// Created by a Brand Representative. Creators can "discover" any campaign
// whose status is 'published'.
const campaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String },
    targetAudience: { type: String },
    niche: { type: String },
    platform: { type: String },
    deliverables: { type: String },
    budget: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['draft', 'published', 'completed'],
      default: 'draft',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);
