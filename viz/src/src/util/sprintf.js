/* @flow */
module.exports = function sprintf(format /*: string */, args /*: Array<string> */) /*: string */ {
	if (Array.isArray(args)) {
		if (format.indexOf('%1$s') !== -1) {
			for (let i = 0; i < args.length; i++) {
				format = format.replace('%' + (i + 1) + '$s', args[i]);
			}
			return format;
		} else {
			return format.replace('%s', args[0]);
		}
	} else {
		throw new Error('You must pass in an array of replace values to sprintf!');
	}
};
