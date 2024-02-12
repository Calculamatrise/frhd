import RequestHandler from "./utils/RequestHandler.js";
import User from "./structures/User.js";

/**
 * 
 * @param {string} uid
 * @param {Function} callback callback function
 * @returns {Promise<User>} 
 */
export default async function(uid, callback = r => r) {
	isFinite(uid) && await RequestHandler.post("friends/remove_friend", { u_id: uid }, false).catch(err => {
		const matches = /[\w-]*(?=,)/.exec(err.message);
		matches !== null && (uid = matches[0]);
		return uid
	});
	return RequestHandler.ajax("u/" + String(uid)).then(data => new User(data)).then(callback)
}