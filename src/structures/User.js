import RequestHandler from "../utils/RequestHandler.js";

import { token } from "../client/Client.js";

import FriendManager from "../managers/FriendManager.js";
import TrackManager from "../managers/TrackManager.js";

import getTrack from "../getTrack.js";

export default class User {
    id = null;
    avatar = null;
    displayName = null;
    moderator = false;
    username = null;
    friends = new FriendManager();
    recentlyPlayed = new TrackManager();
    recentlyCompleted = new TrackManager();
    createdTracks = new TrackManager();
    likedTracks = new TrackManager();
    static async create(data) {
        if (typeof data != "object") {
            throw new TypeError("INVALID_DATA_TYPE");
        }

        const instance = new User();
        instance.id = data.u_id;
        instance.username = data.u_name;
        instance.displayName = data.d_name;
        instance.avatar = data.img_url_small || data.img_url_medium;
        if (data.user !== void 0) {
            instance.id = instance.id || data.user.u_id;
            instance.username = instance.username || data.user.u_name;
            instance.displayName = instance.displayName || data.user.d_name;
            instance.avatar = instance.avatar || data.user.img_url_medium;
            instance.classic = data.user.classic;
            instance.admin = data.user.admin;
            instance.plus = data.user.plus;
            instance.forums = data.user.forum_url || null;
            instance.cosmetics = {
                head: {
                    image: data.user.cosmetics.head.img,
                    spriteSheetURL() {
                        return `https://cdn.freeriderhd.com/free_rider_hd/assets/inventory/head/spritesheets/${data.user.cosmetics.head.img.replace(/\s(.*)/gi, "")}.png`
                    }
                }
            }
        }

        if (data.user_stats !== void 0) {
            instance.stats = {
                totalPoints: data.user_stats.tot_pts,
                completed: data.user_stats.cmpltd,
                rated: data.user_stats.rtd,
                comments: data.user_stats.cmmnts,
                created: data.user_stats.crtd,
                headCount: data.user_stats.head_cnt,
                totalHeadCount: data.user_stats.total_head_cnt
            }
        }

        if (data.user_info) {
            instance.bio = data.user_info.about; 
        }

        if (data.user_mobile_stats !== void 0) {
            instance.mobileStats = {
                level: data.user_mobile_stats.lvl,
                wins: data.user_mobile_stats.wins,
                headCount: data.user_mobile_stats.headCount,
                connected: data.user_mobile_stats.connected
            }
        }

        if (data.user_verify_reminder !== void 0) {
            instance.verifiedEmail = data.user_verify_reminder;
        }

        if (data.recently_played_tracks !== void 0) {
            instance.recentlyPlayed = await Promise.all(data.recently_played_tracks.tracks.map(async function(track) {
                if (typeof track !== "object" || track["slug"] === void 0) {
                    return;
                }
                
                return getTrack(parseInt(track.slug));
            }));
        }

        if (data.recently_ghosted_tracks !== void 0) {
            instance.recentlyCompleted = await Promise.all(data.recently_ghosted_tracks.tracks.map(function(track) {
                if (typeof track !== "object" || track["slug"] === void 0) {
                    return;
                }
                
                return getTrack(parseInt(track.slug));
            }));
        }

        if (data.created_tracks !== void 0) {
            instance.createdTracks = await Promise.all(data.created_tracks.tracks.map(function(track) {
                if (typeof track !== "object" || track["id"] === void 0) {
                    return;
                }
                
                return getTrack(track.id);
            }));
        }

        if (data.liked_tracks !== void 0) {
            instance.likedTracks = await Promise.all(data.liked_tracks.tracks.map(async function(track) {
                if (typeof track !== "object" || track["id"] === void 0) {
                    return;
                }
                
                return getTrack(track.id);
            }));
        }

        if (data.friends !== void 0) {
            instance.friendCount = data.friends.friend_cnt;
            instance.friends.push(...await Promise.all(data.friends.friends_data.map(function(user) {
                return User.create(user);
            })));
        }

        if (data.friend_requests !== void 0) {
            instance.friendRequestCount = data.friend_requests.request_cnt;
            instance.friendRequests = data.friend_requests.request_data;
        }
        
        if (data.has_max_friends !== void 0) {
            instance.friendLimitReached = data.has_max_friends;
        }

        if (data.subscribe !== void 0) {
            instance.subscriberCount = data.subscribe.count;
        }

        if (data.activity_time_ago !== void 0) {
            instance.lastPlayed = data.activity_time_ago;
        }

        if (data.a_ts !== void 0) {
            instance.lastPlayedTimestamp = data.a_ts;
        }

        return instance;
    }

    /**
     * 
     * @returns {Promise}
     */
    buyHead() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/store/buy",
            body: {
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @param {Number} itemId 
     * @returns {Promise}
     */
    setHead(itemId) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!itemId)
            throw new Error("INVALID_COSMETIC");

        return RequestHandler.ajax({
            path: "/store/equip",
            body: {
                item_id: itemId,
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
            path: "/admin/add_won_coins",
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
    deactivate() {
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