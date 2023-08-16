import RequestHandler from "../utils/RequestHandler.js";
import CommentManager from "../managers/CommentManager.js";
import RaceManager from "../managers/RaceManager.js";
import Comment from "./Comment.js";
import Race from "./Race.js";
import User from "./User.js";

export default class Track {
	#cdn = null;
	id = null;
	title = null;
	allowedVehicles = new Set();
	author = new User();
	defaultVehicle = 'MTB';
	featured = false;
	hidden = false;
	comments = new CommentManager(this);
	races = new RaceManager(this);
	constructor(data) {
		typeof data == 'object' && this._update(data);
	}

	/**
	 * 
	 * @private
	 * @param {object} data
	 */
	_update(data) {
		if (typeof data != 'object') {
			console.warn("Invalid data type");
			return;
		}

		for (const key in data) {
			switch(key) {
				case 'track':
					this._update(data[key]);
					break;

				case 'author':
					this.author.username = String(data[key]).toLowerCase();
					this.author.displayName = data[key] ?? null;
					break;
				case 'author_img_small':
				case 'author_img_medium': 
				case 'author_img_large':
					this.author.avatarURL = data[key] ?? null;
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
					// ACCOUNT FOR new Date() ARGUMENT
					this.uploadDate = new Date(data[key]);
					break;
				case 'date_ago':
					this.uploadDateAgo = data[key];
					break;
				case 'descr':
					this.description = data[key];
					break;

				case 'defaultVehicle':
				case 'description':
				case 'featured':
				case 'hidden':
				case 'id':
				case 'isCampaign':
				case 'size':
				case 'thumbnailURL':
				case 'title':
				case 'uploadDate':
				case 'uploadDateAgo':
					this[key] = data[key];
					break;
				case 'game_settings':
					// this might be useful
					// but for now, no.
					break;
				case 'hide':
					this.hidden = Boolean(data[key]);
					break;
				case 'img':
					this.thumbnailURL = data[key];
					break;
				case 'kb_size':
					this.size = data[key];
					break;
				case 'slug':
					this.id ??= parseInt(data[key]);
					break;
				case 'totd': {
					this.daily = this.daily ?? {};
					for (const statistic in data[key]) {
						switch(statistic) {
							case 'entries':
								this.daily.entries = data[key][statistic];
								break;
							case 'gems':
								this.daily.gems = data[key][statistic];
								break;
							case 'lives':
								this.daily.lives = data[key][statistic];
								break;
							case 'refillCost':
								this.daily.refillCost = data[key][statistic];
								break;
						}
					}
					break;
				}

				case 'u_id':
					this.author.id = data[key];
					break;

				case 'vehicle':
					this.defaultVehicle = data[key];
					break;

				case 'vehicles': {
					for (const vehicle of data[key]) {
						this.allowedVehicles.add(vehicle);
					}
					break;
				}

				case 'track_comments': {
					// not sure whether this will be necessary
					for (const commet of data[key].map(comment => new Comment(Object.assign({}, data, comment)))) {
						this.comments.cache.set(commet.id, commet);
					}
					break;
				}

				case 'track_stats': {
					this.stats ??= {};
					for (const property in data[key]) {
						switch(property) {
							case 'avg_time':
								this.stats.averageTime = data[key];
								break;
							case 'cmpltn_rate':
								this.stats.completionRate = data[key];
								break;
							case 'dwn_votes':
								this.stats.dislikes = data[key];
								break;
							case 'first_runs':
								this.stats.firstRuns = data[key];
								break;
							case 'plays':
							case 'runs':
							case 'votes':
								this.stats[property] = data[key];
								break;
							case 'up_votes':
								this.stats.likes = data[key];
								break;
							case 'vote_percent':
								this.stats.averageRating = data[key];
								break;
						}
					}
					break;
				}
			}
		}
	}

	/**
	 * 
	 * @returns {Promise<Array>}
	 */
	async getLeaderboard() {
		return RequestHandler.post("/track_api/load_leaderboard", {
			t_id: this.id
		}).then(function(response) {
			if (response.result) {
				return response.track_leaderboard.map(function(race) {
					return new Race(race);
				});
			}

			return response.msg;
		});
	}

	/**
	 * 
	 * @param {Array} users 
	 * @param {String} message
	 * @returns {Promise}
	 */
	challenge(users = [], message = '') {
		if (typeof users != 'object')
			throw new TypeError("INVALID_USERS");

		return RequestHandler.post("/challenge/send", {
			// "users%5B%5D": users.join("&users%5B%5D="),
			msg: message || '',
			track_slug: this.id,
			users
		}, true);
	}

	/**
	 * 
	 * @param {number|boolean} vote 
	 * @returns {Promise}
	 */
	vote(vote) {
		return RequestHandler.post("/track_api/vote", {
			t_id: this.id,
			vote: Number(vote)
		}, true);
	}

	flag() {
		return RequestHandler.get("/track_api/flag/" + this.id, true);
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
		return RequestHandler.post("/moderator/add_track_of_the_day", {
			t_id: this.id,
			lives,
			rfll_cst: refillCost,
			gems
		}, true);
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
		return RequestHandler.post("/admin/removeTrackOfTheDay", {
			t_id: this.id,
			d_ts: Date.now()
		}, true);
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @returns {Boolean}
	 */
	feature() {
		this.featured = !0;
		if (this.featured) {
			throw new Error("This track is already featured!");
		}

		this.featured = true;
		return RequestHandler.get(`/track_api/feature_track/${this.id}/1`, true).then((response) => {
			if (!response.result) {
				this.featured = false;
				throw new Error(response.msg || "Insufficient privileges");
			}

			return this.featured;
		});
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @returns {Boolean}
	 */
	unfeature() {
		if (!this.featured) {
			throw new Error("This track isn't featured!");
		}

		this.featured = false;
		return RequestHandler.get(`/track_api/feature_track/${this.id}/0`, true).then((response) => {
			if (!response.result) {
				this.featured = true;
				throw new Error(response.msg || "Insufficient privileges");
			}

			return this.featured;
		});
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @returns {Boolean}
	 */
	toggleFeatured() {
		return this.featured ? this.unfeature() : this.feature();
	}

	/**
	 * Hide track as a moderator
	 * @protected requires administrative privileges.
	 * @returns {Promise}
	 */
	async hide() {
		return RequestHandler.get(`/moderator/hide_track/${this.id}`, true).then(res => {
			if (res.result) {
				this.hidden = !0;
				return res;
			}

			throw new Error(res.msg || "Insufficient privileges");
		});
	}

	/**
	 * Hide track as a moderator
	 * @protected requires administrative privileges.
	 * @returns {Promise}
	 */
	async unhide() {
		return RequestHandler.get(`/moderator/unhide_track/${this.id}`, true).then(res => {
			if (res.result) {
				this.hidden = false;
				return res;
			}

			throw new Error(res.msg || "Insufficient privileges");
		});
	}

	/**
	 * Hide track as an admin
	 * @protected requires administrative privileges.
	 * @returns {Promise}
	 */
	hideAsAdmin() {
		return RequestHandler.post("/admin/hide_track", {
			track_id: this.id
		}, true);
	}

	/**
	 * 
	 * @param {object} data 
	 * @returns {Track} 
	 */
	static async create(data) {
		const track = new Track();
		await track._update(data);
		return track;
	}
}