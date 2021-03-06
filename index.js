require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { BOT_TOKEN } = process.env;

const client = new Client({ intents: 32767 });
require('./Handlers/Events')(client);
require('./Handlers/Commands')(client);

client.commands = new Collection();

client.login(BOT_TOKEN);