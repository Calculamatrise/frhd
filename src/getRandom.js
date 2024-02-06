import RequestHandler from "./utils/RequestHandler.js";

import Track from "./structures/Track.js";
import getTrack from "./getTrack.js";

/**
 * 
 * @param {number|string} min
 * @param {number|string} max
 * @param {Function} callback
 * @returns {Promise<Track>}
 */
export default async function(min, max, callback = typeof arguments[arguments.length - 1] == 'function' ? arguments[arguments.length - 1] : r => r) {
	if (typeof min == 'number' || typeof max == 'number') {
		return getTrack(Math.round(Math.random() * Math.max(max, 1001) ?? await getCategory('recently-added').then(({ tracks }) => parseInt(tracks[0].slug))) + Math.max(min, 1001));
	}

	return RequestHandler.ajax("random/track/").then(track => {
		return new Track(track)
	}).then(callback)
}