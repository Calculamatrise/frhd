import Client, { token } from "./client.js";
import Response from "./response.js";

export default class {
    constructor(data) {
        if (!data || typeof data !== "object") throw new Error("INVALID_DATA_TYPE");
        this.id = null,
        this.username = null,
        this.displayName = null,
        this.avatar = null,
        this.classic = false,
        this.admin = false,
        this.plus = false,
        this.forums = null,
        this.cosmetics = null;
        this.stats = null;
        this.mobileStats = null;
        this.verifiedEmail = false;
        this.bio = "",
        this.stats = null,
        this.mobileStats = null,
        this.recentlyPlayed = null,
        this.recentlyGhosted = null,
        this.createdTracks = null,
        this.likedTracks = null,
        this.friendCount = null,
        this.friends = null,
        this.friendRequestCount = null,
        this.friendRequests = null,
        this.friendLimitReached = false,
        this.subscriberCount = null,
        this.init(data);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "user":
                    this.id = data[t].u_id,
                    this.username = data[t].u_name,
                    this.displayName = data[t].d_name,
                    this.avatar = data[t].img_url_medium,
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
                    this.recentlyPlayed = data[t].tracks;
                break;

                case "recently_ghosted_tracks":
                    this.recentlyGhosted = data[t].tracks;
                break;

                case "created_tracks":
                    this.createdTracks = data[t].tracks;
                break;

                case "liked_tracks":
                    this.likedTracks = data[t].tracks;
                break;

                case "friends":
                    this.friendCount = data[t].friend_cnt,
                    this.friends = data[t].friends_data;
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
            }
        }
    }
    async addFriend() {
        if (!token) throw new Error("INVALID_TOKEN");
        return await Client.ajax({
            path: "/friends/send_friend_request",
            body: {
                u_name: this.username,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async removeFriend() {
        if (!token) throw new Error("INVALID_TOKEN");
        return await Client.ajax({
            path: "/friends/remove_friend",
            body: {
                u_id: this.id,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async subscribe() {
        if (!token) throw new Error("INVALID_TOKEN");
        return await Client.ajax({
            path: "/track_api/subscribe",
            body: {
                sub_uid: this.id,
                subscribe: 1,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async unsubscribe() {
        if (!token) throw new Error("INVALID_TOKEN");
        return await Client.ajax({
            path: "/track_api/subscribe",
            body: {
                sub_uid: this.id,
                subscribe: 0,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async setUsername(username) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: "/moderator/change_username",
            body: {
                u_id: this.id,
                username,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async setEmail(email) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: "/moderator/change_email",
            body: {
                u_id: this.id,
                email,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async toggleOA() {
        if (!token) throw new Error("INVALID_TOKEN");
        return await Client.ajax({
            path: "/moderator/toggle_official_author/" + this.id,
            body: {
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
    async ban() {
        if (!token) throw new Error("INVALID_TOKEN");
        return await Client.ajax({
            path: "/moderator/ban_user",
            body: {
                u_id: this.id,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t));
    }
}