require('dotenv').config();
const { Client, Collection } = require('discord.js');

const client = new Client({ intents: 775 });
require('./Handlers/Events')(client);
require('./Handlers/Commands')(client);

client.commands = new Collection();

client.login(process.env.token);