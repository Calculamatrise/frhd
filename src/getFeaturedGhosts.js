import RequestHandler from "./utils/RequestHandler.js";

/**
 * 
 * @param {Function} callback
 * @returns {Promise<object>}
 */
export default function(callback = r => r) {
	return RequestHandler.ajax("Calculamatrise/frhd-featured-ghosts/master/data.json", {
		host: "raw.githubusercontent.com"
	}).then(callback);
}