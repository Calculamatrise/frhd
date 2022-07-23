import Image from "./Image.js";
import Alphabet from "./Alphabet.js";
import { Buffer } from "buffer";

export default class {
    /**
     * 
     * @param {String} URI image location or URI
     */
    static image(URI) {
        const image = new Image();

        image.src = URI;

        return new Promise(function(resolve, reject) {
            image.addEventListener("load", function(image) {
                resolve(image);
            });
        });
    }

    #fillStyle = "#000000";
    get fillStyle() {
        return this.#fillStyle;
    }

    /**
     * @param {String} value
     */
    set fillStyle(value) {
        if (value.match(/^(#([a-f0-9]{3,4}|[a-f0-9]{6,8})|rgba?\((\d+(,\s+)?){3,4}\))$/gi)) {
            throw new Error("INVALID VALUE");
        }

        this.#fillStyle = value;
    }

    #font = "10px sans-serif";
    get font() {
        return this.#font;
    }

    /**
     * @param {String} value
     */
    set font(value) {
        // 10px Arial
        this.#font = value;
    }

    #globalCompositeOperation = "source-over";
    get globalCompositeOperation() {
        return this.#globalCompositeOperation;
    }

    /**
     * @param {String} value
     */
    set globalCompositeOperation(value) {
        this.#globalCompositeOperation = value;
    }

    lineDash = [];
    #lineDashOffset = 0;
    get lineDashOffset() {
        return this.#lineDashOffset;
    }

    /**
     * @param {Number|String} value
     */
    set lineDashOffset(value) {
        if (isNaN(+value)) {
            throw new Error("INVALID VALUE");
        }

        this.#lineDashOffset = +value;
    }

    #lineWidth = 1;
    get lineWidth() {
        return this.#lineWidth;
    }

    /**
     * @param {Number|String} value
     */
    set lineWidth(value) {
        if (isNaN(+value)) {
            throw new Error("INVALID VALUE");
        }

        this.#lineWidth = +value;
    }

    #strokeStyle = "#000000";
    get strokeStyle() {
        return this.#strokeStyle;
    }

    /**
     * @param {String} value
     */
    set strokeStyle(value) {        
        if (value.match(/^(#[a-f0-9]{3,4}|#[a-f0-9]{6,8}|rgba?\((\d+(,\s+)?){3,4}\))/gi)) {
            throw new Error("INVALID VALUE");
        }

        this.#strokeStyle = value;
    }

    #textAlign = "start";
    get textAlign() {
        return this.#textAlign;
    }

    /**
     * @param {String} value
     */
    set textAlign(value) {
        this.#textAlign = value;
    }

    #textBaseline = "start";
    get textBaseline() {
        return this.#textBaseline;
    }

    /**
     * @param {String} value
     */
    set textBaseline(value) {
        this.#textBaseline = value;
    }

    /**
     * @private
     */
    #position = {
        x: null,
        y: null
    }

    /**
     * @private
     */
    #translation = {
        x: 0,
        y: 0
    }
    
    /**
     * @private
     */
    #cache = {}
    #physics = []
    #scenery = []
    #powerups = {
        targets: [],
        boosters: [],
        gravity: [],
        slowmos: [],
        bombs: [],
        checkpoints: [],
        antigravity: [],
        teleporters: [],
        vehicles: {
            heli: [],
            truck: [],
            balloon: [],
            blob: []
        }
    }
    #segment = []
    get lines() {
        return this.strokeStyle.match(/(#000|black|rgba?\((0(,(\s+)?)?){3,4}\))+/gi) ? this.#physics : this.#scenery;
    }

    get filler() {
        return this.fillStyle.match(/(#000|black|rgba?\((0(,(\s+)?)?){3,4}\))+/gi) ? this.#physics : this.#scenery;
    }

    get physics() {
        return this.#physics.map((vector) => vector.map((value) => parseInt(value).toString(32)).join(" ")).join(",");
    }

    get scenery() {
        return this.#scenery.map((vector) => vector.map((value) => parseInt(value).toString(32)).join(" ")).join(",");
    }

    get powerups() {
        let powerups = "";
        for (const t in this.#powerups) {
            switch(t) {
                case "targets":
                    for (const e of this.#powerups[t]) {
                        powerups += `T ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;
                
                case "boosters":
                    for (const e of this.#powerups[t]) {
                        powerups += `B ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "gravity":
                    for (const e of this.#powerups[t]) {
                        powerups += `G ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "slowmos":
                    for (const e of this.#powerups[t]) {
                        powerups += `S ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;
                
                case "bombs":
                    for (const e of this.#powerups[t]) {
                        powerups += `O ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "checkpoints":
                    for (const e of this.#powerups[t]) {
                        powerups += `C ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "antigravity":
                    for (const e of this.#powerups[t]) {
                        powerups += `A ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "teleporters":
                    for (const e of this.#powerups[t]) {
                        powerups += `W ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "vehicles":
                    for (const e in this.#powerups[t]) {
                        for (const i of this.#powerups[t][e]) {
                            powerups += `V ${i.map(t => t.toString(32)).join(" ")},`;
                        }
                    }
                break;
            }
        }

        return powerups;
    }

    get code() {
        return this.physics + "#" + this.scenery + "#" + this.powerups;
    }

    /**
     * @param {String} value track code you wish to manipulate.
     */
    set code(value) {
        if (typeof value !== "string") {
            throw new TypeError("Track code must be of type string!");
        }
        
        value = value.split(/\u0023/g).map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));
        this.#physics = value[0] ? value[0].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [];
        this.#scenery = value[1] ? value[1].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [];
        for (const powerup of value[2]) {
            switch(powerup[0]) {
                case "T":
                    this.#powerups.targets.push(powerup.slice(1).map(t => parseInt(t, 32)));
                    break;
                
                case "B":
                    this.#powerups.boosters.push(powerup.slice(1).map(t => parseInt(t, 32)));
                    break;

                case "G":
                    this.#powerups.gravity.push(powerup.slice(1).map(t => parseInt(t, 32)));
                    break;

                case "S":
                    this.#powerups.slowmos.push(powerup.slice(1).map(t => parseInt(t, 32)));
                    break;

                case "O":
                    this.#powerups.bombs.push(powerup.slice(1).map(t => parseInt(t, 32)));
                    break;

                case "C":
                    this.#powerups.checkpoints.push(powerup.slice(1).map(t => parseInt(t, 32)));
                    break;

                case "A":
                    this.#powerups.antigravity.push(powerup.slice(1).map(t => parseInt(t, 32)));
                    break;

                case "W":
                    this.#powerups.teleporters.push(powerup.slice(1).map(t => parseInt(t, 32)));
                    break;

                case "V":
                    switch(powerup[3]) {
                        case "1":
                            this.#powerups.vehicles.heli.push(powerup.slice(1).map(t => parseInt(t, 32)));
                            break;

                        case "2":
                            this.#powerups.vehicles.truck.push(powerup.slice(1).map(t => parseInt(t, 32)));
                            break;

                        case "3":
                            this.#powerups.vehicles.balloon.push(powerup.slice(1).map(t => parseInt(t, 32)));
                            break;

                        case "4":
                            this.#powerups.vehicles.blob.push(powerup.slice(1).map(t => parseInt(t, 32)));
                            break;
                    }

                    break;
            }
        }
    }

    /**
     * 
     * @param {Number|String} x position x
     * @param {Number|String} y position y
     * @param {Number|String} radius radius of the arc
     * @param {Number|String} startAngle angle in radians
     * @param {Number|String} endAngle angle in radians
     * @param {Boolean} counterClockwise decide the direction at which the arc is drawn
     * @returns {Builder} instance of Builder.
     */
    arc(x, y, radius, startAngle, endAngle, counterClockwise = false) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.arc(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (typeof argument === "boolean") {
                continue;
            }

            if (isNaN(+argument)) {
                throw new Error("INVALID_VALUE");
            }
        }

        const points = []
        if (counterClockwise) {
            for (let i = parseFloat(startAngle) * 180 / Math.PI % 360; i >= -360 + parseFloat(endAngle) * 180 / Math.PI % 360; i -= Math.max(360 / parseFloat(radius), 2)) {
                points.push([
                    parseFloat(x) + parseFloat(radius) * Math.cos(i * Math.PI / 180),
                    parseFloat(y) + parseFloat(radius) * Math.sin(i * Math.PI / 180)
                ]);
            }
        } else {
            for (let i = parseFloat(startAngle) * 180 / Math.PI % 360; i < (parseFloat(endAngle) * 180 / Math.PI % 360 || 360); i += Math.max(360 / parseFloat(radius), 2)) {
                points.push([
                    parseFloat(x) + parseFloat(radius) * Math.cos(i * Math.PI / 180),
                    parseFloat(y) + parseFloat(radius) * Math.sin(i * Math.PI / 180)
                ]);
            }
        }

        points.push(points[0]);

        this.moveTo(...points.shift());
        this.lineTo(...points);

        this.#position.x = this.#translation.x + points[points.length - 2];
        this.#position.y = this.#translation.y + points[points.length - 1];

        return this;
    }

    /**
     * 
     * @param {Number|String} cpx position x of the control point
     * @param {Number|String} cpy position y of the control point
     * @param {Number|String} x position x of the end point
     * @param {Number|String} y position y of the end point
     * @param {Number|String} radius radius of the arc
     * @returns {Builder} instance of Builder.
     */
    arcTo(cpx, cpy, x, y, radius) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.arcTo(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(+argument)) {
                throw new Error("INVALID_VALUE");
            }
        }

        for (let i = 0; i < 1.01; i += (750 / parseFloat(radius)) / 100) {
            this.lineTo([
                Math.pow((1 - i), 2) * (this.#position.x + (parseFloat(cpx) - this.#position.x) - parseFloat(radius)) + 2 * (1 - i) * i * parseFloat(cpx) + Math.pow(i, 2) * parseFloat(x),
                Math.pow((1 - i), 2) * this.#position.y + 2 * (1 - i) * i * parseFloat(cpy) + Math.pow(i, 2) * (y + (parseFloat(cpy) - parseFloat(y)) + parseFloat(radius))
            ]);
        }

        return this;
    }
    
    beginPath() {
        this.#position.x = this.#translation.x;
        this.#position.y = this.#translation.y;

        return this;
    }

    /**
     * 
     * @param {string|number} p1x position x of the first control point
     * @param {string|number} p1y position y of the first control point
     * @param {string|number} p2x position x of the second control point
     * @param {string|number} p2y position y of the second control point
     * @param {string|number} p3x position x of the end point
     * @param {string|number} p3y position y of the end point
     * @returns {Builder} instance of Builder.
     */
    bezierCurveTo(p1x, p1y, p2x, p2y, p3x, p3y) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.bezierCurveTo(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(+argument)) {
                throw new Error("INVALID_VALUE");
            }
        }

        const p1 = { x: parseFloat(p1x), y: parseFloat(p1y) }
        const p2 = { x: parseFloat(p2x), y: parseFloat(p2y) }
        const p3 = { x: parseFloat(p3x), y: parseFloat(p3y) }
        for (let i = 0, cX, bX, cY, bY; i < 1.01; i += (1000 / Math.abs(Math.abs(this.#position.x * this.#position.y) - Math.abs(p3.x * p3.y))) / 10) {
            cX = 3 * (p1.x - this.#position.x),
            bX = 3 * (p2.x - p1.x) - cX,
            cY = 3 * (p1.y - this.#position.y),
            bY = 3 * (p2.y - p1.y) - cY,
            this.lineTo(
                ((p3.x - this.#position.x - cX - bX) * Math.pow(i, 3)) + (bX * Math.pow(i, 2)) + (cX * i) + this.#position.x,
                ((p3.y - this.#position.y - cY - bY) * Math.pow(i, 3)) + (bY * Math.pow(i, 2)) + (cY * i) + this.#position.y
            );
        }

        return this;
    }

    /**
     * 
     * @param {Number|String} x rectangle clip position along the x-axis
     * @param {Number|String} y rectangle clip position along the y-axis
     * @param {Number|String} width clip rectangle width
     * @param {Number|String} height clip rectangle height
     */
    clearRect(x, y, width, height) {
        if (width < 0 || height < 0) {
            throw new Error("Width and Height cannot be negative!");
        }

        for (const line of this.#physics) {
            if (line[0] > x && line[1] > y && line[2] < x + width && line[3] < y + height) {
                this.#physics.splice(this.#physics.indexOf(line), 1);
            }
        }
    }

    clip() {}

    closePath() {
        if (!this.#segment) {
            return this;
        }

        if (this.#segment.length < 1) {
            return;
        }
        
        for (const value of this.#segment) {
            if (isNaN(parseFloat(value))) {
                return;
            }
        }

        let [ x, y ] = this.#segment;

        this.lineTo(x, y);

        return this;
    }


    /**
     * 
     * @param {Number} width the width to give to the new ImageData object.
     * @param {Number} height the height to give to the new ImageData object.
     * @returns {Object} ImageData object.
     */
    createImageData(width, height) {
        if (typeof width === "object" && height === void 0) {
            return {
                data: new Uint8ClampedArray(Array.from({
                    length: width.width * width.height * 4
                }), () => 0),
                width: width.width,
                height: width.height
            }
        }        

        return {
            data: new Uint8ClampedArray(Array.from({
                length: width * height * 4
            }), () => 0),
            width,
            height
        }
    }

    /**
     * 
     * @param {Image} image instance of Image constructor
     * @param {Number|String} sx source image position along the x-axis
     * @param {Number|String} sy source image position along the y-axis
     * @param {Number|String} sWidth source image width
     * @param {Number|String} sHeight source image height
     * @param {Number|String} dx image along the x-axis on the canvas
     * @param {Number|String} dy image along the y-axis on the canvas
     * @param {Number|String} dWidth image width on the canvas
     * @param {Number|String} dHeight image height on the canvas
     * @returns {Builder} instance of Builder.
     */
    drawImage(image, sx = 0, sy = 0, sWidth = image.width, sHeight = image.height, dx = 0, dy = 0, dWidth = sWidth, dHeight = sHeight) {
        if (typeof image !== "object") {
            throw new Error("Invalid Image");
        }

        let pixels = new Uint8ClampedArray(image.data.map(function(item, index, data) {
            if (index % 4 === 0) {
                let average = item * .2 + data[index + 1] * .7 + data[index + 2] * .1;

                return average <= 85 ? 0 : average <= 170 ? 170 : 255;
            }

            return false;
        }).filter((item, index) => {
            return index % 4 === 0
        }));

        let width = sWidth;
        let height = sHeight;

        if (arguments.length > 5) {
            pixels = pixels.slice(image.width * +sy, image.width * +sHeight);
            pixels = pixels.filter((item, index) => index % image.width >= +sx && index % image.width < +sWidth);
            width -= +sx;
            height -= +sy;
        }

        for (let y = 0, iy; y < pixels.length / width; y++) {
            for (let x = 0, ix, dxt, e, n; x < pixels.length / height; x++) {
                e = x + y * width;

                if (pixels[e] === 255 || pixels[e - 1] === pixels[e] && Math.floor((e - 1) / width) === y) {
                    continue;
                }

                ix = x * (arguments.length > 5 ? (dWidth / width) * 2 : 2) + (arguments.length > 5 ? dx : sx);
                iy = y * (arguments.length > 5 ? (dHeight / height) * 2 : 2) + (arguments.length > 5 ? dy : sy);

                for (let i = x + 1, s; i <= width; i++) {
                    s = i + y * width;
                    
                    if (i >= width - 1 || pixels[e] !== pixels[s]) {
                        dxt = (i - 1) * (arguments.length > 5 ? (dWidth / width) * 2 : 2) + (arguments.length > 5 ? dx : sx);

                        break;
                    }
                }

                if (pixels[e] == 0) {
                    this.#physics.push([Math.floor(ix), Math.floor(iy), Math.floor(dxt), Math.floor(iy)]);
                    n = arguments.length > 5 ? (dHeight / height) * 2 : 2;
                    while(n > 0) {
                        this.#physics.push([Math.floor(ix), Math.floor(iy + n), Math.floor(dxt), Math.floor(iy + n)]);

                        n -= 2;
                    }
                } else {
                    this.#scenery.push([Math.floor(ix), Math.floor(iy), Math.floor(dxt), Math.floor(iy)]);
                    n = arguments.length > 5 ? (dHeight / height) * 2 : 2;
                    while(n > 0) {
                        this.#scenery.push([Math.floor(ix), Math.floor(iy + n), Math.floor(dxt), Math.floor(iy + n)]);

                        n -= 2;
                    }
                }
            }
        }

        return this;
    }

    /**
     * 
     * @param {Number|String} x 
     * @param {Number|String} y 
     * @param {Number|String} radiusX 
     * @param {Number|String} radiusY 
     * @param {Number|String} rotation 
     */
    ellipse(x, y, radiusX, radiusY, rotation) {
        let old = {};
        for (let i = 0; i < 360; i += Math.max(360 / Math.sqrt(radiusX ** 2 + radiusY ** 2), 2)) {
            if (i === 0) {
                this.moveTo(
                    old.x = x + Math.sqrt((radiusX - x) ** 2) * Math.cos(i * Math.PI / 180),
                    old.y = y + Math.sqrt((radiusY - y) ** 2) * Math.sin(i * Math.PI / 180)
                );
                continue;
            }

            this.lineTo([
                x + Math.sqrt((radiusX - x) ** 2) * Math.cos(i * Math.PI / 180),
                y + Math.sqrt((radiusY - y) ** 2) * Math.sin(i * Math.PI / 180)
            ]);
        }

        this.lineTo([
            old.x,
            old.y
        ]);
    }

    fill() {
        this.filler.push(...this.#segment);

        this.#segment = []

        return this;
    }

    /**
     * 
     * @param {Number|String} x position of the rectangle along the x-axis
     * @param {Number|String} y position of the rectangle along the y-axis
     * @param {Number|String} width width of the rectangle
     * @param {Number|String} height height of the rectangle
     */
    fillRect(x, y, width, height) {
        for (const argument of arguments) {
            if (isNaN(+argument)) {
                throw new Error("INVALID_VALUE");
            }
        }

        for (let i = y; i < y + height; i++) {
            this.filler.push([
                this.#translation.x + x, this.#translation.y + i,
                this.#translation.x + x + width, this.#translation.y + i
            ]);
        }

        return this;
    }

    /**
     * 
     * @param {Number|String} x 
     * @param {Number|String} y 
     * @param {Number|String} width 
     * @param {Number|String} height 
     * @returns {String} 
     */
    getImageData(x, y, width, height) {
        /* const array = Array.from({ length: width * height * 4 }, () => 255);

        let physics = this.#physics.filter((line) => line[0] > x && line[1] > y && line[2] < x + width && line[3] < y + height);
        let scenery = this.#scenery.filter((line) => line[0] > x && line[1] > y && line[2] < x + width && line[3] < y + height);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let pixel = (y + x * width) * 4;
                for (const line of physics) {
                    let len = Math.sqrt((line[2] - line[0]) ** 2 + (line[3] - line[1]) ** 2);
                    let difference = (x - line[0]) * (line[2] - line[0] / len) + (y - line[1]) * ((line[3] - line[1] / len));
                    let vector = [];
                    if (difference >= len) {
                        vector.push(line[2], line[3]);
                    } else {
                        vector.push(line[0], line[1]);
                        if (difference > 0) {
                            vector[0] += line[2] - line[0] / len;
                            vector[1] += line[3] - line[1] / len;
                        }
                    }

                    if (Math.sqrt((x - vector[0]) ** 2 + (y - vector[1]) ** 2) <= 2) {
                        array[pixel] = 0;
                        array[pixel + 1] = 0;
                        array[pixel + 2] = 0;
                    }
                }

                for (const line of scenery) {
                    let len = Math.sqrt((line[2] - line[0]) ** 2 + (line[3] - line[1]) ** 2);
                    let difference = (x - line[0]) * (line[2] - line[0] / len) + (y - line[1]) * ((line[3] - line[1] / len));
                    let vector = [];
                    if (difference >= len) {
                        vector.push(line[2], line[3]);
                    } else {
                        vector.push(line[0], line[1]);
                        if (difference > 0) {
                            vector[0] += line[2] - line[0] / len;
                            vector[1] += line[3] - line[1] / len;
                        }
                    }

                    if (Math.sqrt((x - vector[0]) ** 2 + (y - vector[1]) ** 2) <= 2) {
                        array[pixel] = 170;
                        array[pixel + 1] = 170;
                        array[pixel + 2] = 170;
                    }
                }
            }
        }

        const data = new Uint8ClampedArray(array);
        console.log(data, Buffer.from(data).toString("base64"))
        */

        return this.code;
    }

    getLineDash() {
        return this.lineDash.split(/\s+/g);
    }

    /**
     * 
     * @param {Number|String} x position x of the end point
     * @param {Number|String} y position y of the end point
     * @returns {Builder} instance of Builder.
     */
    lineTo(x, y) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.lineTo(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(parseFloat(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.lines.push([
            this.#position.x, this.#position.y,
            parseFloat(x), parseFloat(y)
        ]);
        
        this.#position.x = this.#translation.x + parseFloat(x);
        this.#position.y = this.#translation.y + parseFloat(y);

        return this;
    }

    /**
     * 
     * @param {String} text 
     * @returns {Object} properties of text.
     */
    measureText(text) {
        return {
            width: text.length * parseFloat(this.font),
            height: parseFloat(this.font),
            actualBoundingBoxLeft: 0,
            actualBoundingBoxRight: 0
        }
    }

    /**
     * 
     * @param {Number|String} x position x of the starting point
     * @param {Number|String} y position y of the starting point
     * @returns {Builder} instance of Builder.
     */
    moveTo(x, y) {
        for (const argument of arguments) {
            if (isNaN(parseFloat(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.#position.x = this.#translation.x + parseFloat(x);
        this.#position.y = this.#translation.y + parseFloat(y);

        return this;
    }

    /**
     * 
     * @param {Object} data an ImageData object containing the array of pixel values.
     * @param {Number|String} dx horizontal position (x coordinate) at which to place the image data in the destination canvas.
     * @param {Number|String} dy vertical position (y coordinate) at which to place the image data in the destination canvas.
     * @param {Number|String} dirtyX horizontal position (x coordinate) of the top-left corner from which the image data will be extracted.
     * @param {Number|String} dirtyY vertical position (y coordinate) of the top-left corner from which the image data will be extracted.
     * @param {Number|String} dirtyWidth width of the rectangle to be drawn.
     * @param {Number|String} dirtyHeight height of the rectangle to be drawn.
     */
    putImageData(data, dx = 0, dy = 0, dirtyX = 0, dirtyY = 0, dirtyWidth = data.width, dirtyHeight = data.height) {
        return this.drawImage(data, dirtyX, dirtyY, dirtyWidth, dirtyHeight, dx, dy);
    }

    /**
     * 
     * @param {string|number} p1x position x of the control point
     * @param {string|number} p1y position y of the control point
     * @param {string|number} p2x position x of the end point
     * @param {string|number} p2y position y of the end point
     * @returns {Builder} instance of Builder.
     */
    quadraticCurveTo(p1x, p1y, p2x, p2y) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.quadraticCurveTo(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(+argument)) {
                throw new Error("INVALID_VALUE");
            }
        }

        for (let i = 0; i < 1; i += 1 / 10) {
            this.lineTo(
                Math.pow((1 - i), 2) * this.#position.x + 2 * (1 - i) * i * parseFloat(p1x) + Math.pow(i, 2) * parseFloat(p2x),
                Math.pow((1 - i), 2) * this.#position.y + 2 * (1 - i) * i * parseFloat(p1y) + Math.pow(i, 2) * parseFloat(p2y)
            );
        }

        return this;
    }

    /**
     * 
     * @param {Number|String} x 
     * @param {Number|String} y 
     * @param {Number|String} width 
     * @param {Number|String} height 
     * @returns {Builder} instance of Builder.
     */
    rect(x, y, width, height) {
        for (const argument of arguments) {
            if (isNaN(+argument)) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.lines.push([
            this.#translation.x + x, this.#translation.y + y,
            this.#translation.x + x + width, this.#translation.y + y,
            this.#translation.x + x + width, this.#translation.y + y + height,
            this.#translation.x + x, this.#translation.y + y + height,
            this.#translation.x + x, this.#translation.y + y
        ]);
        
        return this;
    }

    restore() {
        for (const property in this.#cache) {
            if (property === "position") {
                this.#position.x = this.#cache[property].x
                this.#position.y = this.#cache[property].y

                continue;
            }
            
            if (this.#cache.hasOwnProperty(property)) {
                this[property] = this.#cache[property];
            }
        }
    }

    rotate(x = 0) {
        if (isNaN(+x)) {
            throw new Error("INVALID_VALUE")
        }

        let rotationFactor = x;
        x *= Math.PI / 180;
        for (const t of this.#physics) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] = t[e] * Math.cos(x) + t[e + 1] * Math.sin(x),
                t[e + 1] = t[e + 1] * Math.cos(x) - t[e] * Math.sin(x);
            }
        }

        for (const t of this.#scenery) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] = t[e] * Math.cos(x) + t[e + 1] * Math.sin(x),
                t[e + 1] = t[e + 1] * Math.cos(x) - t[e] * Math.sin(x);
            }
        }

        for (const t in this.#powerups) {
            for(const e in this.#powerups[t]) {
                switch(t) {
                    case "teleporters":
                        this.#powerups[t][e][2] = this.#powerups[t][e][2] * Math.cos(x) + this.#powerups[t][e][3] * Math.sin(x),
                        this.#powerups[t][e][3] = this.#powerups[t][e][3] * Math.cos(x) - this.#powerups[t][e][2] * Math.sin(x);
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this.#powerups[t][e][0] = this.#powerups[t][e][0] * Math.cos(x) + this.#powerups[t][e][1] * Math.sin(x),
                        this.#powerups[t][e][1] = this.#powerups[t][e][1] * Math.cos(x) - this.#powerups[t][e][0] * Math.sin(x);
                        if (["boosters", "gravity"].includes(t)) {
                            this.#powerups[t][e][2] += rotationFactor;
                        }
                    break;

                    case "vehicles":
                        for (const i in this.#powerups[t][e]) {
                            this.#powerups[t][e][i][0] = this.#powerups[t][e][i][0] * Math.cos(x) + this.#powerups[t][e][i][1] * Math.sin(x),
                            this.#powerups[t][e][i][1] = this.#powerups[t][e][i][1] * Math.cos(x) - this.#powerups[t][e][i][0] * Math.sin(x);
                        }
                    break;
                }
            }
        }
        
        return this;
    }

    save() {
        this.#cache = {
            ...this,
            position: this.#position
        }
    }

    scale(x = 1, y = 1) {
        for (const t of this.#physics) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += t[e] * x;
                t[e + 1] += t[e + 1] * y;
            }
        }

        for (const t of this.#scenery) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += t[e] * x;
                t[e + 1] += t[e + 1] * y;
            }
        }

        for (const t in this.#powerups) {
            for(const e in this.#powerups[t]) {
                switch(t) {
                    case "teleporters":
                        this.#powerups[t][e][2] += this.#powerups[t][e][2] * x;
                        this.#powerups[t][e][3] += this.#powerups[t][e][3] * y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this.#powerups[t][e][0] += this.#powerups[t][e][0] * x;
                        this.#powerups[t][e][1] += this.#powerups[t][e][1] * y;
                    break;

                    case "vehicles":
                        for (const i in this.#powerups[t][e]) {
                            this.#powerups[t][e][i][0] += this.#powerups[t][e][i][0] * x;
                            this.#powerups[t][e][i][1] += this.#powerups[t][e][i][1] * y;
                        }
                    break;
                }
            }
        }

        return this;
    }

    setLineDash(...args) {
        this.lineDash = args.join(" ");
    }

    /**
     * 
     * @deprecated this method may be removed in the near future
     * @param {Number|String} x position x of the starting point
     * @param {Number|String} y position y of the starting point
     * @param {Number|String} x2 position x of the end point
     * @param {Number|String} y2 position y of the end point
     * @returns {Builder} instance of Builder.
     */
    strokeLine(x, y, x2, y2) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                this.strokeLine(...argument);
            }

            return;
        }

        for (const argument of arguments) {
            if (isNaN(parseFloat(argument))) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.lines.push([
            parseFloat(x), parseFloat(y),
            parseFloat(x2), parseFloat(y2)
        ]);

        return this;
    }

    /**
     * 
     * @param {Number|String} x 
     * @param {Number|String} y 
     * @param {Number|String} width 
     * @param {Number|String} height 
     * @returns {Builder} instance of Builder.
     */
    strokeRect(x, y, width, height) {
        for (const argument of arguments) {
            if (isNaN(+argument)) {
                throw new Error("INVALID_VALUE");
            }
        }

        this.lines.push([
            this.#translation.x + x, this.#translation.y + y,
            this.#translation.x + x + width, this.#translation.y + y,
            this.#translation.x + x + width, this.#translation.y + y + height,
            this.#translation.x + x, this.#translation.y + y + height,
            this.#translation.x + x, this.#translation.y + y
        ]);
        
        return this;
    }

    /**
     * 
     * @throws this method is incomplete.
     * @param {String} content 
     * @param {Number|String} x 
     * @param {Number|String} y 
     */
    strokeText(content, x, y) {
        content = content.toUpperCase().split(/\n/g);

        this.beginPath();
        content.forEach((line, offset) => {
            for (const char in line) {
                if (typeof Alphabet[line[char]] === "function") {
                    Alphabet[line[char]](this, x, y + offset * (Alphabet.letterSpacing * (parseInt(Alphabet.fontSize) * 4)) - 2, (char + 1) * (Alphabet.letterSpacing * (parseInt(Alphabet.fontSize) / 5)) - 2);
                }
            }
        });

        return this;
    }
    
    star(x, y) {
        this.#powerups.targets.push([x, y]);
        return this;
    }

    boost(x, y, d) {
        this.#powerups.boosters.push([x, y, d]);
        return this;
    }

    gravity(x, y) {
        this.#powerups.gravity.push([x, y, d]);
        return this;
    }

    slowmo(x, y) {
        this.#powerups.slowmos.push([x, y]);
        return this;
    }

    bomb(x, y) {
        this.#powerups.bombs.push([x, y]);
        return this;
    }

    checkpoint(x, y) {
        this.#powerups.checkpoints.push([x, y]);
        return this;
    }

    antigravity(x, y) {
        this.#powerups.antigravity.push([x, y]);
        return this;
    }

    teleport(x, y, ex, ey) {
        this.#powerups.teleporters.push([x, y, ex, ey]);
        return this;
    }

    heli(x, y, t) {
        this.#powerups.vehicles.heli.push([x, y, 1, t]);
        return this;
    }

    truck(x, y, t) {
        this.#powerups.vehicles.truck.push([x, y, 2, t]);
        return this;
    }

    balloon(x, y, t) {
        this.#powerups.vehicles.balloon.push([x, y, 3, t]);
        return this;
    }

    blob(x, y, t) {
        this.#powerups.vehicles.blob.push([x, y, 4, t]);
        return this;
    }

    translate(x = 0, y = 0) {
        this.#translation.x = x;
        this.#translation.y = y;
        return this;
    }

    clear() {
        this.#physics = [],
        this.#scenery = [],
        this.#powerups = {
            targets: [],
            slowmos: [],
            bombs: [],
            checkpoints: [],
            antigravity: [],
            boosters: [],
            gravity: [],
            teleporters: [],
            vehicles: {
                heli: [],
                truck: [],
                balloon: [],
                blob: []
            }
        }
        
        return this;
    }
}