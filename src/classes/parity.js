/**
 * Represents the parity of a permutation. Can be even, odd, or all. For methods
 * involving parity, an instance of this class will be flipped in sign many
 * times, with an operation only being performed when the parity is either even
 * or all.
 * 
 * @class
 * @constructor
 * @public
 */
export default class Parity {
	/**
	 * Constructor for the Parity class.
	 *
	 * @param {string} type The type of parity of the permutation: either
	 * "even", "odd" or "all".
	 */
	constructor(type) {
		/**
		 * Either "even", "odd", or "all".
		 * @type {boolean}
		 * @public
		 */
		this.type = type;
	}

	/**
	 * Flips an even permutation to an odd permutation and viceversa.
	 *
	 * @returns Itself.
	 */
	flip() {
		switch (this.type) {
			case 'even':
				this.type = 'odd';
				break;
			case 'odd':
				this.type = 'even';
				break;
			default:
				this.type = 'all';
				break;
		}

		return this;
	}

	/**
	 * Checks whether the permutation type is even or all.
	 *
	 * @returns {boolean} A boolean.
	 */
	has_even() {
		return this.type !== 'odd';
	}

	/**
	 * Clones a Parity object.
	 *
	 * @returns {Parity} A Parity object with the same type as this.
	 */
	clone() {
		return new Parity(this.type);
	}
}
