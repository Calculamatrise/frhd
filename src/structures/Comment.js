import RequestHandler from "../utils/RequestHandler.js";

import { token } from "../client/Client.js";

export default class Comment {
    id = null;
    message = null;
    author = null;
    timeAgo = null;
    static create(data) {
        if (typeof data != "object") {
            throw new TypeError("INVALID_DATA_TYPE");
        }

        const comment = new Comment();
        comment.id = data.comment.id;
        comment.message = data.comment.msg;
        comment.timeAgo = data.comment.time;
        comment.author = {
            username: data.user.u_name,
            displayName: data.user.d_name,
            avatar: data.user.img_url_small
        }

        if (data.track !== void 0) {
            comment.trackId = data.track.id;
        }

        return comment;
    }

    async reply(data) {
        if (!token) throw new Error("INVALID_TOKEN");
        else if (!data) throw new Error("INVALID_MESSAGE");
        return RequestHandler.ajax({
            path: "/track_comments/post",
            body: {
                t_id: this.trackId,
                msg: `@${this.author.displayName}, ${(data.content || data).toString().replace(/\s+/g, "+")}`,
                app_signed_request: token
            },
            method: "post"
        }).then(function(response) {
            if (response.result)
                return new Comment(response.data.track_comments[0]);

            return new Error(response.msg);
        });
    }

    async delete({ timeout = 0 } = {}) {
        if (!token) throw new Error("INVALID_TOKEN");
        else if (isNaN(timeout)) throw new Error("INVALID_TIMEOUT");
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                RequestHandler.ajax(`/track_comments/delete/${this.trackId}/${this.id}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then(resolve).catch(reject);
            }, timeout);
        });

        return true;
    }
}