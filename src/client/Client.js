import EventEmitter from "../utils/EventEmitter.js";

import RequestHandler from "../utils/RequestHandler.js";

import UserManager from "../managers/UserManager.js";
import TrackManager from "../managers/TrackManager.js";
import NotificationManager from "../managers/NotificationManager.js";
import CosmeticManager from "../managers/CosmeticManager.js";
import User from "../structures/User.js";

export let token;

/**
 * @callback Callback
 */

export default class extends EventEmitter {
    constructor({ listen = !1 } = {}) {
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

    get friends() {
        return this.user.friends;
    }

    /**
     * 
     * @param {Callback} callback 
     * @returns {Promise} 
     */
    async datapoll(callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/datapoll/poll_request",
            body: {
                notifications: !0,
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
     * @param {Object[String]} asr[username] frhd login username
     * @param {Object[String]} asr[password] frhd login password
     * @param {Object[String]} asr[token] app signed request token
     * @returns {Client}
     */
    async login(asr) {
        if (typeof asr === "object") {
            if (asr.hasOwnProperty("username") && asr.hasOwnProperty("password")) {
                asr = await RequestHandler.ajax({
                    path: "/auth/standard_login",
                    body: {
                        login: asr.username,
                        password: asr.password
                    },
                    method: "post"
                }).then(function(response) {
                    if (response.result === false) {
                        throw new Error(response.msg);
                    }

                    return response.app_signed_request;
                });
            } else if (asr.hasOwnProperty("token")) {
                asr = asr.token;
            }
        }

        if (typeof asr !== "string")
            throw new Error("INVALID_TOKEN");

        token = asr;

        const response = await RequestHandler.ajax(`/account/settings?ajax=!0&app_signed_request=${token}`);
        if (!response || !response.user)
            throw new Error("INVALID_TOKEN");

        this.user = await this.users.fetch(response.user.d_name);
        this.user.moderator = response.user.moderator;
        
        this.emit("ready");

        if (this.options.listen) {
            this.#listen();
        }

        return this;
    }

    /**
     * 
     * @param {Callback} callback 
     * @returns {Promise}
     */
    async buyHead(callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/store/buy",
            method: "post"
        }).then(callback);
    }

    /**
     * 
     * @param {Number|String} itemId 
     * @param {Callback} callback 
     * @returns {Promise}
     */
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
    
    /**
     * 
     * @async
     * @protected requires administrative privileges.
     * @param {Number|String} track 
     * @param {User|Number|String} user 
     * @param {Callback} callback
     * @returns {Promise}
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
     * @param {String} user 
     * @param {String} email 
     * @param {Callback} callback 
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
     * @param {Callback} callback 
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

    /**
     * 
     * @param {String} platform 
     * @param {Number|String} coins 
     * @param {Number|String} gems 
     * @param {Callback} callback 
     * @returns {Promise}
     */
    async generateCoupon(platform, coins, gems, callback = response => response) {
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
     * @param {Callback} callback 
     * @returns {Promise}
     */
    async redeemCoupon(coupon, callback = response => response) {
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
     * @returns {Promise}
     */
    static wait(time = 0) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
}