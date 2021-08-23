import RequestHandler from "../utils/RequestHandler.js";

import { token } from "../client/Client.js";

export default class {
    constructor(data) {
        if (!data || typeof data !== "object")
            throw new Error("INVALID_DATA_TYPE");

        this.id = null,
        this.message = null,
        this.timeAgo = null,
        this.author = null;
        
        this.init(data);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "comment":
                    this.id = data[t].id,
                    this.message = data[t].msg,
                    this.timeAgo = data[t].time;
                break;

                case "user":
                    this.author = {
                        username: data[t].u_name,
                        displayName: data[t].d_name,
                        avatar: data[t].img_url_small
                    }
                break;

                case "track":
                    this.trackId = parseInt(data[t].id);
                break;
            }
        }
    }
    async reply(message) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!message)
            throw new Error("INVALID_MESSAGE");

        return RequestHandler.ajax({
            path: "/track_comments/post",
            body: {
                t_id: this.trackId,
                msg: `@${this.author.displayName}, ${message.toString().replace(/\s+/g, "+")}`,
                app_signed_request: token
            },
            method: "post"
        }).then(function(response) {
            if (response.result)
                return new this.constructor(response.data.track_comments[0]);

            return new Error(response.msg);
        });
    }
    delete({ timeout = 0 } = {}) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (isNaN(timeout))
            throw new Error("INVALID_TIMEOUT");

        setTimeout(() => {
            RequestHandler.ajax(`/track_comments/delete/${this.trackId}/${this.id}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`);
        }, timeout);

        return true;
    }
}