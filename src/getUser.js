import Client from "./utils/client.js";
import User from "./utils/user.js";

export default async function(userId, callback = t => t) {
    return await Client.ajax({
        path: `/u/${userId}?ajax=!0`,
        method: "get"
    }).then(t => new User(t)).then(callback);
}