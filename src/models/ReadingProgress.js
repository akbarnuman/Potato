const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  bookTitle: { type: String, required: true },
  totalPages: { type: Number, required: true },
  currentPage: { type: Number, default: 0 },
  startDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);