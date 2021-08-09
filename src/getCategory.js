import User from "./utils/client.js";

export default async function(category, callback = t => t) {
    return await User.ajax({
        path: `/${category}?ajax=!0`,
        method: "get"
    }, callback);
}