[Wiki documentation](https://github.com/Calculamatrise/frhd/wiki)

### Installation

**Node.js 18.0.0 or newer is required.**

```
npm install frhd
```

### Wiki

More information here.

### Example usage

```js
import frhd, { Client } from "frhd";

// const { Client } = frhd;

const client = new Client();

client.on("ready", function() {
	console.log("Ready!");
});

client.on("trackCommentMention", function(data) {
	console.log(data);
});

client.login("token");

// client.login({
//     username: "Guest",
//     password: "password"
// })
```

### Builder API

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

### Gamepad API

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
	up_down: [0, 2],
	up_up: [1, 8],
	left_down: [3, 5, 10],
	left_up: [4, 9],
	right_down: [6],
	right_up: [7]
}
```

### Data Retrievers

This api requests data from Free Rider HD

Example 1 - Getting User Info:

```js
import frhd, { getUser } from "frhd";

// getUser = frhd.getUser

getUser("Guest", /* Callback Option */ data => console.log(data)).then(data => console.log(data));
```
Expected Output:

```ts
interface User {
	admin: boolean | null,
	classic: boolean,
	cosmetics: CosmeticManager,
	createdTracks: TrackManager,
	displayName: string | null,
	id: number,
	mobileStats: {
		connected: boolean,
		headCount: number,
		level: number,
		wins: number
	} | null,
	moderator: boolean | null,
	plus: boolean,
	stats: {
		comments: number,
		completed: number,
		created: number,
		headCount: number,
		rated: number,
		totalHeadCount: number,
		totalPoints: number
	},
	username: string,
	friendCount: number,
	friends: FriendManager<User>,
	friendRequestCount: number,
	friendRequests: Array<FriendRequest>,
	friendLimitReached: boolean,
	likedTracks: TrackManager,
	recentlyCompleted: TrackManager,
	recentlyPlayed: TrackManager,
	subscriberCount: number | null,
	verifiedEmail: boolean
}
```

Example 2 - Getting Track Data:

```js
import frhd, { getTrack } from "frhd";

// getTrack = frhd.getTrack

getTrack(1001, /* Callback Option */ data => console.log(data)).then(data => console.log(data));
```
Expected Output:

```ts
interface Track {
	allowedVehicles: Array<string>,
	author: User,
	comments: CommentManager<Comment>,
	createdAt: Date | null,
	createdTimestamp: number | null,
	daily: {
		entries: Array<object>,
		gems: number,
		lives: number,
		refillCost: number
	},
	defaultVehicle: string | null,
	description: string,
	featured: boolean,
	id: number,
	isCampaign: boolean,
	size: number,
	stats: {
		averageTime: string,
		completionRate: number,
		dislikes: number,
		firstRuns: number,
		likes: number,
		likesAverage: number,
		plays: string,
		runs: number,
		votes: number
	},
	title: string,
	thumbnail: string,
	vehicle: string
}
```