import https from "https";

export default class {
    constructor() {
        this.token = null;
        this.activity_time_ago = null;
    }
    static async ajax({ host, method, path, headers = { "content-type": "application/json" }, body }, callback = () => {}) {
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
    login(token) {
        this.token = token;
        return this;
    }
    logout() {
        this.token = null;
        this.user = null;
        return this;
    }
    async defaultLogin(username, password, callback = () => {}) {
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
    async verifyLogin(callback = () => {}) {
        if (!this.token) return console.error('You are not logged in');
        return await this.constructor.ajax({
            path: `/?ajax=!0&app_signed_request=${this.token}`,
            method: "get"
        }, callback);
    }
    async getUser(u, callback = () => {}) {
        return await this.constructor.ajax({
            path: `/u/${u}?ajax=!0`,
            method: "get"
        }, callback);
    }
    async getMyUser(callback = () => {}) {
        if (!this.token) return callback('You are not logged in');
        return await this.verifyLogin().then(t => this.getUser(this.user.u_name, callback));
    }
    async getTrack(t, callback = () => {}) {
        return await this.constructor.ajax({
            path: `/t/${t}?ajax=!0`,
            method: "get"
        }, callback);
    }
    async getNotifications(callback = () => {}) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/notifications?ajax=true&app_signed_request=${this.token}&t_1=ref&t_2=desk`,
            method: "get"
        }, callback);
    }
    async getComment(t, c, callback = () => {}) {
        return await this.getTrack(t).then(t => {
            for (const e of t.track_comments) {
                if (e.comment.id == c) {
                    callback(e);
                    return e;
                }
            }
        });
    }
    async datapoll(callback = () => {}) {
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
    async changeName(t, callback = () => {}) {
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
    async changeDesc(t, callback = () => {}) {
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
    async changePassword(t, e, callback = () => {}) {
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
    async changeForumsPassword(p, callback = () => {}) {
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
    async buyHead(callback = () => {}) {
        if (!this.token) return callback('You are not logged in');
        return await this.constructor.ajax({
            path: `/store/buy`,
            method: "post"
        }, callback);
    }
    async equipHead(t, callback = () => {}) {
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
    async addFriend(t, callback = () => {}) {
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
    async removeFriend(t, callback = () => {}) {
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
    async acceptFriend(i, callback = () => {}) {
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
    async challenge(t, e, i, callback = () => {}) {
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
    async comment(t, e, callback = () => {}) {
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
    async vote(t, e, callback = () => {}) {
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
    async subscribe(t, callback = () => {}) {
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
    async hideTrack(t, callback = () => {}) {
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
    async removeRace(t, e, callback = () => {}) {
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
    async toggleOA(t, callback = () => {}) {
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
    async addDailyTrack(track, lives, refill_cost, gems, callback = () => {}) {
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
    async banUser(t, callback = () => {}) {
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
    async changeUsername(t, e, callback = () => {}) {
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
    async changeEmail(t, e, callback = () => {}) {
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
    async redeemCoupon(t, callback = () => {}) {
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
    async signup(t, e, i, callback = () => {}) {
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
    async publish(t, e, i, s, n, o, callback = () => {}) {
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