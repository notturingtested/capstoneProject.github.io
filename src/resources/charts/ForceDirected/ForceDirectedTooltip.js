// Keep imports below.
//import { d3 } from '@analytics/core';

import d3 from './../../d3.js';

import VizTooltip from './../VizTooltip';

export default class ForceDirectedTooltip {
  constructor(opts) { 
    this.opts = opts;
	}

  getItemWidth(item) {
    return item.bounds.x2 - item.bounds.x1;
  }

  getItemHeight(item) {
    return item.bounds.y2 - item.bounds.y1;
  }

  getCx(item) {
    return (this.getItemWidth(item) / 2) + item.bounds.x1;
  }

  getCy(item) {
    return (this.getItemHeight(item) / 2) + item.bounds.y1; 
  }

  /**
   * Check if still floating over the previous node. 
   * @param event - A triggered event (usually called on 'mouseout')
   * @param currentTooltip - The tooltip that is currently rendered (potentially will be removed)
   */
  checkIfOverNode(event, currentTooltip) {
    // TODO: May need to make adjustments if padding is added later on... 
    const cx = this.getCx(currentTooltip); 
    const cy = this.getCy(currentTooltip);  
    let radius = cx - currentTooltip.bounds.x1; 
    radius = Math.round(radius * 100) / 100; 

    // Directly over the center of circle in y-direction
    if ((event.layerY === currentTooltip.cy) && (event.layerX > currentTooltip.bounds.x1) 
                                             && (event.layerX < currentTooltip.bounds.x2)) {
      return true; 
    }

    // Directly over the center of circle in x-direction
    if ((event.layerX === currentTooltip.cx) && (event.layerY > currentTooltip.bounds.xy) 
                                             && (event.layerY < currentTooltip.bounds.xy)) {
      return true; 
    }

    // Use right triangles to calculate distance 
    const distanceFromCenter = 
      Math.sqrt(Math.pow(Math.abs(event.layerX - cx), 2) + Math.pow(Math.abs(event.layerY - cy), 2));

    // event.layerX and event.layerY are slightly imprecise (values are always integers), 
    // so we subtract a small number below from the radius so the tooltips don't stick 
    // when the mouseout is triggered directly off the edge of the node. This means that 
    // the tooltips disappear slightly early, but prevents tooltips from incorrectly persisting. 
    const RADIUS_OFFSET = 1.5;  
    return (radius - RADIUS_OFFSET) > distanceFromCenter; 
  }

	show(handler, event, item, value) { 
		if (!item) {
			return;
		}
    
    // Adjust for 'text' mark tooltips. 
    let isEqualTooltip = false; 
    if (item.mark.name === "node-text") {
      isEqualTooltip = this.currentTooltip && this.currentTooltip.datum.name === item.datum.datum.name; 
      item = item.datum; 
    }

    // Note: Slightly different syntax
    const container = handler._el;

		// when mousing out of a point, remove with a timeout
		if (event && event.vegaType === 'mouseout') {
      const isStillOverNode = this.checkIfOverNode(event, this.currentTooltip);
      //console.log("Is still over node:", isStillOverNode);  

      if (!isStillOverNode) {
        const timeout = 500;
        this.currentTooltip = null;

        this.tooltipCancelId = setTimeout(() => {
          VizTooltip.removeTooltip(d3.select(container), 'node-tooltip');
        }, timeout);
      }
			return;
		}

		//if we are already over this tooltip don't show again
		if (item === this.currentTooltip || isEqualTooltip) {
			return;
		} else {
			this.currentTooltip = item;
		}

    //ADOBE: create formatter to format tooltip information below (see LineTooltip.js for more). 
    const NUM_LINKS_TO_SHOW = 5; 
    const content = 
      this.opts.nodeTooltipContent({ data: item.datum }, {links: this.opts.getTopVolumeEdges(item.datum, this.opts.links, NUM_LINKS_TO_SHOW, this.opts)}, this.opts.swatchColors);

    //calculate the bbox of the point we are hovering over
    let x = item.bounds.x1 + this.opts.padding.left;
    let y = item.bounds.y1 + this.opts.padding.top;
    let width = this.getItemWidth(item);
    let height = this.getItemHeight(item);
     
		//before showing, cancel any existing timeouts
		//eg if the user moved to another dot before the 'mouseout' timeout is up,
		//we don't want to remove the tooltip of the next dot
    clearTimeout(this.tooltipCancelId);

    const targetRect = {
      x,
      width,
      y,
      height,
    }; 

    const boundaryRect = {
      y: 0,
      x: 0,
      height: container.offsetHeight,
      width: container.offsetWidth,
    }; 

		//show the tooltip
    // Note: The code below is a workaround. When the first tooltip displays, 
    // there is no node-tooltip in the DOM, which means the tooltip displays incorrectly
    // (it displays in the top left corner only with no content information). 
    // This is due to the tipDiv.node() being null in the VizTooltip class. 
    // Catching the error allows the initial tooltip code to run, then immediately 
    // followed by displaying a functioning tooltip. 
    try {
      VizTooltip.showTooltip(
        targetRect,
        boundaryRect,
        content,
        'left',
        10,
        d3.select(container),
        'node-tooltip',
      ); 
    } catch(error) {
      VizTooltip.showTooltip(
        targetRect,
        boundaryRect,
        content,
        'left',
        10,
        d3.select(container),
        'node-tooltip',
      );
    }
  } 
}
