import RequestHandler from "../utils/RequestHandler.js";
import S from "../libs/sha256/index.js";

import Comments from "./Comments.js";
import Comment from "./Comment.js";
import Race from "./Race.js";

import { token } from "../client/Client.js";
import getUser from "../getUser.js";

export default class Track {
    id = null;
    title = null;
    slug = null;
    author = null;
    featured = false;
    static async create(data, userId) {
        if (!data || typeof data !== "object") {
            throw new Error("INVALID_DATA_TYPE");
        }

        if (userId !== void 0) {
            this.userId = userId;
        }

        const track = new Track();
        
        await track.init(data);

        return track;
    }
    async init(data) {
        for (const t in data) {
            switch(t) {
                case "id":
                case "title":
                    this[t] = data[t];
                break;

                case "slug":
                    this[t] = data[t];
                    if (!this.id)
                        this.id = parseInt(this.slug);
                break;

                case "author":
                    if (typeof data[t] === "object") {
                        this.author = data[t];

                        break;
                    }

                    if (!this.author)
                        this.author = {};

                    this.author.username = data[t];
                break;

                case "author_slug":
                    if (!this.author)
                        this.author = {};

                    this.author.displayName = data[t];
                break;


                case "track":
                    this.id = data[t].id,
                    this.title = data[t].title,
                    this.description = data[t].descr || null,
                    this.slug = data[t].slug,
                    this.author = {
                        id: data[t].u_id,
                        username: data[t].author,
                        displayName: data[t].author_slug,
                        avatar: data[t].author_img_medium || data[t].author_img_small
                    }
                    this.vehicle = data[t].vehicle,
                    this.cdn = data[t].cdn,
                    this.uploadDate = data[t].date,
                    this.thumbnail = data[t].img,
                    this.size = data[t].kb_size,
                    this.vehicles = data[t].vehicles,
                    this.uploadDateAgo = data[t].date_ago,
                    this.featured = data[t].featured,
                    this.hidden = data[t].hide;
                    if (!this.id)
                        this.id = parseInt(this.slug);
                break;

                case "track_stats":
                    this.stats = {
                        likes: data[t].up_votes,
                        dislikes: data[t].dwn_votes,
                        votes: data[t].votes,
                        likesAverage: data[t].vote_percent,
                        plays: data[t].plays,
                        runs: data[t].runs,
                        firstRuns: data[t].frst_runs,
                        averageTime: data[t].avg_time,
                        completionRate: data[t].cmpltn_rate
                    }
                break;

                case "track_comments":
                    data[t].forEach(comment => {
                        comment.track = {
                            id: this.id
                        }
                    });
                    
                    this.comments = new Comments(await Promise.all(data[t].map(function(comment) {
                        return Comment.create(comment);
                    })), this.id);
                break;

                case "campaign":
                    this.isCampaign = data[t];
                break;

                case "totd":
                    this.daily = {
                        gems: data[t].gems,
                        lives: data[t].lives,
                        refillCost: data[t].refill_cost,
                        entries: data[t].entries
                    }
                break;

                case "game_settings":
                    this.gameSettings = data[t];
                break;
            }
        }
    }
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
    sendChallenge(message, users) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!message || typeof message !== "string")
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
    vote(vote) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!vote || isNaN(vote))
            throw new Error("INVALID_VOTE");

        return RequestHandler.ajax({
            path: "/track_api/vote",
            body: {
                t_id: this.id,
                vote,
                app_signed_request: token
            },
            method: "post"
        });
    }
    async getRace(user) {
        if (isNaN(user))
            user = await getUser(user).then(function(user) {
                return user.id;
            });
            
        if (!user)
            throw new Error("INVALID_USER");
            
        return RequestHandler.ajax(`/track_api/load_races?t_id=${this.id}&u_ids=${user}&ajax=true`).then(function(response) {
            return response.data.map(function(race) {
                return race = new Race(race);
            });
        });
    }
    /**
     * 
     * @param {Object|String} code 
     * @param {String} vehicle 
     * @param {Number} ticks 
     * @returns {Object}
     * @private
     */
    async postRace(code, vehicle = "MTB", ticks) {
        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!this.userId)
            throw new Error("INVALID_CLIENT");
        else if (!code)
            throw new Error("INVALID_RACE_DATA");
        else if (!ticks || isNaN(ticks))
            throw new Error("INVALID_TIME");
        
        if (typeof code == "object")
            code = JSON.stringify(code);

        return RequestHandler.ajax({
            path: "/track_api/track_run_complete",
            body: {
                t_id: this.id,
                u_id: this.userId,
                code: encodeURIComponent(code),
                vehicle,
                run_ticks: ticks,
                fps: 25,
                time: encodeURIComponent(t2t(ticks)),
                sig: S.SHA256(`${this.id}|${this.userId}|${code}|${ticks}|${vehicle}|25|erxrHHcksIHHksktt8933XhwlstTekz`).toString(),
                ajax: true,
                app_signed_request: token,
                t_1: "ref",
                t_2: "desk"
            },
            method: "post"
        });
    }
    /**
     * 
     * @private
     * @param {number|string|object} user 
     * @returns {Object}
     */
    async copyRace(user) {
        if (isNaN(user))
            user = await getUser(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return this.getRace(user).then(response => this.postRace(response.race.code, response.race.vehicle, response.race.runTicks));
    }

    /**
     * 
     * @protected requires administrative priviledges
     * @param {User|number|string} user 
     * @returns 
     */
    async removeRace(user) {
        if (isNaN(user))
            user = await getUser(user).then(function(user) {
                return user.id;
            });

        if (!token)
            throw new Error("INVALID_TOKEN");
        else if (!user)
            throw new Error("INVALID_USER");

        return RequestHandler.ajax({
            path: "/moderator/remove_race",
            body: {
                t_id: this.id,
                u_id: user,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative priviledges
     * @param {Number} lives 
     * @param {Number} refillCost 
     * @param {Number} gems 
     * @returns object
     */
    addDaily(lives, refillCost, gems) {
        if (!token)
            throw new Error("INVALID_TOKEN");
            
        return RequestHandler.ajax({
            path: "/moderator/add_track_of_the_day",
            body: {
                t_id: this.id,
                lives,
                rfll_cst: refillCost,
                gems,
                ajax: true,
                app_signed_request: token
            },
            method: "post"
        });
    }

    /**
     * 
     * @protected requires administrative priviledges
     * @returns object
     */
    hide() {
        if (!token)
            throw new Error("INVALID_TOKEN");

        return RequestHandler.ajax(`/moderator/hide_track/${this.id}?ajax=true&app_signed_request=${token}&t_1=ref&t_2=desk`);
    }
}

function t2t(ticks) {
    let t = ticks / 30 * 1e3;
    t = parseInt(t, 10);
    let e = Math.floor(t / 6e4)
        , i = (t - 6e4 * e) / 1e3;
    return i = i.toFixed(2),
        10 > e && (e = e),
        10 > i && (i = "0" + i),
        e + ":" + i
}