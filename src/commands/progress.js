const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getCurrentBook, updateProgress } = require('../services/trackerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('progress')
    .setDescription('Update your current page')
    .addIntegerOption((opt) => opt.setName('pages').setDescription('Current page number').setRequired(true)),

  async execute(interaction) {
    const current = await getCurrentBook(interaction.user.id);
    if (!current) {
      return interaction.reply({ content: "You're not currently reading a book. Use `/start` first.", ephemeral: true });
    }

    const pages = interaction.options.getInteger('pages');
    if (pages < 0 || pages > current.totalPages) {
      return interaction.reply({ content: `Page must be between 0 and ${current.totalPages}.`, ephemeral: true });
    }

    const updated = await updateProgress(interaction.user.id, pages);
    const percent = Math.round((updated.currentPage / updated.totalPages) * 100);
    const remaining = updated.totalPages - updated.currentPage;

    const embed = new EmbedBuilder()
      .setTitle(updated.bookTitle)
      .setColor(0x57f287)
      .addFields(
        { name: 'Progress', value: `${percent}%`, inline: true },
        { name: 'Current Page', value: `${updated.currentPage}`, inline: true },
        { name: 'Remaining', value: `${remaining} pages`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};