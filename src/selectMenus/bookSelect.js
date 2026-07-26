const { sendBookResult } = require('../commands/book');

module.exports = {
  customId: 'book_select',
  async execute(interaction) {
    await interaction.deferUpdate(); // acknowledge the selection without sending a new message

    const books = interaction.client.pendingBookSearches?.get(interaction.user.id);
    if (!books) {
      return interaction.followUp({ content: 'That search expired, try again.', ephemeral: true });
    }

    const chosen = books[parseInt(interaction.values[0], 10)];
    await sendBookResult(interaction, chosen);
  },
};