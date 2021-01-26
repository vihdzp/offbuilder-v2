import Parity from "./parity.js";

/**
 * Applies a function to all members of an array, and concatenates the output.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {Point => Point[]} fun A function to apply to all points.
 * @returns {Point[]} The concatenated output.
 */
function applyConcat(coord, fun) {
	return coord[0] instanceof Array 
		? [].concat(...coord.map(fun))
		: fun(coord);
}

/**
 * Calculates all permutations of a point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {number[]?} indices The indices to which the permutation will be
 * applied. Defaults to [0, 1, ..., n - 1].
 * @returns {Point[]} All permutations of each of the points.
 */
export const allPermutations = function(coord, indices) {
	return permutations(coord, indices, new Parity('all'));
}
globalThis.allPermutations = allPermutations;

/**
 * Calculates all even permutations of point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {number[]?} indices The indices to which the permutation will be
 * applied. Defaults to [0, 1, ..., n - 1].
 * @returns {Point[]} All even permutations of each of the points.
 */
export const evenPermutations = function(coord, indices) {
	return permutations(coord, indices, new Parity('even'));
}
globalThis.evenPermutations = evenPermutations;

/**
 * Calculates all odd permutations of point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {number[]?} indices The indices to which the permutation will be
 * applied. Defaults to [0, 1, ..., n - 1].
 * @returns {Point[]} All odd permutations of each of the points.
 */
export const oddPermutations = function(coord, indices) {
	return permutations(coord, indices, new Parity('odd'));
}
globalThis.oddPermutations = oddPermutations;

/**
 * Calculates all permutations with a given parity of a point or array of
 * points.
 *
 * @param {Point | Point[]} coord The points to permute.
 * @param {number[]?} indices The indices to which the permutation will be
 * applied. Defaults to [0, 1, ..., n - 1].
 * @param {Parity} parity The parity of the permutation to calculate.
 * @returns {Point[]} All permutations of the point.
 */
function permutations(coord, indices, parity) {
	const dim = coord[0] instanceof Array ? coord[0].length : coord.length;
	indices ||= range(dim);

	// Goes through each permutation in lexicographic order, skipping even/odd
	// ones if necessary.
	return applyConcat(coord, function(coord) {
		let _parity = parity.clone();

		// Sorts the sequence in increasing order. Changes the parity
		// accordingly.
		if(!sort(coord, indices))
			_parity.flip();

		// If any two entries are repeated, even/odd permutations are simply
		// equal to all permutations.
		for(let i = 0; i < indices.length - 1; i++)
			if (coord[indices[i]] === coord[indices[i + 1]]) {
				_parity = new Parity('all');
				break;
			}

		const res = [];

		// While the permutations are being calculated.
		while(true) {
			// Adds a copy of the current coordinates.
			if(_parity.check()) 
				res.push([...coord]);
			
			// Searches for the last point the sequence strictly increases.
			let i = indices.length;
			while(i-- > 0 && coord[indices[i - 1]] >= coord[indices[i]]);

			// Return the complete array if the sequence is now decreasing.
			if(i === 0)
				return res;

			// Finds the next smallest thing larger than coord[indices[i - 1]].
			let j = i;
			while(coord[indices[j]] > coord[indices[i - 1]])
				j++;

			// Swaps it with coord[indices[i - 1]].
			swap(coord, indices[i - 1], indices[--j]);
			_parity.flip();

			// Reverses the entire thing from array[i] onwards.
			j = indices.length - 1;
			while(i < j) {
				swap(coord, indices[i++], indices[j--]);
				_parity.flip();
			}
		}
	});
}

/**
 * Calculates all sign changes of a point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {number[]?} indices The indices to which the sign change will be
 * applied. Defaults to [0, 1, ..., n - 1].
 * @returns {Point[]} All sign changes of each of the points.
 */
export const allSignChanges = function(coord, indices) {
	return signChanges(coord, indices, new Parity('all'));
}
globalThis.allSignChanges = allSignChanges;

/**
 * Calculates all even sign changes of a point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {number[]?} indices The indices to which the sign change will be
 * applied. Defaults to [0, 1, ..., n - 1].
 * @returns {Point[]} All even sign changes of each of the points.
 */
export const evenSignChanges = function(coord, indices) {
	return signChanges(coord, indices, new Parity('even'));
}
globalThis.evenSignChanges = evenSignChanges;

/**
 * Calculates all odd sign changes of a point or array of points.
 *
 * @param {Point | Point[]} coord Either a point or an array thereof.
 * @param {number[]?} indices The indices to which the sign change will be
 * applied. Defaults to [0, 1, ..., n - 1].
 * @returns {Point[]} All odd sign changes of each of the points.
 */
export const oddSignChanges = function(coord, indices) {
	return signChanges(coord, indices, new Parity('odd'));
}
globalThis.oddSignChanges = oddSignChanges;

/**
 * Calculates all sign changes with a given parity of a point or array of
 * points.
 *
 * @param {Point | Point[]} coord The points to change signs.
 * @param {number[]?} indices The indices to which the sign change will be
 * applied. Defaults to [0, 1, ..., n - 1].
 * @param {Parity} parity The parity of the sign change to apply.
 * @returns {Point[]} All sign changes of the point.
 */
function signChanges(coord, indices, parity) {
	const dim = coord[0] instanceof Array ? coord[0].length : coord.length;
	
	return applyConcat(coord, (coord) => _signChanges(
		coord, 
		indices || range(dim),
		parity
	));

	function _signChanges(coord, indices, parity) {
		if(indices.length === 0)
			return parity.check() ? [coord] : [];

		const idx = indices.pop();

		if(coord[idx] === 0) 
			return _signChanges([...coord], [...indices], new Parity('all'));		
		else {
			const res = _signChanges([...coord], [...indices], parity.clone());
			coord[idx] *= -1;
			return res.concat(_signChanges(coord, indices, parity.flip()));	
		}	
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
function sort(array, indices) {
	let checks = indices.length,
		parity = true;

	//Bubblesort.
	while(checks-- > 0)
		for(let i = 0; i < checks; i++)
			if(array[indices[i]] > array[indices[i + 1]]) {
				swap(array, indices[i], indices[i + 1])
				parity = !parity;
			}

	return parity;
}

/**
 * Returns an array with the numbers from 0 to n - 1.
 * 
 * @param {number} n The number of elements in the array.
 * @returns {number[]} The array [0, 1, ..., n - 1].
 */
function range(n) {
	return Array.from({length: n}).map((x, i) => i);
}
