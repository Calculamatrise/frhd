import EventEmitter from "events";
import Events from "../utils/Events.js";
import RequestHandler from "../utils/RequestHandler.js";
import ClientUser from "../structures/ClientUser.js";

export let token = null;

/**
 * @callback Callback
 * @extends {EventEmitter}
 * @type {BaseClient}
 */
export default class extends EventEmitter {
	#options = {
		interval: 6e4,
		listen: true
	}

	user = new ClientUser();

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
			case 'debug':
				this.debug = !!options[key];
				// this.on(Events.Debug, console.log);
				break;
			case 'interval':
				this.#options.interval = Math.max(1e3, ~~options[key]);
				break;
			case 'listen':
				this.#options.listen = Boolean(options[key])
			}
		}

		Object.defineProperty(this, 'api', { value: new RequestHandler(), writable: false })
	}

	async #listen() {
		const notifications = await this.api.datapoll().then(({ notification_count }) => notification_count > 0 ? this.api.notifications(notification_count) : []);
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

		setTimeout(this.#listen.bind(this), this.#options.interval)
	}

	async #verifyToken(value, callback) {
		if (value !== null) {
			await RequestHandler.ajax("account/settings?app_signed_request=" + value).then(async res => {
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

		return token !== null
	}

	/**
	 * 
	 * @emits Events.ClientReady
	 * @param {(string|object)} asr app signed request token
	 * @param {string} asr.username frhd login username
	 * @param {string} asr.password frhd login password
	 * @returns {Promise<Client>}
	 */
	async login(asr) {
		if (typeof asr == 'object') {
			if ((asr.hasOwnProperty('login') || asr.hasOwnProperty('username')) && asr.hasOwnProperty('password')) {
				asr = await RequestHandler.post("auth/standard_login", {
					login: asr.login || asr.username,
					password: asr.password
				}).then(res => res.app_signed_request);
			} else {
				asr = asr.asr || asr.token;
			}
		}

		await this.#verifyToken(asr, async user => {
			this.user._patch(user);
			this.user._patch(await RequestHandler.ajax("u/" + this.user.username));
			this.emit(Events.ClientReady);
			this.#options.listen !== false && this.#listen();
		});
		return this
	}

	/**
	 * 
	 * @param {string} password
	 * @returns {Promise<Client>}
	 */
	async refreshToken(password) {
		let newPassword = password + '_';
		await RequestHandler.post("account/change_password", {
			old_password: password,
			new_password: newPassword
		}, true);
		await RequestHandler.post("account/change_password", {
			old_password: newPassword,
			new_password: password
		}, true);
		return this.login({
			username: this.user.username,
			password
		})
	}

	/**
	 * 
	 * @returns {Client}
	 */
	logout() {
		this.user = null;
		token = null;
		return this
	}

	destroy() {
		this.logout()
	}
}