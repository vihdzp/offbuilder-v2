"use strict";

class CoordinateList {
	//textArea: self-descriptive
	constructor(textArea) {
		textArea.value = '';
		this.textArea = textArea;
		this.list = [];
		this.dictionary = {};
		this.options = {
			formatting: 0,
			sign: 0,
			permutation: 0,
			parentheses: false
		};
	}
	
	//coord: Point | Point[]
	push(coord) {
		const _this = this;
		iterate(coord, (coord) => {_this._push(coord);});
	}
	
	//coord: Point
	_push(coord) {
		const str = CoordinateList._toString(coord);
		if(!this.dictionary[str]) {
			this.list.push(coord);
			this.textArea.value += str + '\n';
			this.dictionary[str] = true;
		}
	}
	
	//coord: Point | Point[]
	add(coord) {
		const _this = this;
		iterate(coord, (coord) => { _this._add(coord); });
	}
	
	//coord: Point
	_add(coord) {
		switch(this.options.sign) {
			//All
			case 1:
				coord = allSignChanges(coord);
				break;
			//Even
			case 2:
				coord = evenSignChanges(coord);
				break;
			//Odd
			case 3:
				coord = oddSignChanges(coord);
				break;
		}
		
		switch(this.options.permutation) {
			//None
			case 0:
				this.push(coord);
				break;
			//All
			case 1:
				this.push(permutations(coord));
				break;
			//Even
			case 2:
				this.push(evenPermutations(coord));
				break;
			//Odd
			case 3:
				this.push(oddPermutations(coord));
				break;					
		}
	}
	
	//returns: void
	clear() {
		this.list = [];
		this.textArea.value = '';
		this.dictionary = {};
	}
	
	//coord: Point
	static _toString(coord) {
		let str = '(';
		let i;
		for(i = 0; i < coord.length - 1; i++)
			str += coord[i] + ', ';
		return str + coord[i] + ')';
	}
}

//str: string
//returns: Point
function parse(str) {
	const c = (coordinates.options.formatting === 1) ? ',' : ' ';	
	str = str.replace(/ +/g, ' ').trim();
	
	if(coordinates.options.parentheses)
		str = str.substr(1, str.length - 2);
	str = str.split(c);
	
	const res = [];
	
	for(let i = 0; i < str.length; i++)
		res.push(eval(str[i]));
	
	return res;
}

const coordinates = new CoordinateList(out_txt);
