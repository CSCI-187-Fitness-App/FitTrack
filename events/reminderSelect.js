const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const reminder = require('../commands/reminder');

const createTable = "CREATE TABLE IF NOT EXISTS reminderTable('userId' TEXT, 'Sunday' INTEGER, 'Monday' INTEGER, 'Tuesday' INTEGER, 'Wednesday' INTEGER, 'Thursday' INTEGER, 'Friday' INTEGER, 'Saturday' INTEGER)";

// create database if it doesn't exist (executes at runtime)
const db = new Database('./databases/reminder.sqlite3', Database.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
		}
		verbose: console.log
});
db.exec(createTable);

// check if user id already exists in the reminder database
const reminderExists = (id) => {
	const data = db.prepare('SELECT * FROM reminderTable');
	let flag = false;
	for (const ch of data.iterate()) {
		if (ch.userId === `${id}`) {
			flag = true;
			break;
		}
	}
	return flag;
}

module.exports = {
	name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isSelectMenu()) { // only get reminder select menu
            return;
        }

		if(interaction.customId == "reminderSelect") {
			const days = new ActionRowBuilder()
				.addComponents(
					new SelectMenuBuilder()
						.setCustomId('reminderSelectDay')
						.setPlaceholder('Choose day')
						.setMinValues(1)
						.setMaxValues(7)
						.addOptions( 
							{
								label: 'Sunday',
								value: 'Sunday',
							},
							{
								label: 'Monday',
								value: 'Monday',
							},
							{
								label: 'Tuesday',
								value: 'Tuesday',
							},
							{
								label: 'Wednesday',
								value: 'Wednesday',
							},
							{
								label: 'Thursday',
								value: 'Thursday',
							},
							{
								label: 'Friday',
								value: 'Friday',
							},
							{
								label: 'Saturday',
								value: 'Saturday',
							}
						),
				);
			
			if(interaction.values[0] == "daily") {
				if(reminderExists(interaction.user.id)) {
					interaction.update({
						content: `:exclamation: Reminder for ${interaction.user} has already been set. :exclamation:`,
						ephemeral: true,
						components: []
					});
				} else {
					db.exec("INSERT INTO reminderTable(userId, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) " +
							`VALUES('${interaction.user.id}', 1, 1, 1, 1, 1, 1, 1)`
					);
					interaction.update({
						content: `Daily reminder for ${interaction.user} set. :white_check_mark:`,
						ephemeral: true,
						components: []
					})
				}
			}
			else if(interaction.values[0] == "weekly") {
				if(reminderExists(interaction.user.id)) {
					interaction.update({
						content: `:exclamation: Reminder for ${interaction.user} has already been set. :exclamation:`,
						ephemeral: true,
						components: []
					});
				} else {
					interaction.update({
						content: "Select days.",
						ephemeral: true,
						components: [days]
					});
				}
			}
			else if(interaction.values[0] == "disable") {
				if(!reminderExists(interaction.user.id)) {
					interaction.update({
						content: `ERROR: ${interaction.user} does not currently have a reminder set.`,
						ephemeral: true,
						components: []
					});
				} else {
					db.exec(`DELETE FROM reminderTable WHERE userId='${interaction.user.id}'`)
					interaction.update({
						content: `Reminder for ${interaction.user} has been removed.`,
						ephemeral: true,
						components: []
					});
				}
			}
		}
		if(interaction.customId == ("reminderSelectDay")) {
			if(reminderExists(interaction.user.id)) {
				interaction.update({
					content: `:exclamation: Reminder for ${interaction.user} has already been set. :exclamation:`,
					ephemeral: true,
					components: []
				});
			} else {
				const days = [0, 0, 0, 0, 0, 0, 0];
				console.log(interaction.values)
				for(let i = 0; i < interaction.values.length; i++) {
					const dayOfWeek = interaction.values[i];
					switch(dayOfWeek) {
						case "Sunday":
							days[0] = 1;
							break;
						case "Monday":
							days[1] = 1;
							break;
						case "Tuesday":
							days[2] = 1;
							break;
						case "Wednesday":
							days[3] = 1;
							break;
						case "Thursday":
							days[4] = 1;
							break;
						case "Friday":
							days[5] = 1;
							break;
						case "Saturday":
							days[6] = 1;
							break;
						default:
							break;
					}
				}
				db.exec("INSERT INTO reminderTable(userId, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) " +
						`VALUES('${interaction.user.id}', ${days[0]}, ${days[1]}, ${days[2]}, ${days[3]}, ${days[4]}, ${days[5]}, ${days[6]})`
						);
				interaction.update({
					content: `Reminders set for ${interaction.values.join(", ")}. :white_check_mark:`,
					ephemeral: true,
					components: []
				});
			}	
    	}
	}
}