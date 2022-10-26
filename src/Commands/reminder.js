const Command = require("../Structures/Command.js");
const { ActionRowBuilder, Events, SelectMenuBuilder, SelectMenuComponent, InteractionResponse } = require('discord.js');

module.exports = new Command({
    name: "reminder",
    description: "Set a weekly workout reminder.",

    async run(message, args, client) {

        const type = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('selecttype')
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
        

        const msg = await message.reply({
            content: "Select a type of reminder.",
            ephemeral: true,
            components: [type]
        });


        let flag = false;
        client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isSelectMenu()) 
                return;

            for(const item of interaction.values) {
                console.log(item);
            }
            if(flag) {
                await interaction.reply({
                    content: "Weekly reminders set!"
                })
                msg.delete();
            }

            if(interaction.values[0] === 'weekly') {
                await interaction.update({
                    content: "Select day.",
                    ephemeral: true,
                    components: [days]
                })
                flag = true;
            }
            else if (interaction.values[0] === 'daily') {
                await interaction.reply({
                    content: "Daily reminder set!"
                })
                msg.delete();
            }
        });
    }
});

