const User = require('../models/User');
const BADGES = require('../constants/badges');

async function refreshBadges(userId, stats) {
  const earned = BADGES.filter((b) => b.check(stats)).map((b) => b.code);
  await User.findOneAndUpdate({ userId }, { userId, badges: earned }, { upsert: true });
  return earned;
}

module.exports = { refreshBadges };