const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const reminder = require('../commands/setroutine');
const { ButtonBuilder } = require('@discordjs/builders');

// create database if it doesn't exist (executes at runtime)
const db = new Database('./databases/calendar.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
});

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if(!interaction.isSelectMenu()){
            return;
        }

        if(interaction.customId == "setroutine"){
            db.exec(`CREATE TABLE IF NOT EXISTS user_${interaction.user.id}('Sunday' TEXT, 'Monday' TEXT, 'Tuesday' TEXT, 'Wednesday' TEXT, 'Thursday' TEXT, 'Friday' TEXT, 'Saturday' TEXT)`);
        }

        const data = db.prepare(`SELECT * FROM user_${interaction.user.id}`);

        const workoutsBuilder = new SelectMenuBuilder()
            .setCustomId('workoutsSelector')
            .setPlaceholder('Placeholder');

        for(const ch of data.iterate()){
            const workoutName = ch.Workouts;
            ButtonBuilder.addOptions(
                {
                    label: workoutName,
                    value: workoutName
                }
            );
        }
    }
}
