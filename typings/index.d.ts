export interface Client {
    on<K extends keyof ClientEvents>(
        event: K, listener: (...args: ClientEvents[K]) => void
    ): this;

    emit<K extends keyof ClientEvents>(
        event: K, ...args: ClientEvents[K]
    ): boolean;
}

export interface ClientEvents {
    friendLeaderboardPassed: [data: object],
    friendRequestAccepted: [data: object],
    friendRequestReceived: [data: object],
    friendTrackChallenge: [data: object],
    raw: [message: object],
    subscriberTrackPublish: [data: object],
    trackLeaderboardPassed: [data: object],
    trackUsernameMention: [data: object]
}