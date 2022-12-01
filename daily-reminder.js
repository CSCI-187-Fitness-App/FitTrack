const Database = require('better-sqlite3');
const schedule = require('node-schedule');

module.exports = {
	dailyReminder: function() {
        const rule = new schedule.RecurrenceRule();
        rule.hour = 9;
        rule.minute = 0;
        rule.tz = 'Etc/GMT-8';
        const createTable = "CREATE TABLE IF NOT EXISTS reminderTable('userId' TEXT, 'Sunday' INTEGER, 'Monday' INTEGER, 'Tuesday' INTEGER, 'Wednesday' INTEGER, 'Thursday' INTEGER, 'Friday' INTEGER, 'Saturday' INTEGER)";
        const job = schedule.scheduleJob(rule, function () {
            const d = new Date();
            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
            const db = new Database('databases/reminder.sqlite3', Database.OPEN_READWRITE, (err) => {
                if (err) {
                    console.error(err.message);
                }
                verbose: console.log;
            });
            db.exec(createTable);
        
            const data = db.prepare(`SELECT userId FROM reminderTable WHERE ${weekday[d.getDay()]}=1`);
            for (const ch of data.iterate()) { // DM all users with reminders set on current day
                client.users.send(`${ch.userId}`, `:man_lifting_weights: This is your ${weekday[d.getDay()]} reminder to go workout! :woman_lifting_weights:`);
            }
        });
	}
}