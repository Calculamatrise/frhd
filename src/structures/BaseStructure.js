export default class {
	id = null;
	constructor(properties) {
		Object.defineProperties(this, Object.assign({
			createdAt: { value: null, writable: true },
			createdTimestamp: { value: null, writable: true }
		}, properties))
	}

	_patch(data) {
		if (typeof data != 'object' || data === null) {
			console.warn("Invalid data type");
			return;
		}

		for (const key in data) {
			switch (key) {
			case 'id':
				this.id = data[key];
				break;
			default:
				if (data[key] !== null && this.hasOwnProperty(key)) {
					if (this[key] !== null && Object.getPrototypeOf(this[key]) !== Object.getPrototypeOf(data[key])) {
						break;
					}
					this[key] = data[key]
				}
			}
		}
	}

	static async create(data) {
		const instance = new this();
		await instance._patch(data);
		return instance;
	}
}