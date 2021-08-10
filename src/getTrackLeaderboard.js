import User from "./utils/client.js";

export default async function(trackId, callback = t => t) {
    return await User.ajax({
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