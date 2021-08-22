import https from "https";

import User from "../structures/User.js";
import Track from "../structures/Track.js";

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
                    res.on("end", () => resolve(this.#parse(data)));
                });
                req.write(headers["content-type"] == "application/json" ? JSON.stringify(body) : new URLSearchParams(body).toString());
                req.end();
            } catch(e) {
                return reject(e);
            }
        });
    }
    static #parse(string) {
        try {
            return JSON.parse(string);
        } catch(e) {
            return string;
        }
    }
    users(username) {
        return this.constructor.ajax(`/u/${username}?ajax=true`).then(function(response) {
            if (response.app_title.match(/Page\s+Not\s+Found/gi))
                throw new Error("USER_NOT_FOUND");

            return new User(response);
        });
    }
    tracks(id) {
        return this.constructor.ajax(`/t/${parseInt(id)}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then(function(response) {
            if (response.app_title.match(/Page\s+Not\s+Found/gi))
                throw new Error("TRACK_NOT_FOUND");
            
            return new Track(response);
        });
    }
}