import RequestHandler from "../utils/RequestHandler.js";

import Comment from "./Comment.js";

import { token } from "../client/Client.js";

export default class extends Array {
    constructor(array, id) {
        super(...array);
        
        this.id = id;
    }
    get(id) {
        if (isNaN(id))
            throw new Error("INVALID_COMMENT");
        
        return this.find(function(comment) {
            return comment.id == id;
        }) || null;
    }
    async post(message) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!message)
            throw new Error("INVALID_MESSAGE");
            
        return RequestHandler.ajax({
            path: "/track_comments/post",
            body: {
                t_id: this.id,
                msg: message.toString().replace(/\s+/g, "+"),
                app_signed_request: token
            },
            method: "post"
        }).then(function(response) {
            if (response.result)
                return new Comment(response.data.track_comments[0]);

            return new Error(response.msg);
        });
    }
}