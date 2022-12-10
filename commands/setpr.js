//setPR command
const { SlashCommandBuilder, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, CommandInteractionOptionResolver} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setpr')
        .setDescription('Add a PR to your personal database.'),
    async execute(interaction){
        if(interaction.setCustomId == "prModal"){
            await CommandInteractionOptionResolver.reply({content: "Submitted"});
        }

        const modal = new ModalBuilder()
			.setCustomId('prModal')
			.setTitle('My PR');

        const exerciseName = new TextInputBuilder()
			.setCustomId('exerciseName')
		    // The label is the prompt the user sees for this input
			.setLabel("Type the name of the exercise")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);

//users can add what day they hit their PR so they can keep track of progress later    
        const prDate = new TextInputBuilder()
			.setCustomId('prDate')
		    // The label is the prompt the user sees for this input
			.setLabel("Type the date you hit your PR")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);  
            
        const prAmount = new TextInputBuilder()
			.setCustomId('prAmount')
		    // The label is the prompt the user sees for this input
			.setLabel("Type the PR weight")
		    // Short means only a single line of text
			.setStyle(TextInputStyle.Short);    

        const exerciseActionRow = new ActionRowBuilder().addComponents(exerciseName);
        const prDateRow = new ActionRowBuilder().addComponents(prDate);
        const prActionRow = new ActionRowBuilder().addComponents(prAmount);


        modal.addComponents(exerciseActionRow, prDateRow, prActionRow);

        await interaction.showModal(modal);
    },
};