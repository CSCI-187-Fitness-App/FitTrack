const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const reminder = require('../commands/reminder');

module.exports = {
	name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isSelectMenu() || interaction.customId != "reminderSelect") { // only get reminder select menu
            return;
        }

        const days = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('selectday')
					.setPlaceholder('Choose day')
                    .setMinValues(1)
					.setMaxValues(7)
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
		
		if(interaction.values[0] == "daily") {
			interaction.update({
				content: "Daily reminder set!",
				ephemeral: true,
				components: []
			});
		}
		else if(interaction.values[0] == "weekly") {
			interaction.update({
				content: "Select days.",
				ephemeral: true,
				components: [days]
			});
		}


    }
}