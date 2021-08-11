import Client from "./utils/client.js";

export default async function(trackId, callback = t => t) {
    return await Client.ajax({
        path: "/track_api/load_leaderboard",
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: {
            t_id: trackId
        },
        method: "post"
    }, callback);
}