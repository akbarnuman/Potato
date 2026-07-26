const User = require('../models/User');
const ReadingProgress = require('../models/ReadingProgress');
const ReadingHistory = require('../models/ReadingHistory');
const Wishlist = require('../models/Wishlist');
const ReadingStreak = require('../models/ReadingStreak');
const { searchBooks } = require('./bookService');
const { refreshBadges } = require('./badgeService');
const BADGES = require('../constants/badges');

async function calculateFavoriteGenre(recentHistory) {
  const genreCounts = {};
  for (const entry of recentHistory) {
    const matches = await searchBooks(entry.bookTitle, 1);
    const subjects = matches[0]?.subjects || [];
    for (const subject of subjects) {
      genreCounts[subject] = (genreCounts[subject] || 0) + 1;
    }
  }
  const sorted = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : 'Not enough data yet';
}

async function getProfile(userId) {
  const [current, history, wishlist, streak, user] = await Promise.all([
    ReadingProgress.findOne({ userId }),
    ReadingHistory.find({ userId }).sort({ completedDate: -1 }),
    Wishlist.find({ userId }).sort({ dateAdded: -1 }),
    ReadingStreak.findOne({ userId }),
    User.findOne({ userId }),
  ]);

  const totalPagesRead = history.reduce((sum, h) => sum + h.totalPages, 0);
  const stats = {
    booksCompleted: history.length,
    totalPagesRead,
    longestStreak: streak?.longestStreak || 0,
  };

  const badgeCodes = await refreshBadges(userId, stats);
  const badges = BADGES.filter((b) => badgeCodes.includes(b.code));
  const favoriteGenre = history.length > 0 ? await calculateFavoriteGenre(history.slice(0, 3)) : 'Not enough data yet';

  return {
    isPublic: user?.isPublic ?? true,
    joinedAt: user?.joinedAt || new Date(),
    current,
    history,
    wishlist,
    streak: streak || { currentStreak: 0, longestStreak: 0 },
    stats,
    badges,
    favoriteGenre,
  };
}

module.exports = { getProfile };