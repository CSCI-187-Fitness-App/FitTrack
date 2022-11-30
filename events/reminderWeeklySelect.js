const { Events } = require('discord.js');
const Database = require('better-sqlite3');

const createTable = "CREATE TABLE IF NOT EXISTS reminderTable('userId' TEXT, 'Sunday' INTEGER, 'Monday' INTEGER, 'Tuesday' INTEGER, 'Wednesday' INTEGER, 'Thursday' INTEGER, 'Friday' INTEGER, 'Saturday' INTEGER)";

// create database if it doesn't exist (executes at runtime)
const db = new Database('./databases/reminder.sqlite3', Database.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message);
		}
		verbose: console.log
});
db.exec(createTable);

// check if user id already exists in the reminder database
const reminderExists = (id) => {
	const data = db.prepare('SELECT * FROM reminderTable');
	let flag = false;
	for (const ch of data.iterate()) {
		if (ch.userId === `${id}`) {
			flag = true;
			break;
		}
	}
	return flag;
}

module.exports = {
	name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isSelectMenu()) { // only get weekly reminder select menu event
            return;
        }

        if(interaction.customId === "reminderWeeklySelect") {
            if(reminderExists(interaction.user.id)) {
                interaction.update({
                    content: `:warning: You already have a reminder set. :warning:`,
                    ephemeral: true,
                    components: []
                });
            } else {
                let days = [0, 0, 0, 0, 0, 0, 0];
                for(let i = 0; i < interaction.values.length; i++) {
                    const dayOfWeek = interaction.values[i];
                    switch(dayOfWeek) {
                        case "Sunday":
                            days[0] = 1;
                            break;
                        case "Monday":
                            days[1] = 1;
                            break;
                        case "Tuesday":
                            days[2] = 1;
                            break;
                        case "Wednesday":
                            days[3] = 1;
                            break;
                        case "Thursday":
                            days[4] = 1;
                            break;
                        case "Friday":
                            days[5] = 1;
                            break;
                        case "Saturday":
                            days[6] = 1;
                            break;
                        default:
                            break;
                    }
                }
                db.exec("INSERT INTO reminderTable(userId, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday) " +
                        `VALUES('${interaction.user.id}', ${days[0]}, ${days[1]}, ${days[2]}, ${days[3]}, ${days[4]}, ${days[5]}, ${days[6]})`
                        );
                interaction.update({
                    content: `Reminders set for \`${interaction.values.join(", ")}\` :white_check_mark:`,
                    ephemeral: true,
                    components: []
                });
            }	
        }
    }
}