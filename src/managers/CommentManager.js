import RequestHandler from "../utils/RequestHandler.js";

import Comment from "../structures/Comment.js";

import { token } from "../client/Client.js";

export default class extends Array {
    get(id) {
        if (isNaN(+(+id).toFixed()))
            throw new Error("INVALID_COMMENT_ID");
        
        return this.find(comment => +comment.id === +id) || null;
    }

    async post(message) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!message)
            throw new Error("INVALID_MESSAGE");
            
        return RequestHandler.ajax({
            path: "/track_comments/post",
            body: {
                t_id: this.track.id,
                msg: message.toString().replace(/\s+/g, "+"),
                app_signed_request: token
            },
            method: "post"
        }).then(function(response) {
            if (response.result) {
                const comment = new Comment(response.data.track_comments[0]);

                return comment;
            }

            return new Error(response.msg);
        });
    }
}