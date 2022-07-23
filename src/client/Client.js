import EventEmitter from "../utils/EventEmitter.js";
import RequestHandler from "../utils/RequestHandler.js";

import Events from "../utils/Events.js";

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
    /**
     * 
     * @param {Object} options 
     * @param {Boolean} options.listen listen to incoming notifications
     * @param {(Number|String)} options.interval time between each datapoll request
     */
    constructor(options = {}) {
        if (typeof options !== "object") {
            throw TypeError("Options must be of type: Object.");
        }

        super();
        this.#options = {
            interval: options.interval || 6e4,
            listen: options.listen || false
        }

        this.cosmetics = new CosmeticManager(this);
        this.notifications = new NotificationManager(this);
        this.tracks = new TrackManager(this);
        this.users = new UserManager(this);
    }
    #api = new RequestHandler();
    #options = {};
    #user = null;
    get api() {
        if (!token) throw new Error("INVALID_TOKEN");
        return this.#api;
    }

    get user() {
        return this.#user;
    }

    /**
     * 
     * @private
     */
    async #listen() {
        let notifications = await this.api.datapoll().then(data => {
            return data.notification_count > 0 ? this.notifications.fetch(data.notification_count) : [];
        });
        for (const notification of notifications) {
            console.log(notification)
            if (notification.id === null) {
                let error = new Error("UNKNOWN_NOTIFICATION_ID");
                console.warn(error, notification);
                this.emit("error", error);
                continue
            }

            if (notification.id == Events.CommentMention) {
                let track = await this.api.tracks(notification.track.id);
                this.emit(notification.id, track.comments.get(notification.comment.id));
                return;
            }

            this.emit(notification.id, notification);
        }

        setTimeout(() => this.#listen(), this.#options.interval);
    }

    /**
     * 
     * @param {(String|Object[])} asr app signed request token
     * @param {String} asr[].username frhd login username
     * @param {String} asr[].password frhd login password
     * @param {String} asr[].token app signed request token
     * @returns {Client}
     */
    async login(asr) {
        if (typeof asr == "object") {
            if (asr.hasOwnProperty("username") && asr.hasOwnProperty("password")) {
                asr = await RequestHandler.ajax({
                    path: "/auth/standard_login",
                    body: {
                        login: asr.username,
                        password: asr.password
                    },
                    method: "post"
                }).then(function(response) {
                    if (response.result == false) {
                        throw new Error(response.msg);
                    }

                    return response.app_signed_request;
                });
            } else if (asr.hasOwnProperty("token")) {
                asr = asr.token;
            }
        }

        if (typeof asr !== "string")
            throw new TypeError("INVALID_TOKEN");

        token = asr;

        let response = await this.api.constructor.ajax(`/account/settings?ajax=!0&app_signed_request=${token}`);
        if (!response || !response.user)
            throw new Error("INVALID_TOKEN");

        this.#user = await this.users.fetch(response.user.d_name) || null;
        this.user.moderator = response.user.moderator;

        this.emit("ready");
        if (this.#options.listen) {
            this.#listen();
        }

        return this;
    }
    
    /**
     * 
     * @async
     * @protected requires administrative privileges.
     * @param {(Number|String)} track 
     * @param {(User|Number|String)} user 
     * @param {Callback} callback
     * @returns {Promise}
     */
    async removeRace(track, user, callback = response => response) {
        if (isNaN(parseInt(user)))
            user = await this.users.fetch(user).then(user => user.id);

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
}