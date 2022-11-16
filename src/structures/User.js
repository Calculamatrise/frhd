import RequestHandler from "../utils/RequestHandler.js";
import CosmeticManager from "../managers/CosmeticManager.js";
import FriendManager from "../managers/FriendManager.js";
import TrackManager from "../managers/TrackManager.js";
import getTrack from "../getTrack.js";

export default class User {
    id = null;
    avatar = null;
    displayName = null;
    moderator = false;
    username = null;
    cosmetics = new CosmeticManager();
    friends = new FriendManager();
    recentlyPlayed = new TrackManager();
    recentlyCompleted = new TrackManager();
    likedTracks = new TrackManager();

    #createdTracks = null;
    get createdTracks() {
        if (!(this.#createdTracks instanceof TrackManager)) {
            this.#createdTracks = new TrackManager();
            for (const { id } of this.#createdTracks) {
                this.#createdTracks.fetch(id);
            }
        }

        return this.#createdTracks;
    }

    static async create(data, isCurrentUser = false) {
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
                        return `https://cdn.freeriderhd.com/free_rider_hd/assets/inventory/head/spritesheets/${data.user.cosmetics.head.img.replace(/\s(.*)/gi, '')}.png`
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
            instance.#createdTracks = data.created_tracks.tracks;
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

    subscribe() {
        return RequestHandler.post("/track_api/subscribe", {
            sub_uid: this.id,
            subscribe: 1
        }, true);
    }

    unsubscribe() {
        return RequestHandler.post("/track_api/subscribe", {
            sub_uid: this.id,
            subscribe: 0
        }, true);
    }

    /**
     * 
     * @param {string} username 
     * @returns {Promise}
     */
    async changeUsername(username) {
        if (this.username == this.client.user.username) {
            return RequestHandler.post("/account/edit_profile", {
                name: "u_name",
                value: username
            }, true).then((res) => {
                if (res.result) {
                    this.username = username;
                    return res;
                }

                throw new Error(res.msg || "Insufficeint privileges.");
            });
        }

        return RequestHandler.post("/moderator/change_username", {
            u_id: this.id,
            username
        }, true).then((res) => {
            if (res.result) {
                this.username = username;
                return res;
            }

            throw new Error(res.msg || "Insufficeint privileges.");
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    changeUsernameAsAdmin(username) {
        return RequestHandler.post("/admin/change_username", {
            change_username_current: this.username,
            change_username_new: username
        }, true);
    }

    /**
     * 
     * @param {string} description 
     * @returns {Promise}
     */
    changeDescription(description) {
        return RequestHandler.post("/account/edit_profile", {
            name: "about",
            value: String(description)
        }, true);
    }

    /**
     * 
     * @param {string} oldPassword 
     * @param {string} newPassword 
     * @returns {Promise}
     */
    changePassword(oldPassword, newPassword) {
        // make sure new password matches restrictions
        if (!newPassword) throw new Error("INVALID_PASSWORD");
        return RequestHandler.post("/account/change_password", {
            old_password: oldPassword,
            new_password: newPassword
        }, true);
    }

    /**
     * 
     * @param {string} password 
     * @returns {Promise}
     */
    changeForumPassword(password) {
        return RequestHandler.post("/account/update_forum_account", {
            password
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {string} email 
     * @returns {Promise}
     */
    changeEmail(email) {
        return RequestHandler.post("/moderator/change_email", {
            u_id: this.id,
            email
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {string} email 
     * @returns {Promise}
     */
    async changeEmailAsAdmin(email) {
        return RequestHandler.post("/admin/change_user_email", {
            username: this.username,
            email
        }, true);
    }

    /**
     * Moderator endpoint
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    toggleOA() {
        return RequestHandler.post("/moderator/toggle_official_author/" + this.id, true);
    }

    /**
     * Admin endpoint
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    toggleClassicAuthorAsAdmin() {
        return RequestHandler.post("/admin/toggle_classic_user/", {
            toggle_classic_uname: this.username
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {number} coins 
     * @returns {Promise}
     */
    addWonCoins(coins) {
        return RequestHandler.post("/admin/add_won_coins", {
            coins_username: this.username,
            num_coins: coins
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    addPlusDays(days, remove) {
        return RequestHandler.post("/admin/add_plus_days", {
            add_plus_days: days,
            username: this.username,
            add_plus_remove: remove
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    messagingBan() {
        return RequestHandler.post("/admin/user_ban_messaging", {
            messaging_ban_uname: this.username
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    uploadingBan() {
        return RequestHandler.post("/admin/user_ban_messaging", {
            messaging_ban_uname: this.username
        }, true);
    }

    /**
     * Moderator endpoint
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    ban() {
        return RequestHandler.post("/moderator/ban_user", {
            u_id: this.id
        }, true);
    }

    /**
     * Moderator endpoint
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    unban() {
        return RequestHandler.post("/moderator/unban_user", {
            u_id: this.id
        }, true);
    }

    /**
     * Admin endpoint (uncertain about whether admin un-action endpoints exist)
     * @protected requires administrative privileges.
     * @param {number|string} time 
     * @param {Boolean} deleteRaces 
     * @returns {Promise}
     */
    banAsAdmin(time = 0, deleteRaces = !1) {
        return RequestHandler.post("/admin/ban_user", {
            ban_secs: ~~time,
            delete_race_stats: deleteRaces,
            username: this.username
        }, true);
    }


    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    deactivate() {
        return RequestHandler.post("/admin/deactivate_user", {
            username: this.username
        }, true);
    }

    /**
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    delete() {
        return RequestHandler.post("/admin/delete_user_account", {
            username: this.username
        }, true);
    }
}