// Keep imports below.
//import { d3 } from '@analytics/core';
//import { l10n } from '@analytics/l10nify';

import { d3 } from './../../analytics/core';
import { l10n } from './../../analytics/l10nify';

import vegaL10n from './../vegaL10n/vegaL10n';
import VizTooltip from './../VizTooltip';

export default class LineTooltip {
	constructor(opts) {
		this.opts = opts;
	}

	show(handler, event, item, value) {
		if (!item) {
			return;
		}

		const container = handler.element();

		// when mousing out of a point, remove with a timeout,
		// this lets users click on the analyze button for anomaly detection
		if (event && event.vegaType === 'mouseout') {
			const timeout = item.datum.isAnomaly ? 2000 : 200;
			this.currentTooltip = null;
			this.tooltipCancelId = setTimeout(() => {
				VizTooltip.removeTooltip(d3.select(container), 'point-tooltip');
			}, timeout);
			return;
		}

		//if we are already over this tooltip don't show again
		if (item === this.currentTooltip) {
			return;
		} else {
			this.currentTooltip = item;
		}

		//create formatter to format tooltip dates
		const gran = this.opts.granularity;
		const format = vegaL10n[this.opts.locale].dateFormat.fullFormat[gran];
		const formatter = this.opts.vegaLocale.format(format);

		//get the tooltip content
		const rawMetricValue = item.datum.y;
		const formatOptions = item.datum.formatOptions;
		const datapoint = item.datum.d();

		//get series name - check for date shifting
		let seriesName;
		let dateShiftedDate = datapoint.value('dateShiftedDate');
		if (dateShiftedDate) {
			seriesName = formatter(dateShiftedDate);
		} else {
			seriesName = formatter(new Date(item.datum.x));
		}

		if (this.opts.showMax && item.datum.isMax) {
			seriesName = l10n`MAX: ${seriesName}`;
		} else if (this.opts.showMin && item.datum.isMin) {
			seriesName = l10n`MIN: ${seriesName}`;
		}

		const content = this.opts.pointTooltipContent({ data: item.datum }, null, null, {
			metricValue: this.opts.formatNumber(rawMetricValue, formatOptions),
			metricName: datapoint.value('seriesLabel') || datapoint.value('series'),
			seriesName,
		});

		//vega gives us bounding boxes that are relative to the plot area - for the tooltip we need to give it relative to the parent element
		//so get the origin from vega which is how far offset the chart area is from the top and left borders of the container
		const origin = event.vega.view()._origin;

		//calculate the bbox of the point we are hovering over
		let x = item.bounds.x1 + origin[0] + this.opts.padding.left;
		let y = item.bounds.y1 + origin[1] + this.opts.padding.top;
		let width = item.bounds.x2 - item.bounds.x1;
		let height = item.bounds.y2 - item.bounds.y1;

		//before showing, cancel any existing timeouts
		//eg if the user moved to another dot before the 'mouseout' timeout is up,
		//we don't want to remove the tooltip of the next dot
		clearTimeout(this.tooltipCancelId);

		//show the tooltip
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
				height: container.offsetHeight,
				width: container.offsetWidth,
			},
			content,
			'top',
			10,
			d3.select(container),
			'point-tooltip',
		);
	}
}
