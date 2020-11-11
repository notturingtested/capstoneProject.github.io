// Number('1.2.3.4') = NaN,
// parseFloat('1.2.3.4') = 1.2
export default function(e) {
	return !Number.isNaN(parseFloat(e)) && Number.isFinite(Number(e));
}
