import https from "https";

import User from "../structures/User.js";
import Track from "../structures/Track.js";
import Notification from "../structures/Notification.js";
import Cosmetic from "../structures/Cosmetic.js";

import { token } from "../client/Client.js";

export default class {
    static ajax(option, options = typeof option === "string" ? { path: option } : option) {
        const {
            host,
            method = "GET",
            path,
            headers = {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body = {}
        } = options;
        
        return new Promise((resolve, reject) => {
            try {
                const req = https.request({
                    hostname: host || "www.freeriderhd.com",
                    path,
                    method,
                    headers
                }, res => {
                    let data = "";
                    res.on("data", d => {
                        data += d;
                    });
                    res.on("end", () => {
                        try {
                            data = JSON.parse(data);
                        } catch(e) {}

                        resolve(data);
                    });
                });
                req.write(headers["content-type"] == "application/json" ? JSON.stringify(body) : new URLSearchParams(body).toString());
                req.end();
            } catch(e) {
                return reject(e);
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