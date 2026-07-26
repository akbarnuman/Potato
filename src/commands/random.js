const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getBooksBySubject, searchBooks } = require('../services/bookService');
const { buildBookEmbed } = require('../utils/embedBuilder');

const DEFAULT_GENRES = ['fiction', 'fantasy', 'mystery', 'romance', 'science_fiction'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('Get a random book recommendation')
    .addStringOption((opt) =>
      opt.setName('genre').setDescription('Optional genre').setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const genre = interaction.options.getString('genre') ||
      DEFAULT_GENRES[Math.floor(Math.random() * DEFAULT_GENRES.length)];

    const books = await getBooksBySubject(genre, 10);
    if (books.length === 0) {
      return interaction.editReply(`Couldn't find books for genre "${genre}".`);
    }

    const pick = books[Math.floor(Math.random() * books.length)];
    const full = (await searchBooks(pick.title, 1))[0] || pick;

    const embed = buildBookEmbed(full);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`random_${genre}`).setLabel('Another Random Book').setStyle(ButtonStyle.Primary)
    );

    await interaction.editReply({ embeds: [embed], components: [row] });
  },
};