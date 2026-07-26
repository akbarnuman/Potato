const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getProfile } = require('../services/profileService');
const { overviewEmbed } = require('../utils/profileEmbeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('collection')
    .setDescription('View a reading profile')
    .addUserOption((opt) => opt.setName('user').setDescription('Whose profile to view').setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply();

    const target = interaction.options.getUser('user') || interaction.user;
    const isOwnProfile = target.id === interaction.user.id;

    const profile = await getProfile(target.id);

    if (!profile.isPublic && !isOwnProfile) {
      return interaction.editReply("This user's reading profile is private.");
    }

    const embed = overviewEmbed(target.username, profile);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`profile_current_${target.id}`).setLabel('📖 Current Book').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`profile_completed_${target.id}`).setLabel('📚 Completed Books').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`profile_wishlist_${target.id}`).setLabel('📝 Wishlist').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`profile_stats_${target.id}`).setLabel('📈 Reading Stats').setStyle(ButtonStyle.Secondary)
    );

    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};