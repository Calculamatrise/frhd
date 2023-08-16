import Events from "../utils/Events.js";

import Comment from "./Comment.js";
import Track from "./Track.js";
import User from "./User.js";

export default class Notification {
	id = null;
	timeAgo = null;
	timestamp = null;
	constructor(data) {
		if (typeof data != "object" || data === null) {
			throw new TypeError("INVALID_DATA_TYPE");
		}

		if (data.friend_lb_passed) {
			this.id = Events.FriendLeaderboardPassed
		} else if (data.friend_req_accptd) {
			this.id = Events.FriendRequestAccepted
		} else if (data.friend_req_rcvd) {
			this.id = Events.FriendRequestReceived
		} else if (data.friend_t_challenge) {
			this.id = Events.FriendTrackChallenge
		} else if (data.mobile_account_linked_award) {
			this.id = Events.MobileAccountLinkedAward
		} else if (data.subscribed_t_publish) {
			this.id = Events.SubscribedTrackPublish
		} else if (data.track_lb_passed) {
			this.id = Events.TrackLeaderboardPassed
		} else if (data.t_uname_mention) {
			this.id = Events.TrackUsernameMention
		}

		if (typeof data.comment == 'object') {
			this.comment = new Comment(data);
		}

		data.message && (this.message = data.message);
		if (typeof data.track == 'object') {
			this.track = new Track(data.track);
		}

		if (typeof data.user == 'object') {
			this.user = new User(data.user);
		}

		this.timeAgo = data.time;
		this.timestamp = data.ts;

		this.rawData = data;
	}
}