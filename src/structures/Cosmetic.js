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
		typeof data == 'object' && this._update(data);
	}

	_update(data) {
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
				this[key] = data[key] | 0;
				break;
			case 'equipped':
			case 'limited':
			case 'show':
				this[key] = Boolean(data[key]);
				break;
			case 'img':
				this.image = data[t];
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
			}
		}
	}

	buy() {}
	equip() {}
}