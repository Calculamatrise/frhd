import BaseClient from "./BaseClient.js";
import RequestHandler from "../utils/RequestHandler.js";

import UserManager from "../managers/UserManager.js";
import TrackManager from "../managers/TrackManager.js";
import CosmeticManager from "../managers/CosmeticManager.js";

/**
 * @callback Callback
 * @extends {BaseClient}
 * @type {Client}
 */
export default class extends BaseClient {
	cosmetics = new CosmeticManager(this);
	tracks = new TrackManager(this);
	users = new UserManager(this);

    /**
     * 
	 * @protected requires administrative priviledges
     * @param {string} username 
     * @param {string} email 
     * @param {Callback} callback 
     * @returns {Promise}
     */
    async communitySignup(username, email, callback = r => r) {
        return RequestHandler.post("admin/community_classic_signup", {
            classic_username: username,
            real_email: email
        }, true).then(callback)
    }

    /**
     * 
	 * @protected requires administrative priviledges
     * @param {string} username
     * @param {string} email
     * @param {string} secondaryEmail
     * @param {Callback} callback
     * @returns {Promise}
     */
    async communityTransfer(username, email, secondaryEmail, callback = r => r) {
        return RequestHandler.post("admin/community_classic_transfer", {
            classic_existing_email: email,
            classic_transfer_to_username: username,
            classic_secondary_email: secondaryEmail
        }, true).then(callback)
    }

    /**
     * 
	 * @protected requires administrative priviledges
     * @param {string} platform
     * @param {number} coins
     * @param {number} gems
     * @param {Callback} callback
     * @returns {Promise}
     */
    async generateCoupon(platform, coins, gems, callback = r => r) {
        return RequestHandler.post("admin/generate_coupon_code", {
            platform,
            coins,
            gems
        }, true).then(callback)
    }

    /**
     * 
     * @param {string} code
     * @param {Callback} callback
     * @returns {Promise}
     */
    async redeemCoupon(code, callback = r => r) {
        return RequestHandler.post("store/redeemCouponCode", {
            coupon_code: code
        }, true).then(callback)
    }
}