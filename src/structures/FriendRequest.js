import RequestHandler from "../utils/RequestHandler.js";

export default class FriendRequest {
	avatarURL = null;
	displayName = null;
	id = null;
	username = null;
	constructor(data) {
		typeof data == 'object' && this._update(data);
	}

	_update(data) {
		if (typeof data != 'object') {
			console.warn("Invalid data type");
			return;
		}

		for (const key in data) {
			switch (key) {
			case 'd_name':
				this.displayName = data[key];
				break;
			case 'img_url_small':
			case 'img_url_medium':
			case 'img_url_large':
				this.avatarURL = data[key];
				break;
			case 'u_id':
				this.id = data[key];
				break;
			case 'u_name':
				this.username = data[key];
				break;
			case 'user':
				this._update(data[key]);
			}
		}
	}

    accept() {
		return this.respond('accept')
	}

    reject() {
		return this.respond('reject')
	}

	respond(action) {
		return RequestHandler.post("friends/respond_to_friend_request", {
			action,
			u_id: this.id
		}, true)
	}

	static async create(data) {
		if (typeof data != 'object') {
			throw new TypeError('Invalid data type');
		}

		return new this(data)
	}
}