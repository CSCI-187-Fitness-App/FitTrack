const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const reminder = require('../commands/reminder');

module.exports = {
	name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isSelectMenu()) { // only get reminder select menu
            return;
        }

		if(interaction.customId == "reminderSelect") {
			const days = new ActionRowBuilder()
				.addComponents(
					new SelectMenuBuilder()
						.setCustomId('reminderSelectDay')
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
					//ephemeral: true,
					components: []
				});

				console.log(interaction.user.id);
			}
			else if(interaction.values[0] == "weekly") {
				interaction.update({
					content: "Select days.",
					//ephemeral: true,
					components: [days]
				});
			}
		}
		
		if(interaction.customId == ("reminderSelectDay")) {

			const selected = interaction.values.join(', ');
			interaction.reply(`${interaction.user} responded with ${selected}.`)
			console.log(selected);

    	}
	
	}
}