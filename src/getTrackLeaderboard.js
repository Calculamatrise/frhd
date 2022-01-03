import RequestHandler from "./utils/RequestHandler.js";

export default function(trackId, callback = response => response) {
    return RequestHandler.ajax({
        path: "/track_api/load_leaderboard",
        body: {
            t_id: trackId
        },
        method: "post"
    }).then(callback);
}