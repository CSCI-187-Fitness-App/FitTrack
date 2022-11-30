const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('ping')
		.setDescription('Returns latency to the bot.'),
	async execute(interaction) {
        const sent = await interaction.reply({ 
			content: 'Pinging...', 
			ephemeral: true,
			fetchReply: true 
		});
        interaction.editReply(`Latency: ${sent.createdTimestamp - interaction.createdTimestamp} ms`);
	},
};
