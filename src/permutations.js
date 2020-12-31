//Apply a function to all members of an array.
//coord: Point | Point[]
//fun: Point => Point[]
//returns: Point[]
function applyConcat(coord, fun) {
	if(coord[0] instanceof Array) {
		let res = [];
		for(let i = 0; i < coord.length; i++)
			res = res.concat(fun(coord[i]));
		return res;
	}
	return fun(coord);
}

//Apply a function either to a single object, or to an array thereof.
//coord: Point | Point[]
//fun: Point => any
//returns: void
function iterate(coord, fun) {
	if(coord[0] instanceof Array)
		for(let i = 0; i < coord.length; i++)
			fun(coord[i]);
	else 
		fun(coord);
}

//Swaps two elements in an array.
//array: any[]
//i, j: number
//returns: void
function swap(array, i, j) {
	const t = array[i];
	array[i] = array[j];
	array[j] = t;
}

//Sorts and returns true if the number of swaps was even.
//array: number[]
//returns: boolean
function sort(array) {
	let checks = array.length;
	let parity = true;
	
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

//Calculates all permutations of an array of points.
//coord: Point | Point[]
//returns: Point[][]
function permutations(coord) {
	return applyConcat(coord, _permutations);
}

//Calculates all permutations of a point.
//coord: Point
//returns: Point[][]
function _permutations(coord) {
	//Sorts the sequence in increasing order.
	coord.sort((a, b) => {return a - b;});
	const res = [];
	
	while(true) {
		//Adds a copy of the array.
		res.push([...coord]);
		
		//Searches for the last point the sequence strictly increases.
		let i = coord.length;
		while(i-- > 0 && coord[i - 1] >= coord[i]);
		
		//Return if the sequence is now decreasing.
		if(i === 0) return res;
		
		//Finds the next smallest thing larger than coord[i - 1].
		let j = i;
		while(coord[j] > coord[i - 1]) j++;
		
		//Swaps it with coord[i - 1].
		swap(coord, i - 1, --j);
		
		//Reverses the entire thing from coord[i] onwards.
		j = coord.length - 1;
		while(i < j) swap(coord, i++, j--);
	}
}

//coord: Point | Point[]
function evenPermutations(coord) {
	return applyConcat(coord, (x => _parityPermutations(x, true)));
}

//coord: Point | Point[]
function oddPermutations(coord) {
	return applyConcat(coord, (x => _parityPermutations(x, false)));
}

//coord: Point
function _parityPermutations(coord, parity) {
	//Sorts the sequence in increasing order. Changes the parity accordingly.
	if(!sort(coord)) parity = !parity;
	
	//If two elements are equal, parity is irrelevant.
	for(let i = 0; i < coord.length - 1; i++)
		if(coord[i] === coord[i + 1])
			return _permutations(coord);
			
	const res = [];
	
	while(true) {
		//Adds a copy of the array.
		if(parity) res.push([...coord]);
		
		//Searches for the last point the sequence strictly increases.
		let i = coord.length;
		while(i-- > 0 && coord[i - 1] >= coord[i]);
		
		//Return if the sequence is now decreasing.
		if(i === 0) return res;
		
		//Finds the next smallest thing larger than coord[i - 1].
		let j = i;
		while(coord[j] > coord[i - 1]) j++;
		
		//Swaps it with array[i - 1].
		swap(coord, i - 1, --j); parity = !parity;
		
		//Reverses the entire thing from array[i] onwards.
		j = coord.length - 1;
		while(i < j) { swap(coord, i++, j--); parity = !parity; }
	}
}

//coord: Point | Point[]
function allSignChanges(coord) {
	return signChanges(coord, range(coord.length));
}	

//coord: Point | Point[]
//indices: number[]
function signChanges(coord, indices) {	
	return applyConcat(coord, (x => _signChanges(coord, indices)));
}

//coord: Point
function _signChanges(coord, indices) {
	if(indices.length === 0)
		return [coord];
	
	const idx = indices.pop();
	const res = signChanges([...coord], [...indices]);
	
	if(coord[idx] === 0) return res;
	
	coord[idx] *= -1;
	return res.concat(signChanges(coord, indices));
}

function evenSignChanges(coord, indices) {
	return paritySignChanges(coord, indices, true);
}

function oddSignChanges(coord, indices) {
	return paritySignChanges(coord, indices, false);
}

//coord: Point | Point[]
//indices: number[]
//parity: boolean
function paritySignChanges(coord, indices, parity) {
	return applyConcat(coord, (x => _paritySignChanges(x, indices || range(x.length), parity)));
}

//coord: Point
//indices: number[]
//parity: boolean
function _paritySignChanges(coord, indices, parity) {
	//If an element is zero, we can just do normal sign changes.
	for(let i = 0; i < indices.length; i++)
		if(coord[indices[i]] === 0)
			return signChanges(coord, indices);
			
	return __paritySignChanges(coord, indices, parity);
}

//coord: Point
//indices: number[]
//parity: boolean
function __paritySignChanges(coord, indices, parity) {
	if(indices.length === 0)
		return parity ? [coord] : [];
	
	const idx = indices.pop();
	const res = __paritySignChanges([...coord], [...indices], parity);	
	coord[idx] *= -1;
	return res.concat(__paritySignChanges(coord, indices, !parity));
}