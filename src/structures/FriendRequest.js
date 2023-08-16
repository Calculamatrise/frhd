import RequestHandler from "../utils/RequestHandler.js";

export default class FriendRequest {
	avatarURL = null;
	displayName = null;
	id = null;
	username = null;
	constructor(data) {
		if (typeof data != 'object') return null;
		if (typeof data.user == 'object') {
			this.avatarURL = data.user.img_url_small;
			this.displayName = data.user.d_name;
			this.id = data.user.u_id;
			this.username = data.user.u_name;
		}
	}

    accept() {
		return RequestHandler.post("/friends/respond_to_friend_request", {
			action: 'accept',
			u_id: this.id
		}, true);
	}

    reject() {
		return RequestHandler.post("/friends/respond_to_friend_request", {
			action: 'reject',
			u_id: this.id
		}, true);
	}

	static async create(data) {
		if (typeof data != 'object') {
			throw new TypeError('Invalid data type');
		}

		return new this(data);
	}
}