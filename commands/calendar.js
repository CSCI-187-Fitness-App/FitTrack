const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('calendar')
		.setDescription('Displays your weekly schedule of your workouts.'),
	async execute(interaction) {
        let topline =    "-------------------------------\n";
        let bottomline = "\n-------------------------------";
        const calendarEmbed = new EmbedBuilder()
            .setColor(0x800020)
            .setTitle("Weekly View of workouts:")
            .setDescription("\u200b")
            .addFields(
                {name: topline + "Monday" + bottomline, value:"- Flat Bench Press \n - Inclined Bench Press \n - Dumbell Fly \n - Tricep push downs \n - Bicep curls", inline: true},
                {name: topline + "Tuesday" + bottomline, value: "Rest Day", inline: true},
                {name: topline + "Wednesday" + bottomline, value: "Vinyasa Yoga", inline: true},
                {name: topline + "Thursday" + bottomline, value: "Rest Day", inline: true},
                {name: topline + "Friday" + bottomline, value: "- Deadlift \n - RDLs \n - Sitting rows \n - Lat pulldowns \n - Shoulder press", inline: true},
                {name: topline + "Saturday" + bottomline, value: "Rest Day", inline: true},
                {name: topline + "Sunday" + bottomline, value: "Rest Day", inline: true},
            );
        interaction.reply({
            embeds: [calendarEmbed]
        });
	},
};
