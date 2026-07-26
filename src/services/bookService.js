const axios = require('axios');
const logger = require('../utils/logger');

function normalizeBook(doc) {
  return {
    title: doc.title,
    author: doc.author_name ? doc.author_name[0] : 'Unknown Author',
    year: doc.first_publish_year || 'Unknown',
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : null,
    subjects: doc.subject ? doc.subject.slice(0, 3) : [],
    pages: doc.number_of_pages_median || 'Unknown',
    language: doc.language ? doc.language[0] : 'Unknown',
    workKey: doc.key, // e.g. "/works/OL893415W" — used to fetch more details later
  };
}

async function searchBooks(title, limit = 5) {
  try {
    const res = await axios.get('https://openlibrary.org/search.json', {
      params: { q: title, limit },
    });
    return res.data.docs.map(normalizeBook);
  } catch (err) {
    logger.error(`Open Library search failed: ${err.message}`);
    return [];
  }
}

async function getBooksBySubject(subject, limit = 5) {
  try {
    const res = await axios.get(
      `https://openlibrary.org/subjects/${encodeURIComponent(subject.toLowerCase())}.json`,
      { params: { limit } }
    );
    return res.data.works.map((w) => ({
      title: w.title,
      author: w.authors?.[0]?.name || 'Unknown Author',
      year: w.first_publish_year || 'Unknown',
      coverUrl: w.cover_id
        ? `https://covers.openlibrary.org/b/id/${w.cover_id}-L.jpg`
        : null,
      workKey: w.key,
    }));
  } catch (err) {
    logger.error(`Open Library subject search failed: ${err.message}`);
    return [];
  }
}

module.exports = { searchBooks, getBooksBySubject };