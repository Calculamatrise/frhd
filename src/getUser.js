import User from "./utils/client.js";

export default async function(userId, callback = t => t) {
    return await User.ajax({
        path: `/u/${userId}?ajax=!0`,
        method: "get"
    }, callback);
}