import EventEmitter from "events";
import https from "https";

import User from "./user.js";
import Track from "./track.js";
import Comment from "./comment.js";
import Notification from "./notification.js";
import Response from "./response.js";

export let token = null;

export default class extends EventEmitter {
    constructor() {
        super();
        this.user = null;
    }
    static async ajax({ host, method = "GET", path, headers = { "content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body }, callback = t => t) {
        return await new Promise(function(resolve, reject) {
            const req = https.request({
                hostname: host || "www.freeriderhd.com",
                path: path,
                method,
                headers
            }, res => {
                let data = "";
                res.on("data", d => {
                    data += d;
                });
                res.on("end", () => {
                    callback(parsable(data) ? JSON.parse(data) : data);
                    resolve(parsable(data) ? JSON.parse(data) : data);
                });
            });
            body && req.write(headers["content-type"] == "application/json" ? JSON.stringify(body) : new URLSearchParams(body).toString());
            req.end();
        });
    }
    listen() {
        if (!token) return new Error("INVALID_TOKEN");
        this.datapoll(t => {
            if (t.notification_count > 0) {
                this.getNotifications(e => {
                    const notifications = e.sort((t, e) => e.ts - t.ts);
                    for (const notification in notifications) {
                        if (notification >= t.notification_count) return;
                        this.handle(notifications[notification]);
                    }
                });
            }
        });
        setTimeout(() => this.listen(), 3000);
    }
    handle(notification) {
        if (!notification.id) return console.warn(new Error("UNKNOWN_NOTIFICATION_ID"));
        this.emit(notification.id, notification);
    }
    async login(appSignedRequest) {
        if (!appSignedRequest || typeof appSignedRequest !== "string") throw new Error("INVALID_TOKEN");
        token = appSignedRequest;
        this.user = await this.getMyUser();
        this.emit("ready");
        this.listen();
        return this;
    }
    async signup(username, email, password, recaptcha, callback = t => t) {
        return await this.constructor.ajax({
            path: "/auth/standard_signup",
            body: {
                username: encodeURIComponent(username),
                email: encodeURIComponent(email).replace("%20", "+"),
                password: encodeURIComponent(password).replace("%20", "+"),
                recaptcha,
                app_signed_request: token
            },
            method: "post"
        }).then(async t => await this.login(t.app_signed_request)).then(callback);
    }
    async defaultLogin(username, password, callback = t => t) {
        return await this.constructor.ajax({
            path: "/auth/standard_login",
            body: {
                login: username,
                password,
                ajax: true,
                t_1: "ref",
                t_2: "desk"
            },
            method: "post"
        }, callback).then(async t => await this.login(t.app_signed_request));
    }
    async verifyLogin(callback = t => t) {
        if (!token) return console.error(new Error("You are not logged in"));
        return await this.constructor.ajax({
            path: `/?ajax=true&app_signed_request=${token}`,
            method: "get"
        }, callback);
    }
    async datapoll(callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: "/datapoll/poll_request",
            body: {
                notifications: true,
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async getUser(username, callback = t => t) {
        return await this.constructor.ajax({
            path: `/u/${username}?ajax=true`,
            method: "get"
        }).then(t => new User(t)).then(callback);
    }
    async getMyUser(callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.verifyLogin().then(t => this.getUser(t.user.d_name)).then(callback);
    }
    async getTrack(trackId, callback = t => t) {
        if (!trackId || isNaN(trackId)) throw new Error("INVALID_TRACK");
        return await this.constructor.ajax({
            path: `/t/${trackId}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`,
            method: "get"
        }).then(t => new Track(t, this.user.id)).then(callback);
    }
    async postTrack(title, description, defaultVehicle, MTBALlowed, BMXAllowed, code, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
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
        }).then(t => new Response(t)).then(callback);
    }
    async getNotifications(callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: `/notifications?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`,
            method: "get"
        }).then(t => t.notification_days && t.notification_days[0] && t.notification_days[0].notifications.map(t => new Notification(t))).then(callback);
    }
    async changeUsername(username, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (!username) throw new Error("INVALID_USERNAME");
        return await this.constructor.ajax({
            path: "/account/edit_profile",
            body: {
                name: "u_name",
                value: encodeURIComponent(username.replace(/[^A-Z0-9]/ig, "")),
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async changeDescription(description, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (!description) throw new Error("INVALID_DESCRIPTION");
        return await this.constructor.ajax({
            path: "/account/edit_profile",
            body: {
                name: "about",
                value: encodeURIComponent(description.replace(/\s+/g, "+")),
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async changePassword(oldPassword, newPassword, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (!oldPassword || !newPassword) throw new Error("INVALID_PASSWORD");
        return await this.constructor.ajax({
            path: "/account/change_password",
            body: {
                old_password: encodeURIComponent(oldPassword).replace("%20", "+"),
                new_password: encodeURIComponent(newPassword.replace("%20", "+")),
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async setForumPassword(password, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (!password) throw new Error("INVALID_PASSWORD");
        return await this.constructor.ajax({
            path: "/account/update_forum_account",
            body: {
                password: encodeURIComponent(password.replace("%20", "+")),
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async buyHead(callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: "/store/buy",
            method: "post"
        }, callback);
    }
    async setHead(itemId, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (!itemId) throw new Error("INVALID_COSMETIC");
        return await this.constructor.ajax({
            path: "/store/equip",
            body: {
                item_id: itemId,
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async addFriend(username, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: "/friends/send_friend_request",
            body: {
                u_name: username,
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async acceptFriend(username, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: "/friends/respond_to_friend_request",
            body: {
                u_name: username,
                action: "accept",
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t)).then(callback);
    }
    async removeFriend(user, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        if (!user) throw new Error("INVALID_USER");
        return await this.constructor.ajax({
            path: "/friends/remove_friend",
            body: {
                u_id: user,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t)).then(callback);
    }
    async subscribe(user, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        if (!user) throw new Error("INVALID_USER");
        return await this.constructor.ajax({
            path: "/track_api/subscribe",
            body: {
                sub_uid: user,
                subscribe: 1,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t)).then(callback);
    }
    async unsubscribe(user, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        return await this.constructor.ajax({
            path: "/track_api/subscribe",
            body: {
                sub_uid: user,
                subscribe: 0,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t)).then(callback);
    }
    async removeRace(trackId, user, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        if (!user) throw new Error("INVALID_USER");
        return await this.constructor.ajax({
            path: "/moderator/remove_race",
            body: {
                t_id: trackId,
                u_id: user || this.user.id,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t)).then(callback);
    }
    async addDailyTrack(trackId, lives, refillCost, gems, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
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
        }).then(t => new Response(t)).then(callback);
    }
    async hideTrack(trackId, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: `/moderator/hide_track/${trackId}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`,
            method: "get"
        }).then(t => new Response(t)).then(callback);
    }
    async deepClean({ users, startingTrackId = 1001, endingTrackId = 836350 }, callback = t => t) {
        for (let t_id = startingTrackId; t_id <= endingTrackId; t_id++) {
            await this.getTrack(t_id).then(t => {
                for (const u_id of users) {
                    t.removeRace(u_id);
                }
                return t;
            }).then(t => callback(t.id));
        }
    }
    async setUsername(user, username, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        if (!user) throw new Error("INVALID_USER");
        return await this.constructor.ajax({
            path: "/moderator/change_username",
            body: {
                u_id: user,
                username,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async setEmail(user, email, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        if (!user) throw new Error("INVALID_USER");
        return await this.constructor.ajax({
            path: "/moderator/change_email",
            body: {
                u_id: user,
                email,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async toggleOA(user, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        if (!user) throw new Error("INVALID_USER");
        return await this.constructor.ajax({
            path: "/moderator/toggle_official_author/" + user,
            body: {
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }).then(t => new Response(t)).then(callback);
    }
    async banUser(user, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        if (isNaN(user)) await this.getUser(user).then(t => (user = t.id));
        if (!user) throw new Error("INVALID_USER");
        return await this.constructor.ajax({
            path: "/moderator/ban_user",
            body: {
                u_id: user,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    async redeemCoupon(coupon, callback = t => t) {
        if (!token) throw new Error("INVALID_TOKEN");
        return await this.constructor.ajax({
            path: "/store/redeemCouponCode",
            body: {
                coupon_code: coupon,
                app_signed_request: token
            },
            method: "post"
        }, callback);
    }
    logout() {
        this.user = null;
        token = null;
        return this;
    }
}

function parsable(string) {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}