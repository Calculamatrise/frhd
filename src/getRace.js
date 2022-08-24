import RequestHandler from "./utils/RequestHandler.js";

import Race from "./structures/Race.js";

export default function(trackId, username, callback = response => response) {
    return RequestHandler.ajax(`/t/${trackId}/r/${username}`).then(function(response) {
        return new Race(response.race_leaderboard[0], response.game_settings.raceData[0]);
    }).then(callback);
}