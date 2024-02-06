import EventEmitter from "events";

import { Events, GamepadEvents, GamepadKeymap } from "../src";
import Comment from "../src/structures/Comment";
import Race from "../src/structures/Race";
import Track from "../src/structures/Track";
import User from "../src/structures/User";

//#region Functions

export function getAuthorLeaderboard(page: number, callback: Function): Promise<object>;
export function getCategory(category: number, callback: Function): Promise<object>;
export function getComment(trackId: number, commendId: number, callback: Function): Promise<Comment>;
export function getFeaturedGhosts(callback: Function): Promise<object>;
export function getHome(callback: Function): Promise<object>;
export function getPlayerLeaderboard(page: number, callback: Function): Promise<object>;
export function getRace(trackId: number, uid: number|string, callback: Function): Promise<Race>;
export function getRandom(min?: number, max?: number, callback: Function): Promise<Track>;
export function getTrack(id: number, callback: Function): Promise<Track>;
export function getTrackLeaderboard(trackId: number, callback: Function): Promise<object>;
export function getUser(uid: string|number, callback: Function): Promise<User>;

//#endregion

//#region Classes

export class Builder {
	public constructor();
	public get fillStyle(): string;
	public set fillStyle(value: string): string;
	public get font(): string;
	public set font(value: string): string;
	public get globalCompositeOperation(): string;
	public set globalCompositeOperation(value: string): string;
	public lineDash: Array;
	public get lineDashOffset(): number;
	public set lineDashOffset(value: number): number;
	public get lineWidth(): number;
	public set lineWidth(value: number): number;
	public get strokeStyle(): string;
	public set strokeStyle(value: string): string;
	public get textAlign(): string;
	public set textAlign(value: string): string;
	public get textBaseline(): string;
	public set textBaseline(value: string): string;
	public get physics(): string;
	public get scenery(): string;
	public get powerups(): string;
	public get code(): string;
	public set code(value: string): string;

	public arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterClockwise: boolean): this;
	public arc(...args: { x: number, y: number, radius: number, startAngle: number, endAngle: number, counterClockwise: boolean }[]): this;
	public arcTo(cpx: number, cpy: number, x: number, y: number, radius: number): this;
	public beginPath(): this;
	public bezierCurveTo(p1x: number, p1y: number, p2x: number, p2y: number, p3x: number, p3y: number): this;
	public clear(): this;
	public clearRect(x: number, y: number, width: number, height: number): void;
	public clip(): void;
	public closePath(): this;
	public createImageData(width: number, height: number): object;
	public drawImage(image: Image | object, sx: number, sy: number, sWidth: number, sHeight: number, dx: number, dy: number, dWidth: number, dHeight: number): this;
	public ellipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number): void;
	public fill(): this;
	public fillRect(x: number, y: number, width: number, height: number): this;
	public getImageData(x: number, y: number, width: number, height: number): this;
	public getLineDash(): Array;
	public lineTo(x: number, y: number): this;
	public measureText(text: string): object;
	public moveTo(x: number, y: number): this;
	public putImageData(data: object, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): this;
	public quadraticCurveTo(p1x: number, p1y: number, p2x: number, p2y: number): this;
	public rect(x: number, y: number, width: number, height: number): this;
	public restore(): void;
	public rotate(x: number): this;
	public save(): void;
	public scale(x: number, y: number): this;
	public setLineDash(...args: any[]): void;
	public strokeLine(x: number, y: number, x2: number, y2: number): this;
	public strokeRect(x: number, y: number, width: number, height: number): this;
	public strokeText(content: string, x: number, y: number): this;
	public star(x: number, y: number): this;
	public boost(x: number, y: number): this;
	public gravity(x: number, y: number): this;
	public slowmo(x: number, y: number): this;
	public bomb(x: number, y: number): this;
	public checkpoint(x: number, y: number): this;
	public antigravity(x: number, y: number): this;
	public teleport(x: number, y: number, ex: number, ey: number): this;
	public heli(x: number, y: number, t: number): this;
	public truck(x: number, y: number, t: number): this;
	public balloon(x: number, y: number, t: number): this;
	public blob(x: number, y: number, t: number): this;
	public translate(x: number, y: number): this;
}

