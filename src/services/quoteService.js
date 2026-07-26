const axios = require('axios');
const logger = require('../utils/logger');

function cleanWikitext(line) {
  return line
    .replace(/^\*+\s*/, '')
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/'''?/g, '')
    .replace(/\{\{[^}]*\}\}/g, '')
    .trim();
}

async function fetchWikiquoteLines(searchTerm) {
  const headers = { 'User-Agent': 'ReadingCompanionBot/1.0 (Discord bot; contact: your-email@example.com)' };

  const searchRes = await axios.get('https://en.wikiquote.org/w/api.php', {
    params: { action: 'query', list: 'search', srsearch: searchTerm, format: 'json', origin: '*' },
    headers,
  });
  const topResult = searchRes.data.query.search[0];
  if (!topResult) return null;

  const pageRes = await axios.get('https://en.wikiquote.org/w/api.php', {
    params: { action: 'parse', page: topResult.title, prop: 'wikitext', format: 'json', origin: '*' },
    headers,
  });
  const wikitext = pageRes.data.parse?.wikitext?.['*'];
  if (!wikitext) return null;

  const lines = wikitext
    .split('\n')
    .filter((line) => /^\*(?!\*)/.test(line))
    .map(cleanWikitext)
    .filter((line) => line.length > 15 && line.length < 300);

  if (lines.length === 0) return null;
  return { lines, pageTitle: topResult.title };
}

async function getBookQuote(bookTitle) {
  try {
    const result = await fetchWikiquoteLines(bookTitle);
    if (!result) return null;
    const chosen = result.lines[Math.floor(Math.random() * result.lines.length)];
    return { text: chosen, book: result.pageTitle, author: null, source: 'Wikiquote' };
  } catch (err) {
    logger.error(`Wikiquote book lookup failed: ${err.message}`);
    return null;
  }
}

async function getAuthorQuote(authorName) {
  try {
    const result = await fetchWikiquoteLines(authorName);
    if (!result) return null;
    const chosen = result.lines[Math.floor(Math.random() * result.lines.length)];
    return { text: chosen, book: null, author: result.pageTitle, source: 'Wikiquote' };
  } catch (err) {
    logger.error(`Wikiquote author lookup failed: ${err.message}`);
    return null;
  }
}

async function getRandomQuote() {
  try {
    const res = await axios.get('https://zenquotes.io/api/random');
    const pick = res.data[0];
    if (!pick) return null;
    return { text: pick.q, book: null, author: pick.a, source: 'ZenQuotes' };
  } catch (err) {
    logger.error(`ZenQuotes random lookup failed: ${err.message}`);
    return null;
  }
}

module.exports = { getBookQuote, getAuthorQuote, getRandomQuote };