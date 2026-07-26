const Wishlist = require('../models/Wishlist');

async function addToWishlist(userId, bookTitle) {
  try {
    return await Wishlist.create({ userId, bookTitle });
  } catch (err) {
    if (err.code === 11000) return null; // duplicate — already on wishlist
    throw err;
  }
}

async function removeFromWishlist(userId, bookTitle) {
  const result = await Wishlist.deleteOne({ userId, bookTitle });
  return result.deletedCount > 0;
}

async function getWishlist(userId) {
  return Wishlist.find({ userId }).sort({ dateAdded: -1 });
}

module.exports = { addToWishlist, removeFromWishlist, getWishlist };