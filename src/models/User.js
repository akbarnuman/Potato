const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  isPublic: { type: Boolean, default: true },
  badges: { type: [String], default: [] },
  joinedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);