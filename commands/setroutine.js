// "!setRoutine" command
//set routine is supposed to give the user a modal to enter their routine
//when entering their routine they should select a day then in a text box
//enter what their workout is for that day
const { 
    ActionRowBuilder, 
    SlashCommandBuilder,
    SelectMenuBuilder
} = require('discord.js');

const Database = require('better-sqlite3');

const db = new Database('./databases/workouts.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
});

module.exports = {
	data: new SlashCommandBuilder()
        .setName('setroutine')
		.setDescription('Set your workout routine for a specific day by selecting from your added workouts.'),
	async execute(interaction) {
        db.exec(`CREATE TABLE IF NOT EXISTS user_${interaction.user.id}('Workouts' TEXT)`)

        let empty = db.prepare(`SELECT COUNT(*) FROM user_${interaction.user.id}`).pluck().all()[0];

        if(empty == 0) {
            await interaction.reply({
                content: ":warning: ERROR: no workouts detected. Use `/addworkout` to add a workout. :warning:",
                ephemeral: true,
            });
        } else {
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
	}
};