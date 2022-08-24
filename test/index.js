import frhd, { Client, Builder, Gamepad, Image } from "../src/index.js";

const client = new Client({
    listen: true,
    interval: 3e3
});

client.on("ready", async function() {
    console.log("Yas!", this);
});

client.on("commentMention", function(comment) {
    console.log("commentMention", comment);
    comment.reply({
        content: "test"
    });
});

client.login({
    username: "frai",
    password: "password"
});