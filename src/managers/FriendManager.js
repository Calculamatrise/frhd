import { token } from "../client/Client.js";

import RequestHandler from "../utils/RequestHandler.js";
import getUser from "../getUser.js";

export default class extends Array {
    get(user) {
        if (typeof user == "string")
            return this.find(friend => friend.username === user) || null;

        if (isNaN(+(+user).toFixed()))
            throw new Error("INVALID_USER");

        return this.find(friend => +friend.id === +user) || null;
    }

    /**
     * 
     * @async
     * @param {Number|String} user
     * @returns {Object}
     */
    async fetch(user) {
        isNaN(+(+user).toFixed()) && (user = await getUser(user).then(user => user.id));

        user = this.get(user);

        if (user) {
            return getUser(user.username);
        }
    }
    
    /**
     * 
     * @param {String} username 
     * @returns {Promise}
     */
    async add(username) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/friends/send_friend_request",
            body: {
                u_name: username,
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
    async accept(username) {
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
        });
    }

    /**
     * 
     * @param {String} username 
     * @returns {Promise}
     */
    async reject(username) {
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
        });
    }

    /**
     * 
     * @param {Number|String} user 
     * @returns {Promise}
     */
    async remove(user) {
        isNaN(+(+user).toFixed()) && (user = await getUser(user).then(user => user.id));

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
        });
    }
}