const ReadingProgress = require('../models/ReadingProgress');
const ReadingHistory = require('../models/ReadingHistory');

async function startBook(userId, bookTitle, totalPages) {
  return ReadingProgress.findOneAndUpdate(
    { userId },
    { userId, bookTitle, totalPages, currentPage: 0, startDate: new Date() },
    { upsert: true, new: true }
  );
}

async function getCurrentBook(userId) {
  return ReadingProgress.findOne({ userId });
}

async function updateProgress(userId, currentPage) {
  return ReadingProgress.findOneAndUpdate(
    { userId },
    { currentPage },
    { new: true }
  );
}

async function finishBook(userId) {
  const progress = await ReadingProgress.findOne({ userId });
  if (!progress) return null;

  await ReadingHistory.create({
    userId,
    bookTitle: progress.bookTitle,
    totalPages: progress.totalPages,
    completedDate: new Date(),
  });

  await ReadingProgress.deleteOne({ userId });
  return progress;
}

module.exports = { startBook, getCurrentBook, updateProgress, finishBook };