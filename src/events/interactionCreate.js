const logger = require('../utils/logger');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction);
      } else if (interaction.isStringSelectMenu()) {
        const menu = interaction.client.selectMenus.get(interaction.customId);
        if (menu) await menu.execute(interaction);
      } else if (interaction.isButton()) {
        // buttons can have dynamic IDs (e.g. "similar_Dune"), so match by prefix
        const button = [...interaction.client.buttons.values()].find((b) =>
          interaction.customId.startsWith(b.customId)
        );
        if (button) await button.execute(interaction);
      }
    } catch (err) {
      logger.error(`Interaction error: ${err.message}`);
      const errorReply = { content: 'Something went wrong.', ephemeral: true };
      if (interaction.replied || interaction.deferred) await interaction.followUp(errorReply);
      else await interaction.reply(errorReply);
    }
  },
};