import frhd, { Client, Builder, Gamepad, Image } from "./src/bootstrap.js";

const track = new Builder();

track.beginPath();

// const image = new Image();
// image.src = "https://calculamatrise.github.io/wtf.png";
// image.addEventListener("load", function(image) {
//     track.drawImage(image, 10, 20, 514, 621, 0, 0, 514, 621);
    
//     console.log(track.code);
// });

// track.moveTo(20, 20);
// track.lineTo(100, 20);
// track.arcTo(150, 20, 150, 70, 50);
// track.lineTo(150, 120);
// track.stroke();

track.strokeText("Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz", 10, 10);

console.log(track.code);

// const gamepad = new Gamepad();

// gamepad.on("complete", function(records) {
//     console.log(records);
// });

// gamepad.on("tick", function(ticks) {
//     this.toggleKey(this.keymap[Math.floor(Math.random() * ticks) % 5]);
//     this.tick(10);
// });

// gamepad.toggleKey("up");
// gamepad.tick();
// gamepad.setKeyDown("up");
// gamepad.complete();

// const client = new Client();

// client.on("ready", async function() {
//     let track = await this.tracks.fetch(1001);
//     // this.user.changeUsername("Calculamatrise");
//     // const user = await this.users.fetch("char");
//     console.log(track.races.fetch(this.user.id));
// });

// client.login({
//     username: "calculus",
//     password: "nt, nt."
// });