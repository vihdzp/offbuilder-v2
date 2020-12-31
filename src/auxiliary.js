"use strict";

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

//Returns the common elements of two sorted arrays.
//el1: number[]
//el2: number[]
//returns: number[]
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

//Checks whether an array has already been added to another.
//Returns -1 if not, the index otherwise.
//els: number[]
//elList: number[][]
//equal: (number[], number[]) => boolean
//returns: number
function checkDuplicate(elList, els, equal) {
	for(let i = 0; i < elList.length; i++) 
		if(equal(els, elList[i]))
			return i;
	
	return -1;
}

//Checks whether two arrays are equal.
//el1: number[]
//el2: number[]
//returns: boolean
function equal(el1, el2) {
	if(el1.length != el2.length) 
		return false;
		
	for(let i = 0; i < el1.length; i++)
		if(el1[i] != el2[i])
			return false;
			
	return true;
}

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