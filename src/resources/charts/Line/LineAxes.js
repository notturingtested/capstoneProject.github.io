// Keep import statements below.
// import { l10n } from '@analytics/l10nify';
// import { _ } from '@analytics/core';
import { l10n } from './../../analytics/l10nify';
import { _ } from './../../analytics/core';
import { getConstants } from './../VizConstants';

const LABEL_FONT_SIZE = 12;

export default class LineAxes {
	getAxes(opts) {
		const showXAxis = opts.showXAxis;
		const showY1Axis = opts.showYAxis;
		const showY2Axis = opts.dualYAxisIsEnabled && opts.showYAxis;

		const xAxes = showXAxis ? this.getXAxes(opts) : [];
		const y1Axes = showY1Axis ? this.getYAxes(opts, 'y1') : [];
		const y2Axes = showY2Axis ? this.getYAxes(opts, 'y2') : [];

		return _.compact([...xAxes, ...y1Axes, ...y2Axes]);
	}

	getXAxes(opts) {
		const axisTypes = ['granLabel', 'switchLabel'];

		const axes = axisTypes.map(type => ({
			scale: 'x',
			orient: 'bottom',
			ticks: false,
			grid: !opts.shouldRenderSmallChart,
			labelColor: getConstants().axisLabelColor,
			tickCount: { signal: `min(ceil(width/150), ${opts.maxDataSetLength})` },
			...this.getSharedAxisProperties(opts),
			...(opts.shouldRenderSmallChart ? { labelPadding: 15 } : {}),
			encode: {
				labels: {
					update: {
						text: {
							signal: `customExpression_formatterForXAxis(datum, getChartOpts('${opts.chartID}'))["${type}"]`,
						},
						dy: { value: type === 'switchLabel' ? 15 : 0 },
					},
				},
			},
			// Disable the X-axis line unless we have no data to display
			domain: !opts.dataSets.length,
		}));

		return axes;
	}

	getYAxes(opts, side) {
		const y1AxisDefaults = {
			scale: 'y1',
			orient: 'left',
			grid: !opts.normalizationRequired,
			labelColor: opts.dualYAxisIsEnabled ? opts.colors[0] : getConstants().axisLabelColor,
			labels: !opts.showNormalizedAxis,
			ticks: !opts.showNormalizedAxis,
			...(opts.showNormalizedAxis ? this.getNormalizeSettings(opts) : {}),
		};

		const y2AxisDefaults = {
			scale: 'y2',
			orient: 'right',
			grid: false,
			labelColor: opts.colors[1],
			ticks: true,
		};

		const tickLabelMarkConfig = {
			text: {
				signal: `customExpression_formatterForYAxis(datum.value, datum.index, '${side}axis', getChartOpts('${opts.chartID}'))`,
			},
		};

		const triangleMarkConfig = {
			text: { signal: `triangleAxisLabel(datum.index, datum.value)` },
			dy: { value: 10 },
			angle: { signal: `datum.value > 0 ? 0 : 180` },
			align: { signal: `getTriangleAxisAlignment('${side}', datum.value)` },
		};

		const axisConfigs = {
			y1: [
				{
					defaults: y1AxisDefaults,
					labelsName: 'y1TickLabels',
					markConfig: tickLabelMarkConfig,
				},
				{
					defaults: y1AxisDefaults,
					labelsName: 'y1Triangle',
					markConfig: triangleMarkConfig,
				},
			],
			y2: [
				{
					defaults: y2AxisDefaults,
					labelsName: 'y2TickLabels',
					markConfig: tickLabelMarkConfig,
				},
				{
					defaults: y2AxisDefaults,
					labelsName: 'y2Triangle',
					markConfig: triangleMarkConfig,
				},
			],
		};

		const axes = axisConfigs[side].map(({ defaults, labelsName, markConfig }) => ({
			...defaults,
			...{
				...this.getSharedAxisProperties(opts),
				tickCount: { signal: this.yTickCountExpression },
				domain: false,
				labelPadding: 10,
				encode: {
					labels: {
						interactive: true,
						name: labelsName,
						update: {
							cursor: { value: 'pointer' },
							...markConfig,
						},
					},
				},
			},
		}));

		return axes;
	}

	getSharedAxisProperties() {
		return {
			labelFlush: true, //without this, if there is a label on the very top of the y-axis, it will make the chart smaller because half of that last label overflows the chart container.
			labelPadding: 5,
			labelFont: getConstants().fontFamilies,
			labelFontSize: LABEL_FONT_SIZE,
			domainColor: getConstants().axisGridColor, //domain is main axis line
			tickColor: getConstants().axisGridColor,
			gridColor: getConstants().axisGridColor,
			labelOverlap: true,
		};
	}

	getNormalizeSettings(opts) {
		return {
			title: l10n('Normalized'),
			titleColor: getConstants().axisLabelColor,
			titleFont: getConstants().fontFamilies,
			titleFontSize: LABEL_FONT_SIZE,
			titleFontWeight: 400,
			titlePadding: opts.shouldRenderSmallChart ? 5 : 20,
		};
	}

	get yTickCountExpression() {
		//divide the height of the chart by 40 to get the number of ticks we want to show
		//eg height of chart is 200px, number of ticks we want to show is 5
		//force a min of 2, and a max of 5
		return 'clamp(height/40, 2, 5)';
	}

	static create(opts) {
		const instance = new this();
		return instance.getAxes(opts);
	}
}
