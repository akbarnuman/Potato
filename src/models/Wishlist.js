const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookTitle: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
});

wishlistSchema.index({ userId: 1, bookTitle: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);