import BaseManager from "./BaseManager.js";

export default class extends BaseManager {
    /**
     * 
     * @async
     * @param {String} username
     * @returns {Response}
     */
    async fetch(username) {
        const data = await this.client.api.users(username);
        this.cache.set(username, data);
        return data;
    }

    /**
     * 
     * @async
     * @param {Number|String} user ID or username
     * @returns {Promise}
     */
    async subscribe(user) {
        isNaN(parseInt(user)) && (user = await this.fetch(user).then(user => user.id));

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
        });
    }

    /**
     * 
     * @async
     * @param {Number|String} user ID or username
     * @returns {Promise}
     */
    async unsubscribe(user) {
        isNaN(parseInt(user)) && (user = await this.fetch(user).then(user => user.id));

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
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number|String} user ID or username
     * @param {String} username new username
     * @returns {Promise}
     */
    async changeUsername(user, username) {
        isNaN(parseInt(user)) && (user = await this.fetch(user).then(user => user.id));

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
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number|String} u_name username
     * @param {String} username new username
     * @returns {Promise}
     */
    changeUsernameAsAdmin(u_name, username) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/change_username",
            body: {
                change_username_current: u_name,
                change_username_new: username,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number|String} user ID or username
     * @param {String} email 
     * @returns {Promise}
     */
    async changeEmail(user, email) {
        isNaN(parseInt(user)) && (user = await this.fetch(user).then(user => user.id));

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
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {String} username 
     * @param {String} email 
     * @returns {Promise}
     */
    changeEmailAsAdmin(username, email) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/change_user_email",
            body: {
                username,
                email,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @param {Number|String} user ID or username
     * @returns {Promise}
     */
    async toggleOA(user) {
        isNaN(parseInt(user)) && (user = await this.fetch(user).then(user => user.id));

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
        });
    }

    /**
     * 
     * @param {String} user 
     * @returns {Promise}
     */
     async toggleClassicUserAsAdmin(user) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/toggle_classic_user/",
            body: {
                toggle_classic_uname: user,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {String} username 
     * @param {Number|String} coins 
     * @returns {Promise}
     */
    async addWonCoins(username, coins) {
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
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {String} username 
     * @param {Number|String} coins 
     * @returns {Promise}
     */
    async addPlusDays(username, days, remove) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/add_plus_days",
            body: {
                add_plus_days: days,
                username: username,
                add_plus_remove: remove,
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
    messagingBan(username) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (typeof username !== "string")
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/admin/user_ban_messaging",
            body: {
                messaging_ban_uname: username.toLocaleLowerCase(),
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
    uploadingBan(username) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (typeof username !== "string")
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/admin/user_ban_uploading",
            body: {
                uploading_ban_uname: username.toLocaleLowerCase(),
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @param {Number|String} user ID or username
     * @returns {Promise}
     */
    async ban(user) {
        isNaN(parseInt(user)) && (user = await this.fetch(user).then(user => user.id));

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/ban_user",
            body: {
                u_id: parseInt(user),
                app_signed_request: token
            },
            method: "post"
        });
    }

     /**
     * 
     * @param {Number|String} user 
     * @param {Number|String} time 
     * @param {Boolean} deleteRaces
     * @returns {Promise} 
     */
    banAsAdmin(user, time = 0, deleteRaces = !1) {
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
        });
    }

    /**
     * 
     * @param {String} username 
     * @returns {Promise} 
     */
    deactivate(username) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/deactivate_user",
            body: {
                username,
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
    delete(username) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/delete_user_account",
            body: {
                username,
                app_signed_request: token
            },
            method: "post"
        });
    }
}