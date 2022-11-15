const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('workout')
		.setDescription('Displays your workout for the day.'),
	async execute(interaction) {
        const workoutEmbdm = new EmbedBuilder()
        .setTitle('Workout of the day: Leg Day')
        .addFields(
            {name: 'Workout of the day:', value: 'Leg Day'},
            {name: 'Excersise:', value: 'squats'},
            {name: 'Sets/reps:', value: '3/6', inline: true},
            {name: 'Weight:', value: '135 155 155', inline: true},
            {name: 'Excersise:', value: 'calf raises'},
            {name: 'Sets/reps:', value: '3/6', inline: true},
            {name: 'Weight:', value: '135 155 155', inline: true},
            {name: 'Excersise:', value: 'RDL'},
            {name: 'Sets/reps:', value: '3/8', inline: true},
            {name: 'Weight:', value: '155 175 175', inline: true},

        );
        interaction.reply({
            embeds: [workoutEmbdm]
        });
	},
};
