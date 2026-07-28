const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./src/config/env');
const logger = require('./src/utils/logger');

const commands = [];
const commandsPath = path.join(__dirname, 'src/commands');
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  commands.push(command.data.toJSON());
}

const rest = new REST().setToken(token);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    logger.info(`Registered ${commands.length} guild command(s)`);
  } catch (err) {
    logger.error(err.message);
  }
})();