import Client from "./utils/client.js";
import Track from "./utils/track.js";

export default async function(trackId, callback = t => t) {
    return await Client.ajax({
        path: `/t/${trackId}?ajax=!0`,
        method: "get"
    }).then(t => new Track(t)).then(callback);
}