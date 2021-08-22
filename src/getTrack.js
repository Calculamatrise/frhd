import RequestHandler from "./utils/RequestHandler.js";

import Track from "./structures/Track.js";

export default async function(trackId, callback = track => track) {
    return await RequestHandler.ajax({
        path: `/t/${trackId}?ajax=!0`,
        method: "get"
    }).then(function(track) {
        return new Track(track);
    }).then(callback);
}