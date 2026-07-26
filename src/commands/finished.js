const { SlashCommandBuilder } = require('discord.js');
const { finishBook } = require('../services/trackerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('finished')
    .setDescription('Mark your current book as completed'),

  async execute(interaction) {
    const finished = await finishBook(interaction.user.id);
    if (!finished) {
      return interaction.reply({ content: "You don't have a book in progress right now.", ephemeral: true });
    }

    await interaction.reply(`🎉 Congrats on finishing **${finished.bookTitle}**!`);
  },
};