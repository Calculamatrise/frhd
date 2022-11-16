import EventEmitter from "events";
import Events from "../utils/Events.js";
import RequestHandler from "../utils/RequestHandler.js";

export let token = null;

/**
 * @callback Callback
 * @extends {EventEmitter}
 * @type {Client}
 */
export default class extends EventEmitter {
    #api = new RequestHandler();
    #user = null;
    #options = {
        interval: 6e4,
        listen: true
    };

    get api() {
        if (!token) {
            throw new Error("INVALID_TOKEN");
        }

        return this.#api;
    }

    get user() {
        return this.#user;
    }

    /**
     * 
     * @param {object} [options]
     * @param {boolean} [options.debug]
     * @param {number} [options.interval] time between each datapoll request
     * @param {boolean} [options.listen] listen to incoming notifications
     */
    constructor(options = {}) {
        if (typeof options != "object" || options instanceof Array) {
            throw TypeError("Options must be of type: Object");
        }

        super();
        for (const key in options) {
            switch(key.toLowerCase()) {
                case "debug": {
                    this.debug = !!options[key];
                    // this.on(Events.Debug, console.log);
                    break;
                }

                case "interval": {
                    this.#options.interval = Math.max(1e3, ~~options[key]);
                    break;
                }

                case "listen": {
                    this.#options.listen = !!options[key];
                    break;
                }
            }
        }
    }

    async #listen() {
        const notifications = await this.api.datapoll().then(({ notification_count }) => notification_count > 0 ? this.notifications.fetch(notification_count) : []);
        for (const notification of notifications) {
            this.debug && console.log(notification);
            this.emit(Events.Raw, notification);
            if (notification.id === null) {
                let error = new Error("UNKNOWN_NOTIFICATION_ID");
                console.warn(error, notification);
                this.emit(Events.Error, error);
            } else if (notification.id == Events.CommentMention) {
                let track = await this.api.tracks(notification.track.id);
                this.emit(notification.id, track.comments.get(notification.comment.id));
            } else {
                this.emit(notification.id, notification);
            }
        }

        setTimeout(this.#listen.bind(this), this.#options.interval);
    }

    /**
     * 
     * @param {(string|object)} asr app signed request token
     * @param {string} asr.username frhd login username
     * @param {string} asr.password frhd login password
     * @param {string} asr.token app signed request token
     * @returns {Client}
     */
    async login(asr) {
        if (typeof asr == "object") {
            if (asr.hasOwnProperty("username") && asr.hasOwnProperty("password")) {
                asr = await RequestHandler.post("/auth/standard_login", {
                    login: asr.username,
                    password: asr.password
                }).then(function(res) {
                    if (res.result == false) {
                        throw new Error(res.msg);
                    }

                    return res.app_signed_request;
                });
            } else if (asr.hasOwnProperty("token")) {
                asr = asr.token;
            }
        }

        if (typeof asr != "string")
            throw new Error("INVALID_TOKEN");

        token = asr;
        let response = await RequestHandler.get(`/account/settings`);
        if (!response || !response.user) {
            token = null;
            throw new Error("INVALID_TOKEN");
        }

        this.#user = await this.users.fetch(response.user.d_name) || null;
        this.user.requests = new RequestManager();
        this.user.moderator = response.user.moderator;

        this.emit(Events.ClientReady);
        if (this.#options.listen) {
            this.#listen();
        }

        return this;
    }

    /**
     * 
     * @returns {Client}
     */
     logout() {
        this.user = null;
        token = null;
        return this;
    }
}