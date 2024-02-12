import Alphabet from "./Alphabet.js";
import Image from "./Image.js";

export default class {
	#fillStyle = "#000000";
	get fillStyle() {
		return this.#fillStyle;
	}

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

	set font(value) {
		// 10px Arial
		this.#font = value;
	}

	#globalCompositeOperation = "source-over";
	get globalCompositeOperation() {
		return this.#globalCompositeOperation;
	}

	set globalCompositeOperation(value) {
		this.#globalCompositeOperation = value;
	}

	lineDash = [];
	#lineDashOffset = 0;
	get lineDashOffset() {
		return this.#lineDashOffset;
	}

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

	set strokeStyle(value) {        
		if (value.match(/^(#([a-f0-9]{3,4}|[a-f0-9]{6,8})|rgba?\((\d+(,\s+)?){3,4}\))/gi)) {
			throw new Error("INVALID VALUE");
		}

		this.#strokeStyle = value;
	}

	#textAlign = "start";
	get textAlign() {
		return this.#textAlign;
	}

	set textAlign(value) {
		this.#textAlign = value;
	}

	#textBaseline = "start";
	get textBaseline() {
		return this.#textBaseline;
	}

	set textBaseline(value) {
		this.#textBaseline = value;
	}

	#position = {
		x: null,
		y: null
	}

	#translation = {
		x: 0,
		y: 0
	}

