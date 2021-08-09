import User from "./utils/client.js";

export default async function(callback = t => t) {
    return await User.ajax({
        path: `/random/track/?ajax=!0`,
        method: "get"
    }, callback);
}