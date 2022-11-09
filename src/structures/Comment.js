import RequestHandler from "../utils/RequestHandler.js";

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
        if (!data) throw new Error("INVALID_MESSAGE");
        return RequestHandler.post("/track_comments/post", {
            t_id: this.trackId,
            msg: `@${this.author.displayName}, ${(data.content || data).toString().replace(/\s+/g, "+")}`
        }, true).then(function(response) {
            if (response.result)
                return new Comment(response.data.track_comments[0]);

            return new Error(response.msg);
        });
    }

    async delete({ timeout = 0 } = {}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                RequestHandler.get(`/track_comments/delete/${this.trackId}/${this.id}`, true).then(resolve).catch(reject);
            }, ~~timeout);
        }).then(() => true).catch(err => {
            this.client.debug && console.warn(err);
            return false;
        });
    }
}