// Keep import below.
//import { _ } from '@analytics/core';
import { _ } from './../../analytics/core';
import { getConstants } from './../VizConstants';

export default class LineMarks {
	getMarks(opts) {
		const marks = _.compact([
			this.getInspectorGroup(),
			opts.anomaliesEnabled ? this.getAnomalyGroup(opts) : null,
			this.getLineGroup(opts),
			this.getPointGroup(opts),
			opts.showMaxMinLabels ? this.getMaxMinLabelGroup(opts) : null,
			opts.showTrendline ? this.getTrendlineGroup(opts) : null,
		]);

		return marks;
	}

	getInspectorGroup() {
		return {
			type: 'group',
			name: 'inspector',
			encode: {
				enter: {
					fill: { value: '#ccc' },
					opacity: { value: 0 },
					width: { signal: 'width' },
					height: { signal: 'height' },
				},
			},
			marks: [
				{
					type: 'rule',
					name: 'inspector-rule',
					encode: {
						update: {
							strokeWidth: [{ test: `isString(xValueClosestToMousePosition)`, value: 2 }, { value: 0 }],
							x: { scale: 'x', signal: 'xValueClosestToMousePosition' },
							y: { value: 0 },
							y2: { signal: 'height' },
							stroke: { value: '#999' },
						},
					},
				},
			],
		};
	}

	getAnomalyGroup(opts) {
		return {
			type: 'group',
			clip: !opts.anomalyRescaleIsEnabled,
			from: {
				facet: { name: 'facet0', data: 'allData', groupby: 'series' },
			},
			marks: [this.getConfidenceBandMark(opts), this.getExpectedLineMark(opts)],
		};
	}

	getTrendlineGroup(opts) {
		return {
			type: 'group',
			from: {
				facet: { name: 'trendlineDataBySeries', data: 'trendlineData', groupby: 'series' },
			},
			marks: [this.getTrendlineMark(opts)],
		};
	}

	getLineGroup(opts) {
		return {
			type: 'group',
			from: {
				facet: { name: 'facet0', data: 'allData', groupby: 'series' },
			},
			marks: _.compact([
				this.getLineMark(opts),
				opts.moreThanOneSeries ? this.getMultiSeriesHoverLine(opts) : null,
			]),
		};
	}

	getMaxMinLabelGroup(opts) {
		return {
			type: 'group',
			from: {
				facet: { name: 'maxMinLabelsBySeries', data: 'maxMinLabels', groupby: 'series' },
			},
			marks: [this.getMaxMinLabelMark(opts), this.getMaxMinPointMark(opts)],
		};
	}

	getPointGroup(opts) {
		return {
			type: 'group',
			from: {
				//here we use allDataNoNulls because we don't want to try and draw a point where y = null or y = Infinity etc.  Vega won't try to infer what null means by drawing 0 etc. With line marks, vega lets you draw a break in the line using the `defined` prop. So we can say if null, leave a break in the line.  But there is no `defined` prop for point marks - which makes sense - line you use the `defined` prop to draw breaks.  But a point can't have a break, it is just a single point.  With point marks you simply tell it draw the point or don't draw the point.  We tell it to not draw any null points by filtering them out of the data set
				facet: { name: 'allDataNoNullYsBySeries', data: 'allDataNoNullYs', groupby: 'series' },
			},
			marks: _.compact([this.getPointMark(opts)]),
		};
	}

