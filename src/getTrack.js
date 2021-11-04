import RequestHandler from "./utils/RequestHandler.js";

import Track from "./structures/Track.js";

export default function(trackId, callback = track => track) {
    return RequestHandler.ajax({
        path: `/t/${trackId}?ajax=!0`,
        method: "get"
    }).then(function(track) {
        return Track.create(track);
    }).then(callback);
}