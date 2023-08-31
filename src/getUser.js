import RequestHandler from "./utils/RequestHandler.js";
import User from "./structures/User.js";

/**
 * 
 * @param {string} uid
 * @param {Function} callback callback function
 * @returns {Promise<User>} 
 */
export default async function(uid, callback = r => r) {
    if (typeof uid == 'number') {
        await RequestHandler.post("/friends/remove_friend", { u_id: uid }, false).then(res => {
            // Response: "You are not friends with USERNAME, you cannot remove friendship."
            const matches = /[\w-]*(?=,)/.exec(res.msg);
            if (matches !== null) {
                uid = matches[0];
            }
        });
    }

    return RequestHandler.ajax("/u/" + String(uid)).then(function(res) {
        return User.create(res);
    }).then(callback);
}