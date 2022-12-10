//for reminder, bot can offer a reaction, then user clicks on reaction and the bot will add a day to the streak
 
const {
    SlashCommandBuilder,
    EmbedBuilder
 } = require('discord.js');

const Database = require('better-sqlite3');

const db = new Database('./databases/streak.sqlite3', Database.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    verbose: console.log
});

db.exec(`CREATE TABLE IF NOT EXISTS streaks('User' INTEGER, 'Streak' INTEGER, 'Date' INTEGER)`);

module.exports = {
	data: new SlashCommandBuilder()
        .setName('streak')
        .setDescription('This command starts a streak or checks you in for you streak!'),
	async execute(interaction) {
        
        let empty = db.prepare(`SELECT COUNT(*) FROM streaks WHERE User = ${interaction.user.id}`).pluck().all()[0];

        let dayprevious = db.prepare(`SELECT Date FROM streaks WHERE User = ${interaction.user.id}`).pluck().all()[0];
        let daydifference = Math.round(Date.now() / 86400000) - Math.round(dayprevious / 86400000)

        let response = "";
        if (empty == 0) {
            db.exec(`INSERT INTO streaks(User, Streak, Date) VALUES(${interaction.user.id}, 1, ${Date.now()})`);
            response = "You've been set up with streaks, and are currently at 1"
        } else if(daydifference == 1){
            let next = db.prepare(`SELECT Streak FROM streaks WHERE User = ${interaction.user.id}`).pluck().all()[0];
            next += 1;
            db.exec(`UPDATE streaks SET Streak = ${next} WHERE User = ${interaction.user.id}`);
            db.exec(`UPDATE streaks SET Date = ${Date.now()} WHERE User = ${interaction.user.id}`);
            let days = db.prepare(`SELECT Streak FROM streaks WHERE User = ${interaction.user.id}`).pluck().all()[0];
            response = `Your streak is ${days}. Keep it up! `
        } else if(daydifference == 0){
            let days = db.prepare(`SELECT Streak FROM streaks WHERE User = ${interaction.user.id}`).pluck().all()[0];
            response = `You have already checked in for today! Your streak is ${days}`
        } else if(daydifference > 1){
            db.exec(`UPDATE streaks SET Streak = 1 WHERE User = ${interaction.user.id}`);
            response = `Oops, you missed a day or a few. Your streak has been reset to 1`
        }


        
        
        const sent = await interaction.reply({ 
			content: response, 
			ephemeral: true,
			fetchReply: true 
		});

        

        



	}
};


//Other part of streak to send daily checkins
  
 
 