const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getBooksBySubject } = require('../services/bookService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recommend')
    .setDescription('Get book recommendations by genre')
    .addStringOption((opt) => opt.setName('genre').setDescription('e.g. fantasy, mystery, romance').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const genre = interaction.options.getString('genre');

    const books = await getBooksBySubject(genre, 5);
    if (books.length === 0) {
      return interaction.editReply(`No recommendations found for "${genre}".`);
    }

    const embed = new EmbedBuilder()
      .setTitle(`📚 ${genre[0].toUpperCase() + genre.slice(1)} Recommendations`)
      .setColor(0x5865f2)
      .setDescription(books.map((b, i) => `${i + 1}. **${b.title}** — ${b.author}`).join('\n'));

    if (books[0].coverUrl) embed.setThumbnail(books[0].coverUrl);

    await interaction.editReply({ embeds: [embed] });
  },
};