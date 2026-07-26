const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getBookQuote, getAuthorQuote, getRandomQuote } = require('../services/quoteService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Get a real, sourced quote')
    .addStringOption((opt) => opt.setName('book').setDescription('Book title').setRequired(false))
    .addStringOption((opt) => opt.setName('author').setDescription('Author name').setRequired(false)),

  async execute(interaction) {
    await interaction.deferReply(); // every path here calls an external API now

    const book = interaction.options.getString('book');
    const author = interaction.options.getString('author');

    let quote = null;
    if (book) quote = await getBookQuote(book);
    else if (author) quote = await getAuthorQuote(author);
    else quote = await getRandomQuote();

    if (!quote) {
      const target = book ? `"${book}"` : author ? `"${author}"` : 'that request';
      return interaction.editReply(`No legally-sourced quote is available for ${target} right now.`);
    }

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setDescription(`*"${quote.text}"*`)
      .setFooter({ text: quote.book ? `${quote.book} — via ${quote.source}` : `${quote.author} — via ${quote.source}` });

    await interaction.editReply({ embeds: [embed] });
  },
};