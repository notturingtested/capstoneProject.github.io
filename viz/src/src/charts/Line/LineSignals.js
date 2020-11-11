// Keep the import below.
// import { _ } from '@analytics/core';
import { _ } from './../../analytics/core';

export default class LineSignals {
	getSignals(opts) {
		//these are the events that tell us to show the confidence bands (when you have more than one series)
		//hover over a point or hovering over a line will set a variable within vega (activeSeries)
		//this lets us reference that variable later and show the confidence bands for that series
		const anomalyHoverEvent = {
			name: 'activeSeries',
			on: [
				{ events: '@multiSeriesHoverLine:mouseover', update: 'datum.series' },
				{ events: '@multiSeriesHoverLine:mouseout', update: 'null' },
				{ events: '@point:mouseover', update: 'datum.series' },
				{ events: '@point:mouseout', update: 'null' },
				{ events: '@maxMinPoint:mouseover', update: 'datum.series' },
				{ events: '@maxMinPoint:mouseout', update: 'null' },
			],
		};

		//summary of the findClosestXExpression string
		// customExpression_findClosestXValue is a custom function we define with vega - it takes a value and returns the x value in our data set closest to it
		// invert is a vega function that takes a value and returns its corresponding value from the scale's domain (see vega docs on invert).  We pass in 'x' to tell vega which scale to use
		// we clamp the x() value vega gives us from the mouse move event
		// we call getChartOpts so we can pass them to the custom expression
		// when we do all of this, the return value is the xValueClosestToMousePosition, which we set to be used later for drawing points based on hover etc
		const findClosestXExpression = `customExpression_findClosestXValue(invert('x', clamp(x(), 0, width)), getChartOpts('${opts.chartID}'))`;

		//used to display the y values in each legend item on hover
		const updateLegendNumberExpression = `customExpression_updateLegendNumbers(xValueClosestToMousePosition, getChartOpts('${opts.chartID}'))`;

		const showTooltip = `showInspectorTooltip(event, xValueClosestToMousePosition, height, getChartOpts('${opts.chartID}'))`;

		return _.compact([
			{
				name: 'xValueClosestToMousePosition',
				on: [
					// adding debounce or throttle here "mousemove{100}" causes the legend to flicker.
					// If you close the console, performance is way better (no need to debounce or throttle).
					{ events: 'mousemove', update: findClosestXExpression },
					{ events: 'mouseout', update: 'null' },
				],
			},
			{
				name: 'updateLegendNumbers',
				on: [{ events: { signal: 'xValueClosestToMousePosition' }, update: updateLegendNumberExpression }],
			},
			{
				name: 'showInspectorTooltip',
				on: [
					{
						events:
							'@inspector:mousemove,@inspector-rule:mousemove,@confidenceBands:mousemove,@line:mousemove,@multiSeriesHoverLine:mousemove,@expectedLine:mousemove',
						update: showTooltip,
					},
					{ events: 'view:mouseout,@point:mouseover!', update: `hideTooltip(event)` },
				],
			},
			{
				name: 'highlightDataSource',
				on: [
					{
						events: '@point:mouseover',
						update: `highlightDataSource(datum, getChartOpts('${opts.chartID}'))`,
					},
					{ events: '@point:mouseout', update: `unhighlightDataSource(getChartOpts('${opts.chartID}'))` },
				],
			},
			{
				name: 'updateForceZero',
				on: [
					{
						events: '@y1TickLabels:click,@y1Triangle:click,@y2TickLabels:click,@y2Triangle:click',
						update: `setForceZero(getChartOpts('${opts.chartID}'))`,
					},
				],
			},
			opts.moreThanOneSeries ? anomalyHoverEvent : null,
		]);
	}

	static create(opts) {
		const instance = new this();
		return instance.getSignals(opts);
	}
}
