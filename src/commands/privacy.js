const { SlashCommandBuilder } = require('discord.js');
const { setPrivacy } = require('../services/privacyService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('privacy')
    .setDescription('Set your reading profile visibility')
    .addStringOption((opt) =>
      opt.setName('mode').setDescription('Public or Private').setRequired(true)
        .addChoices({ name: 'Public', value: 'public' }, { name: 'Private', value: 'private' })
    ),

  async execute(interaction) {
    const mode = interaction.options.getString('mode');
    await setPrivacy(interaction.user.id, mode === 'public');
    await interaction.reply({ content: `Your reading profile is now **${mode}**.`, ephemeral: true });
  },
};