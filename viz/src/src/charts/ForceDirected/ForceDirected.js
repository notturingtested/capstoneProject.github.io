// TODO: Update the below imports using the @analytics syntax.
// TODO: Remove the .js at the end of the files later on...
import { _, MetricFormatter, isNumeric, moment, sleep } from './../../analytics/core';
import guid from './../../analytics/guid';

import ChartFactory from './../ChartFactory';
import VegaViz from '../VegaViz';
import vegaL10n from './../vegaL10n/vegaL10n';
import ForceDirectedMarks from './ForceDirectedMarks';
import ForceDirectedScales from './ForceDirectedScales';
import ForceDirectedSignals from './ForceDirectedSignals';

//import LineMarks from './LineMarks';
//import LineScales from './LineScales';
//import LineSignals from './LineSignals';
//import LineExpressionFunctions from './LineExpressionFunctions';
//import LineTooltip from './LineTooltip';
//import LineVegaDataFormatter from './LineVegaDataFormatter';
//import { getConstants } from './../VizConstants';

const { vega, vegaEmbed } = window;
console.log(vega);
/**
 * Parent class:
 * this.el - the current element storing the view.
 *
 *
 *
 *
 * Class Values:
 *
 * this.chartID - the id of the current chart.
 * this.lastRenderId - the id of the last desired render item.
 * this.vegaView - The current vega view for a Line Graph.
 * this.opts - The opts passed to setupChart. Should have a
 * form of this.opts - {
 *  dataSets: [
 *    data: [
 *      dateGranularity
 *    ]
 *  ],
 *  showLoadingState: function(vegaContainer), - should display a loading indicator on the new vegaContainer element based on the function passed in opts
 *  locale,
 *  shouldRenderSmallChart,
 *
 * }
 *
 *
 * this.setupChart(opts) - async:
 * - 1. assigns a new lastRenderId by calling this.cancelPendingRenders()
 * - 2. calls this.destroy() (class function for removing the previous view)
 * - 3. call this.validate(opts) (function in VegaViz) to make sure opts exists and it is not a unit test
 * - 4. Remove the actual element displayed on the screen: Remove the current .vega-container element shown on the screen.
 * - 5. Create a new div and add it to the 'vega-container' class.
 * - 6. Add the new div to the element (display it), showing a loading indicator if necessary.
 * - 7. Store everything necessary for a chart in a chartOptions object.
 * - 8. Pass the chartOptions to a LineVegaDataFormatter. This function returns formattedData and aggreggate data, which are used to update the chartOptions object.
 * - 9. Create a LineToolTip by passing the updated chartOptions.
 * - 10.
 *
 * this.validate() - returns false if this.dataSets does not exist.
 */

export default class ForceDirected extends VegaViz {
  async draw(opts) {
		await super.draw(opts);
		if (!this.chartID) {
			this.chartID = guid.create();
		}
    console.log("Hello world!");
		await this.setupChart(opts);
	}

