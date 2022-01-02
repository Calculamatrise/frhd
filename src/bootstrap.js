import Builder from "./utils/Builder.js";
import Client from "./client/Client.js";
import Image from "./utils/Image.js";

import { default as getHome } from "./getHome.js";
import { default as getCategory } from "./getCategory.js";
import { default as getTrackLeaderboard } from "./getTrackLeaderboard.js";
import { default as getPlayerLeaderboard } from "./getPlayerLeaderboard.js";
import { default as getAuthorLeaderboard } from "./getAuthorLeaderboard.js";
import { default as getUser } from "./getUser.js";
import { default as getTrack } from "./getTrack.js";
import { default as getComment } from "./getComment.js";
import { default as getRandom } from "./getRandom.js";
import { default as getRace } from "./getRace.js";
import { default as getFeaturedGhosts } from "./getFeaturedGhosts.js";

export default {
    getHome,
    getTrackLeaderboard,
    getPlayerLeaderboard,
    getAuthorLeaderboard,
    getCategory,
    getUser,
    getTrack,
    getComment,
    getRandom,
    getRace,
    getFeaturedGhosts,
    Builder,
    Client,
    Image
}

export {
    Builder,
    Client,
    Image
}