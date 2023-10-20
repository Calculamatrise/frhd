import RequestHandler from "../utils/RequestHandler.js";
import Track from "./Track.js";
import User from "./User.js";

export default class Race {
	code = null;
	placement = null;
	platform = null;
	runTicks = 0;
	runTime = null;
	track = new Track();
	user = new User();
	vehicle = 'MTB';
	constructor(data, track) {
		typeof data == 'object' && this._update(data);
		typeof track == 'object' && this.track._update(track);
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
			switch (key) {
			case 'code':
				if (typeof data[key] == 'string') {
					data[key] = JSON.parse(data[key]);
				}
			case 'vehicle':
				this[key] = data[key];
				break;
			case 'data': {
				if (typeof data[key] == 'object' && data[key]['track_comments']) {
					return this._update(data[key]['track_comments'][0]);
				}

				return this._update(data[key]);
			}
			case 'desktop':
			case 'tablet':
				this.platform = key;
				break;
			case 'place':
				this.placement = data[key];
				break;
			case 'race':
				this._update(data[key]);
				break;
			case 'run_ticks':
				let ticks = parseInt(data[key]);
				this.runTicks = ticks;
				if (!this.runTime) {
					let t = 1e3 * ticks / 30
						, e = t % 6e4 / 1e3;
					this.runTime = Math.floor(t / 6e4) + ':' + e.toFixed(2).padStart(5, 0);
				}
				break;
			case 'run_time':
				this.runTime = data[key];
				break;
			case 'track':
				this.track._update(data[key]);
				break;
			case 'u_id':
				this.user.id = data[key];
				break;
			case 'user':
				this.user._update(data[key]);
				break;
			case 'user_track_stats':
				{
					let stats = data[key];
					for (const property in stats) {
						switch (property) {
						case 'best_date':
							if (stats.u_id === this.user.id) {
								this.uploadDate = new Date(stats[key]);
								this.uploadTimestamp = this.uploadDate.getTime();
							}
						}
					}
				}
			}
		}
	}

	/**
	 * 
	 * @protected requires administrative privileges.
	 * @param {number|string} user id or username
	 * @returns {Promise}
	 */
	async remove() {
		return RequestHandler.post("/moderator/remove_race", {
			t_id: this.track.id,
			u_id: this.user.id
		}, true);
	}
}