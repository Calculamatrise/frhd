import Track from "./Track.js";
import User from "./User.js";

export default {
    async getHome(callback = () => {}) {
        return await User.ajax({
            path: `?ajax=!0`,
            method: "get"
        }, callback);
    },
    async getPlayerLB(page, callback = () => {}) {
        return await User.ajax({
            path: `/leaderboards/player/lifetime/${page}?ajax=!0`,
            method: "get"
        }, callback);
    },
    async getAuthorLB(page, callback = () => {}) {
        return await User.ajax({
            path: `/leaderboards/author/lifetime/${page}?ajax=!0`,
            method: "get"
        }, callback);
    },
    async getCategory(category, callback = () => {}) {
        return await User.ajax({
            path: `/${category}?ajax=!0`,
            method: "get"
        }, callback);
    },
    async getUser(u, callback = () => {}) {
        return await User.ajax({
            path: `/u/${u}?ajax=!0`,
            method: "get"
        }, callback);
    },
    async getTrack(t, callback = () => {}) {
        return await User.ajax({
            path: `/t/${t}?ajax=!0`,
            method: "get"
        }, callback);
    },
    async getRandom(callback = () => {}) {
        return await User.ajax({
            path: `/random/track/?ajax=!0`,
            method: "get"
        }, callback);
    },
    async getRace(t, u, callback = () => {}) {
        return await User.ajax({
            path: `/t/${t}/r/${u}?ajax=!0`,
            method: "get"
        }, callback);
    },
    async getFeaturedGhosts(callback = () => {}) {
        return await User.ajax({
            host: "raw.githubusercontent.com",
            path: "/Calculamatrise/Official_Featured_Ghosts/master/ghosts.json",
            method: "get"
        }, callback);
    },
    User,
    Track
}
