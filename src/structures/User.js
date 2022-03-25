import RequestHandler from "../utils/RequestHandler.js";

import { token } from "../client/Client.js";

import FriendManager from "../managers/FriendManager.js";
import getTrack from "../getTrack.js";
import TrackManager from "../managers/TrackManager.js";

export default class User {
    id = null;
    username = null;
    displayName = null;
    avatar = null;
    moderator = false;
    friends = new FriendManager();
    recentlyPlayed = new TrackManager();
    recentlyCompleted = new TrackManager();
    createdTracks = new TrackManager();
    likedTracks = new TrackManager();
    static async create(data) {
        if (typeof data !== "object") {
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
                
                return getTrack(parseInt(track.slug));
            }));
        }

        if (recently_ghosted_tracks !== void 0) {
            this.recentlyCompleted = await Promise.all(recently_ghosted_tracks.tracks.map(function(track) {
                if (typeof track !== "object" || track["slug"] === void 0) {
                    return;
                }
                
                return getTrack(parseInt(track.slug));
            }));
        }

        if (created_tracks !== void 0) {
            this.createdTracks = await Promise.all(created_tracks.tracks.map(function(track) {
                if (typeof track !== "object" || track["id"] === void 0) {
                    return;
                }
                
                return getTrack(track.id);
            }));
        }

        if (liked_tracks !== void 0) {
            this.likedTracks = await Promise.all(liked_tracks.tracks.map(async function(track) {
                if (typeof track !== "object" || track["id"] === void 0) {
                    return;
                }
                
                return getTrack(track.id);
            }));
        }

        if (friends !== void 0) {
            this.friendCount = friends.friend_cnt;
            this.friends.push(...await Promise.all(friends.friends_data.map(function(user) {
                return User.create(user);
            })));
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

    /**
     * 
     * @alias addFriend
     * @returns object
     */
    befriend() {
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

    /**
     * 
     * @alias removeFriend
     * @returns object
     */
    shun() {
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

    addFriend = this.befriend;
    removeFriend = this.shun;
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

    /**
     * 
     * @param {String} username 
     * @returns {Promise}
     */
    async changeUsername(username) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/change_username",
            body: {
                u_id: this.id,
                username,
                app_signed_request: token
            },
            method: "post"
        }).then((response) => {
            if (response.result) {
                this.username = username;

                return response;
            }

            RequestHandler.ajax({
                path: "/account/edit_profile",
                body: {
                    name: "u_name",
                    value: username,
                    app_signed_request: token
                },
                method: "post"
            }).then((response) => {
                if (response.result) {
                    this.username = username;

                    return response;
                }

                throw new Error(response.msg || "Insufficeint privileges.");
            });
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    changeUsernameAsAdmin(username) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/change_username",
            body: {
                change_username_current: this.username,
                change_username_new: username,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @param {String} description 
     * @returns {Promise}
     */
    changeDescription(description) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!description)
            throw new Error("INVALID_DESCRIPTION");

        return RequestHandler.ajax({
            path: "/account/edit_profile",
            body: {
                name: "about",
                value: description,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @param {String} oldPassword 
     * @param {String} newPassword 
     * @returns {Promise}
     */
    changePassword(oldPassword, newPassword) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!oldPassword || !newPassword)
            throw new Error("INVALID_PASSWORD");

        return RequestHandler.ajax({
            path: "/account/change_password",
            body: {
                old_password: oldPassword,
                new_password: newPassword,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @param {String} password 
     * @returns {Promise}
     */
    changeForumPassword(password) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!password)
            throw new Error("INVALID_PASSWORD");

        return RequestHandler.ajax({
            path: "/account/update_forum_account",
            body: {
                password,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {String} email 
     * @returns {Promise}
     */
    changeEmail(email) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/change_email",
            body: {
                u_id: this.id,
                email,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {String} email 
     * @returns {Promise}
     */
    async changeEmailAsAdmin(email) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/change_user_email",
            body: {
                username: this.username,
                email,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number|String} coins 
     * @param {Callback} callback 
     * @returns {Promise}
     */
    addWonCoins(coins) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/change_username",
            body: {
                coins_username: this.username,
                num_coins: coins,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number} days 
     * @param {any} remove
     * @param {Callback} callback 
     * @returns {Promise}
     */
    async addPlusDays(days, remove, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/add_plus_days",
            body: {
                add_plus_days: days,
                username: this.username,
                add_plus_remove: remove,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    toggleOA() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/toggle_official_author/" + this.id,
            body: {
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    toggleClassicAuthorAsAdmin() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/toggle_classic_user/",
            body: {
                toggle_classic_uname: this.username,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number} coins 
     * @returns {Promise}
     */
    addWonCoins(coins) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/change_username",
            body: {
                coins_username: this.username,
                num_coins: coins,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    addPlusDays(days, remove) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/add_plus_days",
            body: {
                add_plus_days: days,
                username: this.username,
                add_plus_remove: remove,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    messagingBan() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/user_ban_messaging",
            body: {
                messaging_ban_uname: this.username,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    uploadingBan() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/user_ban_messaging",
            body: {
                messaging_ban_uname: this.username,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    ban() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/ban_user",
            body: {
                u_id: this.id,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number|String} time 
     * @param {Boolean} deleteRaces 
     * @returns {Promise}
     */
    banAsAdmin(time = 0, deleteRaces = !1) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (isNaN(+time))
            throw new Error("INVALID_TIME");

        return RequestHandler.ajax({
            path: "/admin/ban_user",
            body: {
                ban_secs: time,
                delete_race_stats: deleteRaces,
                username: this.username,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    deactive() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/deactivate_user",
            body: {
                username: this.username,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    delete() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/delete_user_account",
            body: {
                username: this.username,
                app_signed_request: token
            },
            method: "post"
        });
    }
}