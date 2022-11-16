import RequestHandler from "../utils/RequestHandler.js";
import User from "./User.js";

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
        comment.init(data);
        return comment;
    }

    init(data) {
        for (const key in data) {
            switch(key) {
                case 'comment': {
                    for (const property in data[key]) {
                        switch(property) {
                            case 'id':
                                this.id = data[key][property];
                                break;

                            case 'msg':
                                this.message = data[key][property];
                                break;

                            case 'time':
                                this.timeAgo = data[key][property];
                                break;
                        }
                    }
                    break;
                }

                case 'data':
                    if ('track_comments' in data[key]) {
                        return this.init(data[key]['track_comments'][0]);
                    }

                    return this.init(data[key]);

                case 'track':
                    this.trackId = data[key];
                    break;

                case 'user':
                    this.author = new User();
                    for (const property in data[key]) {
                        switch(property) {
                            case 'd_name':
                                this.author.displayName = data[key][property];
                                break;

                            case 'img_url_small':
                            case 'img_url_medium':
                            case 'img_url_large':
                                this.author.avatarURL = data[key][property];
                                break;

                            case 'u_name':
                                this.author.username = data[key][property];
                                break;
                        }
                    }
                    break;
            }
        }
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