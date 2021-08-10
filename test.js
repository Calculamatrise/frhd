import frhd, { Client } from "./src/bootstrap.js";

const client = new Client();

client.on("ready", function() {
    this.removeRace("1001", this.user.id).then(console.log);
});

client.on("challenge", function(t) {
    console.log(t)
});

client.on("commentMention", function(t) {
    console.log(t)
});

client.login("TOKEN");