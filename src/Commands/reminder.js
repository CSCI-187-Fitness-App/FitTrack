const Command = require("../Structures/Command.js");
const { ActionRowBuilder, Events, SelectMenuBuilder } = require('discord.js');

module.exports = new Command({
    name: "reminder",
    description: "Set a weekly workout reminder.",

    async run(message, args, client) {

        const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions( 
                        {
							label: 'Sunday',
							value: 'sunday',
						},
						{
							label: 'Monday',
							value: 'monday',
						},
						{
							label: 'Tuesday',
							value: 'tuesday',
						},
                        {
							label: 'Wednesday',
							value: 'wednesday',
						},
                        {
							label: 'Thursday',
							value: 'thursday',
						},
                        {
							label: 'Friday',
							value: 'friday',
						},
                        {
							label: 'Saturday',
							value: 'saturday',
						}
					),
			);
        
        
        client.on(Events.InteractionCreate, interaction => {
            if (!interaction.isSelectMenu()) return;
            console.log(interaction.values[0]);
        });

        message.reply({
            content: "Select a day to set a weekly workout reminder.",
            ephemeral: true,
            components: [row]
        });
    }
});