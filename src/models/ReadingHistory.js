const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  totalPages: { type: Number, required: true },
  completedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ReadingHistory', readingHistorySchema);