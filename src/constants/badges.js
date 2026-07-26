const BADGES = [
  { code: 'first_book', emoji: '🌱', name: 'First Book', check: (stats) => stats.booksCompleted >= 1 },
  { code: 'bookworm', emoji: '📚', name: 'Bookworm (10 books)', check: (stats) => stats.booksCompleted >= 10 },
  { code: 'streak_7', emoji: '🔥', name: '7-Day Streak', check: (stats) => stats.longestStreak >= 7 },
  { code: 'streak_30', emoji: '⚡', name: '30-Day Streak', check: (stats) => stats.longestStreak >= 30 },
  { code: 'pages_1000', emoji: '📖', name: '1000 Pages Read', check: (stats) => stats.totalPagesRead >= 1000 },
];

module.exports = BADGES;