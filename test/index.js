import frhd, { Client, Builder, Gamepad, Image, getRace } from "../src/index.js";

// const client = new Client({
// 	debug: true,
// 	listen: true,
// 	interval: 3e3
// });

let res = await getRace('1001', 'calculus')
console.log(res)

// client.on("ready", async function() {
// 	console.log("Yas!", this);
// 	// console.log(this.user, await this.users.fetch('char'))
// });
// // test track challenge
// client.on("trackCommentMention", async function({ comment }) {
// 	console.log("trackCommentMention", comment);
// 	comment.reply({
// 		content: "test"
// 	});
// });

// client.login("token");

const ctx = new Builder();

ctx.import('-18 1i 18 1i##T -18 1i,V -18 1i 2 a');
ctx.star(200, 200)
ctx.heli(-40, 50)

console.log(ctx.toString())