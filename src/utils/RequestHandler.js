import { readFileSync } from "fs";
import { request } from "https";
import { METHODS } from "http";

import { token } from "../client/BaseClient.js";
import Cosmetic from "../structures/Cosmetic.js";
import Notification from "../structures/Notification.js";
import Track from "../structures/Track.js";
import User from "../structures/User.js";

export default global.RequestHandler = new Proxy(class {
    /**
     * Make requests through HTTP
     * @param {string} option URI or options object
     * @param {object} options Options
     * @returns {Promise}
     */
    static ajax(option, options = typeof option == "object" ? option : {}) {
        let host = options.hostname || options.host || 'www.freeriderhd.com';
        let path = options.pathname || options.path || (typeof option != 'object' && option) || '';
        if (/^\.{1,2}\//.test(path)) {
            const body = readFileSync(path);
            if (headers['content-type'].startsWith('image/')) {
                if (headers['content-type'].includes('base64')) {
                    return `data:${headers['content-type']}; base64, ` + body.toString("base64");
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
        if (token != null && options.requireToken !== false) {
            url.searchParams.set("app_signed_request", token);
            delete options.requireToken;
        } else if (options.requireToken === true) {
            throw new Error("You aren't logged in!");
        }

        let req = new Request(url, options);
        if (!req.headers.has("Content-Type") || req.headers.get('Content-Type') == "text/plain;charset=UTF-8") {
            req.headers.set("Content-Type", "application/x-www-form-urlencoded");
        }

        let contentType = req.headers.get("Content-Type");
        return new Promise((resolve, reject) => {
            // resolve into a response?? new Response(data)
            // maybe even create own response class extends response
            request({
                host: url.hostname,
                path: url.pathname + url.search,
                method: req.method,
                headers: Object.fromEntries(req.headers.entries())
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
     * @param {number} id 
     * @returns {Promise}
     */
    cosmetics(id) {
        return this.constructor.ajax("/store/gear").then(function(res) {
            if (res.result === false || /page\s+not\s+found/i.test(res.app_title))
                throw new Error("COSMETIC_NOT_FOUND");

            return {
                heads: res.gear.head_gear.filter(function(head, index) {
                    if (id) {
                        if (typeof id == 'object') {
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
        return this.constructor.ajax("/datapoll/poll_request", {
            body: {
                notifications: true
            },
            method: "post",
            requireToken: true
        });
    }

    /**
     * 
     * @param {number} count 
     * @returns {Promise<Notification>}
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
     * @param {number|string} id
     * @param {Array} fields 
     * @param {string} fields[code] 
     * @returns {Promise<Track>}
     */
    tracks(id, fields) {
        if (fields !== void 0) {
            return this.constructor.ajax(`/track_api/load_track?id=${parseInt(id)}&fields[]=${fields.join("&fields[]=")}`).then(function(response) {
                if (response.result === false)
                    throw new Error("TRACK_NOT_FOUND");
                
                return Track.create(response.data);
            });
        }

        return this.constructor.ajax("/t/" + parseInt(id)).then(function(res) {
            if (res.result === false || /page\s+not\s+found/i.test(res.app_title))
                throw new Error("TRACK_NOT_FOUND");
            
            return Track.create(res);
        });
    }

    /**
     * 
     * @param {string} username 
     * @returns {Promise<User>}
     */
    users(username) {
        return this.constructor.ajax("/u/" + username).then(function(res) {
            if (res.result === false || /page\s+not\s+found/i.test(res.app_title))
                throw new Error("USER_NOT_FOUND");

            return User.create(res);
        });
    }
}, {
    get(target, property, receiver) {
        if (METHODS.indexOf(property.toUpperCase()) !== -1) {
            return function(url, body, requireToken = typeof body == 'boolean' ? body : false) {
                return receiver.ajax(String(url), {
                    body: typeof body == 'boolean' ? null : body,
                    method: property,
                    requireToken
                });
            }
        }

        return Reflect.get(...arguments);
    }
});