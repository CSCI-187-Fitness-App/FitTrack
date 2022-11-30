const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists all available commands'),
    async execute(interaction) {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        const helpEmb = new EmbedBuilder()
            .setColor(0x800020)
            .setTitle("Commands")
            .setDescription("\u200b")

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            if(command.data.name != "help") {
                helpEmb.addFields({
                    name: `\`${command.data.name}\``,
                    value: `${command.data.description}`,
                    inline: false,
                })
            }
        }

        interaction.reply({
            embeds: [helpEmb],
            ephemeral: true
        });
    },
};