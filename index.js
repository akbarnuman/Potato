const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./src/config/env');
const connectDB = require('./src/database/connect');
const logger = require('./src/utils/logger');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'src/commands');
for (const file of fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'src/events');
for (const file of fs.readdirSync(eventsPath).filter((f) => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args));
  else client.on(event.name, (...args) => event.execute(...args));
}

client.selectMenus = new Collection();
const selectMenusPath = path.join(__dirname, 'src/selectMenus');
if (fs.existsSync(selectMenusPath)) {
  for (const file of fs.readdirSync(selectMenusPath).filter((f) => f.endsWith('.js'))) {
    const menu = require(path.join(selectMenusPath, file));
    client.selectMenus.set(menu.customId, menu);
  }
}

client.buttons = new Collection();
const buttonsPath = path.join(__dirname, 'src/buttons');
if (fs.existsSync(buttonsPath)) {
  for (const file of fs.readdirSync(buttonsPath).filter((f) => f.endsWith('.js'))) {
    const button = require(path.join(buttonsPath, file));
    client.buttons.set(button.customId, button);
  }
}

(async () => {
  await connectDB();
  await client.login(token);
})();