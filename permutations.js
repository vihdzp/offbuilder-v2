//Apply a function to all members of an array.
//array: Point[]
//fun: Point => Point[]
//returns: Point[]
function applyConcat(array, fun) {
	let res = [];
	for(let i = 0; i < array.length; i++)
		res = res.concat(fun(array[i]));
	return res;
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

//Calculates all permutations of an array of points.
//array: Point[]
//returns: Point[][]
function permutations(array) {
	return applyConcat(array, _permutations);
}

//Calculates all permutations of a point.
//array: Point
//returns: Point[][]
function _permutations(array) {
	//Sorts the sequence in increasing order.
	array.sort();
	const res = [];
	
	while(true) {
		//Adds a copy of the array.
		res.push([...array]);
		
		//Searches for the last point the sequence strictly increases.
		let i = array.length;
		while(i-- > 0 && array[i - 1] >= array[i]);
		
		//Return if the sequence is now decreasing.
		if(i === 0) return res;
		
		//Finds the next smallest thing larger than array[i - 1].
		let j = i;
		while(array[j] > array[i - 1]) j++;
		
		//Swaps it with array[i - 1].
		swap(array, i - 1, --j);
		
		//Reverses the entire thing from array[i] onwards.
		j = array.length - 1;
		while(i < j) swap(array, i++, j--);
	}
}

//array: Point[]
function evenPermutations(array) {
	return applyConcat(array, (x => _parityPermutations(x, true)));
}

//array: Point[]
function oddPermutations(array) {
	return applyConcat(array, (x => _parityPermutations(x, false)));
}

//array: Point
function _parityPermutations(array, parity) {
	//Sorts the sequence in increasing order. Changes the parity accordingly.
	if(!sort(array)) parity = !parity;
	
	//If two elements are equal, parity is irrelevant.
	for(let i = 0; i < array.length - 1; i++)
		if(array[i] === array[i + 1])
			return _permutations(array);
			
	const res = [];
	
	while(true) {
		//Adds a copy of the array.
		if(parity) res.push([...array]);
		
		//Searches for the last point the sequence strictly increases.
		let i = array.length;
		while(i-- > 0 && array[i - 1] >= array[i]);
		
		//Return if the sequence is now decreasing.
		if(i === 0) return res;
		
		//Finds the next smallest thing larger than array[i - 1].
		let j = i;
		while(array[j] > array[i - 1]) j++;
		
		//Swaps it with array[i - 1].
		swap(array, i - 1, --j); parity = !parity;
		
		//Reverses the entire thing from array[i] onwards.
		j = array.length - 1;
		while(i < j) { swap(array, i++, j--); parity = !parity; }
	}
}

function allSignChanges(coord) {
	const indices = [];
	for(let i = 0; i < coord.length; i++)
		indices.push(i);
		
	return signChanges(coord, indices);
}	

function signChanges(coord, indices) {
	if(indices.length === 0)
		return [coord];
	
	const idx = indices.pop();
	const res = signChanges([...coord], [...indices]);
	
	if(coord[idx] === 0) return res;
	
	coord[idx] *= -1;
	return res.concat(signChanges(coord, indices));
}