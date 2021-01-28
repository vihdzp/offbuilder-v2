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

export const doubleStepPrism = function(...args) {
	return _doubleStepPrism(false, args);
}
globalThis.doubleStepPrism = doubleStepPrism;

export const doubleGyroStepPrism = function(...args) {
	return _doubleStepPrism(true, args);
}
globalThis.doubleGyroStepPrism = doubleGyroStepPrism;

// Expects a 4D shape.
function _doubleStepPrism(gyro, args) {	
	gyro = gyro ? -1 : 1;

	const res = [];

	// Gets the shape and heights from the parameters.
	let [shape, heights] = getShapeHeights(args);
	
	// Precalculates cosines and sines.
	const n = shape[0], 
		alpha = 2 * Math.PI / n,
		cosines = Array.from({length: n}).map((x,i) => Math.cos(alpha * i)),
		sines = Array.from({length: n}).map((x,i) => Math.sin(alpha * i));

	// Adds the coordinates.
	for(let i = 0; i < n; i++) {
		const j = (i * shape[1]) % n
		res.push([
			heights[0] * cosines[i],
			heights[0] * sines[i],
			heights[1] * cosines[j],
			heights[1] * sines[j],
		]);

		res.push([
			heights[1] * cosines[i] * gyro,
			heights[1] * sines[i] * gyro,
			heights[0] * cosines[j],
			heights[0] * sines[j],
		]);
	}

	return res;
}

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