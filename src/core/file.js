import LinkedListNode from "../classes/linkedListNode.js";
import Caret from "../classes/caret.js";
import { dimensions_nud, dl_a } from "./domElements.js";
import coordinates from "./coordinates.js";

import SVD from '../svd/svd.js';

/**
 * Returns the name for a set of n-elements.
 * 
 * @param {number} n The rank of the element.
 * @returns {string} The name of a set of n-elements.
 */
function elementNames(n) {
	const names = [
		"Vertices", 
		"Edges", 
		"Faces", 
		"Cells",
		"Tera", 
		"Peta", 
		"Exa",
		"Zetta",
		"Yotta" 
	];

	return names[n] || n + '-element';
}

/**
 * Saves the coordinates currently on the coordinate list into a text file that
 * can be loaded into Qhull.
 */
export const exportCoordinates = function() {
	// Writes the number of dimensions.
	let txt = dimensions_nud.value + '\n';

	// Writes the number of points.
	const values = Object.values(coordinates.dictionary);
	txt += values.length + '\n';

	// Writes each of the points' coordinates.
	values.forEach((point) => {
		txt += point.toString().replaceAll(',', ' ') + '\n';
	});

	// Saves the file.
	saveFile(txt, 'polytope_input.txt', 'text/plain');
}

/**
 * Reads the Qhull output and produces the OFF file.
 * 
 * @param {Event} event The event triggered by opening the file.
 */
export const importCoordinates = function(event) {
	// Loads header info, declares some variables.
	const caret = new Caret(event.target.result),
		dim = caret.readNumber(),
		vertexCount = caret.readNumber(),
		facetCount = caret.readNumber(),
		ridgeCount = caret.readNumber();

	const elementList = new Array(dim + 1).fill(0).map(() => []),
		vertices = elementList[0],
		edges = elementList[1],
		faces = elementList[2];

	// Reads the output file, gets the elements.

	// Reads vertices.
	for(let i = 0; i < vertexCount; i++) {
		vertices.push([]);

		for(let j = 0; j < dim; j++)
			vertices[i].push(caret.readNumber());
	}

	// Reads facets.
	for(let i = 0; i < facetCount; i++) {
		// Reads vertex indices.
		const elCount = caret.readNumber(),
			facet = [];
		
		for(let j = 0; j < elCount; j++)	
			facet.push(caret.readNumber());

		// Adds facet to elementList.
		elementList[dim - 1].push(facet.sort((a, b) => {return a - b;}));
	}

	// Generates (d - 1)-elements out of d-elements.
	// At the same time, rewrites d-elements in terms of them.
	for(let d = dim - 1; d >= 2; d--) {
		// Initializes newElements.
		const dElements = elementList[d],
			newElements = new Array(dElements.length).fill(0).map(() => []);

		// Two d-dimensional elements have a common face iff they have at least
		// d common vertices and are not contained in (d - 2)-dimensional space.
		for(let i = 0; i < dElements.length; i++)
			for(let j = i + 1; j < dElements.length; j++) {
				const commonElements = common(dElements[i], dElements[j]);

				// It is possible for two d-elements to share more than d 
				// elements without them being a common (d - 1)-elements, but 
				// only when d >= 4.
				if(commonElements.length >= d && (d >= 4 || 
					dimension(
						commonElements.map(x => [...vertices[x]])
					) === d - 1
				)) {
					const dm1Elements = elementList[d - 1],
						newEl1 = newElements[i],
						newEl2 = newElements[j];

					// Checks that the element has not been added before.
					const duplicate = checkDuplicate(
						dm1Elements, commonElements
					);

					// If not, adds the element to the element list and the 
					// corresponding parent elements.
					if(duplicate === -1) {
						const idx = dm1Elements.length;
						
						newEl1.push(idx);
						newEl2.push(idx);
						dm1Elements.push(commonElements);
					}

					// Otherwise, only adds the element to the corresponding
					// parent elements.
					else {
						if(newEl1.indexOf(duplicate) === -1)
							newEl1.push(duplicate);

						if(newEl2.indexOf(duplicate) === -1)
							newEl2.push(duplicate);
					}
				}
			}

		elementList[d] = newElements;
	}

	if(dim > 3 && elementList[dim - 1] != ridgeCount)
		alert("WARNING: Ridge count does not match expected value!");

	// Faces are currently in terms of their edges.
	// We convert them to an ordered vertex representation.
	for(let f = 0; f < elementList[2].length; f++) {
		const face = elementList[2][f];
		const linkedList = [];

		for(let i = 0; i < face.length; i++) {
			const edge = edges[face[i]];

			for(let j = 0; j <= 1; j++) {
				const vertex = edge[j];

				if(!linkedList[vertex])
					linkedList[vertex] = new LinkedListNode(vertex);
			}

			linkedList[edge[0]].linkTo(linkedList[edge[1]]);
		}

		//Gets the cycle starting from whichever of the face's vertices.
		elementList[2][f] = linkedList[edges[face[0]][0]].getCycle();
	}

	//Writes the OFF file.

	// nOFF
	let txt = '';
	if(dim != 3)
		txt += dim;
	txt += 'OFF\n';

	// # Vertices, Faces, Edges, ...
	txt += '# ' + elementNames(0);
	if(dim >= 3)
		txt += ', ' + elementNames(2);
	if(dim >= 2)
		txt += ', ' + elementNames(1);
	for(let i = 3; i < dim; i++)
		txt += ', ' + elementNames(i);
	txt += '\n';

	// The corresponding numbers.
	txt += elementList[0].length;
	if(dim >= 3)
		txt += ' ' + elementList[2].length;
	if(dim >= 2)
		txt += ' ' + elementList[1].length;
	for(let i = 3; i < dim; i++)
		txt += ' ' + elementList[i].length;
	txt += '\n\n';

	// Vertices.
	txt += '# ' + elementNames(0) + '\n';
	for(let i = 0; i < elementList[0].length; i++) {
		const vertex = elementList[0][i];
		txt += vertex[0];

		for(let j = 1; j < dim; j++)
			txt += ' ' + vertex[j];
		txt += '\n';
	}

	// The rest of the elements.
	for(let d = 2; d < dim; d++) {
		txt += '\n# ' + elementNames(d) + '\n';
		for(let i = 0; i < elementList[d].length; i++) {
			const el = elementList[d][i];
			let len = el.length;
			txt += len;

			for(let j = 0; j < len; j++)
				txt += ' ' + el[j];
			txt += '\n';
		}
	}

	saveFile(txt, 'polytope.off', 'application/off');
}

