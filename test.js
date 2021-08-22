import frhd, { Client, Track } from "./src/bootstrap.js";

const client = new Client();

client.on("ready", async function() {
    //this.tracks.fetch(1001).then(console.log)
    //this.users.fetch("char").then(console.log)
    // this.getUser("Char").then(console.log)
    
    for (let t_id = 208172; t_id < 800000; t_id++) {
        await this.tracks.fetch(t_id).then(function(track) {
            return track.vote(1);
        }).then(function(response) {
            return console.log(t_id, response.result || response.msg);
        }).catch(console.error);
    }
});

client.login("TOKEN");