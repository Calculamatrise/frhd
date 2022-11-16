import Comment from "./structures/Comment.js";
import getTrack from "./getTrack.js";

/**
 * 
 * @param {number|string} trackId
 * @param {number|string} commentId
 * @param {Function} callback
 * @returns {Promise<Comment>}
 */
export default function(trackId, commentId, callback = res => res) {
    return getTrack(trackId).then(({ track_comments }) => {
        for (const comment of track_comments) {
            if (comment.comment.id == commentId) {
                return new Comment(comment);
            }
        }

        // comment not found.. load more
        // const entry = await RequestHandler.post("/track_comments/load_more/" + trackId).then(function(res) {
        //     if (res.result !== true) {
        //         throw new Error(res.msg);
        //     }

        //     return new Comment(res);
        // });
    }).then(callback);
}