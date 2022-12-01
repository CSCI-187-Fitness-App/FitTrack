const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Database = require('better-sqlite3');

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
        if (!interaction.isButton()) { // only get button event
            return;
        }
			
		if(interaction.customId == "dailyReminderButton") {
			db.exec("INSERT INTO reminderTable(userId, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) " +
					`VALUES('${interaction.user.id}', 1, 1, 1, 1, 1, 1, 1)`
			);
			interaction.update({
				content: `Daily reminder has been set. :white_check_mark:`,
				ephemeral: true,
				components: []
			})
		}
		else if(interaction.customId == "weeklyReminderButton") {
			const days = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('reminderWeeklySelect')
					.setPlaceholder('Select which days')
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
			interaction.update({
				content: "",
				ephemeral: true,
				components: [days]
			});
		}
			
		if(interaction.customId == "disableReminderButton") {
			db.exec(`DELETE FROM reminderTable WHERE userId='${interaction.user.id}'`)
			interaction.update({
				content: `Your reminder notification has been disabled. :no_entry_sign:`,
				ephemeral: true,
				components: []
			});
		}
	}
}