	getMaxMinPointMark(opts) {
		return {
			name: 'maxMinPoint',
			type: 'symbol',
			from: { data: 'maxMinLabelsBySeries' },
			encode: {
				enter: { tooltip: { signal: 'datum.y' } },
				update: {
					fill: { scale: 'color', field: 'series' },
					x: { scale: 'x', field: 'x' },
					size: { value: 80 },
					y: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'normalizedY' : 'y',
					},
				},
			},
		};
	}

	getMaxMinLabelMark(opts) {
		const singleSeriesOpacityRule = [{ value: 1 }];
		const multiSeriesOpacityRule = [
			{ test: 'activeSeries === datum.series', value: 1 }, //activeSeries is a custom variable - see getSignals
			{ value: 0 },
		];
		const opacity = opts.moreThanOneSeries ? multiSeriesOpacityRule : singleSeriesOpacityRule;

		return {
			name: 'maxMinLabel',
			type: 'text',
			from: { data: 'maxMinLabelsBySeries' },
			encode: {
				update: {
					fill: { scale: 'color', field: 'series' },
					text: {
						signal: `formatNumber(datum.y, datum.numberFormatOptions, getChartOpts('${opts.chartID}'))`,
					},
					opacity,
					dy: { signal: 'datum.isMax ? -5 : 10' },
					dx: { signal: 'datum.isLessThanXMidPoint ? 5 : -5' },
					align: { signal: 'datum.isLessThanXMidPoint ? "left" : "right"' },
					font: { value: getConstants().fontFamilies },
					fontSize: { value: 11 },
					x: { scale: 'x', field: 'x' },
					y: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'normalizedY' : 'y',
					},
				},
			},
		};
	}

	getConfidenceBandMark(opts) {
		const fillOpacity = 0.5;
		const singleSeriesFillRule = [{ value: fillOpacity }];
		const multiSeriesFillRule = [
			{ test: 'activeSeries === datum.series', value: fillOpacity }, //activeSeries is a custom variable - see getSignals
			{ value: 0 },
		];

		return {
			name: 'confidenceBands',
			type: 'area',
			from: { data: 'facet0' },
			encode: {
				update: {
					opacity: { value: 0.3 },
					orient: { value: 'vertical' },
					fill: { scale: 'color', field: 'series' },
					fillOpacity: opts.moreThanOneSeries ? multiSeriesFillRule : singleSeriesFillRule,
					defined: {
						signal: 'isRealNumber(datum.upperConfidenceBound) && isRealNumber(datum.lowerConfidenceBound)',
					},
					x: { scale: 'x', field: 'x' },
					y: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'normalizedUpperConfidenceBound' : 'upperConfidenceBound',
					},
					y2: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'normalizedLowerConfidenceBound' : 'lowerConfidenceBound',
					},
				},
			},
		};
	}

	getExpectedLineMark(opts) {
		const strokeOpacity = 0.3;
		const singleSeriesStrokeRule = [{ value: strokeOpacity }];
		const multiSeriesStrokeRule = [
			{ test: 'activeSeries === datum.series', value: strokeOpacity }, //activeSeries is a custom variable - see getSignals
			{ value: 0 },
		];

		return {
			name: 'expectedLine',
			type: 'line',
			from: { data: 'facet0' },
			encode: {
				update: {
					stroke: { scale: 'color', field: 'series' },
					strokeWidth: { value: 2 },
					defined: { signal: 'isRealNumber(datum.expectedValue)' },
					strokeOpacity: opts.moreThanOneSeries ? multiSeriesStrokeRule : singleSeriesStrokeRule,
					strokeDash: { value: [6, 4] },
					x: { scale: 'x', field: 'x' },
					y: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'normalizedExpectedValue' : 'expectedValue',
					},
				},
			},
		};
	}

	getTrendlineMark(opts) {
		const strokeOpacity = 1;
		const singleSeriesStrokeRule = [{ value: strokeOpacity }];
		const multiSeriesStrokeRule = [
			{ test: 'activeSeries === datum.series', value: strokeOpacity }, //activeSeries is a custom variable - see getSignals
			{ value: 0 },
		];
		const interpolate = opts.showTrendline && !opts.showMovingAverage;

		return {
			name: 'trendline',
			type: 'line',
			from: { data: 'trendlineDataBySeries' },
			encode: {
				update: {
					stroke: { value: '#b3b3b3' },
					strokeWidth: { value: 2 },
					...(interpolate ? { interpolate: { value: 'catmull-rom' } } : {}),
					defined: { signal: 'isRealNumber(datum.trendlineY)' },
					strokeOpacity: opts.moreThanOneSeries ? multiSeriesStrokeRule : singleSeriesStrokeRule,
					x: { scale: 'trendlineXScale', field: 'trendlineX' },
					y: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'trendlineY' : 'trendlineY',
					},
				},
			},
		};
	}

	getLineMark(opts) {
		return {
			name: 'line',
			type: 'line',
			from: { data: 'facet0' },
			encode: {
				update: {
					stroke: { scale: 'color', field: 'series' },
					strokeWidth: { value: 2 },
					strokeOpacity: { value: 1 },
					strokeJoin: { value: 'round' },
					defined: { signal: 'isRealNumber(datum.y)' },
					x: { scale: 'x', field: 'x' },
					y: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'normalizedY' : 'y',
					},
				},
			},
		};
	}

	//this is an invisible line mark that is slightly wider than the real line marks - this gives the user a wider line to hover over to show confidence bands
	getMultiSeriesHoverLine(opts) {
		return {
			name: 'multiSeriesHoverLine',
			type: 'line',
			from: { data: 'facet0' },
			encode: {
				update: {
					stroke: { scale: 'color', field: 'series' },
					strokeWidth: { value: 20 },
					defined: { signal: 'isRealNumber(datum.y)' },
					strokeOpacity: { value: 0 },
					x: { scale: 'x', field: 'x' },
					y: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'normalizedY' : 'y',
					},
				},
			},
		};
	}

	getPointMark(opts) {
		const defaultPointSize = 80;

		return {
			name: 'point',
			type: 'symbol',
			from: { data: 'allDataNoNullYsBySeries' },
			encode: {
				enter: { tooltip: { signal: 'datum.y' } },
				update: {
					x: { scale: 'x', field: 'x' },
					y: {
						scale: opts.normalizationRequired ? 'yNormalized' : 'y1',
						field: opts.normalizationRequired ? 'normalizedY' : 'y',
					},
					size: [
						{ test: 'datum.isFocalDimension', value: 100 },
						{ test: 'datum.x == xValueClosestToMousePosition', value: defaultPointSize },
						{ test: 'datum.isOrphanY', value: 50 },
						{ value: defaultPointSize },
					],
					stroke: [{ scale: 'color', field: 'series' }],
					shape: [{ test: 'datum.isFocalDimension', value: 'diamond' }],
					strokeWidth: [{ value: 2 }],
					strokeOpacity: _.compact([
						{ test: 'datum.isOrphanY', value: 1 },
						{ test: 'datum.x == xValueClosestToMousePosition', value: 1 },
						opts.anomaliesEnabled ? { test: 'datum.isAnomaly', value: 1 } : null,
						{ value: 0 },
					]),
					fill: [
						{ test: 'datum.isAnomaly && datum.x != xValueClosestToMousePosition', value: 'white' },
						{ scale: 'color', field: 'series' },
					],
					fillOpacity: _.compact([
						{ test: 'datum.isOrphanY', value: 1 },
						{ test: 'datum.x == xValueClosestToMousePosition', value: 1 },
						opts.anomaliesEnabled ? { test: 'datum.isAnomaly', value: 1 } : null,
						{ value: 0 },
					]),
				},
			},
		};
	}

	static create(opts) {
		const instance = new this();
		return instance.getMarks(opts);
	}
}
