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
     * @returns 
     */
    static ajax(option, options = typeof option === "object" ? option : {}) {
        const {
            host = option.replace(/(?:^(.+)?:\/\/|(\.?\/.+)|(?!.*\/).*)/gi, ""),
            method = "GET",
            path = option.replace(/^((.+)?:\/\/)?/gi, "").replace(/^[^\/]+([^\/]+)\//gi, "/"),
            headers = {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body = {}
        } = options;  

        if (path.match(/^\.?\/?/) && !host) {
            const body = readFileSync(path);

            if (headers["content-type"].startsWith("image/png")) {
                if (headers["content-type"].includes("base64")) {
                    return "data:image/png; base64, " + body.toString("base64");
                }

                return body;
            }
            
            try {
                return JSON.parse(body);
            } catch(e) {}

            return body.toString("utf8");
        }
        
        return new Promise((resolve, reject) => {
            try {
                const req = https.request({
                    hostname: host || "www.freeriderhd.com",
                    path,
                    method,
                    headers
                }, res => {
                    let data = [];

                    res.on("data", function(buffer) {
                        data.push(buffer);
                    });
                    res.on("end", function() {
                        data = Buffer.concat(data);

                        if (headers["content-type"].startsWith("image/png")) {
                            if (headers["content-type"].includes("base64")) {
                                data = "data:image/png; base64, " + data.toString("base64");
                            }

                            return resolve(data);
                        }

                        try {
                            data = JSON.parse(data);
                        } catch(e) {
                            data = data.toString("utf8");
                        }

                        resolve(data);
                    });
                });
                req.write(headers["content-type"] === "application/json" ? JSON.stringify(body) : new URLSearchParams(body).toString());
                req.end();
            } catch(error) {
                return reject(error);
            }
        });
    }
    users(username) {
        return this.constructor.ajax(`/u/${username}?ajax=true`).then(function(response) {
            if (response.app_title.match(/Page\s+Not\s+Found/gi))
                throw new Error("USER_NOT_FOUND");

            return User.create(response);
        });
    }
    tracks(id) {
        return this.constructor.ajax(`/t/${parseInt(id)}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then(function(response) {
            if (response.app_title.match(/Page\s+Not\s+Found/gi))
                throw new Error("TRACK_NOT_FOUND");
            
            return Track.create(response);
        });
    }
    notifications(count = Infinity) {
        return this.constructor.ajax(`/notifications?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then(function(response) {
            if (response.notification_days && response.notification_days[0]) {
                return response.notification_days[0].notifications.slice(0, count).map(function(notification) {
                    return new Notification(notification)
                });
            }
        });
    }
    cosmetics(id) {
        return this.constructor.ajax(`/store/gear?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then(function(response) {
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
}