	#cache = {}
	#physics = [];
	#scenery = [];
	#powerups = {
		A: new Set(),
		B: new Set(),
		C: new Set(),
		G: new Set(),
		O: new Set(),
		S: new Set(),
		T: new Set(),
		W: new Set(),
		vehicles: {
			1: new Set(),
			2: new Set(),
			3: new Set(),
			4: new Set()
		}
	}
	#segment = [];
	get #lines() {
		return this.strokeStyle.match(/(#000|black|rgba?\((0(,(\s+)?)?){3,4}\))+/gi) ? this.#physics : this.#scenery;
	}

	get #filler() {
		return this.fillStyle.match(/(#000|black|rgba?\((0(,(\s+)?)?){3,4}\))+/gi) ? this.#physics : this.#scenery;
	}

	import(value) {
		if (typeof value != 'string') {
			throw new TypeError("Track code must be of type string!");
		}

		value = value.split(/\u0023/g).map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));
		this.#physics = Array.from(value[0] ? value[0].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : []);
		this.#scenery = Array.from(value[1] ? value[1].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : []);
		for (const powerup of value[2]) {
			const [type] = powerup;
			switch(type) {
			case 'V':
				this.#powerups.vehicles[powerup[3]]?.add(powerup.slice(1).map(t => parseInt(t, 32)));
				break;
			default:
				this.#powerups[type]?.add(powerup.slice(1).map(t => parseInt(t, 32)));
			}
		}
	}

	/**
	 * 
	 * @param {number|string} x position x
	 * @param {number|string} y position y
	 * @param {number|string} radius radius of the arc
	 * @param {number|string} startAngle angle in radians
	 * @param {number|string} endAngle angle in radians
	 * @param {boolean} counterClockwise decide the direction at which the arc is drawn
	 * @returns {this}
	 */
	arc(x, y, radius, startAngle, endAngle, counterClockwise = false) {
		if (Array.isArray(arguments[0])) {
			for (const argument of arguments) {
				this.arc(...argument);
			}
			return;
		}

		for (const argument of arguments) {
			if (typeof argument == 'boolean') {
				continue;
			} else if (isNaN(argument)) {
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

		this.#position.x = this.#translation.x + points.at(-2);
		this.#position.y = this.#translation.y + points.at(-1);
		return this
	}

	/**
	 * 
	 * @param {number|string} cpx position x of the control point
	 * @param {number|string} cpy position y of the control point
	 * @param {number|string} x position x of the end point
	 * @param {number|string} y position y of the end point
	 * @param {number|string} radius radius of the arc
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
		return this
	}
	
	beginPath() {
		this.#position.x = this.#translation.x;
		this.#position.y = this.#translation.y;
		return this
	}

	/**
		* 
		* @param {number|string} p1x position x of the first control point
		* @param {number|string} p1y position y of the first control point
		* @param {number|string} p2x position x of the second control point
		* @param {number|string} p2y position y of the second control point
		* @param {number|string} p3x position x of the end point
		* @param {number|string} p3y position y of the end point
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
		return this
	}

	clear() {
		this.#physics.clear();
		this.#scenery.clear();
		for (const powerup in this.#powerups) {
			if (typeof this.#powerups[powerup] == 'object') {
				for (const vehicle in this.#powerups[powerup]) {
					this.#powerups[powerup][vehicle].clear();
				}
			} else {
				this.#powerups[powerup].clear();
			}
		}
		return this
	}

	/**
	 * 
	 * @param {number|string} x rectangle clip position along the x-axis
	 * @param {number|string} y rectangle clip position along the y-axis
	 * @param {number|string} width clip rectangle width
	 * @param {number|string} height clip rectangle height
	 */
	clearRect(x, y, width, height) {
		if (width < 0 || height < 0) {
			throw new Error("Width and Height cannot be negative!");
		}

		for (const line of this.#physics) {
			if (line[0] > x && line[1] > y && line[2] < x + width && line[3] < y + height) {
				this.#physics.delete(line)
			}
		}
	}

	clip() {}
	closePath() {
		if (!this.#segment || this.#segment.length < 1) {
			return this;
		}

		for (const value of this.#segment) {
			if (isNaN(parseFloat(value))) {
				return;
			}
		}

		return this.lineTo(...this.#segment)
	}

	/**
	 * 
	 * @param {number} width the width to give to the new ImageData object.
	 * @param {number} height the height to give to the new ImageData object.
	 * @returns {object} ImageData object.
	 */
	createImageData(width, height) {
		if (typeof width == "object" && height === void 0) {
			return this.createImageData(width.width, width.height);
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
	 * @param {number|string} sx source image position along the x-axis
	 * @param {number|string} sy source image position along the y-axis
	 * @param {number|string} [sWidth] source image width
	 * @param {number|string} [sHeight] source image height
	 * @param {number|string} [dx] image along the x-axis on the canvas
	 * @param {number|string} [dy] image along the y-axis on the canvas
	 * @param {number|string} [dWidth] image width on the canvas
	 * @param {number|string} [dHeight] image height on the canvas
	 * @returns {Builder} instance of Builder
	 */
	drawImage(image, sx = 0, sy = 0, sWidth, sHeight, dx = 0, dy = 0, dWidth = sWidth, dHeight = sHeight) {
		if (typeof image != 'object') {
			throw new TypeError("Invalid Image");
		}

		let pixels = new Uint8ClampedArray((image.data || image).map((item, index, data) => {
			if (index % 4 === 0) {
				let average = item * .2 + data[index + 1] * .7 + data[index + 2] * .1;
				return average <= 85 ? 0 : average <= 170 ? 170 : 255;
			}

			return false
		}).filter((_, index) => index % 4 === 0));

		let width = sWidth || image.width;
		let height = sHeight || image.height;
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

				let type = pixels[e] == 0 ? this.#physics : this.#scenery;
				type.push([Math.floor(ix), Math.floor(iy), Math.floor(dxt), Math.floor(iy)]);
				n = arguments.length > 5 ? (dHeight / height) * 2 : 2;
				while(n > 0) {
					type.push([Math.floor(ix), Math.floor(iy + n), Math.floor(dxt), Math.floor(iy + n)]);
					n -= 2;
				}
			}
		}
		return this
	}

	/**
	 * 
	 * @param {number|string} x 
	 * @param {number|string} y 
	 * @param {number|string} radiusX 
	 * @param {number|string} radiusY 
	 * @param {number|string} rotation 
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

		return this.lineTo([
			old.x,
			old.y
		])
	}

	fill() {
		return this.#filler.push(...this.#segment.splice(0)), this;
	}

	/**
	 * 
	 * @param {number|string} x position of the rectangle along the x-axis
	 * @param {number|string} y position of the rectangle along the y-axis
	 * @param {number|string} width width of the rectangle
	 * @param {number|string} height height of the rectangle
	 */
	fillRect(x, y, width, height) {
		for (const argument of arguments) {
			if (isNaN(+argument)) {
				throw new Error("INVALID_VALUE");
			}
		}

		for (let i = y; i < y + height; i++) {
			this.#filler.push([
				this.#translation.x + x, this.#translation.y + i,
				this.#translation.x + x + width, this.#translation.y + i
			]);
		}
		return this
	}

	/**
	 * 
	 * @param {number|string} x 
	 * @param {number|string} y 
	 * @param {number|string} width 
	 * @param {number|string} height 
	 * @returns {string} 
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
		return this.code
	}

	getLineDash() {
		return this.lineDash.split(/\s+/g);
	}

	/**
		* 
		* @param {number|string} x position x of the end point
		* @param {number|string} y position y of the end point
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

		this.#lines.push([
			this.#position.x, this.#position.y,
			parseFloat(x), parseFloat(y)
		]);

		this.#position.x = this.#translation.x + parseFloat(x);
		this.#position.y = this.#translation.y + parseFloat(y);
		return this
	}

	/**
	 * 
	 * @param {string} text 
	 * @returns {object} properties of text.
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
	 * @param {number|string} x position x of the starting point
	 * @param {number|string} y position y of the starting point
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
		return this
	}

	/**
	 * 
	 * @param {object} data an ImageData object containing the array of pixel values.
	 * @param {number|string} dx horizontal position (x coordinate) at which to place the image data in the destination canvas.
	 * @param {number|string} dy vertical position (y coordinate) at which to place the image data in the destination canvas.
	 * @param {number|string} dirtyX horizontal position (x coordinate) of the top-left corner from which the image data will be extracted.
	 * @param {number|string} dirtyY vertical position (y coordinate) of the top-left corner from which the image data will be extracted.
	 * @param {number|string} dirtyWidth width of the rectangle to be drawn.
	 * @param {number|string} dirtyHeight height of the rectangle to be drawn.
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
		return this
	}

	/**
	 * 
	 * @param {number|string} x 
	 * @param {number|string} y 
	 * @param {number|string} width 
	 * @param {number|string} height 
	 * @returns {Builder} instance of Builder.
	 */
	rect(x, y, width, height) {
		for (const argument of arguments) {
			if (isNaN(+argument)) {
				throw new Error("INVALID_VALUE");
			}
		}

		this.#lines.push([
			this.#translation.x + x, this.#translation.y + y,
			this.#translation.x + x + width, this.#translation.y + y,
			this.#translation.x + x + width, this.#translation.y + y + height,
			this.#translation.x + x, this.#translation.y + y + height,
			this.#translation.x + x, this.#translation.y + y
		]);
		return this
	}

	restore() {
		for (const property in this.#cache) {
			if (property === 'position') {
				this.#position.x = this.#cache[property].x
				this.#position.y = this.#cache[property].y
				continue;
			}

			this.#cache.hasOwnProperty(property) && (this[property] = this.#cache[property]);
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
				case 'vehicles':
					for (const i in this.#powerups[t][e]) {
						this.#powerups[t][e][i][0] = this.#powerups[t][e][i][0] * Math.cos(x) + this.#powerups[t][e][i][1] * Math.sin(x),
						this.#powerups[t][e][i][1] = this.#powerups[t][e][i][1] * Math.cos(x) - this.#powerups[t][e][i][0] * Math.sin(x);
					}
					break;
				case 'W':
					this.#powerups[t][e][2] = this.#powerups[t][e][2] * Math.cos(x) + this.#powerups[t][e][3] * Math.sin(x),
					this.#powerups[t][e][3] = this.#powerups[t][e][3] * Math.cos(x) - this.#powerups[t][e][2] * Math.sin(x);
				default:
					this.#powerups[t][e][0] = this.#powerups[t][e][0] * Math.cos(x) + this.#powerups[t][e][1] * Math.sin(x),
					this.#powerups[t][e][1] = this.#powerups[t][e][1] * Math.cos(x) - this.#powerups[t][e][0] * Math.sin(x);
					/^(B|G)$/i.test(t) && (this.#powerups[t][e][2] += rotationFactor);
				}
			}
		}
		return this
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
				case 'vehicles':
					for (const i in this.#powerups[t][e]) {
						this.#powerups[t][e][i][0] += this.#powerups[t][e][i][0] * x;
						this.#powerups[t][e][i][1] += this.#powerups[t][e][i][1] * y;
					}
					break;
				case 'W':
					this.#powerups[t][e][2] += this.#powerups[t][e][2] * x;
					this.#powerups[t][e][3] += this.#powerups[t][e][3] * y;
				default:
					this.#powerups[t][e][0] += this.#powerups[t][e][0] * x;
					this.#powerups[t][e][1] += this.#powerups[t][e][1] * y;
				}
			}
		}
		return this
	}

	setLineDash(...args) {
		this.lineDash = args.join(" ")
	}

	/**
	 * 
	 * @deprecated this method may be removed in the near future
	 * @param {number|string} x position x of the starting point
	 * @param {number|string} y position y of the starting point
	 * @param {number|string} x2 position x of the end point
	 * @param {number|string} y2 position y of the end point
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

		this.#lines.push([
			parseFloat(x), parseFloat(y),
			parseFloat(x2), parseFloat(y2)
		]);
		return this
	}

	/**
	 * 
	 * @param {number|string} x 
	 * @param {number|string} y 
	 * @param {number|string} width 
	 * @param {number|string} height 
	 * @returns {Builder} instance of Builder.
	 */
	strokeRect(x, y, width, height) {
		for (const argument of arguments) {
			if (isNaN(+argument)) {
				throw new Error("INVALID_VALUE");
			}
		}

		this.#lines.push([
			this.#translation.x + x, this.#translation.y + y,
			this.#translation.x + x + width, this.#translation.y + y,
			this.#translation.x + x + width, this.#translation.y + y + height,
			this.#translation.x + x, this.#translation.y + y + height,
			this.#translation.x + x, this.#translation.y + y
		]);
		return this
	}

	/**
	 * 
	 * @throws this method is incomplete.
	 * @param {string} content 
	 * @param {number|string} x 
	 * @param {number|string} y 
	 */
	strokeText(content, x, y) {
		content = content.toUpperCase().split(/\n/g);
		this.beginPath();
		content.forEach((line, offset) => {
			for (const char in line) {
				if (typeof Alphabet[line[char]] == 'function') {
					Alphabet[line[char]](this, x, y + offset * (Alphabet.letterSpacing * (parseInt(Alphabet.fontSize) * 4)) - 2, (char + 1) * (Alphabet.letterSpacing * (parseInt(Alphabet.fontSize) / 5)) - 2);
				}
			}
		});
		return this
	}

	translate(x = 0, y = 0) {
		this.#translation.x = ~~x;
		this.#translation.y = ~~y;
		return this
	}

	star(x, y) {
		return this.#powerups['T'].add([x, y]), this
	}

	boost(x, y, angle) {
		return this.#powerups['B'].add([x, y, angle]), this
	}

	gravity(x, y, angle) {
		return this.#powerups['G'].add([x, y, angle]), this
	}

	slowmo(x, y) {
		return this.#powerups['S'].add([x, y]), this
	}

	bomb(x, y) {
		return this.#powerups['O'].add([x, y]), this
	}

	checkpoint(x, y) {
		return this.#powerups['C'].add([x, y]), this
	}

	antigravity(x, y) {
		return this.#powerups['A'].add([x, y]), this
	}

	teleport(x, y, ex, ey) {
		return this.#powerups['W'].add([x, y, ex, ey]), this
	}

	heli(x, y, duration = 10) {
		return this.#powerups.vehicles[1].add([x, y, 1, duration]), this
	}

	truck(x, y, duration = 10) {
		return this.#powerups.vehicles[2].add([x, y, 2, duration]), this
	}

	balloon(x, y, duration = 10) {
		return this.#powerups.vehicles[3].add([x, y, 3, duration]), this
	}

	blob(x, y, duration = 10) {
		return this.#powerups.vehicles[4].add([x, y, 4, duration]), this
	}

	toString() {
		let parts = [];
		parts.push([]);
		for (const t of this.#physics) {
			parts.at(-1).push(t.map(t => t.toString(32)).join(' '));
		}

		parts.push([]);
		for (const t of this.#scenery) {
			parts.at(-1).push(t.map(t => t.toString(32)).join(' '));
		}

		parts.push([]);
		for (const t in this.#powerups) {
			switch(t) {
			case 'vehicles':
				for (const e in this.#powerups[t]) {
					for (const i of this.#powerups[t][e]) {
						parts.at(-1).push(`V ${i.map(t => t.toString(32)).join(' ')}`);
					}
				}
				break;
			default:
				for (const e of this.#powerups[t]) {
					parts.at(-1).push(`${t} ${e.map(t => t.toString(32)).join(' ')}`);
				}
			}
		}
		return parts.map(t => t.join(',')).join('#')
	}
}