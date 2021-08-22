import RequestHandler from "./utils/RequestHandler.js";

export default function(callback = t => t) {
    return RequestHandler.ajax({
        host: "raw.githubusercontent.com",
        path: "/Calculamatrise/Official_Featured_Ghosts/master/ghosts.json"
    }).then(callback);
}