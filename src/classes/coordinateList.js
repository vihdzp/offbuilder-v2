import * as Changes from "../core/changes.js";

/**
 * A data structure that contains both a pile to add and remove objects, and a
 * dictionary to avoid adding duplicates. Is used by the CoordinateList class. 
 *
 * Objects are hashed simply by the toString function.
 */
class DictPile {
	/**
	 * Constructor for the DictPile class.
	 */
	constructor() {
		this.clear();
	}

	push(entry) {
		const str = entry.toString();

		if (!this.dictionary[str]) {
			this.dictionary[str] = true;
			this.list.push(entry);

			return str;
		}

		return "";
	}

	pop() {
		return delete this.dictionary[this.list.pop().toString()];
	}

	removeLast(n) {
		let i;
		for (i = 0; i < n && this.list.length !== 0; i++)
			this.pop();

		return i;
	}

	clear() {
		this.dictionary = {};
		this.list = [];
	}
}

/**
 * Wraps around a list of coordinates, and contains methods to add to it.
 */
export default class CoordinateList {
	/**
	 * Constructor for the CoordinateList class.
	 *
	 * @param {TextArea} textArea The text area to which the coordinates are
	 * added.
	 */
	constructor(textArea) {
		textArea.value = '';

		/** The text area to which the coordinates are added. */
		this.textArea = textArea;

		/** A dictionary storing keys for all coordinates added, as well as the
		 * coordinates themselves. */
		this.dictPile = new DictPile();

		/** An object containing the configuration of the coordinate list. */
		this.options = {
			formatting: 0,
			parentheses: false,
			newline: '\n'
		};

		this.history = [];

		this.permutations = [];
		this.signChanges = [];

		/** The number of dimensions of the coordinate list. */
		this.dimensions = 3;
	}

	/**
	 * Adds a point or array of points to the coordinate list, without further
	 * processing.
	 *
	 * @param {Point | Point[]} coord A point or array thereof.
	 */
	push(coord) {
		const dim = coord[0] instanceof Array ? coord[0].length : coord.length;
		if (dim !== this.dimensions) {
			alert(`Expected ${this.dimensions} coordinates, got ${dim}.`);
			return;
		}

		const _this = this;
		let n = 0;

		iterate(coord, function (coord) {
			const str = _this.dictPile.push(coord);
			if (str !== "") {
				_this.textArea.value += `(${str})\n`;
				n++;
			}
		});

		if (n !== 0)
			this.history.push(n);
	}

	/**
	 * Adds a point or array of points to the coordinate list, also applying any
	 * permutations and sign changes.
	 *
	 * @param {Point | Point[]} coord A point or array thereof.
	 */
	add(coord) {
		const dim = coord[0] instanceof Array ? coord[0].length : coord.length;
		if (dim !== this.dimensions) {
			alert(`Expected ${this.dimensions} coordinates, got ${dim}.`);
			return;
		}

		const _this = this;

		_this.signChanges.forEach(sign => {
			const indices = [];
			for (let i = 0; i < _this.dimensions; i++)
				if (sign.indices[i])
					indices.push(i);

			switch (sign.type) {
				//All
				case 0:
					coord = Changes.allSignChanges(coord, indices);
					break;
				//Even
				case 1:
					coord = Changes.evenSignChanges(coord, indices);
					break;
				//Odd
				case 2:
					coord = Changes.oddSignChanges(coord, indices);
					break;
				//Full
				case 3:
					coord = Changes.fullSignChanges(coord, indices);
					break;
			}
		});

		_this.permutations.forEach(perm => {
			const indices = [];
			for (let i = 0; i < _this.dimensions; i++)
				if (perm.indices[i])
					indices.push(i);

			switch (perm.type) {
				//All
				case 0:
					coord = Changes.allPermutations(coord, indices);
					break;
				//Even
				case 1:
					coord = Changes.evenPermutations(coord, indices);
					break;
				//Odd
				case 2:
					coord = Changes.oddPermutations(coord, indices);
					break;
			}
		});

		_this.push(coord);
	}

	undo() {
		let n = this.history.pop();

		if (n) {
			n = this.dictPile.removeLast(n);
			const txt = this.textArea.value;

			let idx = txt.length;
			for (let i = 0; i < n + 1; i++)
				idx = this.textArea.value.lastIndexOf('\n', idx) - 1

			this.textArea.value = txt.substr(0, idx + 2);
		}
	}

	scale(value) {
		const listClone = this.list.map(x => [...x]);
		this.clear();

		for (let i = 0; i < listClone.length; i++)
			this.push(listClone[i].map(x => x * value));
	}

	setDimensions(dim) {
		if (this.dimensions !== dim) {
			this.dimensions = dim;
			this.clear();
		}
	}

	project() {
		const newCoords = new CoordinateList(this.textArea),
			dim = this.dimensions;

		newCoords.dimensions = --this.dimensions;

		// Declares projection matrix.
		const matrix = [];
		for (let i = 0; i < dim - 1; i++) {
			const row = [];
			matrix.push(row);

			const val1 = -1 / Math.sqrt(2 * (i + 1) * (i + 2)),
				val2 = -val1 * (i + 1);

			// Fills the entries.
			for (let j = 0; j <= i; j++)
				row[j] = val1;

			row[i + 1] = val2;

			for (let j = i + 2; j < dim; j++)
				row[j] = 0;
		}

		for (const key in this.dictionary)
			newCoords.push(_project(this.dictionary[key]));

		this.dictionary = newCoords.dictionary;

		function _project(point) {
			const res = [];

			for (let i = 0; i < dim - 1; i++) {
				let entry = 0;
				for (let j = 0; j < dim; j++)
					entry += point[j] * matrix[i][j];

				res.push(entry);
			}

			return res;
		}
	}

	get list() {
		return this.dictPile.list;
	}

	/**
	 * The character to use as a coordinate separator.
	 *
	 * @returns {string} Either ',' or ' ', depending on the options.
	 */
	get separator() {
		return this.options.formatting ? ',' : ' ';
	}

	/**
	 * Parses a string representing a Point according to the coordinate list's
	 * options.
	 *
	 * @param {string} str The string to parse.
	 * @returns {Point} The point the string represents.
	 */
	parse(str) {
		try {
			// The separator character.
			const c = this.separator;

			// Removes extra whitespaces from the string.
			str = str.replace(/ +/g, ' ').trim();

			// Removes the parentheses wrapping the point.
			if (this.options.parentheses) {
				if (str[0] !== '(' || str[str.length - 1] !== ')')
					throw new Error("Expected enclosing parentheses.");

				str = str.substr(1, str.length - 2);
			}

			// Evaluates each coordinate, returns the resulting point.
			return eval.call(globalThis, '[' + str.replaceAll(c, ',') + '];');
		}
		catch (ex) {
			alert(ex);
			return [];
		}
	}

	/**
	 * Clears the coordinate list.
	 */
	clear() {
		this.textArea.value = '';
		this.dictPile.clear();
		this.history = [];
	}
}

/**
 * Apply a function either to a single object, or to each in an array thereof.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {Point => void} fun A function on points.
 */
function iterate(coord, fun) {
	coord[0] instanceof Array ? coord.forEach(fun) : fun(coord);
}

/**
 * Converts a point into a string, to be added to the text area.
 *
 * @param {Point} coord The point to convert into a string.
 */
function string(coord) {
	return '(' + coord.toString() + ')';
}