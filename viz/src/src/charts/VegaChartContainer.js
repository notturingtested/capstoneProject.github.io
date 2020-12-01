import React from 'react';
import ReactDOM from 'react-dom';
import ChartFactory from './ChartFactory';
//import Wait from '../Wait';

// What would typical data look like? 

/* 
  props: {
     data: [
       data: [
        {
          something calls .value here...is it an object? 
          It does not look like it is a function on a JS obejct or JS array. 
        }
       ]
     ], 
     opts: {
       isLegendEnabled: function(boolean)
     },
     colors: [

     ], 
     type: {Class Name}, 
  }

  field variables: 
  this.viz, 


  Questions: 
  What is a column series? 

  What is a series? 


*/ 

export default class VegaChartContainer extends React.Component {
	constructor(props) {
    super(props); 
		this.draw = this.draw.bind(this);
		this.destroy = this.destroy.bind(this);
	}

  // Get all enabled datasets. 
	get enabledDataSets() {
		return this.props.data.filter(d => this.isDataSetEnabled(d));
	}

	isDataSetEnabled(dataSet) {
		const firstData = dataSet.data[0];
		return this.props.opts.isLegendEnabled(
      // What is .value?
			firstData && (firstData.value('columnSeriesKey') || firstData.value('series')),
		);
	}

	/**
	 * @return {string[]} An array of color hex strings
	 */
	get colors() {
		/**
		 * We're messing with the colors here because Vega expects an array of colors, and binds a color to a data series based on position.
		 * When we disable a series, we remove that series from the data set - essentially shifting the series forward in position - causing
		 * the colors to bind to the wrong series.
		 *
		 * To overcome that problem, we recreate the array of colors based on which series has been disabled.
		 */

		let colors = [];

		// We need to use the full data set so that the colors stay "bound" to the right series.
		this.props.data.forEach((dataSet, i) => {
			const currentColor = this.props.colors[i % this.props.colors.length];

			if (this.isDataSetEnabled(dataSet)) {
				// Only add the current color to the final array we need if the data set is enabled.
				colors.push(currentColor);
			}
		});

		return colors;
	}

	async draw(el) {
		const chartOpts = {
      el,
      // What are the other opts? 
			...this.props.opts,
			type: this.props.type,
      //colors: this.colors,
      colors: this.props.colors,
      //dataSets: this.enabledDataSets,
      data: this.props.data,
			showLoadingState: container => {
				ReactDOM.render(<p>Loading...</p>, container);
			},
		};

		if (!this.viz) {
      this.viz = ChartFactory.create(this.props.type, chartOpts);
      console.log(this.viz);
		}
		await this.viz.draw(chartOpts);
	}

	destroy() {
		if (this.viz) {
			this.viz.destroy();
		}
	}

	render() {
		return (
			<div />
		);
	}
}