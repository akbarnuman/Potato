const { getProfile } = require('../services/profileService');
const { currentBookEmbed, completedBooksEmbed, wishlistEmbed, statsEmbed } = require('../utils/profileEmbeds');

const EMBED_MAP = {
  current: currentBookEmbed,
  completed: completedBooksEmbed,
  wishlist: wishlistEmbed,
  stats: statsEmbed,
};

module.exports = {
  customId: 'profile_',
  async execute(interaction) {
    await interaction.deferUpdate();

    // customId format: "profile_<section>_<userId>"
    const [, section, targetId] = interaction.customId.split('_');
    const target = await interaction.client.users.fetch(targetId);

    const profile = await getProfile(targetId);
    if (!profile.isPublic && targetId !== interaction.user.id) {
      return interaction.followUp({ content: "This user's reading profile is private.", ephemeral: true });
    }

    const buildEmbed = EMBED_MAP[section];
    const embed = buildEmbed(target.username, profile);
    await interaction.editReply({ embeds: [embed] });
  },
};