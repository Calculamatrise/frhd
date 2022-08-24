import RequestHandler from "./utils/RequestHandler.js";

export default function(callback = response => response) {
    return RequestHandler.ajax({
        host: "raw.githubusercontent.com",
        path: "/Calculamatrise/frhd_featured_ghosts/master/data.json"
    }).then(callback);
}