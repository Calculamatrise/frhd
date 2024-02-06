import RequestHandler from "../utils/RequestHandler.js";
import Track from "./Track.js";
import User from "./User.js";

export default class Race {
	platform = null;
	runTicks = 0;
	runTime = null;
	trackId = null;
	user = new User();
	vehicle = null;
	constructor(data) {
		Object.defineProperties(this, {
			data: { value: null, writable: true },
			placement: { value: null, writable: true },
			track: { value: new Track(), writable: false }
		});
		data instanceof Object && this._patch(data)
	}

	_patch(data) {
		if (typeof data != 'object' || data === null) {
			console.warn("Invalid data type");
			return;
		}

		for (const key in data) {
			switch (key) {
			case 'code':
				if (this.data !== null) break;
				typeof data[key] == 'string' && (data[key] = JSON.parse(data[key]));
				Object.defineProperty(this, 'data', { value: data[key] });
				break;
			case 'vehicle':
				this[key] = data[key];
				break;
			case 'data':
				if (typeof data[key] == 'object' && data[key]['race_leaderboard']) {
					return this._patch(data[key]['race_leaderboard'][0]);
				}
				return this._patch(data[key]);
			case 'desktop':
			case 'tablet':
				this.platform = key;
				break;
			case 'place':
				if (this.placement !== null) break;
				Object.defineProperty(this, 'placement', { value: data[key], writable: false });
				break;
			case 'race':
				this._patch(data[key]);
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
				this.track._patch(data[key]);
				this.trackId = this.track.id;
				break;
			case 'u_id':
			case 'user':
				this.user._patch({ [key]: data[key] });
				break;
			case 'user_track_stats':
				{
					let stats = data[key];
					for (const property in stats) {
						switch (property) {
						case 'best_date':
							if (stats.u_id === this.user.id && stats[key]) {
								let date = new Date(stats[key].split('/').reverse().join('/'));
								this.uploadDate = date;
								this.timestamp = date.getTime();
								const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;
								const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "always" });
								let units = Math.floor((this.timestamp - new Date().getTime()) / DAY_MILLISECONDS);
								let style = 'day';
								units <= -7 && (units /= 7,
								style = 'week');
								units <= -4 && (units /= 4,
								style = 'month');
								units <= -12 && (units /= 12,
								style = 'year');
								this.uploadDateAgo = rtf.format(Math.floor(units), style);
							}
						}
					}
				}
				break;
			default:
				this.hasOwnProperty(key) && (this[key] = data[key]);
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
		return RequestHandler.post("moderator/remove_race", {
			t_id: this.track.id,
			u_id: this.user.id
		}, true);
	}
}