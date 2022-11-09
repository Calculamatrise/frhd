import RequestHandler from "./utils/RequestHandler.js";
import Track from "./structures/Track.js";

/**
 * 
 * @param {number|string} id track id
 * @param {Function} callback callback function
 * @returns {Promise<Track>}
 */
export default function(id, callback = res => res) {
    return RequestHandler.ajax("/t/" + parseInt(id)).then(function(res) {
        return Track.create(res);
    }).then(callback);
}