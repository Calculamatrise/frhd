import RequestHandler from "./utils/RequestHandler.js";
import User from "./structures/User.js";

/**
 * 
 * @param {string} username
 * @param {Function} callback callback function
 * @returns {Promise<User>} 
 */
export default function(username, callback = res => res) {
    return RequestHandler.ajax("/u/" + String(username)).then(function(res) {
        return User.create(res);
    }).then(callback);
}