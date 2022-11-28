const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const reminder = require('../commands/addworkout');

// create database if it doesn't exist (executes at runtime)
const db = new Database('./databases/workouts.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
});

module.exports = {
	name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) { // only happen if the interaction is the Modal submit button
            return;
        }

        //when the user submits the Modal
        if(interaction.customId === 'excerciseModal'){
            db.exec(`CREATE TABLE IF NOT EXISTS user_${interaction.user.id}('Workouts' TEXT)`);

            const exercise = interaction.fields.getTextInputValue("exerciseName");

            db.exec(`INSERT INTO user_${interaction.user.id}(Workouts) ` +
                    `VALUES('${exercise}')`);
            await interaction.reply({ 
                content: 'Your submission was received successfully!: ' + exercise,
                ephemeral: true
            });
        }
	}
}