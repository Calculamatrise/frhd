import RequestHandler from "../utils/RequestHandler.js";
import Track from "./Track.js";
import User from "./User.js";

export default class {
	code = null;
	desktop = true;
	placement = null;
	runTicks = 0;
	runTime = null;
	tablet = false;
	track = new Track();
	user = new User();
	vehicle = 'MTB';
	constructor(data) {
		if (typeof data != 'object') return null;
		for (const t in data) {
			switch(t) {
				case 'u_id':
					this.user.id = data[t];
					break;
				case 'tablet':
					this[t] = data[t];
					break;
				case 'place':
					this.placement = data[t];
					break;
				case 'run_time':
					this.runTime = data[t];
					break;
				case 'race':
					this.code = JSON.parse(data[t].code),
					this.vehicle = data[t].vehicle,
					this.desktop = data[t].desktop,
					this.runTicks = data[t].run_ticks;
					break;
				case 'track':
					this.track._update(data[t]);
					break;
				case 'user':
					this.user._update(data[t]);
					break;
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