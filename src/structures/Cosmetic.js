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
		if (typeof data != 'object') return;
		for (const t in data) {
			switch(t) {
				case "id":
				case "title":
				case "type":
				case "name":
				case "cost":
				case "options":
				case "equiped":
				case "show":
				case "script":
				case "limited":
					this[t] = isNaN(parseInt(data[t])) ? data[t] : parseFloat(data[t]);
				break;

				case "classname":
					this.className = data[t];
				break;
				
				case "spritesheet_id":
					this.spritesheetId = data[t];
				break;

				case "img":
					this.image = data[t];
				break;
			}
		}
	}

	buy() {}
	equip() {}
}