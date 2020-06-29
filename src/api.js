const fetch = require("node-fetch");
/**
 * @param {RequestCallback} [callback = () => {}]
*/
module.exports = {
    user: function(username, callback = () => { }){
        fetch(`https://www.freeriderhd.com/u/${username}?ajax`).then((response) => response.json()).then(json => {
            callback(json);
        });
    },
    track: function(track_id, callback = () => {}){
        fetch(`https://www.freeriderhd.com/t/${track_id}?ajax`).then((response) => response.json()).then(json => {
            callback(json);
        });
    }
}