import User from "./User.js";
import RequestHandler from "../utils/RequestHandler.js";
import TrackManager from "../managers/TrackManager.js";
import FriendRequest from "./FriendRequest.js";
import Track from "./Track.js";

export default class ClientUser extends User {
	likedTracks = new TrackManager(this);
	constructor(data) {
		super();
		data instanceof Object && this._patch(data)
	}

	_patch(data) {
		if (typeof data != 'object' || data === null) {
			console.warn("Invalid data type");
			return;
		}

		super._patch(...arguments);
		for (const key in data) {
			switch (key) {
			case 'friend_requests':
				this.friendRequestCount = data.friend_requests.request_cnt;
				this.friendRequests = data.friend_requests.request_data.map(request => {
					return new FriendRequest(request)
				});
				break;
			case 'i_ts':
				Object.defineProperty(this, 'createdTimestamp', { value: data[key] * 1e3, writable: false });
				Object.defineProperty(this, 'createdAt', {
					value: new Date(this.createdTimestamp),
					writable: false
				});
				break;
			case 'liked_tracks':
				for (let track of data[key].tracks.map(data => new Track(data))) {
					this.likedTracks.cache.set(track.id, track)
				}
			}
		}
	}

	updatePersonalData(name, value) {
		return RequestHandler.post("account/update_personal_data", {
			name, value
		}, true);
	}

	deletePersonalData() {
		return RequestHandler.post("account/delete_all_personal_data", true);
	}

	selectProfileImage(type) {
		return RequestHandler.post("account/update_photo", {
			img_type: type
		}, true);
	}

	/**
	 * REQUIRES PRO/PLUS
	 * @param user
	 * @param amount
	 * @param message
	 * @returns {Promise<object>}
	 */
	transferCoins(user, amount, message = '') {
		// user.plus || user.proMember
		return RequestHandler.post("account/plus_transfer_coins", {
			transfer_coins_to: user,
			transfer_coins_amount: amount,
			msg: message
		}, true);
	}

	/**
	 * 
	 * @param {string} username 
	 * @returns {Promise<object>}
	 */
	async changeUsername(username) {
		if (this.username == this.client.user.username) {
			return RequestHandler.post("account/edit_profile", {
				name: "u_name",
				value: username
			}, true).then(res => {
				this.displayName = String(username);
				this.username = this.displayName.toLowerCase();
				return res
			});
		}

		return super.changeUsername(...arguments)
	}

	/**
	 * 
	 * @param {string} description 
	 * @returns {Promise}
	 */
	changeDescription(description) {
		return RequestHandler.post("account/edit_profile", {
			name: "about",
			value: String(description)
		}, true);
	}

	/**
	 * 
	 * @param {string} oldPassword 
	 * @param {string} newPassword 
	 * @returns {Promise}
	 */
	changePassword(oldPassword, newPassword) {
		// make sure new password matches restrictions
		if (!newPassword) throw new Error("INVALID_PASSWORD");
		return RequestHandler.post("account/change_password", {
			old_password: oldPassword,
			new_password: newPassword
		}, true);
	}

	/**
	 * 
	 * @param {string} password 
	 * @returns {Promise}
	 */
	changeForumPassword(password) {
		return RequestHandler.post("account/update_forum_account", {
			password
		}, true);
	}
}