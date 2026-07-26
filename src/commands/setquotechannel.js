const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { setQuoteChannel } = require('../services/settingsService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setquotechannel')
    .setDescription('Set the channel for daily Quote of the Day (admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((opt) =>
      opt.setName('channel')
        .setDescription('The channel to post quotes in')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    await setQuoteChannel(interaction.guildId, channel.id);
    await interaction.reply(`✅ Quote of the Day will now post in ${channel}.`);
  },
};