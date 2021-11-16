import RequestHandler from "./utils/RequestHandler.js";

import Track from "./structures/Track.js";

/**
 * 
 * @param {String|Number} id track id
 * @param {Function} callback callback function
 * @returns {Track} 
 */
export default function(id, callback = function() {}) {
    return RequestHandler.ajax({
        path: `/t/${id}?ajax=!0`,
        method: "get"
    }).then(function(track) {
        return Track.create(track);
    }).then(callback);
}