export class Client extends EventEmitter {
	public constructor(options?: ClientOptions);
	public communitySignup(username: string, email: string, callback?: Function): Promise<object>;
	public communityTransfer(username: string, email: string, secondaryEmail: string, callback?: Function): Promise<object>;
	public generateCoupon(platform: string, coins: number, gems: number, callback: Function): Promise<object>;
	public login(asr: string | { username: string, password: string }): this;
	public logout(): this;
	public redeemCoupon(coupon: string, callback: Function): Promise<object>;
	public get user(): User;

	public on<Event extends keyof ClientEvents>(event: Event, listener: (...args: ClientEvents[Event]) => void): this;
	public once<Event extends keyof ClientEvents>(event: Event, listener: (...args: ClientEvents[Event]) => void): this;
	public emit<Event extends keyof ClientEvents>(event: Event, ...args: ClientEvents[Event]): boolean;
	public off<Event extends keyof ClientEvents>(event: Event, listener: (...args: ClientEvents[Event]) => void): this;
	public removeAllListeners<Event extends keyof ClientEvents>(event?: Event): this;
}

export class Gamepad extends EventEmitter {
	public keymap: Set;
	public records: Map;
	public complete(): void;
	public getReplayString(): object;
	public reset(): void;
	public tick(max?: number): void;

	public down<Key extends keyof GamepadKeymap>(key: Key): void;
	public toggle<Key extends keyof GamepadKeymap>(key: Key): void;
	public up<Key extends keyof GamepadKeymap>(key: Key): void;

	public on<Event extends keyof GamepadEvents>(event: Event, listener: (...args: GamepadEvents[Event]) => void): this;
	public once<Event extends keyof GamepadEvents>(event: Event, listener: (...args: GamepadEvents[Event]) => void): this;
	public emit<Event extends keyof GamepadEvents>(event: Event, ...args: GamepadEvents[Event]): boolean;
	public off<Event extends keyof GamepadEvents>(event: Event, listener: (...args: GamepadEvents[Event]) => void): this;
	public removeAllListeners<Event extends keyof GamepadEvents>(event?: Event): this;
}

export class Image {
	public static load(url: string): Promise<Uint8ClampedArray | null>;
	public get data(): Uint8ClampedArray | null;
	public height: number;
	public get src(): string;
	public set src(value: string): string;
	public width: number;
}

//#endregion

//#region Typedefs

export enum BaseVehicleTypes {
	BMX = 'BMX',
	MTB = 'MTB'
}

export interface ClientEvents {
	debug: [data: object],
	error: [error: Error],
	friendLeaderboardPassed: [data: object],
	friendRequestAccepted: [data: object],
	friendRequestReceived: [data: object],
	friendTrackChallenge: [data: object],
	raw: [data: object],
	ready: [],
	subscriberTrackPublish: [data: object],
	trackLeaderboardPassed: [data: object],
	trackUsernameMention: [data: object],
	warn: [data: object]
}

export interface ClientOptions {
	debug?: boolean,
	interval?: number,
	listen?: boolean
}

export enum Events {
	ClientReady = 'ready',
	Debug = 'debug',
	Error = 'error',
	FriendLeaderboardPassed = 'friendLeaderboardPassed',
	FriendRequestAccepted = 'friendRequestAccepted',
	FriendRequestReceived = 'friendRequestReceived',
	FriendTrackChallenge = 'trackChallenge',
	Raw = 'raw',
	SubscribedTrackPublish = 'subscribedTrackPublish',
	TrackLeaderboardPassed = 'trackLeaderboardPassed',
	TrackUsernameMention = 'commentMention',
	Warn = 'warn'
}

export interface GamepadEvents {
	complete: [replayString: object],
	keyDown: [key: string, ticks: number],
	keyUp: [key: string, ticks: number],
	restart: [],
	tick: [ticks: number]
}

export enum GamepadEvents {
	Complete = 'complete',
	KeyDown = 'keyDown',
	KeyUp = 'keyUp',
	Restart = 'restart',
	Tick = 'tick'
}

export enum GamepadKeymap {
	Down = 'down',
	Left = 'left',
	Right = 'right',
	Up = 'up',
	Z = 'z'
}

//#endregion