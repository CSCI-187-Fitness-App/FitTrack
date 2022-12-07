// Require the necessary discord.js classes
const deploy = require('./deploy-commands.js');
const fs = require('node:fs');
const path = require('node:path');
const schedule = require('node-schedule');
const Database = require('better-sqlite3');
const { Client, Collection, EmbedBuilder, GatewayIntentBits, IntentsBitField } = require('discord.js');
const { token } = require('./config.json');

// redeploy commands automatically each time bot is reset
deploy.deployCommands();

// Create a new client instance
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
		IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.DirectMessageReactions,
		IntentsBitField.Flags.DirectMessageTyping,
	] 
});
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

// Log in to Discord
client.login(token);

// Run daily reminder
const db = new Database('databases/reminder.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log;
});
const cal_db = new Database('databases/calendar.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log;
});

const rule = new schedule.RecurrenceRule();
rule.hour = 9;
rule.minute = 0;
rule.tz = 'Etc/GMT-8';
const createTable = "CREATE TABLE IF NOT EXISTS reminderTable('userId' TEXT, 'Sunday' INTEGER, 'Monday' INTEGER, 'Tuesday' INTEGER, 'Wednesday' INTEGER, 'Thursday' INTEGER, 'Friday' INTEGER, 'Saturday' INTEGER)";
const job = schedule.scheduleJob(rule, function () {
	const d = new Date();
	const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const data = db.prepare(`SELECT userId FROM reminderTable WHERE ${weekday[d.getDay()]}=1`);
	db.exec(createTable);

	for (const ch of data.iterate()) { // DM all users with reminders set on current day
		cal_db.exec(
			`CREATE TABLE IF NOT EXISTS user_${ch.userId}` +
			`('Sunday' TEXT, 'Monday' TEXT, 'Tuesday' TEXT, 'Wednesday' TEXT, 'Thursday' TEXT, 'Friday' TEXT, 'Saturday' TEXT)`
		);
		let day = weekday[d.getDay()];
		let monthName = month[d.getMonth()];
	
		const workoutEmbdm = new EmbedBuilder()
			.setColor('White')
			.setTitle(`${day}, ${monthName} ${d.getDate()}`);
	
		const calData = cal_db.prepare(
			`SELECT DISTINCT ${day} ` +
			`FROM user_${ch.userId}`
			)   
			.pluck()
			.all()
			.filter(n => n)
			.join("\n");
	
		if(calData.length > 0) {
			workoutEmbdm.addFields({
				name: "Workouts:",
				value: calData,
				inline: false
			});
		} else {
			workoutEmbdm.addFields({
				name: "Rest Day",
				value: `*(No routine for ${day} has been set)*`,
				inline: false
			});
		}
		client.users.send(
			`${ch.userId}`, 
			{
				content: `:man_lifting_weights: This is your ${weekday[d.getDay()]} reminder to go workout! :woman_lifting_weights:`,
				embeds: [workoutEmbdm]
			});
	}
});