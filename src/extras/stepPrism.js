import coordinates from "../core/coordinates.js";

/**
 * Builds a step with a given set of heights.
 * 
 * @param {...number | [number[], number[]]} args Either the shape of the step
 * prism, or two arrays containing the shape and heights of the step prisms.
 */
export const stepPrism = function(...args) {
	const res = [];

	// Gets the shape and heights from the parameters.
	let [shape, heights] = getShapeHeights(args);
	
	// Precalculates cosines and sines.
	const n = shape[0], 
		alpha = 2 * Math.PI / n,
		cosines = Array.from({length: n}).map((x,i) => Math.cos(alpha * i)),
		sines = Array.from({length: n}).map((x,i) => Math.sin(alpha * i));

	// Adds the coordinates.
	console.log(n);
	for(let i = 0; i < n; i++) {
		const coord = [heights[0] * cosines[i], heights[0] * sines[i]];

		for(let j = 1; j < shape.length; j++) {
			const idx = (i * shape[j]) % n;
			coord.push(heights[j] * cosines[idx], heights[j] * sines[idx]);
		}
		
		res.push(coord);
	}

	return res;
}
globalThis.stepPrism = stepPrism;

// Expects a 4D shape.
export const doubleStepPrism = function(...args) {	
	const res = [];

	// Gets the shape and heights from the parameters.
	let [shape, heights] = getShapeHeights(args);
	
	// Precalculates cosines and sines.
	const n = shape[0], 
		alpha = 2 * Math.PI * shape[1] / n,
		cosines = Array.from({length: n}).map((x,i) => Math.cos(alpha * i)),
		sines = Array.from({length: n}).map((x,i) => Math.sin(alpha * i));

	// Adds the coordinates.
	for(let i = 0; i < n; i++) {
		res.push([
			heights[0] * cosines[i],
			heights[0] * sines[i],
			heights[1] * cosines[i],
			heights[1] * sines[i],
		]);

		res.push([
			heights[1] * cosines[i],
			heights[1] * sines[i],
			heights[0] * cosines[i],
			heights[0] * sines[i],
		]);
	}

	return res;
}
globalThis.doubleStepPrism = doubleStepPrism;

function getShapeHeights(args) {
	// Gets the shape and heights from the parameters.
	let shape, heights;

	if(args[0] instanceof Array) {
		shape = args[0];
		heights = args[1] || new Array(shape.length).fill(1);
	}
	else {
		shape = args;
		heights = new Array(shape.length).fill(1);
	}

	return [shape, heights];
}