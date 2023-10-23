import crypto from "crypto";

import RequestHandler from "../utils/RequestHandler.js";
import BaseManager from "./BaseManager.js";
import Race from "../structures/Race.js";
import getUser from "../getUser.js";

export default class extends BaseManager {
	/**
	 * 
	 * @async
	 * @param {number|string} uid id or username
	 * @returns {Promise<Race>}
	 */
	async fetch(uid) {
		isNaN(uid) && (uid = await getUser(uid).then(user => user.id));
		if (!uid) throw new Error("INVALID_USER");
		return RequestHandler.get(`/track_api/load_races?t_id=${this.client.id}&u_ids=${uid}`).then(res => {
			return res.data.map(race => {
				race = new Race(Object.assign({ track: this.client }, race));
				this.cache.set(race.user.id, race);
				return race;
			});
		});
	}

	/**
	 * 
	 * @private
	 * @param {number|string} user 
	 * @returns {object}
	 */
	clone(user) {
		return this.fetch(user).then(res => this.post(res.race.code, res.race.vehicle, res.race.runTicks, res.race.vehicle));
	}

	/**
	 * 
	 * @private
	 * @param {number|string} uid 
	 * @param {object|string} code 
	 * @param {number|string} ticks 
	 * @param {string} [vehicle] default is MTB
	 * @returns {Promise<object>}
	 */
	async post(uid, code, ticks, vehicle = 'MTB') {
		isNaN(uid) && (uid = await getUser(uid).then(user => user.id));
		code instanceof Object && (code = JSON.stringify(code));
		if (!uid) throw new Error("INVALID_CLIENT");
		else if (typeof code != 'string') throw new TypeError("Race data must be of type: object or string");
		else if (isNaN(ticks)) throw new Error("Ticks must be of type: number");
		return RequestHandler.post("track_api/track_run_complete", {
			t_id: this.client.id,
			u_id: uid,
			code,
			vehicle,
			run_ticks: ticks,
			fps: 25,
			time: t2t(ticks),
			sig: crypto.createHash('sha256').update(`${this.client.id}|${uid}|${code}|${ticks}|${vehicle}|25|erxrHHcksIHHksktt8933XhwlstTekz`).digest('hex')
		}, true);
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {number|string} uid id or username
	 * @returns {Promise}
	 */
	async remove(uid) {
		isNaN(uid) && (uid = await getUser(uid).then(user => user.id));
		if (!uid) throw new Error("INVALID_USER");
		return RequestHandler.post("moderator/remove_race", {
			t_id: this.client.id,
			u_id: uid
		}, true);
	}
}

function t2t(ticks) {
	let t = parseInt(ticks) / 30 * 1e3;
	return Math.floor(t / 6e4) + ":" + String((t % 6e4 / 1e3).toFixed(2)).padStart(5, '0');
}