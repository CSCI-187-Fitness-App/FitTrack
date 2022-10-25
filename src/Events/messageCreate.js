const Event = require("../Structures/Event.js")

module.exports = new Event("messageCreate", (config, message) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(config.prefix)) return;

    //removes any additional whitespace in command prompts
    const args = message.content.substring(config.prefix.length).split(/ +/);

    //print error message if command doesn't exist
    const command = config.commands.find(cmd => {
        cmd.name === args[0];
    });
    if (!command) return message.reply(`:warning: *Command* \`!${args[0]}\` *does not exist.* :warning:`);

    command.run(message, args, config);
});
