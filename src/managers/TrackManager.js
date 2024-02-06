import BaseManager from "./BaseManager.js";
import RequestHandler from "../utils/RequestHandler.js";

import getCategory from "../getCategory.js";
import getTrackLeaderboard from "../getTrackLeaderboard.js";

export default class extends BaseManager {
	/**
	 * 
	 * @async
	 * @param {number|string} id track ID
	 * @param {object} [options]
	 * @param {boolean} [options.force]
	 * @returns {Promise<Track>}
	  */
	async fetch(id, { force } = {}) {
		if (!force && this.cache.has(id)) {
			return this.cache.get(id);
		}

		const entry = await this.client.api.tracks(id);
		entry && this.cache.set(id, entry);
		return entry
	}

	/**
	 * 
	 * @param {object} [options]
	 * @param {string} [options.title]
	 * @param {string} [options.description]
	 * @param {string} [options.code]
	 * @param {string} [options.defaultVehicle]
	 * @param {object} [options.allowedVehicles]
	 * @param {boolean} [options.allowedVehicles.MTB]
	 * @param {boolean} [options.allowedVehicles.BMX]
	 * @returns {Promise<object?>}
	  */
	async post(options) {
		if (String(title).length < 4 && String(title).length > 30) {
			throw new RangeError("Title must be between 4 and 30 characters.");
		} else if (String(description).length < 6 && String(description).length > 300) {
			throw new RangeError("Description must be between 6 and 300 characters.");
		} else if (String(code).trim().length < 500) {
			throw new RangeError("Track length is too small.");
		} else if (String(code).trim().length > 5e4 || String(code).trim().length > 10e4 /* If the user is OA, 10,000k is the limit */) {
			throw new RangeError("Track is too big.");
		}

		return RequestHandler.post("create/submit", {
			name: title,
			desc: description,
			default_vehicle: /^mtb|bmx$/i.test(options.defaultVehicle) ? options.defaultVehicle : 'MTB',
			allowed_vehicles: {
				MTB: Boolean(options.allowedVehicles.MTB),
				BMX: Boolean(options.allowedVehicles.BMX)
			},
			code
		}, true)
	}

	/**
	 * Rate a track
	 * @param {string} trackId
	 * @param {number|boolean} rating
	 * @returns {Promise<object?>}
	 */
	rate(trackId, rating) {
		return RequestHandler.post("track_api/vote", {
			t_id: trackId,
			vote: Boolean(rating)
		}, true)
	}

	/**
	 * Add a track to the 'track of the day' queue
	 * @protected requires administrative privileges.
	 * @param {number|string} track
	 * @param {number|string} lives
	 * @param {number|string} refillCost
	 * @param {number|string} gems
	 * @returns {Promise}
	  */
	addTrackOfTheDay(track, lives, refillCost, gems) {
		return RequestHandler.post("moderator/add_track_of_the_day", {
			t_id: track,
			lives,
			rfll_cst: refillCost,
			gems
		}, true)
	}

	/**
	 * Remove a track from the 'track of the day' queue
	 * @protected requires administrative privileges.
	 * @param {number|string} track
	 * @returns {Promise}
	  */
	removeTrackOfTheDay(track) {
		return RequestHandler.post("admin/removeTrackOfTheDay", {
			t_id: track
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {number|string} id track ID
	 * @returns {Promise}
	  */
	feature(id) {
		return RequestHandler.get(`/track_api/feature_track/${parseInt(id)}/1`, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {number|string} id track ID
	 * @returns {Promise}
	  */
	unfeature(id) {
		return RequestHandler.get(`/track_api/feature_track/${parseInt(id)}/0`, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @description hide a track
	 * @param {number|string} id track ID
	 * @returns {Promise}
	  */
	hide(id) {
		return RequestHandler.get("moderator/hide_track/" + parseInt(id), true)
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @description hide a track
	 * @param {number|string} id track ID
	 * @returns {Promise}
	  */
	hideAsAdmin(id) {
		return RequestHandler.post("admin/hide_track", {
			track_id: parseInt(id)
		}, true)
	}

	/**
	 * Rate all tracks in a given range
	 * @async
	 * @private
	 * @param {number|boolean} rating
	 * @param {object} [options]
	 * @param {number|string} [options.startingTrackId]
	 * @param {number|string} [options.endingTrackId]
	 * @param {number|string} [options.timeout]
	 * @returns {Promise<string>}
	  */
	async rateAll(rating, { startingTrackId, endingTrackId, timeout = 0 } = {}) {
		endingTrackId = Math.min(~~endingTrackId, await getCategory("recently-added").then(({ tracks }) => parseInt(tracks[0].slug)));
		if (isNaN(endingTrackId)) throw new Error("Ending track ID is NaN.");
		for (let trackId = Math.max(1001, ~~startingTrackId); trackId < endingTrackId; trackId++) {
			await RequestHandler.post("track_api/vote", {
				t_id: this.id,
				vote: Boolean(rating)
			}, true).then(r => console.log(trackId, r.result || r.msg)).catch(console.error);
			typeof arguments[arguments.length - 1] == 'function' && arguments[arguments.length - 1].call(this, trackId);
			timeout && await new Promise(resolve => setTimeout(resolve, ~~timeout));
		}

		return `No more ${rating ? 'love' : 'hate'} left to spread!`
	}

	/**
	 * Remove cheated ghosts on all tracks between a given range
	 * @async
	 * @protected requires administrative privileges.
	 * @param {object} [options]
	 * @param {Array<number|string>} [options.users]
	 * @param {number|string} [options.startingTrackId]
	 * @param {number|string} [options.endingTrackId]
	 * @param {number|string} [timeout]
	 * @returns {string} 
	  */
	async deepClean({ users, startingTrackId, endingTrackId, timeout = 0 } = {}) {
		endingTrackId = Math.min(~~endingTrackId, await getCategory("recently-added").then(({ tracks }) => parseInt(tracks[0].slug)));
		if (isNaN(endingTrackId)) throw new Error("Ending track ID is not a number!");
		for (let trackId = Math.max(1001, ~~startingTrackId); trackId <= endingTrackId; trackId++) {
			if (users) {
				for (const userId of users) {
					await RequestHandler.post("moderator/remove_race", {
						t_id: trackId,
						u_id: userId
					}, true).catch(console.warn);
				}
			} else {
				getTrackLeaderboard(trackId).then(async leaderboard => {
					for (const race of leaderboard.filter(race => !race.runTime)) {
						await RequestHandler.post("moderator/remove_race", {
							t_id: trackId,
							u_id: race.userId || race.user.id
						}, true).catch(console.warn);
					}
				});
			}
			typeof arguments[arguments.length - 1] == 'function' && arguments[arguments.length - 1].call(this, trackId);
			timeout && await new Promise(resolve => setTimeout(resolve, ~~timeout));
		}

		return "No more cheaters left to exterminate!"
	}
}