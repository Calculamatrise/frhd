import RequestHandler from "../utils/RequestHandler.js";

import Track from "./Track.js";

import { token } from "../client/Client.js";

export default class {
    constructor(data) {
        if (!data || typeof data !== "object")
            throw new Error("INVALID_DATA_TYPE");
            
        this.id = null,
        this.username = null,
        this.displayName = null,
        this.avatar = null;
        this.init(data);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "u_id":
                    this.id = data[t];
                break;

                case "u_name":
                    this.username = data[t];
                break;

                case "d_name":
                    this.displayName = data[t];
                break;

                case "img_url_small":
                    this.avatar = data[t];
                break;

                case "user":
                    this.id = data[t].u_id,
                    this.username = data[t].u_name,
                    this.displayName = data[t].d_name,
                    this.avatar = data[t].img_url_medium || data[t].img_url_small;
                    this.classic = data[t].classic,
                    this.admin = data[t].admin,
                    this.plus = data[t].plus,
                    this.forums = data[t].forum_url,
                    this.cosmetics = {
                        head: {
                            image: data[t].cosmetics.head.img,
                            spriteSheetURL() {
                                return `https://cdn.freeriderhd.com/free_rider_hd/assets/inventory/head/spritesheets/${data[t].cosmetics.head.img.replace(/\s(.*)/gi, "")}.png`
                            }
                        }
                    }
                break;

                case "user_stats":
                    this.stats = {
                        totalPoints: data[t].tot_pts,
                        completed: data[t].cmpltd,
                        rated: data[t].rtd,
                        comments: data[t].cmmnts,
                        created: data[t].crtd,
                        headCount: data[t].head_cnt,
                        totalHeadCount: data[t].total_head_cnt
                    }
                break;

                case "user_info":
                    this.bio = data[t].about;
                break;

                case "user_mobile_stats":
                    this.mobileStats = {
                        level: data[t].lvl,
                        wins: data[t].wins,
                        headCount: data[t].headCount,
                        connected: data[t].connected
                    }
                break;

                case "user_verify_reminder":
                    this.verifiedEmail = data[t];
                break;

                case "recently_played_tracks":

                    this.recentlyPlayed = data[t].tracks.map(function(track) {
                        return new Track(track);
                    });
                break;

                case "recently_ghosted_tracks":
                    this.recentlyGhosted = data[t].tracks.map(function(track) {
                        return new Track(track);
                    });
                break;

                case "created_tracks":
                    this.createdTracks = data[t].tracks.map(function(track) {
                        return new Track(track);
                    });
                break;

                case "liked_tracks":
                    this.likedTracks = data[t].tracks.map(function(track) {
                        return new Track(track);
                    });
                break;

                case "friends":
                    this.friendCount = data[t].friend_cnt,
                    this.friends = data[t].friends_data.map(user => {
                        return new this.constructor(user);
                    });
                break;

                case "friend_requests":
                    this.friendRequestCount = data[t].request_cnt,
                    this.friendRequests = data[t].request_data;
                break;

                case "has_max_friends":
                    this.friendLimitReached = data[t];
                break;

                case "subscribe":
                    this.subscriberCount = data[t].count;
                break;

                case "activity_time_ago":
                    this.lastPlayed = data[t];
                break;

                case "a_ts":
                    this.lastPlayedTimestamp = data[t];
                break;
            }
        }
    }
    addFriend() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/friends/send_friend_request",
            body: {
                u_name: this.username,
                app_signed_request: token
            },
            method: "post"
        });
    }
    removeFriend() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/friends/remove_friend",
            body: {
                u_id: this.id,
                app_signed_request: token
            },
            method: "post"
        });
    }
    subscribe() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/track_api/subscribe",
            body: {
                sub_uid: this.id,
                subscribe: 1,
                app_signed_request: token
            },
            method: "post"
        });
    }
    unsubscribe() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/track_api/subscribe",
            body: {
                sub_uid: this.id,
                subscribe: 0,
                app_signed_request: token
            },
            method: "post"
        });
    }
    setUsername(username) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return this.constructor.ajax({
            path: "/moderator/change_username",
            body: {
                u_id: this.id,
                username,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        });
    }
    setEmail(email) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return this.constructor.ajax({
            path: "/moderator/change_email",
            body: {
                u_id: this.id,
                email,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        });
    }
    toggleOA() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/toggle_official_author/" + this.id,
            body: {
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        });
    }
    ban() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/ban_user",
            body: {
                u_id: this.id,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        });
    }
}