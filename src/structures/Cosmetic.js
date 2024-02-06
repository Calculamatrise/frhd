export default class Cosmetic {
	id = null;
	className = null;
	cost = 0;
	equiped = false;
	image = null;
	limited = false;
	name = null;
	options = {};
	script = null;
	show = false;
	spritesheetId = null;
	title = null;
	type = null;
	constructor(data) {
		typeof data == 'object' && this._patch(data);
	}

	_patch(data) {
		if (typeof data != 'object') {
			console.warn("Invalid data type");
			return;
		}

		for (const key in data) {
			switch (key) {
			case 'classname':
				this.className = data[key];
				break;
			case 'cost':
			case 'id':
				this[key] = parseInt(data[key]) | 0;
				break;
			case 'equipped':
			case 'limited':
			case 'show':
				this[key] = Boolean(data[key]);
				break;
			case 'img':
				this.image = data[key];
				let match = this.image.match(/\d/);
				if (match && match.length > 0) {
					this.spritesheetId = match[0];
				}
				break;
			case 'name':
			case 'options':
			case 'script':
			case 'title':
			case 'type':
				this[key] = data[key];
				break;
			case 'spritesheet_id':
				this.spritesheetId = data[key];
				break;
			default:
				this.hasOwnProperty(key) && (this[key] = data[key]);
			}
		}
	}

	/**
	 * 
	 * @returns {Promise<Cosmetic>}
	 */
	equip() {
		return RequestHandler.post("store/equip", {
			item_id: this.id
		}, true).then(() => this);
	}
}