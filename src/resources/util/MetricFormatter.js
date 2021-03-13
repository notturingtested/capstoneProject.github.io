/* @flow */
/*jshint camelcase: false */

// TODO: Update import below.
//import { l10n } from '@analytics/l10nify';
import { l10n } from './../analytics/l10nify';
import _ from './../_';
import moment from './../moment';
import NumberFormatter from './NumberFormatter';

export default class MetricFormatter {
	constructor({ currencyCode = 'USD', thousandsSeparator = ',', decimalSeparator = '.' } = {}) {
		this.currencyCode = currencyCode;
		this.formatterOpts = { decimalSeparator: decimalSeparator, thousandsSeparator: thousandsSeparator };
		this.numberFormatter = new NumberFormatter();
	}

	// Params:
	// type       =  int* | time | percent | currency | raw
	// precision  = number of decimal places to show
	// abbreviate = should the number be abbreviated
	format(input, { type = 'int', precision = 0, abbreviate = false } = {}) {
		// Converts a string to a number, using the current decimalSeparator. If precision is used, it rounds the number to the precision.
		// For example '-1,234,333.455' converts to -123433.46 if precision is 2.
		if (type === 'raw') {
			if (typeof input === 'number') {
				return this.round(input, precision);
			}
			if (typeof input === 'string') {
				let [value, decimal] = input.split(this.formatterOpts.decimalSeparator);
				if (value === undefined) {
					value = '0';
				}
				if (decimal === undefined) {
					decimal = '0';
				}

				let isNegative = value.indexOf('-') !== -1;
				value = parseFloat(value.replace(/[^0-9]/g, ''));
				decimal = parseFloat('0.' + decimal.replace(/[^0-9]/g, ''));
				let newNumber = value + decimal;
				if (isNegative) {
					newNumber *= -1;
				}
				return this.round(newNumber, precision);
			}
		}

		//Convert the input to 0 if it is not a number.
		input = +input || 0;

		if (type === 'time') {
			let negative = input < 0;
			input = Math.abs(input);

			let currLocale = l10n.config.currentLocale;
			if (abbreviate) {
				// displays human readable text, 'a minute' or '9 months'
				return (negative ? '- ' : '') + moment.duration(input * 1000).humanize();
			} else {
				// displays in the format HH:MM:SS
				let seconds = Math.floor(input % 60);
				let minutes = Math.floor((input / 60) % 60);
				let hours = Math.floor(input / 60 / 60);
				return (
					(negative ? '-' : '') +
					(hours < 10 ? '0' : '') +
					hours.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.formatterOpts.thousandsSeparator) +
					':' +
					(minutes < 10 ? '0' : '') +
					minutes +
					':' +
					(seconds < 10 ? '0' : '') +
					seconds
				);
			}
		} else if (type === 'percent') {
			return (
				this.numberFormatter.format(input * 100, Object.assign({ precision: precision }, this.formatterOpts)) +
				'%'
			);
		}

		// for all other metric types, format the number (add commas, decimals, and abbreviate if specified)
		let formattedNumber;
		let isNegative;

		if (input < 0) {
			isNegative = true;
			input *= -1;
		}

		if (abbreviate) {
			// abbreviate big numbers with letters (13560 becomes 13.6K)
			if (input >= 1000 && input < 1e15) {
				formattedNumber = this.numberFormatter.format(input, this.formatterOpts); // adds thousand separators, eliminates precision
				formattedNumber = formattedNumber.split(this.formatterOpts.thousandsSeparator);
				const numCommas = formattedNumber.length - 1;

				// determine if it's an even thousand/million/etc (ie 12,000 would display 12k rather than 12.0k)
				if (formattedNumber[1] !== '000') {
					formattedNumber = Number(formattedNumber[0] + '.' + formattedNumber[1]);
					formattedNumber = this.numberFormatter.format(
						formattedNumber,
						Object.assign({ precision: precision }, this.formatterOpts),
					);
				} else {
					formattedNumber = formattedNumber[0];
				}

				// add on abbreviation letter
				if (numCommas === 1) {
					formattedNumber = l10n('%sK', [formattedNumber]);
				} else if (numCommas === 2) {
					formattedNumber = l10n('%sM', [formattedNumber]);
				} else if (numCommas === 3) {
					formattedNumber = l10n('%sB', [formattedNumber]);
				} else if (numCommas === 4) {
					formattedNumber = l10n('%sT', [formattedNumber]);
				}
			} else {
				formattedNumber = this.numberFormatter.format(input, this.formatterOpts); // adds thousand separators, eliminates precision
			}
		} else {
			formattedNumber = this.numberFormatter.format(
				input,
				Object.assign({ precision: precision }, this.formatterOpts),
			); // rounds to precision and adds thousand separators
		}

		if (type === 'currency') {
			if (this.currencyCode === 'USD') {
				formattedNumber = '$' + formattedNumber;
			} else {
				formattedNumber = formattedNumber + ' ' + this.currencyCode;
			}
		}

		let containsNonZeroNumbers = /[1-9]+/.test(formattedNumber); // See if there are any non-zero numbers in the formatted string.

		// We only need to add a negative sign if there are non-zero numbers in the string. We don't want to output -0 or -0.0
		if (isNegative && containsNonZeroNumbers) {
			formattedNumber = '-' + formattedNumber;
		}

		return formattedNumber;
	}

	round(number, precision) {
		if (precision === -1) {
			precision = this.getCurrentPrecision(number);
		}
		return _.round(number, precision);
	}

	// Gets the curent precision for a given number.
	// This is useful if you want to format a number, keeping the current precision.
	getCurrentPrecision(input) {
		input = +input || 0;
		return (input + '.').split('.')[1].length; // Always add an extra decimal so there are at least 2 elements in the array.
	}
}