  async setupChart(opts) {
    /*
		//the vegaEmbed call is async - cancel any previous renders that haven't finished
		const currentRenderId = guid.create();
		this.cancelPendingRenders({ newPendingRenderId: currentRenderId });

		// Destroy the last vega container so we can measure the appropriate chart dimensions from a clean slate
		this.destroy();

		this.opts = opts;

		if (!this.validate(opts)) {
			return;
		}

		let existing = this.el.querySelector('.vega-container');
		if (existing) {
			existing.remove();
		}

		//create the container
		const vegaContainer = document.createElement('div');
		vegaContainer.classList.add('vega-container');

		if (this.shouldShowLoadingState(opts)) {
			opts.showLoadingState(vegaContainer);
			this.el.appendChild(vegaContainer);
			// set a timeout here to flush the dom changes we just made
			// if we don't, the thread will just keep plowing through and the spinner will never show
			await sleep(500);
		} else {
			this.el.appendChild(vegaContainer);
		}
    */

		//set up locale for vega to take care of x axis date formatting for us
    /*
		const vegaLocale = vega.timeFormatLocale(vegaL10n[opts.locale].localeDefinition);
		const representativeData = opts.dataSets?.[0]?.data?.[0];
		const granularity = representativeData ? representativeData.value('dateGranularity') : null;
		const chartOptions = {
			...opts,
			height: this.el.clientHeight,
			width: this.el.clientWidth,
			vegaLocale,
			maxDataSetLength: this.getMaxDataSetLength(),
			formatYAxisTick: this.formatYAxisTick.bind(this),
			formatXAxisTick: this.createXAxisTickFormatter({ locale: opts.locale, vegaLocale, granularity }),
			formatNumber: this.formatNumber.bind(this),
			moreThanOneSeries: opts.dataSets.length > 1,
			dualYAxisIsEnabled: this.dualYAxisIsEnabled,
			normalizedIsEnabled: this.normalizedIsEnabled,
			normalizationRequired: this.normalizationRequired,
			anomaliesEnabled: this.anomaliesEnabled,
			showMaxMinLabels: this.showMaxMinLabels,
			showNormalizedAxis: this.showNormalizedAxis,
			anomalyRescaleIsEnabled: this.anomalyRescaleIsEnabled,
			padding: this.padding,
			chartID: this.chartID,
			// ASSUMPTION: There can only be ONE granularity applied to the chart at any given time
			granularity,
		};

		//format the data for vega
		const { formattedData, aggregateData } = LineVegaDataFormatter.format(chartOptions);
		Object.assign(chartOptions, { formattedData, ...aggregateData });

		//create tooltip handler
		const lineTooltip = new LineTooltip(chartOptions);
		const tooltipCallback = lineTooltip.show.bind(lineTooltip);

		//create a expression for the instance so we can reference options and custom instance functions inside of vega
		LineExpressionFunctions.registerChartInstance(vega, this.chartID, chartOptions);

		//embed the vega chart into the dom
		const vegaSpec = this.getChartConfig(chartOptions);
		const embedOpts = { renderer: this.renderer, actions: false, tooltip: tooltipCallback };

		// vegaEmbed will generate the canvas, and add the canvas to vegaContainer
		// it will also remove all children from vegaContainer beforehand (so it will remove the loading spinner we added)
		// see here: https://github.com/vega/vega-embed/blob/940c44c1051ae2138cf00e05e2a8b05c1ece25bd/src/embed.ts#L296
		const vegaView = await vegaEmbed(vegaContainer, vegaSpec, embedOpts);

		// because the vegaEmbed func is async, finalize any renders we cancelled above
		// if not cancelled, set as the new this.vegaView
		if (this.isCancelledRender(currentRenderId)) {
			vegaView.view.finalize();
			vegaView.view.container().remove();
		} else {
			this.vegaView = vegaView;
		}
    */
	}

