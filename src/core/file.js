import LinkedListNode from "../classes/linkedListNode.js";
import Caret from "../classes/caret.js";
import { dimensions_nud, dl_a } from "./domElements.js";
import coordinates from "./coordinates.js";
import AvlTree from "../classes/avl.js";

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
export const exportCoordinates = function () {
	const newline = coordinates.options.newline;

	// Writes the number of dimensions.
	let txt = dimensions_nud.value + newline;

	// Writes the number of points.
	const values = coordinates.list;
	txt += values.length + newline;

	// Writes each of the points' coordinates.
	values.forEach((point) => {
		txt += point.toString().replaceAll(',', ' ') + newline;
	});

	// Saves the file.
	saveFile(txt, 'polytope_input.txt', 'text/plain');
}

/**
 * Reads the Qhull output and produces the OFF file.
 * 
 * @param {Event} event The event triggered by opening the file.
 */
export const importCoordinates = function (event) {
	// Loads header info, declares some variables.
	const newline = coordinates.options.newline,
		caret = new Caret(event.target.result),
		dim = caret.readNumber(),
		vertexCount = caret.readNumber(),
		facetCount = caret.readNumber(),
		ridgeCount = caret.readNumber();

	const elementList = new Array(dim + 1).fill(0).map(() => []),
		vertices = elementList[0];

	// Reads the output file, gets the elements.

	// Reads vertices.
	for (let i = 0; i < vertexCount; i++) {
		vertices.push([]);

		for (let j = 0; j < dim; j++)
			vertices[i].push(caret.readNumber());
	}

	// Reads facets.
	for (let i = 0; i < facetCount; i++) {
		// Reads vertex indices.
		const elCount = caret.readNumber(),
			facet = [];

		for (let j = 0; j < elCount; j++)
			facet.push(caret.readNumber());

		// Adds facet to elementList.
		elementList[dim - 1].push(facet.sort((a, b) => { return a - b; }));
	}

	// Generates (d - 1)-elements out of d-elements.
	// At the same time, rewrites d-elements in terms of them.

	for (let d = dim - 1; d >= 2; d--) {
		// Initializes newElements.
		const dElements = elementList[d],
			dm1Elements = new AvlTree(faceCompare),
			len = dElements.length,
			newElements = new Array(len).fill(0).map(() => []);

		// dm1Elements is stored as an AVL tree, so that we can quickly figure
		// out whether a face has been added before or not.

		// Debug stuff.
		let time = Date.now(),
			iter = 0;

		const total = len * (len - 1) / 200;

		// Two d-dimensional elements have a common face iff they have at least
		// d common vertices and are not contained in (d - 2)-dimensional space.
		for (let i = 0; i < len; i++) {
			// For very long calculations, logs progress every 5s.
			if (Date.now() - time > 5000) {
				console.log(`Dimension: ${d}. Progress: ${iter / total}%.`);
				time = Date.now();
			}

			for (let j = i + 1; j < len; j++) {
				iter++;

				// The indices of the common points between the two arrays.
				// If these actually become a new (d - 1)-element, a index
				// attribute is added, specifying the order in which they were
				// added.
				const commonElements = common(dElements[i], dElements[j]);

				// It is possible for two d-elements to share more than d 
				// elements without them being a common (d - 1)-elements, but 
				// only when d >= 4.
				if (commonElements.length >= d && (d >= 4 ||
					dimension(
						commonElements.map(x => [...vertices[x]])
					) === d - 1
				)) {
					const newEl1 = newElements[i],
						newEl2 = newElements[j];

					// Checks that the element has not been added before.
					const duplicate = dm1Elements.get(commonElements);

					// If not, adds the element to the element list and the 
					// corresponding parent elements.
					if (duplicate === null) {
						const idx = dm1Elements.size;
						commonElements.index = idx;

						newEl1.push(idx);
						newEl2.push(idx);
						dm1Elements.insert(commonElements);
					}

					// Otherwise, only adds the element to the corresponding
					// parent elements.
					else {
						const idx = duplicate.key.index;

						if (newEl1.indexOf(idx) === -1)
							newEl1.push(idx);

						if (newEl2.indexOf(idx) === -1)
							newEl2.push(idx);
					}
				}
			}
		}

		// The (d - 1)-elements were saved as arrays in an AVL tree with an 
		// index attribute. We thus go through the tree and put every element
		// in the correct position in a new array.
		const sortdm1Elements = new Array(dm1Elements.size);
		let node = dm1Elements.findMinimumNode();
		while (node) {
			const key = node.key;

			sortdm1Elements[key.index] = key;
			node = dm1Elements.next(node);
		}

		// Currently, each of the d - 1 elements is storing 
		elementList[d] = newElements;
		elementList[d - 1] = sortdm1Elements;
	}

	// Quick sanity test.
	if (elementList[dim - 2].length != ridgeCount)
		alert("WARNING: Ridge count does not match expected value!");

	const edges = elementList[1],
		faces = elementList[2];

	// Faces are currently in terms of their edges.
	// We convert them to an ordered vertex representation.
	for (let f = 0; f < faces.length; f++) {
		const face = faces[f],
			linkedList = [];

		// We build a linked list with all of the edges of the face.
		for (let i = 0; i < face.length; i++) {
			const edge = edges[face[i]];

			for (let j = 0; j <= 1; j++) {
				const vertex = edge[j];

				if (!linkedList[vertex])
					linkedList[vertex] = new LinkedListNode(vertex);
			}

			linkedList[edge[0]].linkTo(linkedList[edge[1]]);
		}

		// Gets the cycle starting from whichever of the face's vertices.
		faces[f] = linkedList[edges[face[0]][0]].getCycle();
	}

	// Writes the OFF file.

	// nOFF
	let txt = '';
	if (dim != 3)
		txt += dim;
	txt += 'OFF' + newline;

	// # Vertices, Faces, Edges, ...
	txt += '# ' + elementNames(0);
	if (dim >= 3)
		txt += ', ' + elementNames(2);
	if (dim >= 2)
		txt += ', ' + elementNames(1);
	for (let i = 3; i < dim; i++)
		txt += ', ' + elementNames(i);
	txt += newline;

	// The corresponding numbers.
	txt += vertices.length;
	if (dim >= 3)
		txt += ' ' + faces.length;
	if (dim >= 2)
		txt += ' ' + edges.length;
	for (let i = 3; i < dim; i++)
		txt += ' ' + elementList[i].length;
	txt += newline + newline;

	// Vertices.
	txt += '# ' + elementNames(0) + newline;
	for (let i = 0; i < vertices.length; i++) {
		const vertex = vertices[i];
		txt += vertex[0];

		for (let j = 1; j < dim; j++)
			txt += ' ' + vertex[j];
		txt += newline;
	}

	// The rest of the elements.
	for (let d = 2; d < dim; d++) {
		txt += newline + '# ' + elementNames(d) + newline;
		for (let i = 0; i < elementList[d].length; i++) {
			const el = elementList[d][i];
			let len = el.length;
			txt += len;

			for (let j = 0; j < len; j++)
				txt += ' ' + el[j];
			txt += newline;
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
	for (let i = 0; i < m; i++)
		for (let j = 0; j < n; j++)
			matrix[i][j] -= lastRow[j];

	// If the matrix is wider than it is tall, it transposes it so that the SVD
	// algorithm can process it.
	if (m < n) {
		const newMatrix = new Array(n).fill(0).map(() => new Array(m));

		for (let i = 0; i < m; i++)
			for (let j = 0; j < n; j++)
				newMatrix[j][i] = matrix[i][j];

		matrix = newMatrix;
	}

	// The rank is the amount of singular values that are either NaN or less 
	// than epsilon.
	let rank = 0;
	SVD(matrix).q.forEach((x) => { if (!(x <= EPS)) rank++; });
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
	const blob = new Blob([txt], { type: mimeType });

	if (window.navigator.msSaveOrOpenBlob)
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
	const common = [],
		len1 = el1.length,
		len2 = el2.length;

	let m = 0, n = 0;

	while (m < len1 && n < len2) {
		if (el1[m] < el2[n])
			m++;
		else if (el1[m] > el2[n])
			n++;
		else
			common.push(el1[m++]);
	}

	return common;
}

/**
 * Sorts two arrays by their contents in lexicographic order.
 * 
 * @param {number[]} el1 The first array.
 * @param {number[]} el2 The second array.
 * @returns {number} A negative number if el1 < el2, a positive number if 
 * el1 > el2, 0 otherwise. 
 */
function faceCompare(el1, el2) {
	const len = Math.min(el1.length, el2.length);
	for (let i = 0; i < len; i++)
		if (el1[i] !== el2[i])
			return el1[i] - el2[i];

	return el1.length - el2.length;
}