import EventEmitter from "../utils/EventEmitter.js";

import RequestHandler from "../utils/RequestHandler.js";

import UserManager from "../managers/UserManager.js";
import TrackManager from "../managers/TrackManager.js";
import NotificationManager from "../managers/NotificationManager.js";
import CosmeticManager from "../managers/CosmeticManager.js";
import getCategory from "../getCategory.js";
import User from "../structures/User.js";

export let token = null;

export default class extends EventEmitter {
    constructor({ listen = false } = {}) {
        super();
        this.options = {
            listen
        }
    }
    user = null;
    users = new UserManager(this);
    tracks = new TrackManager(this);
    notifications = new NotificationManager(this);
    cosmetics = new CosmeticManager(this);
    #api = new RequestHandler();
    get api() {
        return this.#api;
    }

    /**
     * 
     * @param {Function} callback simple callback
     * @returns {Object} object
     */
    datapoll(callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/datapoll/poll_request",
            body: {
                notifications: true,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @private
     */
     #handle(notification) {
        if (!notification.id) {
            let error = new Error("UNKNOWN_NOTIFICATION_ID");
            console.warn(error);
            return error;
        }
        
        this.emit(notification.id, notification);
    }

    /**
     * 
     * @private
     */
    #listen() {
        this.datapoll(t => {
            if (t.notification_count > 0) {
                this.notifications.fetch().then(notifications => {
                    notifications = notifications.sort((t, e) => e.ts - t.ts);
                    for (const notification in notifications) {
                        if (notification >= t.notification_count) return;

                        this.#handle(notifications[notification]);
                    }
                });
            }
        });

        setTimeout(() => this.#listen(), 3000);
    }

    /**
     * 
     * @param {String} asr app signed request token
     * @returns {Client}
     */
    async login(asr) {
        if (!asr || typeof asr !== "string")
            throw new Error("INVALID_TOKEN");

        token = asr;

        const response = await RequestHandler.ajax(`/?ajax=true&app_signed_request=${token}`);
        if (!response.user)
            throw new Error("INVALID_TOKEN");

        this.user = await this.users.fetch(response.user.d_name);
        
        this.emit("ready");

        if (this.options.listen) {
            this.#listen();
        }

        return this;
    }

    /**
     * 
     * @param {String} username login username
     * @param {String|Number} password login password
     * @returns {Client}
     */
    async defaultLogin(username, password) {
        return RequestHandler.ajax({
            path: "/auth/standard_login",
            body: {
                login: username,
                password,
                t_1: "ref",
                t_2: "desk"
            },
            method: "post"
        }).then(response => {
            if (response.app_signed_request === void 0)
                throw new Error("INVALID_TOKEN");

            return this.login(response.app_signed_request);
        });
    }

    async signup(username, email, password, recaptcha, callback = user => user) {
        return RequestHandler.ajax({
            path: "/auth/standard_signup",
            body: {
                username: encodeURIComponent(username),
                email: encodeURIComponent(email).replace("%20", "+"),
                password: encodeURIComponent(password).replace("%20", "+"),
                recaptcha
            },
            method: "post"
        }).then(function(response) {
            if (response.app_signed_request === void 0)
                throw new Error("INVALID_TOKEN");

            return this.login(response.app_signed_request);
        }).then(callback);
    }

    async postTrack(title, description, defaultVehicle, MTBALlowed, BMXAllowed, code, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/create/submit",
            body: {
                name: encodeURIComponent(title).replace('%20', '+'),
                desc: encodeURIComponent(description).replace('%20', '+'),
                default_vehicle: defaultVehicle,
                "allowed_vehicles%5BMTB%5D": MTBALlowed,
                "allowed_vehicles%5BBMX%5D": BMXAllowed,
                code: encodeURIComponent(code).replace('%20', '+'),
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async changeUsername(username, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!username)
            throw new Error("INVALID_USERNAME");

        return RequestHandler.ajax({
            path: "/account/edit_profile",
            body: {
                name: "u_name",
                value: encodeURIComponent(username.replace(/[^A-Z0-9]/ig, "")),
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async changeDescription(description, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!description)
            throw new Error("INVALID_DESCRIPTION");

        return RequestHandler.ajax({
            path: "/account/edit_profile",
            body: {
                name: "about",
                value: encodeURIComponent(description.replace(/\s+/g, "+")),
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async changePassword(oldPassword, newPassword, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!oldPassword || !newPassword)
            throw new Error("INVALID_PASSWORD");

        return RequestHandler.ajax({
            path: "/account/change_password",
            body: {
                old_password: encodeURIComponent(oldPassword).replace("%20", "+"),
                new_password: encodeURIComponent(newPassword.replace("%20", "+")),
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async setForumPassword(password, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!password)
            throw new Error("INVALID_PASSWORD");

        return RequestHandler.ajax({
            path: "/account/update_forum_account",
            body: {
                password: encodeURIComponent(password.replace("%20", "+")),
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async buyHead(callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/store/buy",
            method: "post"
        }).then(callback);
    }

    async setHead(itemId, callback = response => response) {
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
        }).then(callback);
    }

    async addFriend(username, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/friends/send_friend_request",
            body: {
                u_name: username,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async acceptFriend(username, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/friends/respond_to_friend_request",
            body: {
                u_name: username,
                action: "accept",
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async removeFriend(user, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/friends/remove_friend",
            body: {
                u_id: user,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async subscribe(user, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/track_api/subscribe",
            body: {
                sub_uid: user,
                subscribe: 1,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async unsubscribe(user, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/track_api/subscribe",
            body: {
                sub_uid: user,
                subscribe: 0,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }
    
    /**
     * 
     * @async
     * @protected requires administrative priviledges
     * @param {Number|String} track 
     * @param {User|Number|String} user 
     * @param {Function} callback
     * @returns object
     */
    async removeRace(track, user, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/remove_race",
            body: {
                t_id: track,
                u_id: user || this.user.id,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @async
     * @protected requires administrative priviledges
     * @param {Number|String} track
     * @param {Number|String} lives
     * @param {Number|String} refillCost
     * @param {Number|String} gems
     * @param {Function} callback
     * @description removes cheated ghosts on all tracks between the given range
     * @returns String
     */
    async addDailyTrack(track, lives, refillCost, gems, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/add_track_of_the_day",
            body: {
                t_id: track,
                lives,
                rfll_cst: refillCost,
                gems,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @async
     * @protected requires administrative priviledges
     * @param {Number|String} track
     * @param {Function} callback
     * @description removes a specified track from the track of the day queue.
     * @returns 
     */
    async removeTrackOfTheDay(track, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/removeTrackOfTheDay",
            body: {
                t_id: track,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {Number|String} track 
     * @param {Function} callback 
     * @returns {Promise}
     */
    async addFeaturedTrack(track, callback = response => response) {
        return RequestHandler.ajax(`/track_api/feature_track/${parseInt(track)}/1?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then(callback);
    }

    /**
     * 
     * @param {Number|String} track 
     * @param {Function} callback 
     * @returns {Promise}
     */
    async removeFeaturedTrack(track, callback = response => response) {
        return RequestHandler.ajax(`/track_api/feature_track/${parseInt(track)}/0?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then(callback);
    }

    /**
     * 
     * @async
     * @protected
     * @param {Number|String} track
     * @description removes cheated ghosts on all tracks between the given range
     * @returns object
     */
    async hideTrack(track, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax(`/moderator/hide_track/${parseInt(track)}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then(callback);
    }

    /**
     * 
     * @async
     * @protected
     * @param {Number|String} track
     * @description removes cheated ghosts on all tracks between the given range
     * @returns object
     */
    async hideTrackAsAdmin(track, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/hide_track",
            body: {
                track_id: parseInt(track),
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @async
     * @protected requires administrative priviledges.
     * @param {Object} options 
     * @description removes cheated ghosts on all tracks between the given range
     * @returns String
     */
    async deepClean({ users, startingTrackId = 1001, endingTrackId, timeout = 0 } = {}, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        if (!endingTrackId)
            endingTrackId = await getCategory("recently-added").then(function(response) {
                return parseInt(response.tracks[0].slug);
            });
        
        users = await Promise.all(users.map(async user => {
            if (user.match(/\D+/gi)) {
                user = await this.users.fetch(user);
                if (!user)
                    throw new Error("INVALID_USER");

                return user.id;
            }

            return parseInt(user);
        }));

        for (let trackId = startingTrackId; trackId <= endingTrackId; trackId++) {
            await this.tracks.fetch(trackId).then(async function(track) {
                if (users) {
                    for (const userId of users) {
                        track.removeRace(userId).catch(response => {
                            console.warn(response);

                            return track.removeRace(userId);
                        });
                    }
                } else {
                    await track.getLeaderboard().then(leaderboard => {
                        for (const race of leaderboard) {
                            if (race && typeof race.runTime !== "undefined" && !race.runTime) {
                                track.removeRace(race.userId || race.user.id);
                            }
                        }
                    });
                }

                return track.id;
            }).then(callback);
            
            timeout && await new Promise(resolve => setTimeout(resolve, timeout));
        }

        return "No more cheaters left to exterminate!";
    }

    /**
     * 
     * @param {String} username 
     * @param {Number} coins 
     * @param {Function} callback 
     * @returns {Promise}
     */
    async addWonCoins(username, coins, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/change_username",
            body: {
                coins_username: username,
                num_coins: coins,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    addPlusDays(user, days, remove, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/add_plus_days",
            body: {
                add_plus_days: days,
                username: user,
                add_plus_remove: remove,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async setUsername(user, username, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/change_username",
            body: {
                u_id: user,
                username,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async setUsernameAsAdmin(user, username, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/change_username",
            body: {
                change_username_current: user,
                change_username_new: username,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async setEmail(user, email, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/change_email",
            body: {
                u_id: user,
                email,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    setEmailAsAdmin(user, email, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/change_user_email",
            body: {
                username: user,
                email,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {String} user 
     * @param {String} email 
     * @param {Function} callback 
     * @returns {Promise}
     */
    async communitySignup(user, email, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/community_classic_signup",
            body: {
                classic_username: user,
                real_email: email,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {String} user 
     * @param {String} email 
     * @param {String} secondaryEmail 
     * @param {Function} callback 
     * @returns {Promise}
     */
    async communityTransfer(user, email, secondaryEmail, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/community_classic_transfer",
            body: {
                classic_existing_email: email,
                classic_transfer_to_username: user,
                classic_secondary_email: secondaryEmail,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    async toggleOA(user, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/toggle_official_author/" + user,
            body: {
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {String} user 
     * @param {Function} callback 
     * @returns {Promise}
     */
    async toggleClassicUserAsAdmin(user, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/toggle_classic_user/",
            body: {
                toggle_classic_uname: user,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {String} user 
     * @param {Function} callback 
     * @returns {Promise} 
     */
    async userMessagingBan(user, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/user_ban_messaging",
            body: {
                messaging_ban_uname: user,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {String} user 
     * @param {Function} callback 
     * @returns {Promise} 
     */
    async userUploadingBan(user, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/user_ban_uploading",
            body: {
                uploading_ban_uname: user,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {Number|String} user 
     * @param {Function} callback 
     * @returns {Promise}
     */
    async banUser(user, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        // /admin/ban_user
        // ban_secs, username, delete_race_stats
        return RequestHandler.ajax({
            path: "/moderator/ban_user",
            body: {
                u_id: parseInt(user),
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {Number|String} user 
     * @param {Number|String} time 
     * @param {Boolean} deleteRaces
     * @param {Function} callback 
     * @returns {Promise} 
     */
    async banUserAsAdmin(user, time = 0, deleteRaces = false, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/ban_user",
            body: {
                ban_secs: time,
                delete_race_stats: deleteRaces,
                username: user,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {String} user 
     * @param {Function} callback 
     * @returns {Promise} 
     */
    async deactivateUser(user, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/deactivate_user",
            body: {
                username: user,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {String} user 
     * @param {Function} callback 
     * @returns {Promise} 
     */
    async deleteUserAccount(user, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/delete_user_account",
            body: {
                username: user,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    generateCoupon(platform, coins, gems, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/generate_coupon_code",
            body: {
                platform,
                coins,
                gems,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {String} coupon 
     * @param {Function} callback 
     * @returns 
     */
    redeemCoupon(coupon, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/store/redeemCouponCode",
            body: {
                coupon_code: coupon,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }
    
    /**
     * 
     * @returns {Client}
     */
    logout() {
        this.user = null;
        token = null;

        return this;
    }
    
    /**
     * 
     * @static
     * @param {Number|String} time Number in miliseconds
     */
    static sleep(time = 0) {
        let now = Date.now();
        while(Date.now() - now < time) {
            continue;
        }
    }

    /**
     * 
     * @static
     * @param {Number|String} time Number in miliseconds
     */
    static wait(time = 0) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}