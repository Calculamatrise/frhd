import RequestHandler from "./utils/RequestHandler.js";
import Track from "./structures/Track.js";

/**
 * 
 * @param {number|string} id track id
 * @param {object} [fields]
 * @param {Function} callback callback function
 * @returns {Promise<Track>}
 */
export default function(id, fields, callback = r => r) {
	callback ||= typeof arguments[arguments.length - 1] == 'function' && arguments[arguments.length - 1];
	if (fields instanceof Object && typeof fields[Symbol.iterator] == 'function') {
		return RequestHandler.ajax(`track_api/load_track?id=${parseInt(id)}&fields[]=${Array.from(fields.values()).join("&fields[]=")}`).then(callback);
	}

	return RequestHandler.ajax("t/" + parseInt(id)).then(data => Track.create(data)).then(callback)
}