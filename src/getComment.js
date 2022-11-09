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
    // user 'show more' to find the api endpoint
    return getTrack(trackId).then(({ track_comments }) => {
        for (const comment of track_comments) {
            if (comment.comment.id == commentId) {
                return new Comment(comment);
            }
        }
    }).then(callback);
}