# Official Documentation

https://calculamatrise.github.io/frhd/api/docs/

# Demo Code

```js
import frhd, { Client } from "frhd";

// const { Client } = frhd;

const client = new Client();

client.on("ready", function() {
    console.log("Ready!");
});

client.on("commentMention", function(data) {
    console.log(data);
});

client.login("token");

// client.login({
//     username: "Guest",
//     password: "password"
// })
```

# Builder API

```js
import frhd, { Builder } from "frhd";

// const { Builder } = frhd;
const track = new Builder();

// Import tracks:
// track.code = "-18 1i 18 1i##"

track.beginPath();
track.moveTo(-40, 50);
track.lineTo(40, 50);
track.stroke();

console.log(track.code);
```
Expected Output:

```js
"-18 1i 18 1i##"
```

# Gamepad API

```js
import frhd, { Gamepad } from "frhd";

// const { Gamepad } = frhd;
const gamepad = new Gamepad();

gamepad.on("tick", function(records) {
    // records = this.getReplayString();
    console.log(records);
});

gamepad.on("tick", function(ticks) {
    this.toggleKey(this.keymap[Math.floor(Math.random() * ticks) % 5]);
    /* switch(ticks) {
        case 0:
            this.setKeyDown("up");
            break;

        case 1:
            this.setKeyDown("left", "down");
            break;
    } */
    this.tick(10); // first param defines the maximum ticks
});

/* Or create a ghost manually
gamepad.setKeyDown("up");
gamepad.tick();
gamepad.setKeyUp("up");
gamepad.complete();
*/
```
Expected Output:

```js
{
  up_down: [ 0, 2 ],
  up_up: [ 1, 8 ],
  left_down: [ 3, 5, 10 ],
  left_up: [ 4, 9 ],
  right_down: [ 6 ],
  right_up: [ 7 ]
}
```

# Data Retrievers

This api requests data from Free Rider HD

Example 1 - Getting User Info:

```js
import frhd, { getUser } from "frhd";

// getUser = frhd.getUser

getUser("Guest", /* Callback Option */ data => console.log(data)).then(data => console.log(data));
```
Expected Output:

```js
{
    id: 0000000,
    username: 'guest',
    displayName: 'Guest',
    avatar: 'https://secure.gravatar.com/avatar/16f000fecd4582f8aa6f424b2d9789c9/?s=100&d=mm&r=pg',
    classic: false,
    admin: false,
    plus: false,
    cosmetics: { head: [Object] },
    stats: {
        u_id: 0000000,
        tot_pts: 2,
        cmpltd: 1,
        rtd: 0,
        cmmnts: 0,
        crtd: 0,
        head_cnt: 1,
        total_head_cnt: 200
    },
    bio: null,
    mobileStats: { lvl: '--', wins: '--', headCount: '--', connected: '1' },
    verifiedEmail: false,
    recentlyPlayed: [ [Object] ],
    recentlyGhosted: [ [Object] ],
    createdTracks: [ [Object] ],
    likedTracks: [ [Object] ],
    friendCount: 0,
    friends: [],
    friendRequestCount: 0,
    friendRequests: [],
    friendLimitReached: false,
    subscriberCount: false
}
```

Example 2 - Getting Track Data:

```js
import frhd, { getTrack } from "frhd";

// getTrack = frhd.getTrack

getTrack(1001, /* Callback Option */ data => console.log(data)).then(data => console.log(data));
```
Expected Output:

```js
{
    id: 1001,
    title: 'Wild West',
    descr: 'Wild West is a Free Rider community classic track by weewam.',
    slug: '1001-wild-west',
    u_id: 1001,
    author: {
        id: 1001,
        username: 'weewam',
        displayName: 'weewam',
        avatar: 'https://cdn.freeriderhd.com/free_rider_hd/sprites/guest_profile_v2.png'
    },
    vehicle: 'MTB',
    cdn: 'https://cdn.freeriderhd.com/free_rider_hd/tracks/prd/b/8c/1001/track-data-v1.js',
    uploadDate: '11/19/13',
    thumbnail: 'https://cdn.freeriderhd.com/free_rider_hd/tracks/prd/b/8c/1001/250x150-v5.png',
    size: 66,
    vehicles: [ 'BMX', 'MTB' ],
    uploadDateAgo: '7 years ago',
    featured: false,
    hidden: 0,
    stats: {
        likes: 223,
        dislikes: 62,
        votes: 285,
        likesAverage: 78,
        plays: '36.0k',
        runs: 371,
        firstRuns: 163,
        averageTime: '0:33.97',
        completionRate: 0.03
    },
    comments: [
        [Object],
        [Object],
        [Object],
        [Object]
    ],
    isCampaign: false,
    daily: { gems: 500, lives: 30, refillCost: 10, entries: [] },
    game_settings: {
        user: { d_name: 'Guest', u_id: false, cosmetics: [Object], guest: true },
        showHelpControls: true,
        isCampaign: false,
        track: {
            id: 1001,
            title: 'Wild West',
            descr: 'Wild West is a Free Rider community classic track by weewam.',
            url: '1001-wild-west',
            vehicle: 'MTB',
            vehicles: [Array],
            size: 65606,
            cdn: 'https://cdn.freeriderhd.com/free_rider_hd/tracks/prd/b/8c/1001/track-data-v1.js',
            pwrups: [Object],
            u_id: 1001,
            author_is_user: true,
            u_url: 'weewam',
            author: 'weewam',
            img: 'https://cdn.freeriderhd.com/free_rider_hd/tracks/prd/b/8c/1001/250x150-v5.png',
            ft_ts: 0,
            featured: false,
            p_ts: 1384895497,
            hide: 0,
            admin: false
        },
        userTrackStats: false,
        campaignData: false,
        trackUploadCost: 25,
        raceUids: [],
        raceData: false,
        soundsEnabled: true,
        bestGhostEnabled: false,
        requireTrackVerification: true
    }
}
```