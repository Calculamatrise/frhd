# Usage

This api requests data from Free Rider HD

Example 1 - Getting User Info:

```js
import frhd from "frhd";

let username = "Guest";
frhd.getUser(username, /* Method 1 */ data => console.log(data)).then(/* Method 2 */ data => console.log(data));
```
Expected Output:

```js
{
  user: {
    u_id: 117248,
    u_name: 'guest',
    d_name: 'Guest',
    img_url_medium: 'https://secure.gravatar.com/avatar/16f000fecd4582f8aa6f424b2d9789c9/?s=100&d=mm&r=pg',
    current_user: false,
    classic: false,
    admin: false,
    plus: false,
    cosmetics: { head: [Object] }
  },
  user_stats: {
    u_id: 117248,
    tot_pts: 2,
    cmpltd: 1,
    rtd: 0,
    cmmnts: 0,
    crtd: 0,
    head_cnt: 1,
    total_head_cnt: 200
  },
  user_info: false,
  user_mobile_stats: { lvl: '--', wins: '--', headCount: '--', connected: '1' },
  user_notification: false,
  user_verify_reminder: false,
  is_profile_owner: false,
  recently_played_tracks_active: false,
  recently_played_tracks: { track_list_1_ad: false, tracks: [ [Object] ] },
  recently_ghosted_tracks_active: true,
  recently_ghosted_tracks: { track_list_1_ad: true, tracks: [ [Object] ] },
  created_tracks_active: false,
  created_tracks: { track_list_1_ad: false, tracks: [] },
  show_liked_tracks: false,
  liked_active: false,
  liked_tracks: { tracks: [] },
  friends_active: false,
  friends: { friend_cnt: 0, friends_data: [] },
  friend_requests: { request_cnt: 0, request_data: [] },
  has_max_friends: false,
  show_friends: true,
  subscribe: false,
  total_head_count: 200,
  social_forum_url: 'http://community.freeriderhd.com',
  app_title: 'Guest | Free Rider HD',
  header_title: 'Guest',
  app_version: 'd633437bb6'
}
```

Example 2 - Getting Track Data:

```js
import frhd from "frhd";

let track = "1001";
frhd.getTrack(track, /* Method 1 */ data => console.log(data)).then(/* Method 2 */ data => console.log(data));
```
Expected Output:

```js
{
  track: {
    id: 1001,
    title: 'Wild West',
    descr: 'Wild West is a Free Rider community classic track by weewam.',
    slug: '1001-wild-west',
    u_id: 1001,
    author_is_user: true,
    u_url: 'weewam',
    author: 'weewam',
    author_slug: 'weewam',
    author_img_small: 'https://cdn.freeriderhd.com/free_rider_hd/sprites/guest_profile_v2.png',
    vehicle: 'MTB',
    cdn: 'https://cdn.freeriderhd.com/free_rider_hd/tracks/prd/b/8c/1001/track-data-v1.js',
    date: '11/19/13',
    img: 'https://cdn.freeriderhd.com/free_rider_hd/tracks/prd/b/8c/1001/250x150-v5.png',
    img_768x250: 'https://cdn.freeriderhd.com/free_rider_hd/tracks/prd/b/8c/1001/768x250-v5.png',
    kb_size: 66,
    vehicles: [ 'BMX', 'MTB' ],
    date_ago: '7 years ago',
    featured: false,
    hide: 0
  },
  track_stats: {
    up_votes: 223,
    dwn_votes: 62,
    votes: 285,
    vote_percent: 78,
    plays: '36.0k',
    runs: 371,
    frst_runs: 163,
    avg_time: '0:33.97',
    cmpltn_rate: 0.03
  },
  race_leaderboard: false,
  show_race_leaderboard: false,
  right_side_content: {
    tracks: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object], [Object]
    ],
    title: false,
    list_only: true,
    hide_ads: false,
    ads_override: false
  },
  track_comments: [
    { user: [Object], comment: [Object] },
    { user: [Object], comment: [Object] },
    { user: [Object], comment: [Object] },
    { user: [Object], comment: [Object] }
  ],
  track_comments_load_more: true,
  max_comment_length: 500,
  logged_in_user: false,
  user_track_stats: false,
  campaign: false,
  show_preroll_ads: false,
  hide_ads: false,
  ads_override: false,
  is_admin: false,
  totd: { gems: 500, lives: 30, refill_cost: 10, entries: [] },
  subscribe: { is_subscribed: false, count: 51 },
  race_uids: [],
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
  },
  app_title: 'Wild West by weewam | Free Rider HD Track',
  header_title: 'Wild West',
  app_version: 'd633437bb6'
}
```
