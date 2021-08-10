import Comment from "./utils/comment.js";

import getTrack from "./getTrack.js";

export default async function(trackId, commentId, callback = t => t) {
    return await getTrack(trackId).then(t => {
        for (const e of t.track_comments) {
            if (e.comment.id == commentId) {
                return callback(new Comment(e));
            }
        }
    }).then(callback);
}