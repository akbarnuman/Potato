const ReadingStreak = require('../models/ReadingStreak');

function todayString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

async function logReadingSession(userId) {
  const today = todayString();
  let streak = await ReadingStreak.findOne({ userId });

  if (!streak) {
    streak = await ReadingStreak.create({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastReadDate: today,
    });
    return { streak, alreadyLoggedToday: false };
  }

  if (streak.lastReadDate === today) {
    return { streak, alreadyLoggedToday: true };
  }

  const gap = daysBetween(streak.lastReadDate, today);
  streak.currentStreak = gap === 1 ? streak.currentStreak + 1 : 1;
  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.lastReadDate = today;
  await streak.save();

  return { streak, alreadyLoggedToday: false };
}

module.exports = { logReadingSession };