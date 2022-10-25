const Client = require("./Structures/Client.js");
const config = require("./Data/config.json");

const client = new Client();

console.clear();
client.start(config.token);