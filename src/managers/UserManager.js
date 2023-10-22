import BaseManager from "./BaseManager.js";
import RequestHandler from "../utils/RequestHandler.js";

export default class extends BaseManager {
	/**
	 * 
	 * @async
	 * @param {object|number|string} uid id or username
	 * @param {object} [options]
	 * @param {boolean} [options.force]
	 * @returns {User}
	  */
	async fetch(uid, { force } = {}) {
		if (typeof uid == 'object') {
			if (uid.hasOwn('id')) {
				uid = parseInt(uid['id']);
			} else if (uid.hasOwn('username')) {
				uid = uid['username'];
			}

			if (uid.hasOwn('force')) {
				force = uid.force;
			}
		}

		if (!force && this.cache.has(uid)) {
			return this.cache.get(uid);
		} else if (typeof uid == 'number') {
			await RequestHandler.post("friends/remove_friend", { u_id: uid }, false).then(res => {
				// Response: "You are not friends with USERNAME, you cannot remove friendship."
				const matches = /[\w-]+(?=,)/.exec(res.msg);
				if (matches !== null) {
					uid = matches[0];
				}
			});
		}

		const entry = await this.client.api.users(uid);
		entry && this.cache.set(uid, entry);
		return entry;
	}

	/**
	 * 
	 * @async
	 * @param {number|string} uid id or username
	 * @returns {Promise}
	  */
	async subscribe(uid) {
		isNaN(arguments[0]) && (uid = await this.fetch(String(arguments[0])).then(user => user.id));
		return RequestHandler.post("track_api/subscribe", {
			sub_uid: uid,
			subscribe: 1
		}, true);
	}

	/**
	 * 
	 * @async
	 * @param {number|string} uid id or username
	 * @returns {Promise}
	  */
	async unsubscribe(uid) {
		isNaN(arguments[0]) && (uid = await this.fetch(String(arguments[0])).then(user => user.id));
		return RequestHandler.post("track_api/subscribe", {
			sub_uid: uid,
			subscribe: 0
		}, true);
	}

	search(query) {
		return RequestHandler.post("search/u_mention_lookup/" + query);
	}

	/**
	 * Change a user's username
	 * @protected requires administrative privileges.
	 * @param {number|string} uid id or username
	 * @param {string} username new username
	 * @returns {Promise}
	  */
	async changeUsername(uid, username) {
		isNaN(arguments[0]) && (uid = await this.fetch(String(arguments[0])).then(user => user.id));
		return RequestHandler.post("moderator/change_username", {
			u_id: uid,
			username
		}, true);
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {number|string} u_name username
	 * @param {string} username new username
	 * @returns {Promise}
	  */
	changeUsernameAsAdmin(u_name, username) {
		return RequestHandler.post("admin/change_username", {
			change_username_current: u_name,
			change_username_new: username
		}, true);
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {number|string} uid ID or username
	 * @param {string} email 
	 * @returns {Promise}
	  */
	async changeEmail(uid, email) {
		isNaN(arguments[0]) && (uid = await this.fetch(String(arguments[0])).then(user => user.id));
		return RequestHandler.post("moderator/change_email", {
			u_id: uid,
			email
		}, true);
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {string} uid username or id
	 * @param {string} email 
	 * @returns {Promise}
	  */
	async changeEmailAsAdmin(uid, email) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/change_user_email", {
			username: uid,
			email
		}, true);
	}

	/**
	 * 
	 * @param {number|string} uid ID or username
	 * @returns {Promise}
	  */
	async toggleOA(uid) {
		isNaN(arguments[0]) && (uid = await this.fetch(String(arguments[0])).then(user => user.id));
		return RequestHandler.post("moderator/toggle_official_author/" + uid, true);
	}

	/**
	 * 
	 * @param {string} uid username or id
	 * @returns {Promise}
	  */
	async toggleClassicUserAsAdmin(uid) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/toggle_classic_user/", {
			toggle_classic_uname: uid
		}, true);
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {string} uid username or id
	 * @param {number|string} coins 
	 * @returns {Promise}
	  */
	async addWonCoins(uid, coins) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/add_won_coins", {
			coins_username: uid,
			num_coins: coins
		}, true);
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {string} uid username or id
	 * @param {number|string} days
	 * @param {number|string|boolean} remove
	 * @returns {Promise}
	  */
	async addPlusDays(uid, days, remove = false) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/add_plus_days", {
			add_plus_days: days,
			username: uid,
			add_plus_remove: remove
		}, true);
	}

	/**
	 * 
	 * @param {string} uid username or id
	 * @returns {Promise}
	  */
	async messagingBan(uid) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/user_ban_messaging", {
			messaging_ban_uname: uid
		}, true);
	}

	/**
	 * 
	 * @param {string} user
	 * @returns {Promise}
	  */
	async uploadingBan(uid) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/user_ban_uploading", {
			uploading_ban_uname: uid
		}, true);
	}

	/**
	 * 
	 * @param {number|string} uid id or username
	 * @returns {Promise}
	  */
	async ban(uid) {
		isNaN(arguments[0]) && (uid = await this.fetch(String(arguments[0])).then(user => user.id));
		return RequestHandler.post("moderator/ban_user", {
			u_id: parseInt(uid)
		}, true);
	}

	/**
	 * 
	 * @param {number|string} user 
	 * @param {number|string} time 
	 * @param {Boolean} deleteRaces
	 * @returns {Promise} 
	  */
	async banAsAdmin(uid, time = 0, deleteRaces = !1) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/ban_user", {
			ban_secs: time,
			delete_race_stats: deleteRaces,
			username: uid
		}, true);
	}

	/**
	 * 
	 * @param {string} username 
	 * @returns {Promise} 
	  */
	async deactivate(uid) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/deactivate_user", {
			username: String(uid)
		}, true);
	}

	/**
	 * 
	 * @param {string} uid username or id
	 * @returns {Promise}
	  */
	async delete(uid) {
		if (isFinite(uid)) {
			let user = this.cache.get(uid);
			user || (user = await this.fetch(uid));
			uid = user.username;
		}

		return RequestHandler.post("admin/delete_user_account", {
			username: String(uid)
		}, true).then(res => {
			// this.cache.delete(Array.from(this.cache.values()).find(u => u.username === uid).id);
			return res;
		});
	}
}