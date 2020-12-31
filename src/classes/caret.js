class Caret {
	constructor(txt) {
		this.fileText = txt;
		this.pos = 0;
	}
	
	static _isWhitespace(c) {
		return c === ' ' || c === '\r' || c === '\n';
	}
	
	skipWhitespace() {
		let c = this.fileText[this.pos];
		while(Caret._isWhitespace(c)) 
			c = this.fileText[++this.pos];
	}
	
	readNumber() {
		this.skipWhitespace();
		const idx = this.pos;
		while(!Caret._isWhitespace(this.fileText[++this.pos]));
		return parseFloat(this.fileText.substr(idx, this.pos - idx));
	}
}