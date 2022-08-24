export default class {
    constructor(data) {
        if (typeof data != "object" || data === null) {
            throw new TypeError("INVALID_DATA_TYPE");
        }

        this.id = null,
        this.title = null,
        this.type = null,
        this.name = null,
        this.cost = null,
        this.className = null,
        this.options = null,
        this.equiped = null,
        this.spritesheetId = null,
        this.image = null,
        this.show = null,
        this.script = null,
        this.limited = null;
        
        this.init(data);
    }
    init(data) {
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
}