import Client from "./utils/client.js";

export default async function(category, callback = t => t) {
    return await Client.ajax({
        path: `/${category}?ajax=!0`,
        method: "get"
    }, callback);
}