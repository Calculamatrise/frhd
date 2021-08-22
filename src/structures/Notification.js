export default class {
    constructor(data) {
        if (!data || typeof data !== "object") throw new Error("INVALID_DATA_TYPE");
        this.id = null,
        this.user = null,
        this.timeAgo = null,
        this.timestamp = null,
        this.init(data);
    }
    init(data) {
        for (const t in data) {
            switch(t) {
                case "t_uname_mention":
                    this.id = "commentMention";
                break;

                case "track_lb_passed":
                    this.id = "trackRaceLost";
                break;

                case "friend_req_rcvd":
                    this.id = "friendRequestReceived";
                break;

                case "friend_lb_passed":
                    this.id = "friendRaceLost";
                break;

                case "friend_req_accptd":
                    this.id = "friendRequestAccepted";
                break;

                case "friend_t_challenge":
                    this.id = "challenge";
                break;

                case "user":
                    this.user = {
                        id: data[t].u_id,
                        username: data[t].u_name,
                        displayName: data[t].d_name,
                        avatar: data[t].img_url_small
                    }
                break;

                case "track":
                case "message":
                case "comment":
                    this[t] = data[t];
                break;
                 
                case "time":
                    this.timeAgo = data[t];
                break;
            
                case "ts":
                    this.timestamp = data[t];
                break;
            }
        }
    }
}