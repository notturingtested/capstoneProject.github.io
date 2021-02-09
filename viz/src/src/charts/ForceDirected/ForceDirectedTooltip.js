// Keep imports below.
//import { d3 } from '@analytics/core';
//import { l10n } from '@analytics/l10nify';

import d3 from './../../d3.js';
import { l10n } from './../../analytics/l10nify'; 

import vegaL10n from './../vegaL10n/vegaL10n';
import VizTooltip from './../VizTooltip';

console.log("D3: ");
console.log(d3); 

export default class ForceDirectedTooltip {
  constructor(opts) {
    this.opts = opts;
	}

	show(handler, event, item, value) {
    console.log(handler); 
    console.log(event);  
    console.log(item); 
		if (!item) {
			return;
		}

    // Note: Slightly different syntax
    const container = handler._el;
    console.log(container);

		// when mousing out of a point, remove with a timeout
		if (event && event.vegaType === 'mouseout') {
      const removeTimeout = 500;
      const setInCornerTimeout = 1000; 
      this.currentTooltip = null;

      // The tooltip must be not be in the process of removing when moving
      // the tooltip into the corner of the screen. 
      this.tooltipRemove = {removingTooltip: false, removedTooltip: false}; 

			this.tooltipCancelId = setTimeout(() => {
        this.tooltipRemove.removingTooltip = true; 
        VizTooltip.removeTooltip(d3.select(container), 'node-tooltip');
        this.tooltipRemove = {removingTooltip: false, removedTooltip: true}; 
        setTimeout(() => {
          // Set the tooltip in the corner if a new tooltip has not 
          // been selected (prevents the hidden tooltip from covering
          // one of the nodes in the diagram). 
          if (!this.removingTooltip && this.removedTooltip) {
            VizTooltip.setTooltipInCorner(d3.select(container), 'node-tooltip'); 
          }
        }, setInCornerTimeout);
      }, removeTimeout);

			return;
		}

		//if we are already over this tooltip don't show again
		if (item === this.currentTooltip) {
			return;
		} else {
			this.currentTooltip = item;
		}

    //ADOBE: create formatter to format tooltip dates below (see LineTooltip.js for more). 
    
    const content = this.opts.nodeTooltipContent({ data: item.datum }, {links: item.mark.items });

    if (item) {
      console.log("Line!"); 
      console.log(item); 
    }

		//vega gives us bounding boxes that are relative to the plot area - for the tooltip we need to give it relative to the parent element
    //so get the origin from vega which is how far offset the chart area is from the top and left borders of the container
    const origin = event.vega.view()._origin;
    console.log("origin", origin)
    console.log(event.vega)

    //calculate the bbox of the point we are hovering over
    let x = item.bounds.x1 + origin[0] + this.opts.padding.left;
    let y = item.bounds.y1 + origin[1] + this.opts.padding.top;
    let width = item.bounds.x2 - item.bounds.x1;
    let height = item.bounds.y2 - item.bounds.y1;
    console.log("--------------------------")
    console.log("X: ", x); 
    console.log("Y: ", y); 
    console.log("Width: ", width); 
    console.log("Height: ", height); 
     
		//before showing, cancel any existing timeouts
		//eg if the user moved to another dot before the 'mouseout' timeout is up,
		//we don't want to remove the tooltip of the next dot
    clearTimeout(this.tooltipCancelId);
    console.log("Container offsetHeight: " + container.offsetHeight);
    console.log("Container offsetWidth: " + container.offsetWidth);
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
			'node-tooltip',
    ); 
  } 
}
