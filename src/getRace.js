import Client from "./utils/client.js";
import Race from "./utils/race.js";

export default async function(trackId, username, callback = t => t) {
    return await Client.ajax({
        path: `/t/${trackId}/r/${username}?ajax=true`,
        method: "get"
    }).then(t => new Race(t.race_leaderboard[0], t.game_settings.raceData[0])).then(callback);
}