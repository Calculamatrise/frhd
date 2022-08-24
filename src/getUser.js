import RequestHandler from "./utils/RequestHandler.js";

import User from "./structures/User.js";

/**
 * 
 * @param {String|Number} username username or user display name
 * @param {Function} callback callback function
 * @returns {User} 
 */
export default function(user, callback = response => response) {
    return RequestHandler.ajax(`/u/${user}`).then(function(response) {
        return User.create(response);
    }).then(callback);
}