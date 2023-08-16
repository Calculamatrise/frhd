import frhd, { Client, Builder, Gamepad, Image } from "../src/index.js";

const client = new Client({
	debug: true,
    listen: true,
    interval: 3e3
});

client.on("ready", async function() {
    console.log("Yas!", this);
	// console.log(this.user, await this.users.fetch('char'))
});
// test track challenge
client.on("trackCommentMention", async function({ comment }) {
    console.log("trackCommentMention", comment);
    comment.reply({
        content: "test"
    });
});

client.login("token");