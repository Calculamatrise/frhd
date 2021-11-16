import RequestHandler from "./utils/RequestHandler.js";

import User from "./structures/User.js";

/**
 * 
 * @param {String|Number} username username or user display name
 * @param {Function} callback callback function
 * @returns {User} 
 */
export default function(user, callback = function() {}) {
    return RequestHandler.ajax({
        path: `/u/${user}?ajax=!0`,
        method: "get"
    }).then(function(user) {
        return User.create(user);
    }).then(callback);
}