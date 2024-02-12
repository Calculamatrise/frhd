import BaseStructure from "./BaseStructure.js";
import RequestHandler from "../utils/RequestHandler.js";
import CommentManager from "../managers/CommentManager.js";
import RaceManager from "../managers/RaceManager.js";
import Comment from "./Comment.js";
import Race from "./Race.js";
import User from "./User.js";

export default class Track extends BaseStructure {
	#cdn = null;
	#leaderboard = null;
	allowedVehicles = new Set();
	author = new User();
	comments = new CommentManager(this);
	defaultVehicle = null;
	featured = false;
	races = new RaceManager(this);
	size = null;
	title = null;
	constructor(data) {
		super({
			hidden: { value: null, writable: true }
		});
		data instanceof Object && this._patch(data);
	}

	_patch(data) {
		if (typeof data != 'object' || data === null) {
			console.warn("Invalid data type");
			return;
		}

		super._patch(...arguments);
		for (const key in data) {
			switch(key) {
			case 'author':
				this.author._patch({ d_name: data[key] });
				break;
			case 'author_img_small':
			case 'author_img_medium':
			case 'author_img_large':
				this.author._patch({ avatar: data[key] });
				break;
			case 'campaign':
				this.isCampaign = data[key];
				break;
			case 'cdn':
				// can be used to fetch more data (like track code)
				// save this in a private variable then access it in
				// getter to get track code and other metadata
				this.#cdn = data[key];
				break;
			case 'date':
				if (this.createdAt !== null) break;
				Object.defineProperty(this, 'createdAt', { value: new Date(data[key]), writable: false });
				Object.defineProperty(this, 'createdTimestamp', {
					value: this.createdAt.getTime(),
					writable: false
				});
				break;
			case 'descr':
				this.description = data[key];
				break;
			case 'featured':
			case 'featured_history':
			case 'id':
			case 'title':
				this[key] = data[key];
				break;
			case 'hide':
				this.hidden = Boolean(data[key]);
				break;
			case 'img':
				this.thumbnailURL = data[key];
				break;
			case 'kb_size':
				this.size = data[key] | 0;
				break;
			case 'slug':
				this.id ??= parseInt(data[key]);
				break;
			case 'totd':
				this.daily ??= {};
				for (const property in data[key]) {
					switch (property) {
					case 'entries':
						this.daily.entries = data[key][property];
						break;
					case 'gems':
						this.daily.gems = data[key][property];
						break;
					case 'lives':
						this.daily.lives = data[key][property];
						break;
					case 'refillCost':
						this.daily.refillCost = data[key][property];
					}
				}
				break;
			case 'track':
				this._patch(data[key]);
				break;
			case 'u_id':
				this.author.id = data[key];
				break;
			case 'vehicle':
				this.defaultVehicle = data[key];
				break;
			case 'vehicles':
				for (const vehicle of data[key]) {
					this.allowedVehicles.add(vehicle);
				}
				break;
			case 'track_comments':
				// not sure whether this will be necessary
				for (const commet of data[key].map(comment => new Comment(Object.assign({}, data, comment)))) {
					this.comments.cache.set(commet.id, commet);
				}
				break;
			case 'track_stats':
				this.stats ||= {};
				for (const property in data[key]) {
					switch(property) {
					case 'avg_time':
						this.stats.averageTime = data[key][property];
						break;
					case 'cmpltn_rate':
						this.stats.completionRate = data[key][property];
						break;
					case 'dwn_votes':
						this.stats.dislikes = data[key][property];
						break;
					case 'first_runs':
						this.stats.firstRuns = data[key][property];
						break;
					case 'plays':
					case 'runs':
					case 'votes':
						this.stats[property] = data[key][property];
						break;
					case 'up_votes':
						this.stats.likes = data[key][property];
						break;
					case 'vote_percent':
						this.stats.averageRating = data[key][property];
					}
				}
			}
		}
	}

	/**
	 * Fetch leaderboard
	 * @returns {Promise<Array<Race>>}
	 */
	async fetchLeaderboard({ force } = {}) {
		if (!force && this.#leaderboard) {
			return this.#leaderboard;
		}
		return RequestHandler.post("track_api/load_leaderboard", {
			t_id: this.id
		}).then(res => {
			return this.#leaderboard = res.track_leaderboard.map(data => new Race(data))
		})
	}

	/**
	 * Send a track challenge
	 * @param {Array} users 
	 * @param {String} message
	 * @returns {Promise}
	 */
	challenge(users = [], message = '') {
		if (typeof users != 'object')
			throw new TypeError("INVALID_USERS");

		return RequestHandler.post("challenge/send", {
			// "users%5B%5D": users.join("&users%5B%5D="),
			msg: message || '',
			track_slug: this.id,
			users
		}, true)
	}

	/**
	 * 
	 * @param {number|boolean} vote 
	 * @returns {Promise}
	 */
	vote(vote) {
		return RequestHandler.post("track_api/vote", {
			t_id: this.id,
			vote: Number(vote)
		}, true).then(res => {
			this.stats[(vote < 0 ? 'dis' : '') + 'likes'] += vote;
			return res
		})
	}

	flag() {
		return RequestHandler.get("track_api/flag/" + this.id, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {Number} lives 
	 * @param {Number} refillCost 
	 * @param {Number} gems 
	 * @returns {Promise}
	 */
	addToDaily(lives = 30, refillCost = 10, gems = 500) {
		return RequestHandler.post("moderator/add_track_of_the_day", {
			t_id: this.id,
			lives,
			rfll_cst: refillCost,
			gems
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {Number} lives 
	 * @param {Number} refillCost 
	 * @param {Number} gems 
	 * @returns {Promise}
	 */
	removeFromDaily() {
		return RequestHandler.post("admin/removeTrackOfTheDay", {
			t_id: this.id,
			d_ts: Date.now()
		}, true)
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @returns {Boolean}
	 */
	feature() {
		if (this.featured) return true;
		return RequestHandler.get(`track_api/feature_track/${this.id}/1`, true).then(res => {
			return this.featured = true
		})
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @returns {Boolean}
	 */
	unfeature() {
		if (!this.featured) return true;
		return RequestHandler.get(`track_api/feature_track/${this.id}/0`, true).then(res => {
			return this.featured = false, true
		})
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @returns {Boolean}
	 */
	toggleFeatured() {
		return this.featured ? this.unfeature() : this.feature()
	}

	/**
	 * Hide track as a moderator
	 * @protected requires administrative privileges.
	 * @returns {Promise}
	 */
	async hide() {
		return RequestHandler.get("moderator/hide_track/" + this.id, true).then(res => {
			return this.hidden ||= !0
		})
	}

	/**
	 * Hide track as a moderator
	 * @protected requires administrative privileges.
	 * @returns {Promise}
	 */
	async unhide() {
		return RequestHandler.get("moderator/unhide_track/" + this.id, true).then(res => {
			return this.hidden &&= !1
		})
	}

	/**
	 * Hide track as an admin
	 * @protected requires administrative privileges.
	 * @returns {Promise}
	 */
	hideAsAdmin() {
		return RequestHandler.post("admin/hide_track", {
			track_id: this.id
		}, true)
	}
}