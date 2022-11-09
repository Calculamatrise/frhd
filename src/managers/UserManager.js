import BaseManager from "./BaseManager.js";

export default class extends BaseManager {
    /**
     * 
     * @async
     * @param {object|number|string} uid
     * @param {object} [force]
     * @returns {Response}
     */
    async fetch(uid, { force }) {
        if (typeof uid == 'object') {
            if (uid.hasOwn('id')) {
                uid = parseInt(uid['id']);
            } else if (uid.hasOwn('username')) {
                uid = uid['username'];
            }
        }

        if (force || !this.cache.has(uid)) {
            if (typeof uid == 'number') {
                await RequestHandler.post("/friends/remove_friend", { u_id: uid }, false).then(res => {
                    // Response: "You are not friends with USERNAME, you cannot remove friendship."

                });
            }

            const entry = await this.client.api.users(uid);
            entry && this.cache.set(uid, entry);
        }

        return this.cache.get(uid);
    }

    /**
     * 
     * @async
     * @param {number|string} user id or username
     * @returns {Promise}
     */
    async subscribe(user) {
        if (typeof user != 'number') {
            return this.fetch(String(user)).then(user => user.subscribe());
        }

        return RequestHandler.post("/track_api/subscribe", {
            sub_uid: user,
            subscribe: 1
        }, true);
    }

    /**
     * 
     * @async
     * @param {number|string} user id or username
     * @returns {Promise}
     */
    async unsubscribe(user) {
        if (typeof user != 'number') {
            return this.fetch(String(user)).then(user => user.unsubscribe());
        }

        return RequestHandler.post("/track_api/subscribe", {
            sub_uid: user,
            subscribe: 0
        }, true);
    }

    /**
     * Change a user's username
     * @protected requires administrative privileges.
     * @param {number|string} user ID or username
     * @param {string} username new username
     * @returns {Promise}
     */
    async changeUsername(user, username) {
        if (typeof user != 'number') {
            return this.fetch(String(user)).then(user => user.changeUsername(username));
        }

        return RequestHandler.post("/moderator/change_username", {
            u_id: user,
            username
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {number|string} u_name username
     * @param {string} username new username
     * @returns {Promise}
     */
    changeUsernameAsAdmin(u_name, username) {
        return RequestHandler.post("/admin/change_username", {
            change_username_current: u_name,
            change_username_new: username
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {number|string} user ID or username
     * @param {string} email 
     * @returns {Promise}
     */
    async changeEmail(user, email) {
        if (typeof user != 'number') {
            return this.fetch(String(user)).then(user => user.changeEmail(email));
        }

        return RequestHandler.post("/moderator/change_email", {
            u_id: user,
            email
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {string} username 
     * @param {string} email 
     * @returns {Promise}
     */
    changeEmailAsAdmin(username, email) {
        return RequestHandler.post("/admin/change_user_email", {
            username,
            email
        }, true);
    }

    /**
     * 
     * @param {number|string} user ID or username
     * @returns {Promise}
     */
    async toggleOA(user) {
        if (typeof user != 'number') {
            return this.fetch(String(user)).then(user => user.toggleOA());
        }

        return RequestHandler.post("/moderator/toggle_official_author/" + user, true);
    }

    /**
     * 
     * @param {string} user 
     * @returns {Promise}
     */
    toggleClassicUserAsAdmin(user) {
        return RequestHandler.post("/admin/toggle_classic_user/", {
            toggle_classic_uname: user
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {string} username 
     * @param {number|string} coins 
     * @returns {Promise}
     */
    addWonCoins(username, coins) {
        return RequestHandler.post("/moderator/change_username", {
            coins_username: username,
            num_coins: coins
        }, true);
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {string} username
     * @param {number|string} days
     * @param {number|string|boolean} remove
     * @returns {Promise}
     */
    addPlusDays(username, days, remove = false) {
        return RequestHandler.post("/admin/add_plus_days", {
            add_plus_days: days,
            username: username,
            add_plus_remove: remove
        }, true);
    }

    /**
     * 
     * @param {string} username
     * @returns {Promise}
     */
    messagingBan(username) {
        if (typeof username == 'number') {
            username = this.cache.get(username).username;
        }

        return RequestHandler.post("/admin/user_ban_messaging", {
            messaging_ban_uname: username
        }, true);
    }

    /**
     * 
     * @param {string} username
     * @returns {Promise}
     */
    uploadingBan(username) {
        if (typeof username == 'number') {
            username = this.cache.get(username).username;
        }

        return RequestHandler.post("/admin/user_ban_uploading", {
            uploading_ban_uname: username
        }, true);
    }

    /**
     * 
     * @param {number|string} user ID or username
     * @returns {Promise}
     */
    async ban(user) {
        if (typeof user != 'number') {
            return this.fetch(String(user)).then(user => user.ban());
        }

        return RequestHandler.post("/moderator/ban_user", {
            u_id: parseInt(user)
        }, true);
    }

     /**
     * 
     * @param {number|string} user 
     * @param {number|string} time 
     * @param {Boolean} deleteRaces
     * @returns {Promise} 
     */
    banAsAdmin(user, time = 0, deleteRaces = !1) {
        return RequestHandler.post("/admin/ban_user", {
            ban_secs: time,
            delete_race_stats: deleteRaces,
            username: user
        }, true);
    }

    /**
     * 
     * @param {string} username 
     * @returns {Promise} 
     */
    deactivate(user) {
        if (typeof username == 'number') {
            username = this.cache.get(username).username;
        }

        return RequestHandler.post("/admin/deactivate_user", {
            username: String(user)
        }, true);
    }

    /**
     * 
     * @param {string} username 
     * @returns {Promise}
     */
    delete(user) {
        if (typeof username == 'number') {
            username = this.cache.get(username).username;
        }

        return RequestHandler.post("/admin/delete_user_account", {
            username: String(user)
        }, true);
    }
}