import RequestHandler from "./utils/RequestHandler.js";

import User from "./structures/User.js";

export default function(userId, callback = user => user) {
    return RequestHandler.ajax({
        path: `/u/${userId}?ajax=!0`,
        method: "get"
    }).then(function(user) {
        return User.create(user);
    }).then(callback);
}