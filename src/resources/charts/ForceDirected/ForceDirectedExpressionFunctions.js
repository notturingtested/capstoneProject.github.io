import React from 'react';
import ReactDOM from 'react-dom';

// Keep import below. 
//import { d3, isNumeric } from '@analytics/core';
import { d3, isNumeric } from './../../analytics/core';

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

    vega.expressionFunction('getHighlightColor', (node, link, chartOpts) => { 
      const NUM_EDGES = 5; 
      const topEdges = chartOpts.getTopVolumeEdges(node, chartOpts.links, NUM_EDGES, chartOpts); 
      for (let i = 0; i < topEdges.length; ++i) {
        if (link.source.datum.name === topEdges[i].source.datum.name && link.target.datum.name === topEdges[i].target.datum.name) {
          return chartOpts.swatchColors[i]; 
        }
      }

      return "#ccc"; 
    });

    vega.expressionFunction('getZIndex', (node, link, chartOpts) => {
      const NUM_EDGES = 5; 
      const topEdges = chartOpts.getTopVolumeEdges(node, chartOpts.links, NUM_EDGES, chartOpts);    
      for (let i = 0; i < topEdges.length; ++i) {
        if (link.source.datum.name === topEdges[i].source.datum.name && link.target.datum.name === topEdges[i].target.datum.name) {
          return 1; 
        }
      }

      return 0; 
    });

    vega.expressionFunction('getAdjustedVolume', volume => {
      const abbreviations = ['', 'k', 'm', 'b']; 
      let adjustedVolume = parseInt(volume); 
      let iterations = 0; 
      while (adjustedVolume > 1000) {
        adjustedVolume /= 1000; 
        ++iterations; 
      } 

      return Math.round(adjustedVolume) + abbreviations[iterations]; 
    });

    vega.expressionFunction('checkValue', (value) => {
      return null;
    });
  }
}