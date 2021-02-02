// Keep the import below.
// import { _ } from '@analytics/core';
import { _ } from './../../analytics/core';

export default class ForceDirectedSignals { 
  getSignals(opts) {
    return _.compact([
      {
        "name": "cx",
        "update": "width / 2"
      },
      {
        "name": "cy",
        "update": "height / 2"
      },
      {
        "name": "nodeRadius",
        "value": 8,
        "bind": {
          "input": "range",
          "min": 1,
          "max": 50,
          "step": 1
        }
      },
      {
        "name": "nodeCharge",
        "value": -30,
        "bind": {
          "input": "range",
          "min": -100,
          "max": 10,
          "step": 1
        }
      },
      {
        "name": "linkDistance",
        "value": 30,
        "bind": {
          "input": "range",
          "min": 5,
          "max": 100,
          "step": 1
        }
      },
      {
        "name": "static",
        "value": true,
        "bind": {
          "input": "checkbox"
        }
      },
      {
        "description": "State variable for active node fix status.",
        "name": "fix",
        "value": false,
        "on": [{
            "events": "symbol:mouseout[!event.buttons], window:mouseup",
            "update": "false"
          },
          {
            "events": "symbol:mouseover",
            "update": "fix || true"
          },
          {
            "events": "[symbol:mousedown, window:mouseup] > window:mousemove!",
            "update": "xy()",
            "force": true
          }
        ]
      },
      {
        "description": "Graph node most recently interacted with.",
        "name": "node",
        "value": null,
        "on": [{
          "events": "symbol:mouseover",
          "update": "fix === true ? item() : node"
        }]
      },
      {
        "description": "Flag to restart Force simulation upon data changes.",
        "name": "restart",
        "value": false,
        "on": [{
          "events": {
            "signal": "fix"
          },
          "update": "fix && fix.length"
        }]
      }
    ]); 
  }

  static create(opts) {
		const instance = new this();
		return instance.getSignals(opts);
	}
}
