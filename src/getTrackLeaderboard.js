import RequestHandler from "./utils/RequestHandler.js";

export default async function(trackId, callback = t => t) {
    return await RequestHandler.ajax({
        path: "/track_api/load_leaderboard",
        body: {
            t_id: trackId
        },
        method: "post"
    }).then(callback);
}