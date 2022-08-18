export interface Client {
    on<K extends keyof ClientEvents>(
        event: K, listener: (...args: ClientEvents[K]) => void
    ): this;

    emit<K extends keyof ClientEvents>(
        event: K, ...args: ClientEvents[K]
    ): boolean;
}

export interface ClientEvents {
    test: [message: string],
    raw: [message: object]
}