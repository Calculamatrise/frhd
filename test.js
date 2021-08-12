import frhd, { Client, Track } from "./src/bootstrap.js";

const client = new Client();

client.on("ready", async function() {
    const track = new Track();

    track.beginPath();
    track.moveTo(-40, 50);
    track.lineTo(40, 50);
    track.lineTo(40, 100);
    track.closePath();

    console.log(track.code)
});

client.login("TOKEN");