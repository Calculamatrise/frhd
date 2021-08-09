import User from "./utils/client.js";

export default async function(page, callback = t => t) {
    return await User.ajax({
        path: `/leaderboards/player/lifetime/${page}?ajax=!0`,
        method: "get"
    }, callback);
}