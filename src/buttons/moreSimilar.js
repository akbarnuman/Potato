const { getBooksBySubject, searchBooks } = require('../services/bookService');
const { buildBookEmbed } = require('../utils/embedBuilder');

module.exports = {
  customId: 'similar_', // prefix match — see interactionCreate.js
  async execute(interaction) {
    await interaction.deferReply();

    const title = interaction.customId.replace('similar_', '');
    const matches = await searchBooks(title, 1);
    if (matches.length === 0 || matches[0].subjects.length === 0) {
      return interaction.editReply(`Couldn't find similar books for "${title}".`);
    }

    const subject = matches[0].subjects[0];
    const similar = await getBooksBySubject(subject, 6);
    const filtered = similar.filter((b) => b.title !== title).slice(0, 5);

    if (filtered.length === 0) {
      return interaction.editReply(`No similar books found in "${subject}".`);
    }

    const embed = buildBookEmbed(filtered[0]);
    embed.setFooter({ text: `Similar to "${title}" via genre: ${subject}` });
    await interaction.editReply({ embeds: [embed] });
  },
};