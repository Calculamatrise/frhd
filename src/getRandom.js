import RequestHandler from "./utils/RequestHandler.js";

import Track from "./structures/Track.js";
import getTrack from "./getTrack.js";

export default function(min, max, callback = response => response) {
    if (min !== void 0 && max !== void 0) {
        getTrack(Math.ceil(Math.random() * max) + min);
    }

    return RequestHandler.ajax({
        path: `/random/track/?ajax=!0`,
        method: "get"
    }).then(function(track) {
        return new Track(track);
    }).then(callback);
}