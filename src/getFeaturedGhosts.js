import User from "./utils/client.js";

export default async function(callback = t => t) {
    return await User.ajax({
        host: "raw.githubusercontent.com",
        path: "/Calculamatrise/Official_Featured_Ghosts/master/ghosts.json",
        method: "get"
    }, callback);
}