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
        .setName('calendar')
		.setDescription('Displays your weekly schedule of your workouts.'),
	async execute(interaction) {
        let topline =    "-------------------------------\n";
        let bottomline = "\n-------------------------------";

        db.exec(
            `CREATE TABLE IF NOT EXISTS user_${interaction.user.id}` +
            `('Sunday' TEXT, 'Monday' TEXT, 'Tuesday' TEXT, 'Wednesday' TEXT, 'Thursday' TEXT, 'Friday' TEXT, 'Saturday' TEXT)`
        );

        const calendarEmbed = new EmbedBuilder()
            .setColor('White')
            .setTitle("Weekly View of workouts:")
            .setDescription("\u200b");

        const weekdays = [];
        weekdays.push("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");

        for(const day of weekdays) {
            const data = db.prepare(
                `SELECT DISTINCT ${day} ` +
                `FROM user_${interaction.user.id}`
                )   
                .pluck()
                .all()
                .filter(n => n)
                .join("\n");

            if(data.length > 0) {
                calendarEmbed.addFields({
                    name: topline + `${day}` + bottomline,
                    value: data,
                    inline: true
                });
            } else {
                calendarEmbed.addFields({
                    name: topline + `${day}` + bottomline,
                    value: "`Rest Day`",
                    inline: true
                });
            }
        }
        interaction.reply({
            embeds: [calendarEmbed],
            ephemeral: true
        });
	},
};
