import RequestHandler from "./utils/RequestHandler.js";

import User from "./structures/User.js";

export default async function(userId, callback = user => user) {
    return await RequestHandler.ajax({
        path: `/u/${userId}?ajax=!0`,
        method: "get"
    }).then(function(user) {
        return User.create(user);
    }).then(callback);
}