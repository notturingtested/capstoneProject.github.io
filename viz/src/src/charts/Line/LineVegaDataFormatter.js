// Keep import below.
//import { _, isNumeric, d3 } from '@analytics/core';
import { _, isNumeric, d3 } from './../../analytics/core';

export default class LineVegaDataFormatter {
	static format(opts) {
		return new this().formatDataForVega(opts);
	}

	formatDataForVega(opts) {
		let maxAndMinDataSet = { name: 'maxMinLabels', values: [] };

		//first go through and format all data points
		const formattedDataSets = opts.dataSets.map(ds => {
			let columnSeriesKey = ds.data[0].value('columnSeriesKey');

			let seriesValues = {
				formatOptions: ds.value('numberFormatOptions'),
				series: columnSeriesKey || ds.data[0].value('series'),
				columnSeriesKey,
				highlightFocalDimensionItem: opts.highlightFocalDimensionItem,
			};

			let formatted = ds.data.map((d, i) => {
				return this.formatDataPoint(d, i, seriesValues);
			});

			if (opts.showMax || opts.showMin) {
				let seriesMaxAndMin = this.setMaxAndMin(formatted, opts);
				maxAndMinDataSet.values.push(...seriesMaxAndMin);
			}

			return formatted;
		});

		//go through and mark orphan ys - ys whose neighboring points (to the right and left of the point) have null data
		this.markOrphanYs(formattedDataSets);

		//if normalized setting enabled, create scales (creating the scales is expensive so don't do it if we don't need to)
		if (opts.normalizationRequired) {
			this.addNormalizedFields(formattedDataSets, opts);
		}

		//create a few data sets that we will use throughout the vega config
		//original data set with data for every series
		const allData = { name: 'allData', values: _.flatten(formattedDataSets) };
		//all data, just without null Ys
		const allDataNoNullYs = { name: 'allDataNoNullYs', values: allData.values.filter(value => isNumeric(value.y)) };
		//just series 1 data, used for dual axis
		const dualAxisDataSeries1 = { name: 'dualAxisDataSeries1', values: formattedDataSets[0] };
		//just series 2 data, used for dual axis
		const dualAxisDataSeries2 = { name: 'dualAxisDataSeries2', values: formattedDataSets[1] };

		//create ysGroupedByX - we use this when you hover on the chart and we show the legend values for each y point.  We want the data indexed by x value for quick look ups
		const ysGroupedByX = _.groupBy(allData.values, 'x');

		//create a sorted list of the unique x values
		//we already have all the unique x values - the keys from ysGroupedByX - now just sort them
		//we use this when hovering to quickly find the closest x value to the mouse position
		//sorting the list lets us do a binary search on the values
		const uniqueSortedXValues = Object.keys(ysGroupedByX).sort();

		//add one property to the minMax data set - whether it is before or after the midpoint
		if (opts.showMaxMinLabels) {
			const xMidPoint = uniqueSortedXValues[Math.ceil(uniqueSortedXValues.length / 2)];
			maxAndMinDataSet.values.forEach(v => (v.isLessThanXMidPoint = v.x < xMidPoint));
		}

		const formattedData = _.compact([
			allData,
			allDataNoNullYs,
			opts.dualYAxisIsEnabled ? dualAxisDataSeries1 : null,
			opts.dualYAxisIsEnabled ? dualAxisDataSeries2 : null,
			opts.showTrendline ? this.getTrendlineData(opts) : null,
			opts.showMaxMinLabels ? maxAndMinDataSet : null,
		]);

		const aggregateData = {
			ysGroupedByX,
			uniqueSortedXValues,
		};

		return { formattedData, aggregateData };
	}

	setMaxAndMin(formattedData, opts) {
		let validNumbers = formattedData.filter(d => isNumeric(d.y));
		let max;
		let min;
		if (validNumbers.length) {
			if (opts.showMax) {
				max = _.max(validNumbers, 'y');
				max.isMax = true;
			}
			if (opts.showMin) {
				min = _.min(validNumbers, 'y');
				min.isMin = true;
			}
		}

		//unique the max and min in case they are the same, so we don't show the same label twice
		let maxAndMin = _.compact([max, min]);
		if (opts.showMax && opts.showMin) {
			maxAndMin = _.uniq(maxAndMin, 'y');
		}

		return maxAndMin;
	}

	getTrendlineData(opts) {
		if (opts.showMovingAverage) {
			return this.getMovingAverageData(opts);
		} else {
			return this.getRegressionData(opts);
		}
	}

	getMovingAverageData(opts) {
		const { movingAverageWindow, normalizationRequired } = opts;
		return {
			name: 'trendlineData',
			source: 'allData', //allData because vega will remove nulls before averaging
			transform: [
				{
					type: 'window',
					groupby: ['series'],
					ops: ['mean'],
					fields: [normalizationRequired ? 'normalizedY' : 'y'],
					as: ['trendlineY'],
					//vega expects a window like [-6, 0] which means window of last 7 days
					frame: [(movingAverageWindow - 1) * -1, 0],
				},
				//we don't want to show moving average until there are enough datapoints to create the window - filter out the first n points
				{ type: 'filter', expr: `datum.trendlineX > ${movingAverageWindow - 1}` },
			],
		};
	}

