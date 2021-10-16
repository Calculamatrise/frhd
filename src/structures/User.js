import RequestHandler from "../utils/RequestHandler.js";

import getTrack from "../getTrack.js";

import { token } from "../client/Client.js";

export default class User {
    id = null;
    username = null;
    displayName = null;
    avatar = null;
    static async create(data) {
        if (!data || typeof data !== "object") {
            throw new Error("INVALID_DATA_TYPE");
        }

        const user = new User();

        await user.init(data);

        return user;
    }
    async init({
        u_id,
        u_name,
        d_name,
        img_url_small,
        img_url_medium,
        user,
        user_stats,
        user_info,
        user_mobile_stats,
        user_verify_reminder,
        recently_played_tracks,
        recently_ghosted_tracks,
        created_tracks,
        liked_tracks,
        friends,
        friend_requests,
        has_max_friends,
        subscribe,
        activity_time_ago,
        a_ts
    }) {
        this.id = u_id || user.u_id;
        this.username = u_name || user.u_name;
        this.displayName = d_name || user.d_name;
        this.avatar = img_url_small || img_url_medium || user.img_url_medium;
        if (user !== void 0) {
            this.classic = user.classic;
            this.admin = user.admin;
            this.plus = user.plus;
            this.forums = user.forum_url;
            this.cosmetics = {
                head: {
                    image: user.cosmetics.head.img,
                    spriteSheetURL() {
                        return `https://cdn.freeriderhd.com/free_rider_hd/assets/inventory/head/spritesheets/${user.cosmetics.head.img.replace(/\s(.*)/gi, "")}.png`
                    }
                }
            }
        }

        if (user_stats !== void 0) {
            this.stats = {
                totalPoints: user_stats.tot_pts,
                completed: user_stats.cmpltd,
                rated: user_stats.rtd,
                comments: user_stats.cmmnts,
                created: user_stats.crtd,
                headCount: user_stats.head_cnt,
                totalHeadCount: user_stats.total_head_cnt
            }
        }

        if (user_info) {
            this.bio = user_info.about; 
        }
        
        if (user_mobile_stats !== void 0) {
            this.mobileStats = {
                level: user_mobile_stats.lvl,
                wins: user_mobile_stats.wins,
                headCount: user_mobile_stats.headCount,
                connected: user_mobile_stats.connected
            }
        }

        if (user_verify_reminder !== void 0) {
            this.verifiedEmail = user_verify_reminder;
        }

        if (recently_played_tracks !== void 0) {
            this.recentlyPlayed = await Promise.all(recently_played_tracks.tracks.map(async function(track) {
                if (typeof track !== "object" || track["slug"] === void 0) {
                    return;
                }
                
                return await getTrack(parseInt(track.slug));
            }));
        }

        if (recently_ghosted_tracks !== void 0) {
            this.recentlyCompleted = await Promise.all(recently_ghosted_tracks.tracks.map(async function(track) {
                if (typeof track !== "object" || track["slug"] === void 0) {
                    return;
                }
                
                return await getTrack(parseInt(track.slug));
            }));
        }

        if (created_tracks !== void 0) {
            this.createdTracks = await Promise.all(created_tracks.tracks.map(async function(track) {
                if (typeof track !== "object" || track["id"] === void 0) {
                    return;
                }
                
                return await getTrack(track.id);
            }));
        }

        if (liked_tracks !== void 0) {
            this.likedTracks = await Promise.all(liked_tracks.tracks.map(async function(track) {
                if (typeof track !== "object" || track["id"] === void 0) {
                    return;
                }
                
                return await getTrack(track.id);
            }));
        }

        if (friends !== void 0) {
            this.friendCount = friends.friend_cnt;
            this.friends = await Promise.all(friends.friends_data.map(function(user) {
                return User.create(user);
            }));
        }

        if (friend_requests !== void 0) {
            this.friendRequestCount = friend_requests.request_cnt;
            this.friendRequests = friend_requests.request_data;
        }
        
        if (has_max_friends !== void 0) {
            this.friendLimitReached = has_max_friends;
        }

        if (subscribe !== void 0) {
            this.subscriberCount = subscribe.count;
        }

        if (activity_time_ago !== void 0) {
            this.lastPlayed = activity_time_ago;
        }

        if (a_ts !== void 0) {
            this.lastPlayedTimestamp = a_ts;
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