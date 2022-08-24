import RequestHandler from "../utils/RequestHandler.js";

import RaceManager from "../managers/RaceManager.js";
import CommentManager from "../managers/CommentManager.js";

import Race from "./Race.js";
import Comment from "./Comment.js";

import { token } from "../client/Client.js";

export default class Track {
    id = null;
    title = null;
    author = null;
    hidden = !1;
    races = new RaceManager();
    comments = new CommentManager();
    #featured = !1;
    get featured() {
        return this.#featured;
    }

    /**
     * 
     * @param {Boolean} value 
     * @returns {Boolean}
     */
    set featured(value) {
        if (!token)
            throw new Error("INVALID_TOKEN");

        RequestHandler.ajax(`/track_api/feature_track/${this.id}/${+value}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then((response) => {
            if (response.result) {
                this.#featured = !!value;

                return response;
            }

            throw new Error(response.msg || "Insufficient privileges");
        });
    }

    /**
     * 
     * @param {Object} data 
     * @returns {Track} 
     */
    static async create(data) {
        if (typeof data != "object") {
            throw new TypeError("INVALID_DATA_TYPE");
        }

        const track = new Track();
        
        await track.init(data);

        return track;
    }

    /**
     * 
     * @param {Object} options 
     */
    async init({
        id,
        title,
        descr,
        campaign,
        featured,
        hide,
        author,
        author_slug,
        author_img_small,
        u_id,
        cdn,
        vehicle,
        vehicles,
        img,
        kb_size,
        date,
        date_ago,
        track_stats,
        track_comments,
        totd,
        game_settings
    }) {
        this.id = id;
        this.title = title;
        this.slug = id + "-" + title.trim().toLowerCase().replace(/\s+/g, "-");
        this.description = descr;
        this.#featured = featured;
        this.hidden = !!hide;
        this.author = {
            id: u_id,
            username: author_slug || author.toLowerCase(),
            displayName: author,
            avatar: author_img_small
        }

        this.cdn = cdn;
        this.vehicle = vehicle;
        this.vehicles = vehicles;
        this.thumbnail = img;
        this.size = kb_size;
        this.uploadDate = date;
        this.uploadDateAgo = date_ago;
        if (campaign !== void 0) {
            this.isCampaign = campaign;
        }

        if (track_stats !== void 0) {
            this.stats = {
                likes: track_stats.up_votes,
                dislikes: track_stats.dwn_votes,
                votes: track_stats.votes,
                likesAverage: track_stats.vote_percent,
                plays: track_stats.plays,
                runs: track_stats.runs,
                firstRuns: track_stats.frst_runs,
                averageTime: track_stats.avg_time,
                completionRate: track_stats.cmpltn_rate
            }
        }

        if (track_comments !== void 0) {
            this.comments.push(...(await Promise.all(track_comments.map((comment) => {
                comment.track = {
                    id: this.id
                }

                return Comment.create(comment);
            }))));
        }

        if (totd !== void 0) {
            this.daily = {
                gems: totd.gems,
                lives: totd.lives,
                refillCost: totd.refill_cost,
                entries: totd.entries
            }
        }

        if (game_settings !== void 0) {
            this.gameSettings = game_settings;
        }

        this.races.track = id;
        this.comments.track = id;
    }

    /**
     * 
     * @returns {Promise<Array>}
     */
    async getLeaderboard() {
        return RequestHandler.ajax({
            path: "/track_api/load_leaderboard",
            body: {
                t_id: this.id,
                app_signed_request: token
            },
            method: "post"
        }).then(function(response) {
            if (response.result) {
                return response.track_leaderboard.map(function(race) {
                    return new Race(race);
                });
            }

            return response.msg;
        });
    }

    /**
     * 
     * @param {String} message 
     * @param {Array} users 
     * @returns {Promise}
     */
    sendChallenge(message, users) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (typeof message !== "string")
            throw new Error("INVALID_MESSAGE");
        else if (!users || typeof users !== "object")
            throw new Error("INVALID_USERS");

        return RequestHandler.ajax({
            path: "/challenge/send",
            body: {
                "users%5B%5D": users.join("&users%5B%5D="),
                msg: message,
                track_slug: this.id,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @param {Number|Boolean} vote 
     * @returns {Promise}
     */
    vote(vote) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (isNaN(+vote))
            throw new Error("INVALID_VOTE");

        return RequestHandler.ajax({
            path: "/track_api/vote",
            body: {
                t_id: this.id,
                vote: +vote,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number} lives 
     * @param {Number} refillCost 
     * @param {Number} gems 
     * @returns {Promise}
     */
    addToDaily(lives, refillCost, gems) {
        if (!token)
            throw new Error("INVALID_TOKEN");
            
        return RequestHandler.ajax({
            path: "/moderator/add_track_of_the_day",
            body: {
                t_id: this.id,
                lives,
                rfll_cst: refillCost,
                gems,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @param {Number} lives 
     * @param {Number} refillCost 
     * @param {Number} gems 
     * @returns {Promise}
     */
    removeFromDaily() {
        if (!token)
            throw new Error("INVALID_TOKEN");
            
        return RequestHandler.ajax({
            path: "/admin/removeTrackOfTheDay",
            body: {
                t_id: this.id,
                lives,
                rfll_cst: refillCost,
                gems,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Boolean}
     */
    feature() {
        this.featured = !0;
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Boolean}
     */
    unfeature() {
        this.featured = !1;
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Boolean}
     */
    toggleFeatured() {
        return this.featured = !this.featured;
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Boolean}
     */
    toggleHidden() {
        return this.hidden = !this.hidden;
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    async hide() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax(`/moderator/hide_track/${this.id}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`).then((response) => {
            if (response.result) {
                this.hidden = !0;

                return response;
            }

            throw new Error(response.msg || "Insufficient privileges");
        });
    }

    /**
     * 
     * @protected requires administrative privileges.
     * @returns {Promise}
     */
    hideAsAdmin() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax({
            path: "/admin/hide_track",
            body: {
                track_id: this.id,
                app_signed_request: token
            },
            method: "post"
        });
    }
}