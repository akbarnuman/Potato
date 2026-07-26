const { getBooksBySubject, searchBooks } = require('../services/bookService');
const { buildBookEmbed } = require('../utils/embedBuilder');

module.exports = {
  customId: 'random_',
  async execute(interaction) {
    await interaction.deferUpdate();
    const genre = interaction.customId.replace('random_', '');

    const books = await getBooksBySubject(genre, 10);
    if (books.length === 0) return interaction.followUp({ content: 'No books found.', ephemeral: true });

    const pick = books[Math.floor(Math.random() * books.length)];
    const full = (await searchBooks(pick.title, 1))[0] || pick;

    await interaction.editReply({ embeds: [buildBookEmbed(full)] });
  },
};