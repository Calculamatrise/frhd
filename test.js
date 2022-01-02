import frhd, { Client, Builder, Image } from "./src/bootstrap.js";

const track = new Builder();

track.beginPath();

const image = new Image();
image.src = "https://calculamatrise.github.io/wtf.png";
image.addEventListener("load", function(image) {
    track.drawImage(image, 10, 20, 514, 621, 0, 0, 514, 621);
    
    console.log(track.code);
});

track.moveTo(20, 20);
track.lineTo(100, 20);
track.arcTo(150, 20, 150, 70, 50);
track.lineTo(150, 120);
track.stroke();

console.log(track.code);

// const client = new Client();

// client.on("ready", async function() {
//     const track = this.tracks.create();

//     track.beginPath();
//     track.moveTo(20, 20);
//     track.lineTo(100, 20);
//     track.arcTo(150, 20, 150, 70, 50);
//     track.lineTo(150, 120);
    
//     console.log(track.code);

//     const user = await this.users.fetch("char");

//     console.log(user);
// });

// client.defaultLogin("precalculus", "nt, nt.");