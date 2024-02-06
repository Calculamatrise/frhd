import BaseStructure from "./BaseStructure.js";
import RequestHandler from "../utils/RequestHandler.js";
import CosmeticManager from "../managers/CosmeticManager.js";
import FriendManager from "../managers/FriendManager.js";
import TrackManager from "../managers/TrackManager.js";
import Track from "./Track.js";

export default class User extends BaseStructure {
	#avatarURL = null;
	classic = null;
	cosmetics = new CosmeticManager(this);
	createdTracks = new TrackManager(this);
	displayName = null;
	forumId = null;
	friends = new FriendManager(this);
	recentlyCompleted = new TrackManager(this);
	recentlyPlayed = new TrackManager(this);
	username = null;
	constructor(data) {
		super({
			activityAt: { value: null, writable: true },
			activityTimeAgo: { value: null, writable: true },
			activityTimestamp: { value: null, writable: true },
			admin: { value: null, writable: true },
			banned: { value: null, writable: true },
			description: { value: null, writable: true },
			moderator: { value: null, writable: true },
			subscribers: { value: null, writable: true }
		});
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
			case 'a_ts':
				this.activityTimestamp = data[key] * 1e3;
				this.activityAt = new Date(this.lastActivityTimestamp);
				break;
			case 'activity_time_ago':
				this.activityTimeAgo = data[key];
				break;
			case 'admin':
			case 'banned':
			case 'moderator':
				if (this[key] !== null) break;
				Object.defineProperty(this, key, { value: data[key], writable: false });
				break;
			case 'classic':
			case 'plus':
				this[key] = Boolean(data[key]);
				break;
			case 'avatar':
			case 'img_url_small':
			case 'img_url_medium':
			case 'img_url_large':
				let url = URL.canParse(data[key]) && new URL(data[key]);
				url && (url.search = '',
				this.#avatarURL = url.toString());
				break;
			case 'cosmetics':
				this.cosmetics = {}
				this.cosmetics.head = {}
				if (typeof data[key] == 'object') {
					this.cosmetics.head.image = data[key].head.img;
					this.cosmetics.head.spriteSheetURL = function() {
						return `https://cdn.freeriderhd.com/free_rider_hd/assets/inventory/head/spritesheets/${this.image.replace(/\s(.*)/gi, '')}.png`
					}
				}
				break;
			case 'created_tracks':
				for (let track of data[key].tracks.map(data => new Track(data))) {
					this.createdTracks.cache.set(track.id, track);
				}
				break;
			case 'd_name':
				this.displayName = data[key];
				this.username ||= this.displayName.toLowerCase();
				break;
			case 'forum_url':
				let matches = String(data[key]).match(/\d+(?=\/)/g);
				matches !== null && matches.length > 0 && (this.forumId = isFinite(matches[0]) ? parseInt(matches[0]) : matches[0]);
				break;
			case 'friends':
				this.friendCount = data[key].friend_cnt;
				for (const friend of data[key].friends_data.map(data => new User(data))) {
					this.friends.cache.set(friend.id, friend);
				}
				break;
			case 'has_max_friends':
				this.friendLimitReached = Boolean(data[key]);
				break;
			case 'recently_ghosted_tracks':
				for (let track of data[key].tracks.map(data => new Track(data))) {
					this.recentlyCompleted.cache.set(track.id, track);
				}
				break;
			case 'recently_played_tracks':
				for (let track of data[key].tracks.map(data => new Track(data))) {
					this.recentlyPlayed.cache.set(track.id, track);
				}
				break;
			case 'subscribe':
				this.subscribers = ~~data[key].count;
				break;
			case 'u_id':
				this.id = data[key];
				break;
			case 'u_name':
				this.username = data[key];
				break;
			case 'user':
				this._patch(data[key]);
				break;
			case 'user_info':
				this.description = typeof data[key] == 'object' && data[key].about || null;
				break;
			case 'user_mobile_stats': {
				{
					let mobileStats = data[key];
					this.mobileStats = {
						level: Number(mobileStats.lvl),
						wins: Number(mobileStats.wins),
						headCount: Number(mobileStats.headCount),
						connected: Boolean(mobileStats.connected)
					}
				}
				break;
			}
			case 'user_stats': {
				{
					let stats = data[key];
					this.stats = {
						comments: stats.cmmnts,
						completed: stats.cmpltd,
						created: stats.crtd,
						headCount: stats.head_cnt,
						rated: stats.rtd,
						totalHeadCount: stats.total_head_cnt,
						totalPoints: stats.tot_pts
					}
				}
				break;
			}
			case 'user_verify_reminder':
				this.verifiedEmail = data[key];
				break;
			default:
				this.hasOwnProperty(key) && (this[key] = data[key]);
			}
		}
	}

	avatarURL({ size = 50 } = {}) {
		return this.#avatarURL + (size ? '?sz=' + size : '')
	}

	forumURL() {
		return 'https://community.' + RequestHandler.host + '/members/' + this.username + '.' + this.forumId + '/'
	}

	subscribe() {
		return RequestHandler.post("track_api/subscribe", {
			sub_uid: this.id,
			subscribe: 1
		}, true).then(res => {
			this.subscribers++;
			return res
		})
	}

	unsubscribe() {
		return RequestHandler.post("track_api/subscribe", {
			sub_uid: this.id,
			subscribe: 0
		}, true).then(res => {
			this.subscribers--;
			return res
		})
	}

	/**
	 * 
	 * REQUIRES PRO/PLUS
	 * @param amount
	 * @param message
	 * @returns {Promise<object>}
	 */
	transferCoins(amount, message = '') {
		// user.plus || user.proMember
		return RequestHandler.post("account/plus_transfer_coins", {
			transfer_coins_to: this.username,
			transfer_coins_amount: amount,
			msg: message
		}, true)
	}

	/**
	 * 
	 * @param {string} username 
	 * @returns {Promise<object>}
	 */
	async changeUsername(username) {
		return RequestHandler.post("moderator/change_username", {
			u_id: this.id,
			username
		}, true).then(res => {
			this._patch({ d_name: username });
			return res
		})
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @returns {Promise}
	 */
	changeUsernameAsAdmin(username) {
		return RequestHandler.post("admin/change_username", {
			change_username_current: this.username,
			change_username_new: username
		}, true)
	}

	/**
	 * 
	 * @protected requires moderation privileges
	 * @param {string} email 
	 * @returns {Promise}
	 */
	changeEmail(email) {
		return RequestHandler.post("moderator/change_email", {
			u_id: this.id,
			email
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @param {string} email 
	 * @returns {Promise}
	 */
	async changeEmailAsAdmin(email) {
		return RequestHandler.post("admin/change_user_email", {
			username: this.username,
			email
		}, true)
	}

	/**
	 * 
	 * @protected requires moderation privileges
	 * @returns {Promise}
	 */
	toggleOA() {
		return RequestHandler.post("moderator/toggle_official_author/" + this.id, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @returns {Promise<object>}
	 */
	toggleClassicAuthorAsAdmin() {
		return RequestHandler.post("admin/toggle_classic_user/", {
			toggle_classic_uname: this.username
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @param {number} coins
	 * @returns {Promise<object>}
	 */
	addWonCoins(coins) {
		return RequestHandler.post("admin/add_won_coins", {
			coins_username: this.username,
			num_coins: coins | 0
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @param {number} [days] defaults to 7
	 * @param {number} [remove] defaults to 0
	 * @returns {Promise<object>}
	 */
	addPlusDays(days = 7, remove) {
		return RequestHandler.post("admin/add_plus_days", {
			add_plus_days: days | 0,
			username: this.username,
			add_plus_remove: remove | 0
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @returns {Promise<object}
	 */
	messagingBan() {
		return RequestHandler.post("admin/user_ban_messaging", {
			messaging_ban_uname: this.username
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @returns {Promise<object>}
	 */
	uploadingBan() {
		return RequestHandler.post("admin/user_ban_uploading", {
			uploading_ban_uname: this.username
		}, true)
	}

	/**
	 * 
	 * @protected requires moderation privileges
	 * @returns {Promise<object>}
	 */
	ban() {
		if (this.banned) return true;
		return RequestHandler.post("moderator/ban_user", {
			u_id: this.id
		}, true)
	}

	/**
	 * 
	 * @protected requires moderation privileges
	 * @returns {Promise<object>}
	 */
	unban() {
		if (!this.banned) return true;
		return RequestHandler.post("moderator/unban_user", {
			u_id: this.id
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @param {number|string} [time] defaults to 365 days
	 * @param {Boolean} [deleteRaces] defaults to false
	 * @returns {Promise<object>}
	 */
	banAsAdmin(time = 31536000, deleteRaces = !1) {
		return RequestHandler.post("admin/ban_user", {
			ban_secs: time | 0,
			delete_race_stats: Boolean(deleteRaces),
			username: this.username
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges
	 * @returns {Promise<object>}
	 */
	deactivate() {
		return RequestHandler.post("admin/deactivate_user", {
			username: this.username
		}, true)
	}

	/**
	 * @protected requires administrative privileges
	 * @returns {Promise<object>}
	 */
	delete() {
		return RequestHandler.post("admin/delete_user_account", {
			username: this.username
		}, true)
	}

	/**
	 * Remove cheated ghosts on all tracks between a given range
	 * @async
	 * @protected requires administrative privileges
	 * @param {object} [options]
	 * @param {Array<number|string>} [options.users]
	 * @param {number|string} [options.startingTrackId]
	 * @param {number|string} [options.endingTrackId]
	 * @param {number|string} [timeout]
	 * @returns {string} 
	  */
	async removeAllRaces({ startingTrackId, endingTrackId, timeout = 0 } = {}) {
		endingTrackId = Math.min(~~endingTrackId, await getCategory("recently-added").then(({ tracks }) => parseInt(tracks[0].slug)));
		if (isNaN(endingTrackId)) throw new Error("Ending track ID is NaN.");
		for (let trackId = Math.max(1001, ~~startingTrackId); trackId <= endingTrackId; trackId++) {
			/* const race = await getRace(trackId, this.id);
			/* race && */ await RequestHandler.post("moderator/remove_race", {
				t_id: trackId,
				u_id: this.id
			}, true);
			typeof arguments[arguments.length - 1] == 'function' && arguments[arguments.length - 1].call(this, trackId);
			timeout && await new Promise(resolve => setTimeout(resolve, ~~timeout))
		}

		return `All of ${this.displayName}'s races have been successfully removed!`
	}
}