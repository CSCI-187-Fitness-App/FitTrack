const Discord = require("discord.js");
const { GatewayIntentBits } = require('discord.js');
const Command = require("./Command.js");
const Event = require("./Event.js");
const config = require("../Data/config.json");



class Client extends Discord.Client {
    constructor() {
        super({ 
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            allowedMentions: { 
                repliedUser: false //don't ping user
            } 
        }); 

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();

        this.prefix = config.prefix;
    }

    start(token) {
        const fs = require("fs");
        fs.readdirSync("./src/Commands").filter(file => file.endsWith(".js")).forEach(file => {
            /**
             * @type {Command}
             */
            const command = require(`../Commands/${file}`);
            console.log(`Command ${command.name} loaded.`);
            this.commands.set(command.name, command);
        });

        fs.readdirSync("./src/Events").filter(file => file.endsWith(".js")).forEach(file => {
            /**
             * @type {Event}
             */
            const event = require(`../Events/${file}`);
            console.log(`Event ${event.event} loaded.`);
            this.on(event.event, event.run.bind(null, this));
        });

        this.login(token);
    }

}

module.exports = Client;