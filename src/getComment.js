import RequestHandler from "./utils/RequestHandler.js";
import Comment from "./structures/Comment.js";

/**
 * 
 * @param {number|string} trackId
 * @param {number|string} commentId
 * @param {Function} callback
 * @returns {Promise<Comment>}
 */
export default function(trackId, commentId, callback = r => r) {
	return RequestHandler.post("track_comments/load_more/" + trackId + "/" + commentId).then(res => {
		return new Comment(Object.assign(res.track_comments[0], { track: { id: trackId } }))
	}).then(callback)
}