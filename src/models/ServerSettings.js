const mongoose = require('mongoose');

const serverSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  quoteChannelId: { type: String, default: null },
});

module.exports = mongoose.model('ServerSettings', serverSettingsSchema);