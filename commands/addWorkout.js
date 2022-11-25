//addWorkout slash command to add workouts to database
const { 
    ActionRowBuilder, 
    SlashCommandBuilder,
    TextInputBuilder, 
    TextInputStyle,
    ModalBuilder,
} = require('discord.js');
const { execute } = require('./setRoutine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addWorkout')
        .setDescription('add workouts to database'),
    async execute(interaction){
        const modal = new ModalBuilder()
            .setCustomId('workoutModal')
            .setTitle('workout Modal');
        
        		// Create the text input components
		const titleInput = new TextInputBuilder()
        .setCustomId('titleInput')
        // The label is the prompt the user sees for this input
        .setLabel("Give your workout a name")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);

            //textbox input to put in desired workout
        const workoutInput = new TextInputBuilder()
			.setCustomId('workoutInput')
			.setLabel("Type your workout")
		    // Paragraph means multiple lines of text.
			.setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
		// so you need one action row per text input.
		const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
		const secondActionRow = new ActionRowBuilder().addComponents(workoutInput);

        // Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);

		// Show the modal to the user
		await interaction.showModal(modal);



    }
};