const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');

const db = new Database('./databases/calendar.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
});

module.exports = {
	data: new SlashCommandBuilder()
        .setName('workout')
		.setDescription('Displays your workout for the day.'),
	async execute(interaction) {
        db.exec(
            `CREATE TABLE IF NOT EXISTS user_${interaction.user.id}` +
            `('Sunday' TEXT, 'Monday' TEXT, 'Tuesday' TEXT, 'Wednesday' TEXT, 'Thursday' TEXT, 'Friday' TEXT, 'Saturday' TEXT)`
        );

        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const d = new Date();
        let day = weekday[d.getDay()];
        let monthName = month[d.getMonth()];

        const workoutEmbdm = new EmbedBuilder()
            .setTitle(`${day}, ${monthName} ${d.getDate()}`);

        const data = db.prepare(
            `SELECT DISTINCT ${day} ` +
            `FROM user_${interaction.user.id}`
            )   
            .pluck()
            .all()
            .filter(n => n)
            .join("\n");

        if(data.length > 0) {
            workoutEmbdm.addFields({
                name: "Workouts:",
                value: data,
                inline: false
            });

            interaction.reply({
                embeds: [workoutEmbdm],
                ephemeral: true
            });
        } else {
            interaction.reply({
                content: `Today (${day}) is a rest day. (*No routine set for today.*)`,
                ephemeral: true
            });
        }
	},
};
