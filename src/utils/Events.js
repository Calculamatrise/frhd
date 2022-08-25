/**
 * @typedef {object} Events
 * @property {string} ClientReady ready
 * @property {string} Debug debug
 * @property {string} Error error
 * @property {string} FriendLeaderboardPassed friendLeaderboardPassed
 * @property {string} FriendRequestAccepted friendRequestAccepted
 * @property {string} FriendRequestReceived friendRequestReceived
 * @property {string} FriendTrackChallenge trackChallenge
 * @property {string} Raw raw
 * @property {string} SubscribedTrackPublish subscribedTrackPublish
 * @property {string} TrackLeaderboardPassed trackLeaderboardPassed
 * @property {string} TrackUsernameMention trackUsernameMention
 * @property {string} Warn warn
 */

/**
 * @type {Events}
 * @ignore
 */
export default {
    ClientReady: 'ready',
    Debug: 'debug',
    Error: 'error',
    FriendLeaderboardPassed: 'friendLeaderboardPassed',
    FriendRequestAccepted: 'friendRequestAccepted',
    FriendRequestReceived: 'friendRequestReceived',
    FriendTrackChallenge: 'trackChallenge',
    Raw: 'raw',
    SubscribedTrackPublish: 'subscribedTrackPublish',
    TrackLeaderboardPassed: 'trackLeaderboardPassed',
    TrackUsernameMention: 'commentMention',
    Warn: 'warn'
}