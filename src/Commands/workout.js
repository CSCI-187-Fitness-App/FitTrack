const Command = require("../Structures/Command.js");

module.exports = new Command({
    name: "workout",
    description: "Checks workout of the day and returns exercises, sets/reps, and wieghts.",

    async run(message, args, client) {

        message.reply(`Workout of the day: Leg Day \n
        Excersise: squats \n
        Sets/reps: 3/6 Weight: 135 155 155 \n
        Excersise: calf raises\n
        Sets/reps: 3/6 Weight: 135 155 155\n
        Excersise: RDL\n
        Sets/reps: 3/6 Weight: 155 175 175`); 


    }
});