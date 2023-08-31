import Comment from "./structures/Comment.js";

/**
 * 
 * @param {number|string} trackId
 * @param {number|string} commentId
 * @param {Function} callback
 * @returns {Promise<Comment>}
 */
export default function(trackId, commentId, callback = r => r) {
    return RequestHandler.post("/track_comments/load_more/" + trackId + "/" + commentId).then(function(res) {
        if (res.result !== true) {
            throw new Error(res.msg);
        }

        return new Comment(res);
    }).then(callback);
}