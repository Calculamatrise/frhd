import RequestHandler from "./utils/RequestHandler.js";

/**
 * 
 * @param {Function} callback 
 * @returns {Promise}
 */
export default function(callback = res => res) {
    return RequestHandler.ajax("/").then(callback);
}