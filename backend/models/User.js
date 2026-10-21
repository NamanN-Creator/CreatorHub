const mongoose = require('mongoose');

// One User model, one "role" field — this single field is what turns the
// same app into 4 different stakeholder experiences (creator / brand /
// talent / finance). That's the simplest possible way to do multi-role
// access in MERN, which is why it's a good thing to point out to Swapnil.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // stored as a bcrypt hash, never plain text
    role: {
      type: String,
      enum: ['creator', 'brand', 'talent', 'finance'],
      required: true,
    },
    brandName: { type: String }, // only used when role === 'brand'
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
