/**
 * @typedef {object} Events
 * @property {string} ClientReady ready
 * @property {string} Debug debug
 * @property {string} Error error
 * @property {string} FriendLeaderboardPassed friendLeaderboardPassed
 * @property {string} FriendRequestAccepted friendRequestAccepted
 * @property {string} FriendRequestReceived friendRequestReceived
 * @property {string} FriendTrackChallenge trackChallenge
 * @property {string} MobileAccountLinkedAward mobileAccountLinkedAward
 * @property {string} Raw raw
 * @property {string} SubscribedTrackPublish subscribedTrackPublish
 * @property {string} TrackLeaderboardPassed trackLeaderboardPassed
 * @property {string} TrackUsernameMention trackUsernameMention
 * @property {string} TransferredCoins transferredCoins
 * @property {string} Warn warn
 */

/**
 * @type {Events}
 * @ignore
 */
export default { // "notifications/notification_day", "notifications/uname_reminder", "notifications/track_lb_passed", "notifications/t_uname_mention", "notifications/friend_lb_passed", "notifications/friend_req_rcvd", "notifications/friend_req_accptd", "notifications/friend_t_challenge", "notifications/mobile_account_linked_award", "notifications/subscribed_t_publish", "notifications/transferred_coins", "notifications/friend_added"
    ClientReady: 'ready',
    Debug: 'debug',
    Error: 'error',
    FriendLeaderboardPassed: 'friendLeaderboardPassed',
    FriendRequestAccepted: 'friendRequestAccepted',
    FriendRequestReceived: 'friendRequestReceived',
    FriendTrackChallenge: 'trackChallenge',
	MobileAccountLinkedAward: 'mobileAccountLinkedAward',
    Raw: 'raw',
    SubscribedTrackPublish: 'subscribedTrackPublish',
    TrackLeaderboardPassed: 'trackLeaderboardPassed',
    TrackUsernameMention: 'trackCommentMention',
	TransferredCoins: 'transferredCoins',
    Warn: 'warn'
}