const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    SlashCommandBuilder, 
} = require('discord.js');
const Database = require('better-sqlite3');

// create database if it doesn't exist (executes at runtime)
const db = new Database('./databases/reminder.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
});
db.exec("CREATE TABLE IF NOT EXISTS reminderTable('userId' TEXT, 'Sunday' INTEGER, 'Monday' INTEGER, 'Tuesday' INTEGER, 'Wednesday' INTEGER, 'Thursday' INTEGER, 'Friday' INTEGER, 'Saturday' INTEGER)");

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
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Set a daily or weekly reminder.'),
	async execute(interaction) {
        const reminderButtons = new ActionRowBuilder();

        if(reminderExists(interaction.user.id)) {
            reminderButtons.addComponents(
                new ButtonBuilder()
                    .setCustomId('disableReminderButton')
                    .setLabel('Disable')
                    .setStyle(ButtonStyle.Danger)
            );
            const data = db.prepare(`SELECT * FROM reminderTable WHERE userId='${interaction.user.id}'`);
            let days = [];
            for(const ch of data.iterate()) {
                if(ch.Monday == 1)
                    days.push("Monday");
                if(ch.Tuesday == 1)
                    days.push("Tuesday");
                if(ch.Wednesday == 1)
                    days.push("Wednesday");
                if(ch.Thursday == 1)
                    days.push("Thursday");
                if(ch.Friday == 1)
                    days.push("Friday");
                if(ch.Saturday == 1)
                    days.push("Saturday");
                if(ch.Sunday == 1)
                    days.push("Sunday");
            }
            if(days.length == 1) {
                await interaction.reply({
                    content: `You currently have a reminder set for \`${days[0]}\``,
                    ephemeral: true,
                    components: [reminderButtons]
                })
            }
            else if(days.length == 2) {
                await interaction.reply({
                    content: `You currently have reminders set for \`${days[0]} and ${days[1]}\``,
                    ephemeral: true,
                    components: [reminderButtons]
                })
            }
            else {
                let last = days.pop();
                await interaction.reply({
                    content: `You currently have reminders set for \`${days.join(", ")}, and ${last}\``,
                    ephemeral: true,
                    components: [reminderButtons]
                })
            }
        } else {
            reminderButtons.addComponents(
                new ButtonBuilder()
                    .setCustomId('dailyReminderButton')
                    .setLabel('Daily')
                    .setStyle(ButtonStyle.Primary)
            );
            reminderButtons.addComponents(
                new ButtonBuilder()
                    .setCustomId('weeklyReminderButton')
                    .setLabel('Weekly')
                    .setStyle(ButtonStyle.Primary)
            );

            await interaction.reply({
                content: "Select a type of reminder.",
                ephemeral: true,
                components: [reminderButtons]
            });
        }
    }
};