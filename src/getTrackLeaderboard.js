import RequestHandler from "./utils/RequestHandler.js";

/**
 * 
 * @param {number|string} id track id
 * @param {Function} callback
 * @returns {Promise}
 */
export default function(id, callback = r => r) {
    if (parseInt(id) < 1001) {
        throw new RangeError("Tracks with an id below 1001 do not exist!");
    }

    return RequestHandler.post("/track_api/load_leaderboard", {
        t_id: parseInt(id)
    }).then(callback);
}