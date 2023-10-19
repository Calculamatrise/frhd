import BaseManager from "./BaseManager.js";
import RequestHandler from "../utils/RequestHandler.js";
import getUser from "../getUser.js";

export default class extends BaseManager {
	/**
	 * 
	 * @async
	 * @param {number|string} user
	 * @returns {object}
	 */
	async fetch(user) {
		if (isNaN(user)) {
			user = await getUser(user).then(u => u.id);
		}

		user = this.cache.get(user);
		if (user) {
			return getUser(user.username);
		}
	}
	
	/**
	 * Sends a friend request to the specified user
	 * @param {string} username 
	 * @returns {Promise}
	 */
	async add(username) {
		return RequestHandler.post("/friends/send_friend_request", {
			u_name: username
		}, true);
	}

	/**
	 * Accept an incoming friend request
	 * @param {string} username 
	 * @returns {Promise}
	 */
	async accept(user) {
		if (isNaN(user)) {
			user = await getUser(user).then(u => u.id);
		}

		return RequestHandler.post("/friends/respond_to_friend_request", {
			u_id: user,
			action: 'accept'
		}, true).then(res => {
			// this.cache.set(user.id, user);
			return res;
		});
	}

	/**
	 * 
	 * @param {string} username 
	 * @returns {Promise}
	 */
	async reject(user) {
		if (isNaN(user)) {
			user = await getUser(user).then(u => u.id);
		}

		return RequestHandler.post("/friends/respond_to_friend_request", {
			u_id: user,
			action: 'reject'
		}, true);
	}

	/**
	 * 
	 * @param {number|string} user 
	 * @returns {Promise}
	 */
	async remove(user) {
		if (isNaN(user)) {
			user = await getUser(user).then(u => u.id);
		}

		if (!user) throw new Error("INVALID_USER");
		return RequestHandler.post("/friends/remove_friend", {
			u_id: user
		}, true);
	}
}