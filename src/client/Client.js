import BaseClient from "./BaseClient.js";
import RequestHandler from "../utils/RequestHandler.js";

import UserManager from "../managers/UserManager.js";
import TrackManager from "../managers/TrackManager.js";
import NotificationManager from "../managers/NotificationManager.js";
import CosmeticManager from "../managers/CosmeticManager.js";

/**
 * @callback Callback
 * @extends {BaseClient}
 * @type {Client}
 */
export default class extends BaseClient {
    constructor() {
        super(...arguments);
        this.cosmetics = new CosmeticManager(this);
        this.notifications = new NotificationManager(this);
        this.tracks = new TrackManager(this);
        this.users = new UserManager(this);
    }

    /**
     * 
     * @param {string} user 
     * @param {string} email 
     * @param {Callback} callback 
     * @returns {Promise}
     */
    async communitySignup(user, email, callback = res => res) {
        return RequestHandler.post("/admin/community_classic_signup", {
            classic_username: user,
            real_email: email
        }, true).then(callback);
    }

    /**
     * 
     * @param {string} user
     * @param {string} email
     * @param {string} secondaryEmail
     * @param {Callback} callback
     * @returns {Promise}
     */
    async communityTransfer(user, email, secondaryEmail, callback = res => res) {
        return RequestHandler.post("/admin/community_classic_transfer", {
            classic_existing_email: email,
            classic_transfer_to_username: user,
            classic_secondary_email: secondaryEmail
        }, true).then(callback);
    }

    /**
     * 
     * @param {string} platform
     * @param {number} coins
     * @param {number} gems
     * @param {Callback} callback
     * @returns {Promise}
     */
    async generateCoupon(platform, coins, gems, callback = res => res) {
        return RequestHandler.post("/admin/generate_coupon_code", {
            platform,
            coins,
            gems
        }, true).then(callback);
    }

    /**
     * 
     * @param {string} code
     * @param {Callback} callback
     * @returns {Promise}
     */
    async redeemCoupon(code, callback = res => res) {
        return RequestHandler.post("/store/redeemCouponCode", {
            coupon_code: code
        }, true).then(callback);
    }
}