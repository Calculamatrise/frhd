import frhd, { Client, Track } from "./src/bootstrap.js";

const client = new Client();

client.on("ready", async function() {
    const track = new Track();

    track.beginPath();
    track.moveTo(0, 0);
    track.lineTo(10, 10, 20, 50);

    console.log(track.code)
});

client.login("TOKEN");