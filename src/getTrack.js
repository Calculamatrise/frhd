import RequestHandler from "./utils/RequestHandler.js";

import Track from "./structures/Track.js";

/**
 * 
 * @param {String|Number} id track id
 * @param {Function} callback callback function
 * @returns {Track} 
 */
export default function(id, callback = response => response) {
    return RequestHandler.ajax("/t/" + parseInt(id) + "").then(function(response) {
        return Track.create({
            ...response.track,
            campagin: response.campagin,
            track_comments: response.track_comments,
            track_stats: response.track_stats
        });
    }).then(callback);
}