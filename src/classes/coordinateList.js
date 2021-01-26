import * as Changes from "../core/changes.js";

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
		this.dictionary = {};

		/** An object containing the configuration of the coordinate list. */
		this.options = {
			formatting: 0,
			sign: 0,
			permutation: 0,
			parentheses: false
		};

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
		const _this = this;

		iterate(coord, function(coord) {
			const str = string(coord);
			
			if(
				coord.length === _this.dimensions
				&&_this.dictionary[str] === undefined
			) {
				_this.dictionary[str] = coord;
				_this.textArea.value += str + '\n';
			}
		});
	}

	/**
	 * Adds a point or array of points to the coordinate list, also applying any
	 * permutations and sign changes.
	 * 
	 * @param {Point | Point[]} coord A point or array thereof.
	 */
	add(coord) {
		const _this = this;

		iterate(coord, function(coord) {
			switch(_this.options.sign) {
				//All
				case 1:
					coord = Changes.allSignChanges(coord);
					break;
				//Even
				case 2:
					coord = Changes.evenSignChanges(coord);
					break;
				//Odd
				case 3:
					coord = Changes.oddSignChanges(coord);
					break;
			}

			switch(_this.options.permutation) {
				//None
				case 0:
					_this.push(coord);
					break;
				//All
				case 1:
					_this.push(Changes.allPermutations(coord));
					break;
				//Even
				case 2:
					_this.push(Changes.evenPermutations(coord));
					break;
				//Odd
				case 3:
					_this.push(Changes.oddPermutations(coord));
					break;
			}
		});
	}

	setDimensions(dim) {
		if(this.dimensions !== dim) {
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
		for(let i = 0; i < dim - 1; i++) {
			const row = [];
			matrix.push(row);

			const val1 = -1 / Math.sqrt(2 * (i + 1) * (i + 2)),
				val2 = -val1 * (i + 1); 

			// Fills the entries.
			for(let j = 0; j <= i; j++) 
				row[j] = val1;

			row[i + 1] = val2;

			for(let j = i + 2; j < dim; j++)
				row[j] = 0;
		}

		for(const key in this.dictionary)
			newCoords.push(_project(this.dictionary[key]));
		
		this.dictionary = newCoords.dictionary;

		function _project(point) {
			const res = [];

			for(let i = 0; i < dim - 1; i++) {
				let entry = 0;
				for(let j = 0; j < dim; j++) 
					entry += point[j] * matrix[i][j];
				
				res.push(entry);
			}

			return res;
		}
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
		// The separator character.
		const c = this.separator;

		// Removes extra whitespaces from the string.
		str = str.replace(/ +/g, ' ').trim();

		// Removes the parentheses wrapping the point.
		if(this.options.parentheses)
			str = str.substr(1, str.length - 2);

		// Evaluates each coordinate, returns the resulting point.
		return str.split(c).map(eval);
	}

	/**
	 * Clears the coordinate list.
	 */
	clear() {
		this.textArea.value = '';
		this.dictionary = {};
	}
}

/**
 * Apply a function either to a single object, or to each in an array thereof.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {Point => void} fun A function on points.
 */
function iterate(coord, fun) {
	coord[0] instanceof Array ?	coord.forEach(fun) : fun(coord);
}

/**
 * Converts a point into a string, to be added to the text area.
 *
 * @param {Point} coord The point to convert into a string.
 */
function string(coord) {
	return '(' + coord.toString() + ')';
}
