import RequestHandler from "../utils/RequestHandler.js";

import UserManager from "../managers/UserManager.js";
import TrackManager from "../managers/TrackManager.js";
import NotificationManager from "../managers/NotificationManager.js";

export let token = null;

export default class {
    constructor() {
        this.user = null;
        this.users = new UserManager(this);
        this.tracks = new TrackManager(this);
        this.notifications = new NotificationManager(this);
    }
    #api = new RequestHandler();
    #events = new Map();
    get api() {
        return this.#api;
    }
    on(event, func = function() {}) {
        if (event === void 0 || typeof event !== "string")
            throw new Error("INVALID_EVENT");

        this.#events.set(event, func.bind(this));
        return this;
    }
    emit(event, ...args) {
        if (event === void 0 || typeof event !== "string")
            throw new Error("INVALID_EVENT_ID");

        event = this.#events.get(event);
        if (event === void 0 && typeof event !== "function")
            throw new Error("INVALID_FUNCTION");
            
        return event(...args);
    }
    async datapoll(callback = response => response) {
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
    #handle(notification) {
        if (!notification.id)
            return console.warn(new Error("UNKNOWN_NOTIFICATION_ID"));
            
        this.emit(notification.id, notification);
    }
    async login(asr) {
        if (!asr || typeof asr !== "string")
            throw new Error("INVALID_TOKEN");

        token = asr;

        const response = await RequestHandler.ajax(`/?ajax=true&app_signed_request=${token}`);
        if (!response.user)
            throw new Error("INVALID_TOKEN");

        this.user = await this.users.fetch(response.user.d_name);
        this.emit("ready");
        this.#listen();
        return this;
    }
    async defaultLogin(username, password) {
        return RequestHandler.ajax({
            path: "/auth/standard_login",
            body: {
                login: username,
                password,
                ajax: true,
                t_1: "ref",
                t_2: "desk"
            },
            method: "post"
        }).then(function(response) {
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
        if (isNaN(user))
            await this.getUser(user).then(t => (user = t.id));

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
        if (isNaN(user))
            await this.getUser(user).then(t => (user = t.id));

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
        if (isNaN(user))
            await this.getUser(user).then(t => (user = t.id));

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
    async removeRace(trackId, user, callback = response => response) {
        if (isNaN(user))
            await this.getUser(user).then(t => (user = t.id));

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/remove_race",
            body: {
                t_id: trackId,
                u_id: user || this.user.id,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }
    async addDailyTrack(trackId, lives, refillCost, gems, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/moderator/add_track_of_the_day",
            body: {
                t_id: trackId,
                lives,
                rfll_cst: refillCost,
                gems,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }
    async hideTrack(trackId, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: `/moderator/hide_track/${trackId}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`,
            method: "get"
        }).then(callback);
    }
    async deepClean({ users, startingTrackId = 1001, endingTrackId = 836350 }, callback = response => response) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        for (let t_id = startingTrackId; t_id <= endingTrackId; t_id++) {
            await this.getTrack(t_id).then(t => {
                for (const u_id of users) {
                    t.removeRace(u_id);
                }
                return t;
            }).then(t => callback(t.id));
        }
    }
    async setUsername(user, username, callback = response => response) {
        if (isNaN(user))
            await this.getUser(user).then(t => (user = t.id));

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/change_username",
            body: {
                u_id: user,
                username,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }
    async setEmail(user, email, callback = response => response) {
        if (isNaN(user))
            await this.getUser(user).then(t => (user = t.id));

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/change_email",
            body: {
                u_id: user,
                email,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }
    async toggleOA(user, callback = response => response) {
        if (isNaN(user))
            await this.getUser(user).then(t => (user = t.id));

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/toggle_official_author/" + user,
            body: {
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }
    async banUser(user, callback = response => response) {
        if (isNaN(user))
            await this.getUser(user).then(t => (user = t.id));

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/ban_user",
            body: {
                u_id: user,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(callback);
    }
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
    logout() {
        this.user = null;
        token = null;
        return this;
    }
}