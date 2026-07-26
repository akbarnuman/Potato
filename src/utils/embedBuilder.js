const { EmbedBuilder } = require('discord.js');

function buildBookEmbed(book) {
  const embed = new EmbedBuilder()
    .setTitle(book.title)
    .setColor(0x5865f2)
    .addFields(
      { name: 'Author', value: book.author, inline: true },
      { name: 'Year', value: `${book.year}`, inline: true },
      { name: 'Pages', value: `${book.pages}`, inline: true }
    );

  if (book.subjects && book.subjects.length) {
    embed.addFields({ name: 'Genres', value: book.subjects.join(', ') });
  }
  if (book.coverUrl) embed.setThumbnail(book.coverUrl);

  return embed;
}

module.exports = { buildBookEmbed };