const axios = require('axios');
const logger = require('../utils/logger');

async function findFreeVersion(title) {
  try {
    const res = await axios.get('https://gutendex.com/books', {
      params: { search: title },
    });
    const match = res.data.results[0];
    if (!match) return null;

    return {
      readOnlineUrl: match.formats['text/html'] || null,
      epubUrl: match.formats['application/epub+zip'] || null,
      pdfUrl: match.formats['application/pdf'] || null,
    };
  } catch (err) {
    logger.error(`Gutendex lookup failed: ${err.message}`);
    return null;
  }
}

module.exports = { findFreeVersion };