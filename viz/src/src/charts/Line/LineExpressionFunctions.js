import React from 'react';
import ReactDOM from 'react-dom';

// Keep import below. 
//import { d3, isNumeric } from '@analytics/core';
import { d3, isNumberic } from './../../analytics/core';

import vegaL10n from './../vegaL10n/vegaL10n';
import VizTooltip from './../VizTooltip';

// Expression Functions
// Vega allows custom functions that we can use for formatting, additional data processing, etc.
// See docs: https://vega.github.io/vega/docs/api/extensibility/#expressions
export default class LineExpressionFunctions {
	//we will add each chart instance to this hash as they are created (when multiple charts are on the page, we need to store opts separately for each one)
	static registerChartInstance(vega, chartID, chartsOpts = {}) {
    // Return the matching value in the registry (only one param), or undefined if not found.
		const allCharts = vega.expressionFunction('getAllCharts')();
    allCharts[chartID] = chartsOpts;
    // R
		vega.expressionFunction('getAllCharts', () => allCharts);
	}

	static registerStaticExpressions(vega) {
		vega.expressionFunction('getAllCharts', () => {
			//start with an empty object, will get filled as chart instances are created
			return {};
		});

		vega.expressionFunction('getChartOpts', chartID => {
			const getAllCharts = vega.expressionFunction('getAllCharts');
			const allCharts = getAllCharts();
			return allCharts[chartID];
		});

		vega.expressionFunction('customExpression_formatterForYAxis', (value, index, axisName, chartOpts) => {
			return chartOpts.formatYAxisTick(value, index, axisName);
		});

		vega.expressionFunction('customExpression_formatterForXAxis', (datum, chartOpts) => {
			return chartOpts.formatXAxisTick(datum);
		});

		vega.expressionFunction('customExpression_findClosestXValue', (value, chartOpts) => {
			return findClosestValue(chartOpts.uniqueSortedXValues, value);
		});

		//custom expression so when hovering over the chart we can tell the legend to render the y values for each series
		vega.expressionFunction('customExpression_updateLegendNumbers', (xValueClosestToMousePosition, chartOpts) => {
			//if no legends, no need to update numbers
			if (!chartOpts.legendVisible) {
				return;
			}

			//if no closestXValue, we have moused out of the chart - clear the legend numbers
			if (xValueClosestToMousePosition === null) {
				chartOpts.displayLegendNumbers();
				return;
			}

			const datapoints = chartOpts.ysGroupedByX[xValueClosestToMousePosition];
			const numberMappings = new Map(
				datapoints.map(vegaPoint => {
					const rawMetricValue = vegaPoint.y;
					const formatOptions = vegaPoint.formatOptions;
					const formattedY = chartOpts.formatNumber(rawMetricValue, formatOptions);
					return [vegaPoint.columnSeriesKey, formattedY];
				}),
			);

			chartOpts.displayLegendNumbers(numberMappings);
		});

		vega.expressionFunction('setForceZero', chartOpts => {
			chartOpts.setForceZero(!chartOpts.forceZero);
		});

		vega.expressionFunction('isRealNumber', val => {
			return isNumeric(val);
		});

		vega.expressionFunction('formatNumber', (number, formatOptions, chartOpts) => {
			return chartOpts.formatNumber(number, formatOptions);
		});

		vega.expressionFunction('triangleAxisLabel', (tickIndex, tickValue) => {
			let shouldShowTriangle = false;
			const isTopYTick = tickIndex === 1;
			const isBottomYTick = tickIndex === 0;

			//if the bottom tick is greater than 0, we know that 0 is not showing - we should show the "anchor to zero" indicator
			//if the top tick is less than 0, we know that 0 is not showing (all the tick values are negative) - we should show the "anchor to zero" indicator
			if ((isBottomYTick && tickValue > 0) || (isTopYTick && tickValue < 0)) {
				shouldShowTriangle = true;
			}

			return shouldShowTriangle ? '▾' : ' ';
		});

		//this is for the triangle symbol we show to allow the user to change the forceZero setting
		//we will rotate the triangle 180 degress when the axis values are negative
		//when we rotate, the center of rotation is the edge of the triangle, so we also need to change the alignment
		vega.expressionFunction('getTriangleAxisAlignment', (axis, tickValue) => {
			if (axis === 'y1') {
				return tickValue > 0 ? 'right' : 'left';
			} else if (axis === 'y2') {
				return tickValue < 0 ? 'right' : 'left';
			}
		});

		vega.expressionFunction('showInspectorTooltip', (event, _x, _y, chartOpts) => {
			if (!_x) {
				return;
			}
			const view = event.vega.view();
			const group = event.vega.group('root');
			const container = view.container();
			const origin = view.origin();
			const padding = view.padding();

			if (!group.bounds) {
				return;
			}

			let x = view.scale('x')(_x) + origin[0] + padding.left;
			let y = group.bounds.y1 + origin[1] + padding.top;
			let width = 0;
			let height = view.height();

			const contentDiv = document.createElement('div');

			const vegaLocale = vega.timeFormatLocale(vegaL10n[chartOpts.locale].localeDefinition);
			const format = vegaL10n[chartOpts.locale].dateFormat.fullFormat[chartOpts.granularity];
			const label = vegaLocale.format(format)(_x);

			ReactDOM.render(<div style={{ textAlign: 'center' }}>{label}</div>, contentDiv);

			VizTooltip.showTooltip(
				{
					x,
					width,
					y,
					height,
				},
				{
					y: 0,
					x: 0,
					height: container.offsetHeight + padding.bottom,
					width: container.offsetWidth,
				},
				contentDiv,
				'bottom',
				10,
				d3.select(container),
				'inspector-tooltip',
			);
		});

		vega.expressionFunction('hideTooltip', event => {
			const container = event.vega.view().container();

			VizTooltip.removeTooltip(d3.select(container), 'inspector-tooltip');
		});
		vega.expressionFunction('highlightDataSource', (datum, chartOpts) => {
			chartOpts.onMouseOver({ dataPoint: datum.d() });
		});

		vega.expressionFunction('unhighlightDataSource', chartOpts => {
			chartOpts.onMouseOut();
		});
	}
}

function findClosestValue(array, valueToFind) {
	//find the index that we would use to insert this value if we wanted to maintain sort order (starting from the left/beginning of the array)
	let bisectIndex = d3.bisectLeft(array, valueToFind);
	let bisectValue = array[bisectIndex];

	//get the previous because the point is somewhere between these two.
	let previousIndex = bisectIndex - 1;
	let previousValue = array[previousIndex];

	//measure the distance from the point.
	let bisectDistance = bisectValue !== undefined ? Math.abs(bisectValue - valueToFind) : Infinity;
	let previousDistance = previousValue !== undefined ? Math.abs(previousValue - valueToFind) : Infinity;

	//return the closest
	let closest = bisectDistance < previousDistance ? bisectValue : previousValue;
	return closest;
}
