import RequestHandler from "./utils/RequestHandler.js";

/**
 * 
 * @param {Function} callback
 * @returns {Promise<object>}
 */
export default function(callback = res => res) {
    return RequestHandler.ajax("/Calculamatrise/frhd_featured_ghosts/master/data.json", {
        host: "raw.githubusercontent.com"
    }).then(callback);
}