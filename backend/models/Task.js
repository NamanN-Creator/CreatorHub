const mongoose = require('mongoose');

// A Talent Manager assigns this to a Creator against a Campaign.
const taskSchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Under Review', 'Completed'],
      default: 'Not Started',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
