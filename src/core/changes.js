import Parity from "./parity.js";

/**
 * Applies a function to all members of an array, and concatenates the output.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {Point => Point[]} fun A function to apply to all points.
 * @returns {Point[]} The concatenated output.
 */
function applyConcat(coord, fun) {
	return coord[0] instanceof Array ? [].concat(...coord.map(fun)) : fun(coord);
}

/**
 * Calculates all permutations of a point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @returns {Point[]} All permutations of each of the points.
 */
export const allPermutations = function(coord) {
	return permutations(coord, new Parity('all'));
}

/**
 * Calculates all even permutations of point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @returns {Point[]} All even permutations of each of the points.
 */
export const evenPermutations = function(coord) {
	return permutations(coord, new Parity('even'));
}

/**
 * Calculates all odd permutations of point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @returns {Point[]} All odd permutations of each of the points.
 */
export const oddPermutations = function(coord) {
	return permutations(coord, new Parity('odd'));
}

/**
 * Calculates all permutations with a given parity of a point or array of
 * points.
 *
 * @param {Point | Point[]} coord The points to permute.
 * @param {Parity} parity The parity of the permutation to calculate.
 * @returns {Point[]} All permutations of the point.
 */
function permutations(coord, parity) {
	return applyConcat(coord, function(coord) {
		// Sorts the sequence in increasing order. Changes the parity accordingly.
		if(!sort(coord))
			parity.flip();

		const res = [];

		// While the permutations are being calculated.
		while(true) {
			// Adds a copy of the current coordinates.
			if(parity.check()) 
				res.push([...coord]);
			
			// Searches for the last point the sequence strictly increases.
			let i = coord.length;
			while(i-- > 0 && coord[i - 1] >= coord[i]);

			// Return the complete array if the sequence is now decreasing.
			if(i === 0)
				return res;

			// Finds the next smallest thing larger than coord[i - 1].
			let j = i;
			while(coord[j] > coord[i - 1])
				j++;

			// Swaps it with array[i - 1].
			swap(coord, i - 1, --j);
			parity.flip();

			// Reverses the entire thing from array[i] onwards.
			j = coord.length - 1;
			while(i < j) {
				swap(coord, i++, j--);
				parity.flip();
			}
		}
	});
}

/**
 * Calculates all sign changes of a point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @returns {Point[]} All sign changes of each of the points.
 */
export const allSignChanges = function(coord, indices) {
	return signChanges(coord, indices, new Parity('all'));
}

/**
 * Calculates all even sign changes of a point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @returns {Point[]} All even sign changes of each of the points.
 */
export const evenSignChanges = function(coord, indices) {
	return signChanges(coord, indices, new Parity('even'));
}

/**
 * Calculates all odd sign changes of a point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @returns {Point[]} All odd changes of each of the points.
 */
export const oddSignChanges = function(coord, indices) {
	return signChanges(coord, indices, new Parity('odd'));
}

/**
 * Calculates all sign changes with a given parity of a point or array of
 * points.
 *
 * @param {Point | Point[]} coord The points to permute.
 * @param {Parity} parity The parity of the permutation to calculate.
 * @returns {Point[]} All permutations of the point.
 */
function signChanges(coord, indices, parity) {
	return applyConcat(coord, (coord) => _signChanges(
		coord, 
		indices || range(coord.length),
		parity
	));

	function _signChanges(coord, indices, parity) {
		if(indices.length === 0)
			return parity.check() ? [coord] : [];

		const idx = indices.pop(),
			res = _signChanges([...coord], [...indices], parity.clone());

		coord[idx] *= -1;
		return res.concat(_signChanges(coord, indices, parity.flip()));		
	}
}

/**
 * Swaps two elements in an array.
 *
 * @param {Array} array The array from which to do the swap.
 * @param {number} i The first index to swap.
 * @param {number} j The second index to swap.
 */
function swap(array, i, j) {
	const t = array[i];
	array[i] = array[j];
	array[j] = t;
}

/**
 * Sorts an array, and returns whether the number of swaps was even. Implements
 * bubblesort as a sorting algorithm.
 *
 * @param {Array} array The array to sort.
 * @returns {number} Whether the number of swaps was even.
 */
function sort(array) {
	let checks = array.length,
		parity = true;

	//Bubblesort.
	while(checks-- > 0)
		for(let i = 0; i < checks; i++)
			if(array[i] > array[i + 1]) {
				swap(array, i, i + 1)
				parity = !parity;
			}

	return parity;
}

//Returns [0, 1, ..., n - 1].
//n: number
//returns: number[]
function range(n) {
	const indices = [];
	for(let i = 0; i < n; i++)
		indices.push(i);

	return indices;
}
