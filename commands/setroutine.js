// "!setRoutine" command
//set routine is supposed to give the user a modal to enter their routine
//when entering their routine they should select a day then in a text box
//enter what their workout is for that day
const { 
    ActionRowBuilder, 
    SlashCommandBuilder,
    SelectMenuBuilder
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('setroutine')
		.setDescription('Set the routine for a specific day'),
	async execute(interaction) {
        const days = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('routineSelectDay')
                    .setPlaceholder('Choose day to place routine in')
                    .addOptions( 
                        {
                            label: 'Sunday',
                            value: 'Sunday',
                        },
                        {
                            label: 'Monday',
                            value: 'Monday',
                        },
                        {
                            label: 'Tuesday',
                            value: 'Tuesday',
                        },
                        {
                            label: 'Wednesday',
                            value: 'Wednesday',
                        },
                        {
                            label: 'Thursday',
                            value: 'Thursday',
                        },
                        {
                            label: 'Friday',
                            value: 'Friday',
                        },
                        {
                            label: 'Saturday',
                            value: 'Saturday',
                        }
                    )
            )
            
            await interaction.reply({
                content: "Select a day to place routine in.",
                ephemeral: true,
                components: [days]
            });
	}
};