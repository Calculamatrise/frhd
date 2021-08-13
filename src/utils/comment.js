import Client, { token } from "./client.js";

export default class {
    constructor(data) {
        if (!data || typeof data !== "object") throw new Error("INVALID_DATA_TYPE");
        this.id = null,
        this.message = null,
        this.timeAgo = null,
        this.deletable = null,
        this.flagged = null,
        this.author = null,
        this.init(data);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "comment":
                    this.id = data[t].id,
                    this.message = data[t].msg,
                    this.timeAgo = data[t].time,
                    this.deletable = data[t].can_delete;
                    if (data[t].flagged)
                        this.flagged = data[t].flagged;
                break;

                case "user":
                    this.author = {
                        username: data[t].u_name,
                        displayName: data[t].d_name,
                        avatar: data[t].img_url_small
                    }
                break;

                case "track":
                    this.trackId = data[t].id;
                break;
            }
        }
    }
    async reply(message) {
        if (!message) throw new Error("INVALID_MESSAGE");
        return await Client.ajax({
            path: "/track_comments/post",
            body: {
                t_id: this.trackId,
                msg: `@${this.author.displayName}, ${message.toString().replace(/\s+/g, "+")}`,
                app_signed_request: token
            },
            method: "post"
        }).then(async t => t.result ? new this.constructor(t.data.track_comments[0]) : new Error(t.msg));
    }
    delete({ timeout = 0 }) {
        if (isNaN(timeout)) throw new Error("INVALID_TIMEOUT");
        setTimeout(() => {
            Client.ajax({
                path: `/track_comments/delete/${this.trackId}/${this.id}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`,
                method: "get"
            });
        }, timeout);
        return true;
    }
}