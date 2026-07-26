const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('author')
    .setDescription('Search for an author')
    .addStringOption((opt) =>
      opt.setName('name').setDescription('Author name').setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const name = interaction.options.getString('name');

    try {
      const searchRes = await axios.get('https://openlibrary.org/search/authors.json', {
        params: { q: name },
      });
      const found = searchRes.data.docs[0];
      if (!found) return interaction.editReply(`No author found for "${name}".`);

const detailsRes = await axios.get(`https://openlibrary.org/authors/${found.key}.json`);      const details = detailsRes.data;

      const embed = new EmbedBuilder()
        .setTitle(found.name)
        .setColor(0x5865f2)
        .addFields(
          { name: 'Birth Year', value: `${found.birth_date || 'Unknown'}`, inline: true },
          { name: 'Top Work', value: found.top_work || 'Unknown', inline: true },
          { name: 'Total Works', value: `${found.work_count || 'Unknown'}`, inline: true }
        );

      const bio = typeof details.bio === 'string' ? details.bio : details.bio?.value;
      if (bio) embed.setDescription(bio.slice(0, 500));

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      logger.error(`Author search failed: ${err.message}`);
      await interaction.editReply('Something went wrong searching for that author.');
    }
  },
};