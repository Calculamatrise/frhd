import frhd, { Client, Track, getCategory } from "./src/bootstrap.js";

const client = new Client();

client.on("ready", async function() {
    let end = await getCategory("recently-added").then(function(response) {
        return parseInt(response.tracks[0].slug);
    });

    for (let trackId = 759117; trackId < end; trackId++) {
        await this.tracks.fetch(trackId).then(function(track) {
            return track.vote(1).catch(error => {
                console.warn(error);
                
                return track.vote(1);
            });
        }).then(function(response) {
            return console.log(trackId, response.result || response.msg);
        }).catch(console.error);
    }
});

client.login("TOKEN");