import RequestHandler from "./utils/RequestHandler.js";

/**
 * 
 * @param {number|string} page
 * @param {Function} callback
 * @returns {Promise}
 */
export default function(page = 1, callback = res => res) {
    return RequestHandler.ajax("/leaderboards/player/lifetime/" + parseInt(page)).then(callback);
}