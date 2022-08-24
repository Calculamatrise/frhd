import Events from "../utils/Events.js";

export default class {
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
            this.id = Events.Challenge
        } else if (data.subscribed_t_publish) {
            this.id = Events.SubscribedTrackPublish
        } else if (data.track_lb_passed) {
            this.id = Events.TrackLeaderboardPassed
        } else if (data.t_uname_mention) {
            this.id = Events.TrackUsernameMention
        }

        if (data.comment) {
            this.comment = data.comment;
        }

        if (data.message) {
            this.message = data.message;
        }

        if (data.track) {
            this.track = data.track;
        }

        if (data.user) {
            this.user = {
                id: data.user.u_id,
                username: data.user.u_name,
                displayName: data.user.d_name,
                avatar: data.user.img_url_small
            }
        }

        this.timeAgo = data.time;
        this.timestamp = data.ts;
        this.init(data);
    }
    id = null;
    comment = null;
    message = null;
    user = null;
    track = null;
    timeAgo = null;
    timestamp = null;
}