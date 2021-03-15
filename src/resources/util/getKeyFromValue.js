// module.exports = function getKeyFromValue(value) {
// 	let key = value.replace(/%s/g, '');
// 	key = key.replace(/%[1-9]+\$s/g, '').substring(0, 50);
//
// 	// Get the sum of all each letters character code.
// 	const detectCapsUniqueValue = key
// 		.split('')
// 		.map(char => char.charCodeAt(0))
// 		.reduce((a, b) => a + b);
//
// 	// CamelCase the value.
// 	const camelCaseKey = key
// 		.replace(/\W+/g, ' ') // remove any non-alphanumeric characters.
// 		.trim()
// 		.split(/\s+|_+|-+/) // split on spaces, underscores, and dashes.
// 		.map(
// 			(word, index) =>
// 				word.substring(0, 1)[index === 0 ? 'toLowerCase' : 'toUpperCase']() + word.substring(1).toLowerCase(),
// 		) // either uppercase or lowercase the first character.
// 		.join(''); // and finally join it all back together.
//
// 	return camelCaseKey + '_' + (value.length + detectCapsUniqueValue);
// };
