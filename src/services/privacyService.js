const User = require('../models/User');

async function setPrivacy(userId, isPublic) {
  return User.findOneAndUpdate({ userId }, { userId, isPublic }, { upsert: true, new: true });
}

module.exports = { setPrivacy };