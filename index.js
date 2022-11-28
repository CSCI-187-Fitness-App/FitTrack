// Require the necessary discord.js classes
const deploy = require('./deploy-commands.js');
const fs = require('node:fs');
const path = require('node:path');
const rem = require('./daily-reminder.js');
const Database = require('better-sqlite3');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// redeploy commands automatically each time bot is reset
deploy.deployCommands();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
exports.client = client;

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Run dailyReminder()
rem.dailyReminder();

// Log in to Discord
client.login(token);