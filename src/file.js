function exportCoordinates() {
	let txt = dimensions_nud.value + '\n';
	const len = coordinates.list.length;
	txt += len + '\n';
	
	for(let i = 0; i < len; i++)  {
		for(let j = 0; j < coordinates.list[i].length; j++)
			txt += coordinates.list[i][j] + ' ';
		txt += '\n';
	}
	
	const blob = new Blob([txt], {type: 'text/plain'});
	const fileName = 'polytope_input.txt';
	if(window.navigator.msSaveOrOpenBlob) 
		window.navigator.msSaveOrOpenBlob(blob, filename);
	else {
		dl_a.href = window.URL.createObjectURL(blob);	
		dl_a.download = fileName;
		dl_a.click();
	}
}

function importCoordinates(event) {
	//Loads header info, declares some variables.
	const caret = new Caret(event.target.result);
	const dim = caret.readNumber();
	const vertexCount = caret.readNumber();
	const facetCount = caret.readNumber();
	const ridgeCount = caret.readNumber();
	const elementList = [[]];
	
	//Reads vertices.
	for(let i = 0; i < vertexCount; i++) {
		elementList[0].push([]);
		for(let j = 0; j < dim; j++)
			elementList[0][i].push(caret.readNumber());
	}
	
	//Reads facets.
	elementList[dim - 1] = [];
	for(let i = 0; i < facetCount; i++) {
		const elCount = caret.readNumber();
		const facet = [];
		
		for(let j = 0; j < elCount; j++)
			facet.push(caret.readNumber());
		elementList[dim - 1].push(facet.sort());
	}
	
	//Generates (d - 1)-dimensional elements out of d-dimensional elements.
	for(let d = dim - 1; d >= 2; d--) {
		elementList[d - 1] = [];
	}
	
	console.log(elementList);
}