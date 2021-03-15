// TODO: Update the below imports using the @analytics syntax.
// TODO: Remove the .js at the end of the files later on...
import { _, MetricFormatter, isNumeric, moment, sleep } from './../../analytics/core';
import guid from './../../analytics/guid';

import ChartFactory from './../ChartFactory';
import VegaViz from '../VegaViz';
import ForceDirectedMarks from './ForceDirectedMarks';
import ForceDirectedScales from './ForceDirectedScales';
import ForceDirectedSignals from './ForceDirectedSignals';
import ForceDirectedVegaFormatter from './ForceDirectedVegaDataFormatter';
import ForceDirectedExpressionFunctions from './ForceDirectedExpressionFunctions'; 
import ForceDirectedTooltip from './ForceDirectedTooltip';  
import { getConstants } from './../VizConstants';

const { vega, vegaEmbed } = window;
//register custom functions with vega
ForceDirectedExpressionFunctions.registerStaticExpressions(vega);
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
     
		await this.setupChart(opts);
	}

  async setupChart(opts) {
		//the vegaEmbed call is async - cancel any previous renders that haven't finished
		const currentRenderId = guid.create();
		this.cancelPendingRenders({ newPendingRenderId: currentRenderId });

		// Destroy the last vega container so we can measure the appropriate chart dimensions from a clean slate
		this.destroy();

		this.opts = opts;

    // Called in parent class. 
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

    // ADOBE: Handle localization here. 

		const chartOptions = {
			...opts,
			height: this.el.clientHeight,
			width: this.el.clientWidth,
			padding: this.padding,
			chartID: this.chartID,
		};

    //TODO: format the data for vega (right now it simply returns the data passed in). 
		const { formattedData, aggregateData } = ForceDirectedVegaFormatter.format(chartOptions);
		Object.assign(chartOptions, { formattedData, ...aggregateData });

		//TODO: create tooltip handler
		const forceDirectedTooltip = new ForceDirectedTooltip(chartOptions);
    chartOptions.links = chartOptions.formattedData[1].name === 'link-data' ? chartOptions.formattedData[1].values : chartOptions.formattedData[0].values; 
		const tooltipCallback = forceDirectedTooltip.show.bind(forceDirectedTooltip);
 
		//TODO: create a expression for the instance so we can reference options and custom instance functions inside of vega
		ForceDirectedExpressionFunctions.registerChartInstance(vega, this.chartID, chartOptions);

		//TODO: embed the vega chart into the dom
		const vegaSpec = this.getChartConfig(chartOptions);
    //const embedOpts = { renderer: this.renderer, actions: false, tooltip: tooltipCallback };
    const embedOpts = {tooltip: tooltipCallback}; 

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
	}

	shouldShowLoadingState(opts) {
		//use a hueristic to decide to show a loading spinner - only show for big data sets
		//for example concurrent viewers panel can have 15000 data points
		//let totalDataPoints = (opts.dataSets?.length ?? 0) * (opts.dataSets?.[0]?.data?.length ?? 0);
    //return totalDataPoints > 10000;

    // TODO: DECIDE LATER ON WHAT CONDITIONS TO SHOW A LOADING INDICATOR.
    return true;
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

  /* 
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
  */ 

	getChartConfig(opts) {
		let config = {
      $schema: 'https://vega.github.io/schema/vega/v5.json',
      // Fit within width/height, with width/height being the total.
			autosize: { type: 'fit', contains: 'padding' },
			padding: opts.padding,
			background: getConstants().vizBackgroundColor,
			width: opts.width,
			height: opts.height,
			data: opts.formattedData,
			signals: ForceDirectedSignals.create(opts),
			marks: ForceDirectedMarks.create(opts),
			scales: ForceDirectedScales.create(opts),
      config: {}
		};

		return config;
  } 

	get padding() {
    // Hardcoded values for now...
    return { left: 0, top: 0, right: 0, bottom: 0 };
	}

  /* 
	getMaxDataSetLength() {
		if (!this.dataSets.length) {
			return 0;
		}
		const longestDataSet = _.max(this.dataSets, ds => ds.data.length);
		return longestDataSet.data.length;
	}


	getPrecision(input) {
		const metricFormatter = new MetricFormatter();
		return metricFormatter.getCurrentPrecision(input);
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
