"use strict";

function stepPrism(n, d) {
	let alpha = 0, beta = 0;
	const dAlpha = 2 * Math.PI / n, dBeta = dAlpha * d;
	
	for(let i = 0; i < n; i++) {
		coordinates.add([
			Math.cos(alpha), Math.sin(alpha),
			Math.cos(beta), Math.sin(beta)
		]);
		
		alpha += dAlpha; beta += dBeta;
	}
}