  /*
	shouldShowLoadingState(opts) {
		//use a hueristic to decide to show a loading spinner - only show for big data sets
		//for example concurrent viewers panel can have 15000 data points
		let totalDataPoints = (opts.dataSets?.length ?? 0) * (opts.dataSets?.[0]?.data?.length ?? 0);
		return totalDataPoints > 10000;
	}

	// since vegaEmbed is async, allow for cancelling pending renders
	// if two render calls come in, we want the last one in to be what renders on the page
	// imagine an example where call "A" comes in, then "B", but B finishes async work before A.  We want A to be cancelled so that B is what gets rendered on the page
	cancelPendingRenders({ newPendingRenderId }) {
		this.lastRenderId = newPendingRenderId;
	}

	isCancelledRender(renderId) {
		return renderId !== this.lastRenderId;
	}

	destroy() {
		if (this.vegaView) {
			this.vegaView.view.finalize();
			this.vegaView.view.container().remove();
		}
	}

	validate() {
		// An array of datasets is required
		if (!this.dataSets) {
			return false;
		}

		const representativeData = this.dataSets[0]?.data?.[0];

		// Check that the first element is time
		// This still allows an empty dataset to pass
		if (representativeData && !(representativeData.value('x') instanceof Date)) {
			return false;
		}

		return super.validate(this._opts.dataSets);
	}

	getChartConfig(opts) {
		let config = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      // Fit within width/height, with width/height being the total.
			autosize: { type: 'fit', contains: 'padding' },
			//padding: opts.padding,
			//background: getConstants().vizBackgroundColor,
			width: opts.width,
			height: opts.height,
			data: opts.formattedData,
			signals: LineSignals.create(opts),
			marks: LineMarks.create(opts),
			scales: LineScales.create(opts),
			axes: LineAxes.create(opts),
			config: {},
		};

		return config;
	}

	get padding() {
    // Hardcoded value for now...
    return 0;
	}

	getMaxDataSetLength() {
		if (!this.dataSets.length) {
			return 0;
		}
		const longestDataSet = _.max(this.dataSets, ds => ds.data.length);
		return longestDataSet.data.length;
	}

	formatYAxisTick(value, index, axisName) {
		let formatOptions;

		if (this.dualYAxisIsEnabled) {
			const dataSet = axisName === 'y2axis' ? this.dataSets[1] : this.dataSets[0];
			formatOptions = dataSet.value(`numberFormatOptions`);
		} else {
			//get format options for all series
			const allFormats = this.dataSets.map(set => set.value('numberFormatOptions'));

			//check to see if we have conflicting format types
			//if mixedType, create a mixed formatting, else just get the formatting options from the first series
			const isMixedType = _.uniq(allFormats.map(f => f.type)).length > 1;

			if (isMixedType) {
				formatOptions = {
					type: 'int',
					precision: Math.max.apply(null, allFormats.map(f => f.precision)),
					abbreviate: false,
				};
			} else {
				formatOptions = this.dataSets[0] ? this.dataSets[0].value(`numberFormatOptions`) : {};
			}
		}

		//calculate precision - when generating the axes, vega will provide the number with the precision necessary.  Compare that with the metric precision, and take the more precise one
		let parsedPrecision = this.getPrecision(value);
		if (formatOptions.type === 'percent') {
			parsedPrecision -= 2;
		} //values come as decimal, so subtract 2 if show percents
		const metricPrecision = _.isFinite(formatOptions.precision) ? formatOptions.precision : 0;
		formatOptions.precision = Math.max(parsedPrecision, metricPrecision);

		//TODO: always abbreviating false for now until we set up calculatePrecision
		let formatted = this.formatNumber(value, { ...formatOptions, abbreviate: false });

		return formatted;
	}

	getPrecision(input) {
		const metricFormatter = new MetricFormatter();
		return metricFormatter.getCurrentPrecision(input);
	}

	//if we want to mirror prod as close as possible, we can use this function
	//but there are still some issues - now that we don't create ticks with 2 lines, asian locales appear wrong
	//we need to work on this before we use this function reliably
	createXAxisTickFormatter(opts) {
		if (!this.dataSets[0]) {
			return null;
		}

		const { locale, vegaLocale } = opts;
		const defaultHandler = datum => ({ granLabel: datum.label, switchLabel: ' ' });

		const gran = opts.granularity;
		if (!gran) {
			return defaultHandler;
		}

		const getFormattingTemplate = (granularity, format) => format[granularity] || format.fallback;
		const dateFormats = vegaL10n[locale].dateFormat;
		const granTemplate = getFormattingTemplate(gran, dateFormats.shortFormat);

		//switchFormat,switchLabel refer to the extra labels we will add when a tick
		//switches from one time frame to another, eg Oct1, 2, 3, ... 29, 30, 31, Nov1
		const switchFormat = dateFormats.mediumFormat; //switchFormat

		let prevDate;

		return function(datum) {
			let switchTemplate;
			let granLabel;
			let switchLabel;
			let formatter;
			let switchGranularity;
			let comparisonGranularity;

			const d = datum.value;
			const i = datum.index;

			if (i === 0) {
				prevDate = null;
			}

			// Extra label info on first tick & on change
			// minutes changed
			if (gran === 'second') {
				switchTemplate = switchFormat.minute;
				comparisonGranularity = 'second';
				switchGranularity = 'minute';
			}

			// day changed
			if (gran === 'hour') {
				switchTemplate = switchFormat.day;
				comparisonGranularity = 'hour';
				switchGranularity = 'day';
			}

			// month changed
			if (gran === 'day' || gran === 'week') {
				switchTemplate = switchFormat.month;
				comparisonGranularity = 'day';
				switchGranularity = 'month';
			}

			// year changed
			if (gran === 'month' || gran === 'quarter') {
				switchTemplate = switchFormat.year;
				comparisonGranularity = 'month';
				switchGranularity = 'year';
			}

			// hour changed
			// For this one, instead of concatting, just create a combined time format
			// for example for minute: instead of 12 PM 5, just do 12:05 PM
			if (gran === 'minute') {
				const minuteTemplate = getFormattingTemplate('minute', dateFormats.mediumFormat);
				formatter = vegaLocale.format(minuteTemplate);
			} else {
				formatter = vegaLocale.format(granTemplate);
			}

			//create the label
			granLabel = formatter(d);

			//format the switchLabel
			if (switchTemplate) {
				formatter = vegaLocale.format(switchTemplate);
				switchLabel = formatter(d);
			}

			const newDate = moment(d);
			/**
			 * The common denominator of a date is the granularity that is one step less granular than the specified one.
			 *
			 * For these dates:
			 * 30 Jan 2019
			 * 31 Jan 2019
			 * 1 Feb 2019
			 * 2 Feb 2019
			 *
			 * If the specified granularity is `day`, we define the switch granularity to be a step above that, which is `month`.
			 * Therefore, 30 Jan 2019 and 31 Jan 2019 will have a common switch granularity, where 30 Jan 2019 and 1 Feb 2019 will not.
			 *
			const switchGranularityMatch =
				switchGranularity && prevDate ? moment(prevDate).isSame(newDate, switchGranularity) : false;
			const comparisonGranularityMatch =
				comparisonGranularity && prevDate ? moment(prevDate).isSame(newDate, comparisonGranularity) : false;

			prevDate = newDate;

			/**
			 * Since we're showing every possible label thus far, we'll need to filter out redundant labels.
			 * An axis label looks something like this:
			 *         15    -> Granularity Label
			 *        Jan    -> Switch Label
			 *
			 * The granularity label should be rendered for every unique date.
			 *
			if (comparisonGranularityMatch) {
				granLabel = ' ';
			}

			/**
			 * For each sequence of identical switch labels, only the first instance should be rendered:
			 *       30      31       1      2      3
			 *      Jan              Feb
			 *
			if (i !== 0 && switchGranularityMatch) {
				switchLabel = ' ';
			}

			// Vega expects a non-empty string label for each datum
			return {
				granLabel: granLabel || ' ',
				switchLabel: switchLabel || ' ',
			};
		};
	}

	containsAnomalyData() {
		return this.dataSets.some(ds => ds.data.some(d => d.value('upperConfidenceBound')));
	}

	get dataSets() {
		return this.opts.dataSets;
	}

	get anomaliesEnabled() {
		return this.opts.showAnomalies && this.containsAnomalyData();
	}

	get anomalyRescaleIsEnabled() {
		return this.opts.allowAnomaliesToRescale && this.anomaliesEnabled;
	}

	get dualYAxisIsEnabled() {
		return this.opts.dualYAxis && this.dataSets.length === 2;
	}

	get normalizedIsEnabled() {
		return this.opts.normalized && this.dataSets.length >= 2;
	}

	get normalizationRequired() {
		return this.normalizedIsEnabled || this.dualYAxisIsEnabled;
	}

	get showMaxMinLabels() {
		return this.opts.showMax || this.opts.showMin;
	}

	get showNormalizedAxis() {
		return this.normalizedIsEnabled;
	}

	get renderer() {
		//render differently depending where the chart will be rendered (svg for PDF, canvas for HTML)
		//canvas won't scale well in PDF as the user resizes the PDF.  SVG lets the PDF redraw certain nodes (eg text) so they look crisp
		//SVG adds a lot of dom nodes that will slow down a browser page, using canvas cuts down to just one dom node
		return this.opts.serverRender ? 'svg' : 'canvas';
	}

	highlightDataByIds(ids = []) {
		// TODO: Needs to be implemented differently from CloudViz since we don't have the DOM to manipulate
	}
  */
}

ChartFactory.registerChart(ForceDirected);
