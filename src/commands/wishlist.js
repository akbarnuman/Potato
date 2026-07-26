const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../services/wishlistService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wishlist')
    .setDescription('Manage your reading wishlist')
    .addSubcommand((sub) =>
      sub.setName('add').setDescription('Add a book to your wishlist')
        .addStringOption((opt) => opt.setName('title').setDescription('Book title').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub.setName('remove').setDescription('Remove a book from your wishlist')
        .addStringOption((opt) => opt.setName('title').setDescription('Book title').setRequired(true))
    )
    .addSubcommand((sub) => sub.setName('view').setDescription('View your wishlist')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    if (sub === 'add') {
      const title = interaction.options.getString('title');
      const added = await addToWishlist(userId, title);
      if (!added) return interaction.reply({ content: `**${title}** is already on your wishlist.`, ephemeral: true });
      return interaction.reply(`✅ Added **${title}** to your wishlist.`);
    }

    if (sub === 'remove') {
      const title = interaction.options.getString('title');
      const removed = await removeFromWishlist(userId, title);
      if (!removed) return interaction.reply({ content: `**${title}** wasn't on your wishlist.`, ephemeral: true });
      return interaction.reply(`🗑️ Removed **${title}** from your wishlist.`);
    }

    if (sub === 'view') {
      const list = await getWishlist(userId);
      if (list.length === 0) return interaction.reply({ content: 'Your wishlist is empty.', ephemeral: true });

      const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.username}'s Wishlist`)
        .setColor(0xfee75c)
        .setDescription(list.map((b, i) => `${i + 1}. ${b.bookTitle}`).join('\n'));

      return interaction.reply({ embeds: [embed] });
    }
  },
};