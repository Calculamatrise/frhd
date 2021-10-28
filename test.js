import frhd, { Client, Builder, getCategory } from "./src/bootstrap.js";

const client = new Client();

client.on("ready", async function() {
    const track = this.tracks.create();

    track.beginPath();
    track.moveTo(20, 20);
    track.lineTo(100, 20);
    track.arcTo(150, 20, 150, 70, 50);
    track.lineTo(150, 120);
    
    console.log(track.code);

    const user = await this.users.fetch("char");

    console.log(user);
});

client.defaultLogin("precalculus", "nt, nt.");