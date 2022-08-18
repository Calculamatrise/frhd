import http from "http";
import https from "https";
import { readFileSync } from "fs";

import User from "../structures/User.js";
import Track from "../structures/Track.js";
import Notification from "../structures/Notification.js";
import Cosmetic from "../structures/Cosmetic.js";

import { token } from "../client/Client.js";

export default class RequestHandler {
    /**
     * 
     * @param {String} option URI or options object
     * @param {Object} options Options
     * @returns {Promise}
     */
    static ajax(option, options = typeof option === "object" ? option : {}) {
        let host = options.hostname || options.host || 'www.freeriderhd.com';
        let path = options.pathname || options.path || option || '';
        if (path.match(/^\.?\/?/) && host === "local") {
            const body = readFileSync(path);
            if (headers["content-type"].startsWith("image/png")) {
                if (headers["content-type"].includes("base64")) {
                    return "data:image/png; base64, " + body.toString("base64");
                }

                return body;
            }

            try {
                return JSON.parse(body);
            } catch {}
            return body.toString("utf8");
        }

        let url = new URL(options.url || `https://${host}${path}`);
        url.searchParams.set("ajax", true);
        url.searchParams.set("t_1", "ref");
        url.searchParams.set("t_2", "desk");
        if (token !== null) {
            url.searchParams.set("app_signed_request", token);
        }

        let request = new Request(url, { ...options, headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...options.headers
        }});

        let contentType = request.headers.get("Content-Type");
        return new Promise((resolve, reject) => {
            (/^https:$/i.test(url.protocol) ? https : http).request({
                host: url.hostname,
                path: url.pathname + url.search,
                method: request.method,
                headers: Object.fromEntries(request.headers.entries())
            }, async function(res) {
                const buffers = [];
                for await (const chunk of res) {
                    buffers.push(chunk);
                }

                let data = Buffer.concat(buffers);
                if (contentType.startsWith("image/png")) {
                    if (contentType.includes("base64")) {
                        data = 'data:image/png; base64, ' + data.toString("base64");
                    }

                    return void resolve(data);
                }

                res.once("error", reject);
                try {
                    return void resolve(JSON.parse(data));
                } catch {}
                resolve(data.toString("utf8"));
            }).end(contentType == "application/json" ? JSON.stringify(options.body) : (new URLSearchParams(options.body) || url.searchParams).toString());
        });
    }

    /**
     * 
     * @param {Number} id 
     * @returns {Promise}
     */
    cosmetics(id) {
        return this.constructor.ajax(`/store/gear`).then(function(response) {
            if (response.app_title.match(/Page\s+Not\s+Found/gi))
                throw new Error("COSMETIC_NOT_FOUND");
            
            return {
                heads: response.gear.head_gear.filter(function(head, index) {
                    if (id) {
                        if (typeof id === "object") {
                            if (Array.isArray(id)) {
                                return id.includes(head.id);
                            }

                            const { limit } = id;
                            if (limit) {
                                return index < limit;
                            }
                        }

                        return head.id == id;
                    }

                    return true;
                }).map(function(head) {
                    return new Cosmetic(head);
                })
            }
        });
    }

    /**
     * 
     * @returns {Promise}
     */
    datapoll() {
        return this.constructor.ajax({
            path: "/datapoll/poll_request",
            body: {
                notifications: !0,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @param {Number} count 
     * @returns {Promise}
     */
    notifications(count = Infinity) {
        return this.constructor.ajax(`/notifications`).then(function({ notification_days }) {
            if (notification_days && notification_days.length > 0) {
                return notification_days[0].notifications.slice(0, count).map(function(notification) {
                    return new Notification(notification)
                }).sort((t, e) => e.ts - t.ts);
            }
        });
    }

    /**
     * 
     * @param {Number|String} id
     * @param {Array} fields 
     * @param {String} fields[code] 
     * @returns {Promise}
     */
    tracks(id, fields) {
        if (fields !== void 0) {
            return this.constructor.ajax(`/track_api/load_track?id=${parseInt(id)}&fields[]=${fields.join("&fields[]=")}`).then(function(response) {
                if (response.result === false)
                    throw new Error("TRACK_NOT_FOUND");
                
                return Track.create(response.data);
            });
        }

        return this.constructor.ajax(`/t/${parseInt(id)}`).then(function(response) {
            if (response.app_title.match(/Page\s+Not\s+Found/gi))
                throw new Error("TRACK_NOT_FOUND");
            
            return Track.create({
                ...response.track,
                campagin: response.campagin,
                track_comments: response.track_comments,
                track_stats: response.track_stats
            });
        });
    }

    /**
     * 
     * @param {String} username 
     * @returns {Promise}
     */
    users(username) {
        return this.constructor.ajax(`/u/${username}`).then(function(response) {
            if (response.app_title.match(/Page\s+Not\s+Found/gi))
                throw new Error("USER_NOT_FOUND");

            return User.create(response);
        });
    }
}