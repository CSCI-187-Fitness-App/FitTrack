const { 
    ActionRowBuilder, 
    SelectMenuBuilder, 
    SlashCommandBuilder, 
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reminder')
		.setDescription('Set a daily or weekly reminder.'),
	async execute(interaction) {
		
        const type = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('reminderSelect')
                    .setPlaceholder('Choose type of reminder')
                    .addOptions(
                        {
							label: 'Daily',
							value: 'daily',
						},
                        {
							label: 'Weekly',
							value: 'weekly',
						},
                    )
            )

        await interaction.reply({
            content: "Select a type of reminder.",
            //ephemeral: true,
            components: [type]
        });
    }
};