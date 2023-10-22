import RequestHandler from "../utils/RequestHandler.js";
import Track from "./Track.js";
import User from "./User.js";

export default class Comment {
	id = null;
	message = null;
	timeAgo = null;
	author = new User();
	track = new Track();
	constructor(data) {
		typeof data == 'object' && this._update(data);
	}

	_update(data) {
		if (typeof data != 'object') {
			console.warn("Invalid data type");
			return;
		}

		for (const key in data) {
			switch(key) {
			case 'comment':
				this._update(data[key]);
				break;
			case 'data': {
				if (typeof data[key] == 'object' && data[key]['track_comments']) {
					return this._update(data[key]['track_comments'][0]);
				}

				return this._update(data[key]);
			}

			case 'id':
				this[key] = data[key];
				break;
			case 'msg':
				this.message = data[key];
				break;
			case 'time':
				this.timeAgo = data[key];
				break;
			case 'track':
				if (typeof data[key] == 'object') {
					this.track._update(data[key]);
					break;
				}

				this.track.id = data[key];
				break;
			case 'user':
				this.author._update(data[key]);
				break;
			default:
				this.hasOwnProperty(key) && (this[key] = data[key]);
			}
		}
	}

	reply(data) {
		if (!data) throw new Error("INVALID_MESSAGE");
		return RequestHandler.post("/track_comments/post", {
			t_id: this.track.id,
			msg: `@${this.author.displayName}, ${(data.content || data).toString().replace(/\s+/g, "+")}`
		}, true).then(function(response) {
			if (response.result)
				return new Comment(response.data.track_comments[0]);

			return new Error(response.msg);
		});
	}

	delete({ timeout = 0 } = {}) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				RequestHandler.get(`/track_comments/delete/${this.track.id}/${this.id}`, true)
				.then(resolve)
				.catch(reject);
			}, ~~timeout);
		});
	}

	static create(data) {
		if (typeof data != "object") {
			throw new TypeError("INVALID_DATA_TYPE");
		}

		const comment = new Comment();
		comment._update(data);
		return comment;
	}
}