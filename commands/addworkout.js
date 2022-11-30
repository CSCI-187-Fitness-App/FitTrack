const { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, CommandInteractionOptionResolver} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addworkout')
        .setDescription('Add a workout to your personal database.'),
    async execute(interaction){
        if(interaction.setCustomId == "exerciseModal"){
            await CommandInteractionOptionResolver.reply({content: "Submitted"});
        }

        const modal = new ModalBuilder()
			.setCustomId('excerciseModal')
			.setTitle('My exercise');

        const exerciseName = new TextInputBuilder()
			.setCustomId('exerciseName')
		    // The label is the prompt the user sees for this input
			.setLabel("Type the name of the exercise")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

        const exerciseActionRow = new ActionRowBuilder().addComponents(exerciseName);
        modal.addComponents(exerciseActionRow);

        await interaction.showModal(modal);
    },
};