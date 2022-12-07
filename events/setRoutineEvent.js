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

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction){
        if(!interaction.isSelectMenu()){
            return;
        }

        if(interaction.customId == "routineSelectDay"){
            //store the day selected
            let daySelected = interaction.values[0];
            const data = workouts_db.prepare(`SELECT * FROM user_${interaction.user.id} ORDER BY Workouts ASC`);

            const workoutsSelect = new SelectMenuBuilder()
                .setCustomId(`workoutsSelector_${daySelected}`)
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

            const workoutsAction = new ActionRowBuilder().addComponents(workoutsSelect);

            await interaction.update({
                content: "Select workout to add to routine.",
                ephemeral: true,
                components: [workoutsAction]
            });
        } else if(interaction.customId.substring(0, 16) == "workoutsSelector"){
            let day = interaction.customId.substring(17);
            let added = [];
            let duplicates = [];

            calendar_db.exec(
                `CREATE TABLE IF NOT EXISTS user_${interaction.user.id}` +
                `(id integer primary key autoincrement, 'Sunday' TEXT, 'Monday' TEXT, ` +
                `'Tuesday' TEXT, 'Wednesday' TEXT, 'Thursday' TEXT, 'Friday' TEXT, 'Saturday' TEXT)`
            );

            for(let i = 0; i < interaction.values.length; i++){
                const firstNull = calendar_db.prepare(`SELECT id FROM user_${interaction.user.id} WHERE ${day} IS NULL`).pluck().all();
                const exists = calendar_db.prepare(
                    `SELECT COUNT(1) ` +
                    `FROM user_${interaction.user.id} ` +
                    `WHERE ${day} = '${interaction.values[i]}'`
                    ).pluck().all()[0];
                if(exists > 0) {
                    duplicates.push(interaction.values[i]);
                } else {
                    if(firstNull.length > 0) {
                        calendar_db.exec(
                            `UPDATE user_${interaction.user.id} ` +
                            `SET ${day} = '${interaction.values[i]}' ` +
                            `WHERE id = ${firstNull[0]}`
                        );
                    } else {
                        calendar_db.exec(
                            `INSERT INTO user_${interaction.user.id}('${day}') `+
                            `VALUES('${interaction.values[i]}')`
                        );
                    }
                    added.push(interaction.values[i]);
                }
            }
            
            let msg = "";
            if(added.length > 0) {
                msg += `Workouts \`${added.sort().join(", ")}\` set for ${day} :white_check_mark:\n\n`;
            }
            if(duplicates.length > 0) {
                msg += `Duplicate entries \`${duplicates.sort().join(", ")}\` not added for ${day} :no_entry_sign:`;
            }
            
            interaction.update({
                content: msg,
                ephemeral: true,
                components: []
            });
        }
    }
}
