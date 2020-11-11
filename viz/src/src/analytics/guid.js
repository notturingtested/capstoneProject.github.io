/* eslint no-bitwise:0,no-nested-ternary:0,no-mixed-operators:0 */

import { v4 as uuidv4 } from 'uuid';

let dateNow =
	Date.now()
		.toString(16)
		.substring(5) + '-';
let count = 0;

export default {
	create: function({ delimiter = '-', lowerCase = false } = {}) {
		let id = uuidv4(); // IE: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
		if (delimiter !== '-') {
			id = id.replace(/-/g, delimiter);
		}
		if (!lowerCase) {
			id = id.toUpperCase();
		}
		return id;
	},
	light: function() {
		count++;
		//Example: 775e67-15b
		return dateNow + count.toString(16);
	},
};
