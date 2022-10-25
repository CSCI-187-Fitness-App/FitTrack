const Command = require("../Structures/Command.js");
const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');

module.exports = new Command({
    name: "help",
    description: "List of commands and descriptions.",

    async run(message, args, client) {
        let name = []; //get names and descriptions of all commands
        let desc = [];
        client.commands.forEach(command => name.push(command.name));
        client.commands.forEach(command => desc.push(command.description));

        const embed = new EmbedBuilder() //create embedding
            .setTitle("FitTrack Commands")
            .setDescription("\u200b")
            .setColor("Red")
            .setTimestamp();

        for (let i = 0; i < name.length; i++) { //add each command name and description to embed
            embed.addFields({
                name: `\`!${name[i]}\``,
                value: `${desc[i]}`,
                inline: false,
            });
        }
        message.reply({ embeds: [embed] });
    }
});