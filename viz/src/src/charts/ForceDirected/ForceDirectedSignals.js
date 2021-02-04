// Keep the import below.
// import { _ } from '@analytics/core';
import { _ } from './../../analytics/core';

export default class ForceDirectedSignals { 
  getSignals(opts) {
    return _.compact([
      this.getCx(opts),
      this.getCy(opts),
      this.getNodeRadius(opts),
      this.getNodeCharge(opts),
      this.getLinkDistance(opts),
      this.getStatic(opts),
      this.getFix(opts), 
      this.getClicked(opts),
      this.getNode(opts),
      this.getRestart(opts)
    ]); 
  }

  getCx(opts) {
    return {
      name: "cx",
      update: "width / 2"
    }; 
  }

  getCy(opts) {
    return {
      name: "cy",
      update: "height / 2"
    }; 
  }

  getNodeRadius(opts) {
    return {
      name: "nodeRadius",
      value: 20,
      bind: {
        input: "range",
        min: 30,
        max: 75,
        step: 1
      }
    }; 
  }

  getNodeCharge(opts) {
    return {
      name: "nodeCharge",
      value: -30,
      bind: {
        input: "range",
        min: -100,
        max: 10,
        step: 1
      }
    }; 
  }

  getLinkDistance(opts) {
    return {
      name: "linkDistance",
      value: 30,
      bind: {
        input: "range",
        min: 5,
        max: 100,
        step: 1
      }
    }; 
  }

  getStatic(opts) {
    return {
      name: "static",
      value: true,
      bind: {
        "input": "checkbox"
      }
    }
  }

  getFix(opts) {
    return {
      description: "State variable for active node fix status.",
      name: "fix",
      value: false,
      on: [{
          events: "symbol:mouseout[!event.buttons], window:mouseup",
          update: "false"
        },
        {
          events: "symbol:mouseover",
          update: "fix || true"
        },
        {
          events: "[symbol:mousedown, window:mouseup] > window:mousemove!",
          update: "xy()",
          force: true
        }
      ]
    };
  }

  getClicked(opts) {
    return {
      description: "Clicked an active node.",
      name: "clicked",
      value: false,
      on: [{
          events: "symbol:click",
          update: "datum.name == 'Other Pages' ? loadMore() : null"
        }
      ]
    };
  }

  getNode(opts) {
    return {
      description: "Graph node most recently interacted with.",
      name: "node",
      value: null,
      on: [{
        events: "symbol:mouseover",
        update: "fix === true ? item() : node"
      }]
    };
  }

  getRestart(opts) {
    return {
      description: "Flag to restart Force simulation upon data changes.",
      name: "restart",
      value: false,
      on: [{
        events: {
          signal: "fix"
        },
        update: "fix && fix.length"
      }]
    };
  }

  static create(opts) {
		const instance = new this();
		return instance.getSignals(opts);
	}
}
