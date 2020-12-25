class DataStream {
	constructor (path,startpoint=0) {	
		this.stream_ = path.slice(startpoint,path.length);
	}

	get stream() {
		return this.stream_;
	}

	get min () {
		let bottom = 100000;
		for(let i = 0; i < this.stream.length; i++) {
			if(this.stream[i] < bottom) {
				bottom = this.stream[i];
			}
		}
		return bottom;
	}
	
	get max () {
		let top = -100000;
		for(let i = 0; i < this.stream.length; i++) {
			if(this.stream[i] > top) {
				top = this.stream[i];
			}
		}
		return top;
	}

	modulator (index,scalemin,scalemax,outputmin,outputmax, smoothing=1) {
		let inputmin = this.min + scalemin*(this.max - this.min);
		let inputmax = this.max - scalemax*(this.max - this.min);
		if(smoothing < 1) smoothing = 1;
		let sum = 0;
		let avg = 0;
		for (let i = 0; i < smoothing; i++) {
			if(index-i >= 0) {
				let ix = index-i;
				if (ix > this.stream.length) ix =this.stream.length;
				let value = map(this.stream[index-i],inputmin,inputmax,outputmin,outputmax);
				sum += value;
				avg = sum/(i+1);
		}
    }
		return this.clamp(avg,outputmin,outputmax);// (num, a, b) => Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
	}

	gate (index,threshold) {
		let value = map(this.stream[index], this.min, this.max, 0, 1);
		return threshold < value 
	}

	clamp(num,low,high) {
		return Math.max(Math.min(num, Math.max(low, high)), Math.min(low, high))
	}
}	