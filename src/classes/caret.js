/**
 * Used to read through a text file like a caret. Stores the text and the
 * position at which it's reading it.
 */
export default class Caret {
	/**
	 * Constructor for the Caret class.
	 *
	 * @param {string} txt The text to read through.
	 */
	constructor(txt) {
		/** The file that's read by the caret. */
		this.fileText = txt;

		/** The current reading position of the caret. */
		this.pos = 0;
	}

	/**
	 * Skips the caret to the next non-whitespace character.
	 */
	skipWhitespace() {
		let c = this.fileText[this.pos];

		while (isWhitespace(c))
			c = this.fileText[++this.pos];
	}

	/**
	 * Reads the next number from the current caret position.
	 *
	 * @returns {number} The read number.
	 */
	readNumber() {
		// Skips any initial whitespace, stores the initial position.
		this.skipWhitespace();
		const idx = this.pos;

		// Skips until a whitespace character is found.
		while (!isWhitespace(this.fileText[++this.pos]));

		// Returns the string from the initial position to the current position
		// as a number.
		return parseFloat(this.fileText.substring(idx, this.pos - idx));
	}
}

/**
 * Determines if a character is a whitespace character.
 *
 * @param {string} c The character to test.
 * @returns {boolean} Whether the character is whitespace or not.
 */
function isWhitespace(c) {
	return /\s/.test(c);
}
