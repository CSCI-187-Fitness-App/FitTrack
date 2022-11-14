const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Database = require("better-sqlite3");
const reminder = require('../commands/reminder');

const createTable = "CREATE TABLE IF NOT EXISTS reminder('userId' TEXT, 'sunday' INTEGER, 'monday' INTEGER, 'tuesday' INTEGER, 'wednesday' INTEGER, 'thursday' INTEGER, 'friday' INTEGER, 'saturday' INTEGER)";

module.exports = {
	name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isSelectMenu()) { // only get reminder select menu
            return;
        }

		// create the database if it doesn't exist
		const reminder = './databases/reminder.sqlite3';
        let db = new Database(reminder, Database.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
            verbose: console.log
        })
        db.exec(createTable);

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
								value: 'sunday',
							},
							{
								label: 'Monday',
								value: 'monday',
							},
							{
								label: 'Tuesday',
								value: 'tuesday',
							},
							{
								label: 'Wednesday',
								value: 'wednesday',
							},
							{
								label: 'Thursday',
								value: 'thursday',
							},
							{
								label: 'Friday',
								value: 'friday',
							},
							{
								label: 'Saturday',
								value: 'saturday',
							}
						),
				);
			
			if(interaction.values[0] == "daily") {

				console.log(interaction.user.id);

				const data = db.prepare('SELECT * FROM reminder');
				let flag = true;
				for (const ch of data.iterate()) {
					if (ch.userId === `${interaction.user.id}`) {
						interaction.update({
							content: `:exclamation: Reminder for ${interaction.user} has already been set. :exclamation:`,
							//ephemeral: true,
							components: []
						});
						flag = false;
						break;
					}
				}
				if(flag) {
					db.exec("INSERT INTO reminder(userId, sunday, monday, tuesday, wednesday, thursday, friday, saturday)" +
							`VALUES(${interaction.user.id}, 1, 1, 1, 1, 1, 1, 1)`
					)
					interaction.update({
						content: `Daily reminder for ${interaction.user} set. :white_check_mark:`,
						//ephemeral: true,
						components: []
					})
				}
			}
			else if(interaction.values[0] == "weekly") {
				interaction.update({
					content: "Select days.",
					//ephemeral: true,
					components: [days]
				});
			}
		}
		
		if(interaction.customId == ("reminderSelectDay")) {

			const selected = interaction.values.join(', ');
			interaction.reply(`${interaction.user} responded with ${selected}.`)
			console.log(selected);

    	}
	
	}
}