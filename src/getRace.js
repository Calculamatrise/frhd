import RequestHandler from "./utils/RequestHandler.js";
import Race from "./structures/Race.js";

/**
 * 
 * @param {number|string} trackId
 * @param {string} username
 * @param {Function} callback
 * @returns {Promise<Race>}
 */
export default function(trackId, username, callback = r => r) {
    return RequestHandler.ajax(`/t/${parseInt(trackId)}/r/` + String(username)).then(function(response) {
        return new Race(response.race_leaderboard[0], response.game_settings.raceData[0]);
    }).then(callback);
}