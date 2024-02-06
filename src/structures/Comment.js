import BaseStructure from "./BaseStructure.js";
import RequestHandler from "../utils/RequestHandler.js";
import Track from "./Track.js";
import User from "./User.js";

export default class Comment extends BaseStructure {
	message = null;
	timeAgo = null;
	author = new User();
	trackId = null;
	constructor(data) {
		super({
			data: { value: null, writable: true },
			deletable: { value: null, writable: true },
			flagged: { value: null, writable: true },
			track: { value: new Track(), writable: false }
		});
		typeof data == 'object' && this._patch(data)
	}

	_patch(data) {
		if (typeof data != 'object' || data === null) {
			console.warn("Invalid data type");
			return;
		}

		super._patch(...arguments);
		for (const key in data) {
			switch(key) {
			case 'can_delete':
				if (this.deletable !== null) break;
				Object.defineProperty(this, 'deletable', { value: data[key], writable: false });
				break;
			case 'comment':
				this._patch(data[key]);
				break;
			case 'data':
				return this._patch(data[key]);
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
				this.track._patch(typeof data[key] == 'object' ? data[key] : { id: data[key] });
				this.trackId = this.track.id;
				break;
			case 'user':
				this.author._patch(data[key]);
				break;
			default:
				this.hasOwnProperty(key) && (this[key] = data[key]);
			}
		}
	}

	reply(data) {
		typeof data == 'object' && (data = data.content);
		let content = `@${this.author.displayName}, ${data.replace(/\s+/g, '+')}`;
		if (typeof content != 'string') throw new TypeError("Content must be of type: string");
		else if (content.length < 4) throw new RangeError("Comment is too short!");
		else if (content.length > 500) throw new RangeError("Yo, comment too long! Must be 500 characters or less.");
		return RequestHandler.post("track_comments/post", {
			t_id: this.track.id,
			msg: content
		}, true).then(res => new Comment(res.data.track_comments[0]));
	}

	delete({ timeout = 0 } = {}) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				RequestHandler.get(`track_comments/delete/${this.track.id}/${this.id}`, true)
					.then(resolve)
					.catch(reject)
			}, ~~timeout)
		})
	}

	static create(data) {
		if (typeof data != "object") {
			throw new TypeError("INVALID_DATA_TYPE");
		}

		const comment = new Comment();
		comment._patch(data);
		return comment;
	}
}