let d3Lib;
if (typeof window !== 'undefined') {
	d3Lib = window.d3;
} else {
	d3Lib = {};
}

const d3 = d3Lib;

export default d3;
