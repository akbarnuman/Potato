const { SlashCommandBuilder } = require('discord.js');
const { logReadingSession } = require('../services/streakService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('read')
    .setDescription("Log today's reading session"),

  async execute(interaction) {
    const { streak, alreadyLoggedToday } = await logReadingSession(interaction.user.id);

    if (alreadyLoggedToday) {
      return interaction.reply({ content: "You've already logged your reading for today. Come back tomorrow!", ephemeral: true });
    }

    await interaction.reply(
      `🔥 Reading logged! Current streak: **${streak.currentStreak} day(s)** (longest: ${streak.longestStreak})`
    );
  },
};