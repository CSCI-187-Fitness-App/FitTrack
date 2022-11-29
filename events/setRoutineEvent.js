const { Events, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const reminder = require('../commands/setroutine');
const { ButtonBuilder } = require('@discordjs/builders');

// create database if it doesn't exist (executes at runtime)
const calendar_db = new Database('./databases/calendar.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
});

// create database if it doesn't exist (executes at runtime)
const workouts_db = new Database('./databases/workouts.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
});

let daySelected;

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if(!interaction.isSelectMenu()){
            return;
        }

        if(interaction.customId == "routineSelectDay"){
            //store the day selected
            daySelected = interaction.values[0];
            const data = workouts_db.prepare(`SELECT * FROM user_${interaction.user.id}`);

            const workoutsSelect = new SelectMenuBuilder()
                .setCustomId('workoutsSelector')
                .setPlaceholder('Choose workouts to add to the day selected')
                .setMinValues(1);

            let workoutsCount = 0;

            for(const ch of data.iterate()){
                const workoutName = ch.Workouts;
                workoutsSelect.addOptions(
                    {
                        label: workoutName,
                        value: workoutName
                    }
                );
                workoutsCount++;
            }

            workoutsSelect.setMaxValues(workoutsCount);

            const workoutsAction = new ActionRowBuilder()
                .addComponents(workoutsSelect);

            await interaction.reply({
                content: "Select workout to add to routine.",
                components: [workoutsAction]
            });
        }
        else if(interaction.customId == "workoutsSelector"){
            calendar_db.exec(`CREATE TABLE IF NOT EXISTS user_${interaction.user.id}('Sunday' TEXT, 'Monday' TEXT, 'Tuesday' TEXT, 'Wednesday' TEXT, 'Thursday' TEXT, 'Friday' TEXT, 'Saturday' TEXT)`);
            console.log(daySelected)
            console.log(interaction.values)
            for(let i = 0; i < interaction.values.length; i++){
                calendar_db.exec(`INSERT INTO user_${interaction.user.id}('${daySelected}')`+
                `VALUES('${interaction.values[i]}')`);
            }

            interaction.reply(`Workouts: ${interaction.values.join(", ")}. set for the day: ${daySelected}`);
        }
    }
}
