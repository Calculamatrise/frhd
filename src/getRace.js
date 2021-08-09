import User from "./utils/client.js";

export default async function(trackId, userId, callback = t => t) {
    return await User.ajax({
        path: `/t/${trackId}/r/${userId}?ajax=!0`,
        method: "get"
    }, callback);
}