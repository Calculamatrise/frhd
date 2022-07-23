/**
 * @typedef {Object} Events
 * @property {string} FriendLeaderboardPassed friendLeaderboardPassed
 * @property {string} FriendRequestAccepted friendRequestAccepted
 * @property {string} FriendRequestReceived friendRequestReceived
 * @property {string} FriendTrackChallenge trackChallenge
 * @property {string} SubscribedTrackPublish subscribedTrackPublish
 * @property {string} TrackLeaderboardPassed trackLeaderboardPassed
 * @property {string} TrackUsernameMention trackUsernameMention
 */

/**
 * @type {Events}
 * @ignore
 */
export default {
    FriendLeaderboardPassed: 'friendLeaderboardPassed',
    FriendRequestAccepted: 'friendRequestAccepted',
    FriendRequestReceived: 'friendRequestReceived',
    FriendTrackChallenge: 'trackChallenge',
    SubscribedTrackPublish: 'subscribedTrackPublish',
    TrackLeaderboardPassed: 'trackLeaderboardPassed',
    TrackUsernameMention: 'commentMention'
}