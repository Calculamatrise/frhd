import User from "./utils/client.js";

export default async function(callback = t => t) {
    return await User.ajax({
        path: "/?ajax=true",
        method: "get"
    }, callback);
}