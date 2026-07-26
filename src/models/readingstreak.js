const mongoose = require('mongoose');

const readingStreakSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastReadDate: { type: String, default: null }, // stored as "YYYY-MM-DD"
});

module.exports = mongoose.model('ReadingStreak', readingStreakSchema);