/**
 * Returns the number of dimensions of lowest-dimensional hyperplane in which a
 * set of points lies. Calculates this by interpreting the points as a matrix 
 * and calculating its rank. 
 * 
 * Will modify the array that is passed to it.
 * 
 * @param {Point[]} matrix The array of points.
 * @returns The rank of the matrix.
 */
function dimension(matrix) {
	// Any singular values of the matrix less than this will be counted as 0.
	const EPS = 1e-6;

	// Removes and stores the last row of the matrix.
	const lastRow = matrix.pop();
	
	// The dimensions of the matrix.
	const m = matrix.length, 
		n = matrix[0].length;

	// Offsets every other row in the matrix by the removed one.
	for(let i = 0; i < m; i++)
		for(let j = 0; j < n; j++)
			matrix[i][j] -= lastRow[j];	

	// If the matrix is wider than it is tall, it transposes it so that the SVD
	// algorithm can process it.
	if(m < n) {
		const newMatrix = new Array(n).fill(0).map(() => new Array(m));

		for(let i = 0; i < m; i++)
			for(let j = 0; j < n; j++)
				newMatrix[j][i] = matrix[i][j];
		
		matrix = newMatrix;
	}

	// The rank is the amount of singular values that are either NaN or less 
	// than epsilon.
	let rank = 0;
	SVD(matrix).q.forEach((x) => {if(!(x <= EPS)) rank++;});
	return rank;
}

/**
 * Saves a file with some given content.
 * 
 * @param {string} txt The content of the file to save.
 * @param {string} fileName The filename of the file.
 * @param {string} mimeType The MIME type of the file.
 */
function saveFile(txt, fileName, mimeType) {
	const blob = new Blob([txt], {type: mimeType});

	if(window.navigator.msSaveOrOpenBlob)
		window.navigator.msSaveOrOpenBlob(blob, filename);
	else {
		dl_a.href = window.URL.createObjectURL(blob);
		dl_a.download = fileName;
		dl_a.click();
	}
}

/**
 * Gets the common elements of two sorted arrays.
 * 
 * @param {number[]} el1 The first array.
 * @param {number[]} el2 The second array
 * @returns {number[]} A sorted array with all of the common elements of el1 and
 * el2.
 */
function common(el1, el2) {
	const common = [];
	let m = 0, n = 0;

	while(m < el1.length && n < el2.length) {
		if(el1[m] < el2[n])
			m++;
		else if(el1[m] > el2[n])
			n++;
		else
			common.push(el1[m++]);
	}

	return common;
}

/**
 * Checks whether an array has already been added to another.
 * 
 * @param {number[][]} array The array in which the search is made.
 * @param {number[]} key The array for which we're searching.
 * @returns {number} The index of the array if it's found, -1 otherwise.
 */
function checkDuplicate(array, key) {
	for(let i = 0; i < array.length; i++) 
		if(equal(array[i], key))
			return i;

	return -1;
}

/**
 * Checks whether two arrays have exactly the same contents.
 * 
 * @param {number[]} arr1 The first array.
 * @param {number{}} arr2 The second array.
 * @returns {boolean} Whether the two arrays have the same terms in the same
 * order.
 */
function equal(arr1, arr2) {
	// Compares the lengths of the arrays.
	if(arr1.length != arr2.length)
		return false;

	// Compares elements pairwise.
	for(let i = 0; i < arr1.length; i++)
		if(arr1[i] != arr2[i])
			return false;

	return true;
}