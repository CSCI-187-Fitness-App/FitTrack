const Command = require("../Structures/Command.js");
const {EmbedBuilder} = require("discord.js");

module.exports = new Command({
    name: "workout",
    description: "Checks workout of the day and returns exercises, sets/reps, and wieghts.",

    async run(message, args, client) {
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
        message.reply({embeds: [workoutEmbdm]});


    }
});