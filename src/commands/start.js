const { SlashCommandBuilder } = require('discord.js');
const { startBook } = require('../services/trackerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start tracking a new book')
    .addStringOption((opt) => opt.setName('title').setDescription('Book title').setRequired(true))
    .addIntegerOption((opt) => opt.setName('pages').setDescription('Total pages').setRequired(true)),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const pages = interaction.options.getInteger('pages');

    if (pages <= 0) {
      return interaction.reply({ content: 'Total pages must be greater than 0.', ephemeral: true });
    }

    await startBook(interaction.user.id, title, pages);
    await interaction.reply(`📖 Started reading **${title}** (${pages} pages). Good luck!`);
  },
};