import EventEmitter from "events";
import https from "https";

export default class extends EventEmitter {
    constructor() {
        super();
        this.token = null;
        this.activity_time_ago = null;
    }
    static async ajax({ host, method = "GET", path, headers = { "content-type": "application/json" }, body }, callback = t => t) {
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
                    callback(JSON.parse(data));
                    resolve(JSON.parse(data));
                });
            });
            body && req.write(headers["content-type"] == "application/json" ? JSON.stringify(body) : new URLSearchParams(body).toString());
            req.end();
        });
    }
    listen() {
        this.datapoll(t => {
            if (t.notification_count > 0) {
                this.getNotifications(e => {
                    const notifications = e.notification_days[0].notifications.sort((t, e) => e.ts - t.ts);
                    for (const notification in notifications) {
                        if (notification >= t.notification_count) return;
                        this.handle(notifications[notification]);
                    }
                });
            }
        });
        setTimeout(() => this.listen(), 3000);
    }
    async handle(notification) {
        if (notification.t_uname_mention) {
            this.emit("commentMention", {
                track: notification.track,
                user: notification.user,
                comment: await this.getComment(notification.track.id, notification.comment.id).then(t => t.comment),
                time: notification.time,
                timestamp: notification.ts
            });
        } else if (notification.track_lb_passed) {
            this.emit("raceBeaten", {
                track: notification.track,
                user: notification.user,
                time: notification.time,
                timestamp: notification.ts
            });
        } else if (notification.friend_t_challenge) {
            this.emit("challenge", {
                track: notification.track,
                user: notification.user,
                message: notification.msg,
                time: notification.time,
                timestamp: notification.ts
            });
        } else if (notification.friend_req_rcvd) {
            this.emit("friendRequestReceived", {
                user: notification.user,
                me: notification.to_user,
                time: notification.time,
                timestamp: notification.ts
            });
        } else if (notification.friend_req_accptd) {
            this.emit("friendRequestAccepted", {
                user: notification.user,
                time: notification.time,
                timestamp: notification.ts
            });
        }
    }
    login(token) {
        if (!token || typeof token !== "string") throw new Error("INVALID_TOKEN");
        this.token = token;
        this.emit("ready");
        this.listen();
        return this;
    }
    logout() {
        this.token = null;
        this.user = null;
        return this;
    }
    async defaultLogin(username, password, callback = t => t) {
        return await this.constructor.ajax({
            path: `/auth/standard_login`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                login: username,
                password,
                ajax: true,
                t_1: "ref",
                t_2: "desk"
            },
            method: "post"
        }, callback).then(t => {
            this.user = t.data.user;
            this.token = t.app_signed_request;
            return t;
        });
    }
    async verifyLogin(callback = t => t) {
        if (!this.token) return console.error('You are not logged in');
        return await this.constructor.ajax({
            path: `/?ajax=!0&app_signed_request=${this.token}`,
            method: "get"
        }, callback);
    }
    async getUser(u, callback = t => t) {
        return await this.constructor.ajax({
            path: `/u/${u}?ajax=!0`,
            method: "get"
        }, callback);
    }
    async getMyUser(callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.verifyLogin().then(t => this.getUser(this.user.u_name, callback));
    }
    async getTrack(t, callback = t => t) {
        return await this.constructor.ajax({
            path: `/t/${t}?ajax=!0`,
            method: "get"
        }, callback);
    }
    async getNotifications(callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/notifications?ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`,
            method: "get"
        }, callback);
    }
    async getComment(trackId, commentId, callback = t => t) {
        return await this.getTrack(trackId).then(t => {
            for (const e of t.track_comments) {
                if (e.comment.id == commentId) {
                    callback(e);
                    return e;
                }
            }
        });
    }
    async datapoll(callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/datapoll/poll_request`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                notifications: true,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async changeName(t, callback = t => t) {
        if (!t) return callback("False arguments");
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/account/edit_profile`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                name: "u_name",
                value: encodeURIComponent(t.replace(/[^A-Z0-9]/ig, "")),
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async changeDesc(t, callback = t => t) {
        if (!t) return callback("False arguments");
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/account/edit_profile`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                name: "about",
                value: encodeURIComponent(t.replace("%20", "+")),
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async changePassword(t, e, callback = t => t) {
        if (!t || !e) return callback('False arguments');
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/account/change_password`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                old_password: encodeURIComponent(t).replace("%20", "+"),
                new_password: encodeURIComponent(e.replace("%20", "+")),
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async changeForumsPassword(p, callback = t => t) {
        if (!p) return callback('False arguments');
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/account/update_forum_account`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                password: encodeURIComponent(t.replace("%20", "+")),
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async buyHead(callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/store/buy`,
            method: "post"
        }, callback);
    }
    async equipHead(t, callback = t => t) {
        if (!t) return callback('False arguments');
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/store/equip`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                item_id: t,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async addFriend(t, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/friends/send_friend_request`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                u_name: t,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async removeFriend(t, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/friends/remove_friend`,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                u_id: t,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async acceptFriend(i, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/friends/respond_to_friend_request",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                u_name: t,
                action: "accept",
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async challenge(t, e, i, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/challenge/send",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                "users%5B%5D": t.join("&users%5B%5D="),
                msg: e,
                track_slug: i,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async comment(t, e, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/track_comments/post",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                t_id: t,
                msg: encodeURIComponent(e).replace("%20", "+"),
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async vote(t, e, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/track_api/vote",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                t_id: t,
                vote: e,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async subscribe(t, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/friends/send_friend_request",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                sub_uid: t,
                subscribe: 1,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async hideTrack(t, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/moderator/hide_track/" + t,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                ajax: true,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async removeRace(t, e, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/moderator/remove_race",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                t_id: t,
                u_id: e || this.user.u_id,
                ajax: true,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async toggleOA(t, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/moderator/toggle_official_author/" + t,
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                ajax: true,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async addDailyTrack(track, lives, refill_cost, gems, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/moderator/add_track_of_the_day",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                t_id: track,
                lives,
                rfll_cst: refill_cost,
                gems,
                ajax: true,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async banUser(t, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/moderator/ban_user",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                u_id: t,
                ajax: true,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async changeUsername(t, e, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/moderator/change_username",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                u_id: t,
                username: e,
                ajax: true,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async changeEmail(t, e, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/moderator/change_email",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                u_id: t,
                email: e,
                ajax: true,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async redeemCoupon(t, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/store/redeemCouponCode",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                coupon_code: t,
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
    async signup(t, e, i, callback = t => t) {
        return await this.constructor.ajax({
            path: "/auth/standard_signup",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                username: encodeURIComponent(t),
                email: encodeURIComponent(e).replace("%20", "+"),
                password: encodeURIComponent(i).replace("%20", "+"),
                recaptcha: "03AGdBq252AkaYfc0P6E9u_GQq4aruILoiMcMMMZgxXfGKa-Y2nASs5BEjB-df6V6fSyYuBG8xs4nlcwb5ASfsJL98W1Pq2HUXyR5QyFT-FgZ8ljubncpwK92q5XKnaXWthEfbA0EvH1qV2Rh4a6WQSpoo01kgteHf5C3dvK6c8rhM1nZThunHUNAgld1_AljlDS7cYXGsPSAdLXOFcMwz_TtcliBTei_f3TiQTasfNIFWfrgdWCyWSARj5LGbrciLS_-65cgoMbuh9rSLqOAduwn_RCcVoteCX6RlfVT3DPsVr1v7uJseYuTvgrVGpsrrrBx87O3pO_n0zGnRZpYU65qfx8Z7hjVvrohuvJgmDE7qtDsshmsmwo-OiJ0yc5WwRV2m63XrC9I-1JA8ZjAGg5xhPhh0NkCAQrMKSkUrkdgPg2VpEc9ZJZalUOdex8GpzDQ23gwqmh_gknLC2dhr8C5QpFCLfIl8eA",
                app_signed_request: this.token
            },
            method: "post"
        }, callback).then(t => {
            this.user = t.data.user;
            this.token = t.app_signed_request;
            return t;
        });
    }
    async publish(t, e, i, s, n, o, callback = t => t) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: "/create/submit",
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: {
                name: encodeURIComponent(t).replace('%20', '+'),
                desc: encodeURIComponent(e).replace('%20', '+'),
                default_vehicle: i,
                "allowed_vehicles%5BMTB%5D": s,
                "allowed_vehicles%5BBMX%5D": n,
                code: encodeURIComponent(c).replace('%20', '+'),
                app_signed_request: this.token
            },
            method: "post"
        }, callback);
    }
}