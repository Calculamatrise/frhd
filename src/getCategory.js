import RequestHandler from "./utils/RequestHandler.js";

/**
 * 
 * @param {string} category
 * @param {Function} callback
 * @returns {Promise}
 */
export default function(category, callback = res => res) {
    return RequestHandler.ajax(`/${category}`).then(callback);
}