const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { searchBooks } = require('../services/bookService');
const { findFreeVersion } = require('../services/freeReadingService');
const { buildBookEmbed } = require('../utils/embedBuilder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('book')
    .setDescription('Search for a book by title')
    .addStringOption((opt) =>
      opt.setName('title').setDescription('Book title').setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply(); // searching takes a moment, so tell Discord "we're working on it"

    const title = interaction.options.getString('title');
    const books = await searchBooks(title);

    if (books.length === 0) {
      return interaction.editReply(`No books found for "${title}".`);
    }

    if (books.length === 1) {
      return sendBookResult(interaction, books[0]);
    }

    // Multiple matches → let the user pick with a select menu
    const menu = new StringSelectMenuBuilder()
      .setCustomId('book_select')
      .setPlaceholder('Choose a book')
      .addOptions(
        books.slice(0, 5).map((b, i) => ({
          label: b.title.slice(0, 100),
          description: `${b.author} (${b.year})`.slice(0, 100),
          value: `${i}`,
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);
    interaction.client.pendingBookSearches = interaction.client.pendingBookSearches || new Map();
    interaction.client.pendingBookSearches.set(interaction.user.id, books);

    await interaction.editReply({
      content: `Found ${books.length} matches for "${title}" — pick one:`,
      components: [row],
    });
  },
};

async function sendBookResult(interaction, book) {
  const embed = buildBookEmbed(book);
  const buttons = [];

  const free = await findFreeVersion(book.title);
  if (free?.readOnlineUrl) {
    buttons.push(new ButtonBuilder().setLabel('Read Free').setStyle(ButtonStyle.Link).setURL(free.readOnlineUrl));
  }
  buttons.push(
    new ButtonBuilder().setCustomId(`similar_${book.title}`).setLabel('More Like This').setStyle(ButtonStyle.Secondary)
  );

  const row = new ActionRowBuilder().addComponents(buttons);
  await interaction.editReply({ embeds: [embed], components: [row] });
}

module.exports.sendBookResult = sendBookResult;