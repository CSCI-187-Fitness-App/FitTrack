const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const reminder = require('../commands/setpr');

// create PR database if it doesn't exist (executes at runtime)
const db = new Database('./databases/prdatabase.sqlite3', Database.OPEN_READWRITE, (err) => {
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

        if(interaction.customID === 'prModal'){
            db.exec(`CREATE TABLE IF NOT EXISTS user_${interaction.user.id}('Workouts' TEXT)`);

            const exercise = interaction.fields.getTextInputValue("exerciseName");
            const day = interaction.fields.getTextInputValue("prDate");
            const amount = interaction.fields.getTextInputValue("prAmount");


            const data = db.prepare(`SELECT * FROM user_${interaction.user.id}`);

            db.exec(`INSERT INTO user_${interaction.user.id}(userID, Workouts, Dates, Weights) ` +
                        `VALUES('${interaction.user.id}','${exercise}','${day}','${amount}')`);
                await interaction.reply({ 
                    content: `Exercise \`${exercise}\` has been added.`,
                    ephemeral: true,
                    components: []
            });
            
        }
    }
}