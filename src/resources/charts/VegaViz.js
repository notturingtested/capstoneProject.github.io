// Keep import below.
// import { _, MetricFormatter } from '@analytics/core';
import { _, MetricFormatter } from './../analytics/core';

// Params:
// numberFormatter(number, {type:int* | time | percent | currency , precision:0 , abbreviate: false})

export default class VegaViz {
  // Call this._setOpts
	constructor(opts = {}) {
		this._setOpts(opts);
	}

	async draw(opts = {}) {
    // Call this._setOpts
		this._setOpts(opts);
	}

  // If data is null, return false. If this is a unit test, return false.
	validate(data) {
		if (!data) {
			return false;
		}

		if (this.isUnitTest) {
			this.el.innerHTML = JSON.stringify(data, null, 2);
			return false; // For now we always return false if it is a unit test so we don't try to render via cloudviz.
		}

		return true;
	}

	get isUnitTest() {
		return !!window.isUnitTest;
	}

	// Calls update with the same opts previously used. Used for resizing.
	refresh() {
		// VegaVizComponent currently takes care of resizing via React's lifecycle methods
		// this.update(this._opts);
	}

	onResize() {
		this.refresh();
	}

	destroy() {
		// cleanup.
	}

	_callOptsHandler(method, args) {
		if (!this._opts[method]) {
			return;
		}
		return this._opts[method].apply(null, args);
	}

	formatNumber(value, options = {}, optionOverrides = null) {
		return this._numberFormatter(value, optionOverrides ? Object.assign({}, options, optionOverrides) : options);
	}

	onMouseOver(...args) {
		return this._callOptsHandler('onMouseOver', args);
	}

	onMouseOut(...args) {
		return this._callOptsHandler('onMouseOut', args);
	}

	onContextMenu(...args) {
		return this._callOptsHandler('onContextMenu', args);
	}

	onRender(...args) {
		return this._callOptsHandler('onRender', args);
	}

	highlightDataByIds(ids) {
		/* implemented in subclass */
	}

	unhighlightData() {
		/* implemented in subclass */
	}

	onError(...args) {
		if (this.el && !this.isUnitTest) {
			this.el.innerHTML = '';
		}
		return this._callOptsHandler('onError', args);
	}

	get locale() {
		return this._opts.locale || 'en-US';
	}

	get l10nConfig() {
		return this._opts.l10n || {};
	}

	/*
	 * opts should have a data property defined like:
	 * opts = {
	 * 	data: {
	 * 		data: [value, value, value]
	 * 	}
	 * }
	 *
	 * or
	 * opts = {
	 * 	y: [value, value, value],
	 * 	x: [value, value, value]
	 * }
	 */
	// AN-232139 - Don't call this outside of VegaViz, there are other opts that get injected in VegaVizComponent
	_setOpts(opts = {}) {
    // Element passed into the class.
    this.el = opts.el;

    // assign the number formatter passed into the function, or
    // create a new MetricFormatter() otherwise.
		if (opts.numberFormatter) {
			this._numberFormatter = opts.numberFormatter;
		} else if (!this._numberFormatter) {
			let metricFormatter = new MetricFormatter();
			this._numberFormatter = metricFormatter.format.bind(metricFormatter);
		}
		this._opts = opts;
	}
}
