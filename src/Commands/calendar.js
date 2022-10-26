const { EmbedBuilder } = require("discord.js");
const Command = require("../Structures/Command.js");

module.exports = new Command({
    name: "calendar",
    description: "Display image of a week calendar of your workouts.",

    async run(message, args, client) {
        let topline =    "-------------------------------\n";
        let bottomline = "\n-------------------------------";
        const calendarEmbed = new EmbedBuilder()
            .setColor(0x800020)
            .setTitle("Weekly View of workouts:")
            .setDescription("\u200b")
            .addFields(
                {name: topline + "Monday" + bottomline, value:"- Flat Bench Press \n - Inclined Bench Press \n - Dumbell Fly \n - Tricep push downs \n - Bicep curls", inline: true},
                {name: topline + "Tuesday" + bottomline, value: "- Deadlift \n - RDLs \n - Sitting rows \n - Lat pulldowns \n - Shoulder press", inline: true},
                {name: topline + "Wednesday" + bottomline, value: "testing Wednesday", inline: true},
                {name: topline + "Thursday" + bottomline, value: "testing thursday", inline: true},
                {name: topline + "Friday" + bottomline, value: "testing Friday", inline: true},
                {name: topline + "Saturday" + bottomline, value: "testing Saturday", inline: true},
                {name: topline + "Sunday" + bottomline, value: "testing Sunday", inline: true},
            );
        message.reply({embeds: [calendarEmbed]});
    }
});