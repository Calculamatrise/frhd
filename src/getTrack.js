import RequestHandler from "./utils/RequestHandler.js";
import Track from "./structures/Track.js";

/**
 * 
 * @param {number|string} id track id
 * @param {object} [fields]
 * @param {Function} callback callback function
 * @returns {Promise<Track>}
 */
export default function(id, fields, callback = typeof arguments[arguments.length - 1] == 'function' ? arguments[arguments.length - 1] : res => res) {
    if (typeof fields == 'object') {
        return RequestHandler.ajax(`/track_api/load_track?id=${parseInt(id)}&fields[]=${fields.join("&fields[]=")}`).then(callback);
    }

    return RequestHandler.ajax("/t/" + parseInt(id)).then(function(res) {
        return Track.create(res);
    }).then(callback);
}