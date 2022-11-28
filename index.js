// Require the necessary discord.js classes
const deploy = require('./deploy-commands.js');
const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');
const schedule = require('node-schedule');
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

const rule = new schedule.RecurrenceRule();
rule.hour = 9;
rule.minute = 0;
rule.tz = 'Etc/GMT-8';
const createTable = "CREATE TABLE IF NOT EXISTS reminder('userId' TEXT, 'Sunday' INTEGER, 'Monday' INTEGER, 'Tuesday' INTEGER, 'Wednesday' INTEGER, 'Thursday' INTEGER, 'Friday' INTEGER, 'Saturday' INTEGER)";
const job = schedule.scheduleJob(rule, function () {
	const d = new Date();
	const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const db = new Database('databases/reminder.sqlite3', Database.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
		}
		verbose: console.log;
	});
	db.exec(createTable);

	const data = db.prepare(`SELECT userId FROM reminder WHERE ${weekday[d.getDay()]}=1`);
	for (const ch of data.iterate()) { // DM all users with reminders set on current day
		client.users.send(`${ch.userId}`, `:man_lifting_weights: This is your ${weekday[d.getDay()]} reminder to go workout! :woman_lifting_weights:`);
	}
});

// Log in to Discord
client.login(token);