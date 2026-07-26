const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getCurrentBook } = require('../services/trackerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('current')
    .setDescription('Show the book you are currently reading'),

  async execute(interaction) {
    const current = await getCurrentBook(interaction.user.id);
    if (!current) {
      return interaction.reply({ content: "You're not currently reading anything. Use `/start` to begin.", ephemeral: true });
    }

    const percent = Math.round((current.currentPage / current.totalPages) * 100);
    const remaining = current.totalPages - current.currentPage;

    const embed = new EmbedBuilder()
      .setTitle(current.bookTitle)
      .setColor(0x5865f2)
      .addFields(
        { name: 'Progress', value: `${percent}%`, inline: true },
        { name: 'Current Page', value: `${current.currentPage}`, inline: true },
        { name: 'Remaining', value: `${remaining} pages`, inline: true },
        { name: 'Started On', value: current.startDate.toDateString(), inline: false }
      );

    await interaction.reply({ embeds: [embed] });
  },
};