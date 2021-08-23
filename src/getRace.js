import RequestHandler from "./utils/RequestHandler.js";

import Race from "./structures/Race.js";

export default async function(trackId, username, callback = race => race) {
    return await RequestHandler.ajax({
        path: `/t/${trackId}/r/${username}?ajax=true`,
        method: "get"
    }).then(function(race) {
        return new Race(race.race_leaderboard[0], race.game_settings.raceData[0]);
    }).then(callback);
}