import Comment from "./structures/Comment.js";

import getTrack from "./getTrack.js";

export default function(trackId, commentId, callback = comment => comment) {
    return getTrack(trackId).then(t => {
        for (const comment of t.track_comments) {
            if (comment.comment.id == commentId) {
                return new Comment(comment);
            }
        }
    }).then(callback);
}