	getRegressionData(opts) {
		return {
			name: 'trendlineData',
			source: 'allDataNoNullYs',
			transform: [
				{
					type: 'regression',
					groupby: ['series'],
					method: opts.trendlineModel,
					x: 'trendlineX',
					y: opts.normalizationRequired ? 'normalizedY' : 'y',
					as: ['trendlineX', 'trendlineY'],
				},
			],
		};
	}

	formatDataPoint(d, index, seriesValues = {}) {
		let { series, formatOptions, columnSeriesKey, highlightFocalDimensionItem } = seriesValues;

		const datapoint = {
			x: d.value('x').getTime(),
			y: this.formatInvalidNumber(d.value('y')),
			series,
			lowerConfidenceBound: this.formatInvalidNumber(d.value('lowerConfidenceBound')),
			upperConfidenceBound: this.formatInvalidNumber(d.value('upperConfidenceBound')),
			expectedValue: this.formatInvalidNumber(d.value('expectedValue')),
			isAnomaly: d.value('isAnomaly'),
			numberFormatOptions: formatOptions,
			formatOptions,
			columnSeriesKey,
			isFocalDimension: highlightFocalDimensionItem ? d.value('isHighlighted') : false,
			trendlineX: index + 1,
			d: () => d,
		};

		return datapoint;
	}

	//go through and mark orphan ys - ys whose neighboring points (to the right and left of the point) have null data
	//we want to show a point in these cases because it is hard to see the tiny "line" vega will draw for orphan points
	markOrphanYs(data) {
		data.forEach(dataset => {
			dataset.forEach((d, i) => {
				const prev = dataset[i - 1];
				const next = dataset[i + 1];
				const prevIsNull = !prev || !isNumeric(prev.y);
				const nextIsNull = !next || !isNumeric(next.y);
				d.isOrphanY = prevIsNull && nextIsNull;
			});
		});
	}

	addNormalizedFields(formattedDataSets, opts) {
		formattedDataSets.forEach(ds => {
			const normalizationScale = this.createNormalizationScale(ds, opts);
			ds.forEach(datapoint => {
				Object.assign(datapoint, this.getNormalizedFields(datapoint, normalizationScale));
			});
		});
	}

	//These scales are simply used to create normalized values (between 0-1) for each y axis field (y, expectedY, etc).  We will use these fields later with other scales to convert these values to pixels for drawing on a chart
	createNormalizationScale(dataSet, opts) {
		//get all y values so we can find the max and min
		let yValues = [];
		if (opts.anomalyRescaleIsEnabled) {
			//if allow anomalies to rescale, we have to look at all anomaly values for the max and min
			yValues = dataSet.map(d => [d.y, d.expectedValue, d.upperConfidenceBound, d.lowerConfidenceBound]);
			yValues = _.flatten(yValues);
		} else {
			//else just gather all the ys
			yValues = dataSet.map(d => d.y);
		}

		//filter out nulls (if not Math.min will coerce nulls to 0)
		yValues = yValues.filter(y => isNumeric(y));

		//get the max and min
		let max = Math.max(...yValues);
		let min = Math.min(...yValues);

		//check if either is null/Infinity etc
		if (!isNumeric(max) || !isNumeric(min)) {
			return val => this.invalidNumberFallback;
		}

		//check for the forceZero option - and edge case to remember here is negative numbers, where 0 could be greater than the max.  Check both max and min for zero.
		if (opts.forceZero) {
			max = max < 0 ? 0 : max;
			min = min > 0 ? 0 : min;
		}

		//if the max and min are the same, increase the domain by one on either side.  This will display those points in the middle of the graph
		if (max === min) {
			max += 1;
			min -= 1;
		}

		const scale = d3.scale
			.linear()
			.domain([min, max])
			.range([0, 1]);

		//val can be a number or null - if an invalid number, just give the invalid number back.  If valid, run through the scale
		return val => (!isNumeric(val) ? val : scale(val));
	}

	getNormalizedFields(datapoint, scale) {
		return {
			normalizedUpperConfidenceBound: scale(datapoint.upperConfidenceBound),
			normalizedLowerConfidenceBound: scale(datapoint.lowerConfidenceBound),
			normalizedExpectedValue: scale(datapoint.expectedValue),
			normalizedY: scale(datapoint.y),
		};
	}

	formatInvalidNumber(value) {
		//undefined is how the cohort viz signals it wants to show a break in the line
		//null is how freeform formats numbers when "interpret zero as no value" is checked
		//internally within the line component, we use null to tell vega to show a break in the line
		//so convert to null
		if (value === undefined || value === null) {
			return null;

			//everything else invalid (Infinity, NaN) will get coerced to the invalidNumberFallback
		} else if (!isNumeric(value)) {
			return this.invalidNumberFallback;

			//else the value is valid
		} else {
			return value;
		}
	}

	//return 0 for now as the fallback for null, Infinity, NaN, etc.
	//instead of 0, we should really be drawing a break in the line chart etc to show that there is no data
	get invalidNumberFallback() {
		return 0;
	}
}
