import RequestHandler from "./utils/RequestHandler.js";
import Race from "./structures/Race.js";
import getUser from "./getUser.js";

/**
 * 
 * @param {number|string} trackId track id
 * @param {number|string} uid user id or username
 * @param {Function} callback
 * @returns {Promise<Race>}
 */
export default async function(trackId, uid, callback = r => r) {
	isNaN(uid) && (uid = await getUser(uid).then(user => user.id));
	return RequestHandler.post("track_api/load_races", {
		t_id: trackId,
		u_ids: uid
	}).then(([race]) => {
		return new Race(Object.assign(race, { track: { id: trackId }}))
	}).then(callback)
}