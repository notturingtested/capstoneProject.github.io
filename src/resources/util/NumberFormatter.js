// TODO: Update import below.
//import { l10n } from '@analytics/l10nify';
import { l10n } from './../analytics/l10nify';

export default class NumberFormatter {
	format(number, { precision = 0, decimalSeparator = '.', thousandsSeparator = ',' } = {}) {
		if (typeof number !== 'number') {
			number = Number(number);
		}

		if (number === Infinity) {
			return l10n('Infinity');
		}

		if (Number.isNaN(number)) {
			return number.toString();
		}

		if (precision === -1) {
			precision = this.getPrecision(number);
		}

		precision = Math.min(precision, 20);

		// round number to given precision (adds decimalSeparator character)
		number = number.toFixed(precision);

		// add thousand separators and convert to string
		let [left, right] = number.toString().split('.');

		// right will be undefined if precision is zero
		right = precision && typeof right !== 'undefined' ? '.' + right : '';

		number = left.replace(/\B(?=(\d{3})+(?!\d))/g, 'thousandsSeparator') + right;

		// replace decimal and thousand separator with custom characters
		number = number.replace(/\./g, decimalSeparator);
		number = number.replace(/thousandsSeparator/g, thousandsSeparator);

		let containsNonZeroNumbers = /[1-9]+/.test(number);
		if (number.indexOf('-') === 0 && !containsNonZeroNumbers) {
			// If it is negative, and there are no numbers other than zero, then remove the negative. We don't want -0
			number = number.substr(1);
		}

		return number;
	}

	/**
	 * find the number of place after the decimal point of the given number
	 * @param {number} number
	 * @return {number} the precision of number
	 */
	getPrecision(number) {
		return (number + '.').split('.')[1].length; // Always add an extra decimal so there are at least 2 elements in the array.
	}

	/**
	 * Convert a number to the given precision. This will fix floating point problems with doing math on numbers
	 *
	 * Example:
	 * 1.45 - 1 => 0.44999999999999996
	 * numberToPrecision(1.45 - 1, 2) => 0.45
	 *
	 * @param {number} number
	 * @param {number} precision - the number of places after the decimal point.
	 * @return {number} the number with the precision applied
	 */
	numberToPrecision(number, precision) {
		return parseFloat(Number(number).toFixed(precision));
	}
}
