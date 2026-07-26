const ServerSettings = require('../models/ServerSettings');

async function setQuoteChannel(guildId, channelId) {
  return ServerSettings.findOneAndUpdate(
    { guildId },
    { guildId, quoteChannelId: channelId },
    { upsert: true, new: true }
  );
}

async function getAllQuoteChannels() {
  return ServerSettings.find({ quoteChannelId: { $ne: null } });
}

module.exports = { setQuoteChannel, getAllQuoteChannels };