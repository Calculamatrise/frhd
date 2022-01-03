import RequestHandler from "../utils/RequestHandler.js";

import { token } from "../client/Client.js";

export default class Comment {
    id = null;
    message = null;
    author = null;
    timeAgo = null;
    static async create(data) {
        if (typeof data !== "object") {
            throw new Error("INVALID_DATA_TYPE");
        }

        const comment = new Comment();

        await comment.init(data);

        return comment;
    }
    
    init({
        comment,
        user,
        track
    }) {
        this.id = comment.id;
        this.message = comment.msg;
        this.timeAgo = comment.time;
        this.author = {
            username: user.u_name,
            displayName: user.d_name,
            avatar: user.img_url_small
        }

        if (track !== void 0) {
            this.trackId = track.id;
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