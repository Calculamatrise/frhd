import User from "./utils/client.js";

export default async function(trackId, username, callback = t => t) {
    return await User.ajax({
        path: `/t/${trackId}/r/${username}?ajax=!0`,
        method: "get"
    }, callback);
}