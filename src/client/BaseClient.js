import EventEmitter from "events";
import Events from "../utils/Events.js";
import RequestHandler from "../utils/RequestHandler.js";

export let token = null;

/**
 * @callback Callback
 * @extends {EventEmitter}
 * @type {BaseClient}
 */
export default class extends EventEmitter {
	#api = new RequestHandler();
	#user = null;
	#options = {
		interval: 6e4,
		listen: true
	}

	get api() {
		return this.#api;
	}

	get user() {
		return this.#user;
	}

	/**
	 * 
	 * @param {object} [options]
	 * @param {boolean} [options.debug]
	 * @param {number} [options.interval] time between each datapoll request
	 * @param {boolean} [options.listen] listen to incoming notifications
	 */
	constructor(options = {}) {
		if (typeof options != 'object' || options instanceof Array) {
			throw TypeError("Options must be of type: object");
		}

		super();
		for (const key in options) {
			switch(key.toLowerCase()) {
				case 'debug': {
					this.debug = !!options[key];
					// this.on(Events.Debug, console.log);
					break;
				}

				case 'interval': {
					this.#options.interval = Math.max(1e3, ~~options[key]);
					break;
				}

				case 'listen': {
					this.#options.listen = Boolean(options[key]);
					break;
				}
			}
		}
	}

	async #listen() {
		const notifications = await this.#api.datapoll().then(({ notification_count }) => notification_count > 0 ? this.#api.notifications(notification_count) : []);
		for (const notification of notifications) {
			this.debug && console.log(notification);
			this.emit(Events.Raw, notification);
			if (notification.id === null) {
				let error = new Error("Unregistered notification; " + JSON.stringify(notification));
				console.warn(error, notification);
				this.emit(Events.Error, error);
			} else {
				this.emit(notification.id, notification);
			}
		}

		setTimeout(this.#listen.bind(this), this.#options.interval);
	}

	async #verifyToken(value, callback) {
		if (value !== null) {
			await RequestHandler.ajax("/account/settings?app_signed_request=" + value).then(async res => {
				if ('user' in res) {
					token = value;
					typeof callback == 'function' && await callback(res.user);
					return true;
				}

				throw new Error("Invalid token!");
			});
		} else {
			token = null;
		}

		return token !== null;
	}

	/**
	 * 
	 * @param {(string|object)} asr app signed request token
	 * @param {string} asr.username frhd login username
	 * @param {string} asr.password frhd login password
	 * @returns {Client}
	 */
	async login(asr) {
		if (typeof asr == 'object') {
			if (asr.hasOwnProperty('username') && asr.hasOwnProperty('password')) {
				asr = await RequestHandler.post("/auth/standard_login", {
					login: asr.username,
					password: asr.password
				}).then(function(res) {
					if (res.result == false) {
						throw new Error(res.msg);
					}

					return res.app_signed_request;
				});
			}
		}

		await this.#verifyToken(asr, async user => {
			this.#user = await this.users.fetch(user.d_name) || null; // maybe create instance of User here instead of re-fetching
			this.#user.admin = user.admin;
			this.#user.moderator = user.moderator;
			this.emit(Events.ClientReady);
			if (this.#options.listen) {
				this.#listen();
			}
		});

		return this;
	}

	/**
	 * 
	 * @returns {Client}
	 */
	logout() {
		this.#user = null;
		token = null;
		return this;
	}
}