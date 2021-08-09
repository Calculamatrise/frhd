import User from "./utils/client.js";

export default async function(trackId, callback = t => t) {
    return await User.ajax({
        path: `/t/${trackId}?ajax=!0`,
        method: "get"
    }, callback);
}