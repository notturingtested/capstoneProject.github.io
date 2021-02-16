// Keep the import below.
// import { _ } from '@analytics/core';
import { _ } from './../../analytics/core';

export default class ForceDirectedMarks {
  getMarks(opts) {
		const marks = _.compact([{
      "name": "nodes",
      "type": "symbol",
      "zindex": 1,
      "from": {
        "data": "node-data"
      },
      "on": [{
          "trigger": "fix",
          "modify": "node",
          "values": "fix === true ? {fx: node.x, fy: node.y} : {fx: fix[0], fy: fix[1]}"
        },
        {
          "trigger": "!fix",
          "modify": "node",
          "values": "{fx: null, fy: null}"
        }
      ],

      "encode": {
        "enter": {
          "fill": {
            "scale": "color",
            "field": "group"
          },
          "stroke": {
            "value": "pink"
          },
          "size": {
            "scale": "size", 
            "field": "volume"
          },
          "tooltip": {
            "signal": "{Name: datum.name, Value: format(datum.volume, ',')}"
          },
        },
        "update": {
          "cursor": {
            "value": "pointer"
          }
        }
      },

      "transform": [{
        "type": "force",
        "iterations": 300,
        "restart": {
          "signal": "restart"
        },
        "static": {
          "signal": "static"
        },
        "signal": "force",
        "forces": [{
            "force": "center",
            "x": {
              "signal": "cx"
            },
            "y": {
              "signal": "cy"
            }
          },
          {
            "force": "collide",
            "radius": {
              "signal": "nodeRadius"
            }
          },
          {
            "force": "nbody",
            "strength": {
              "signal": "nodeCharge"
            }
          },
          {
            "force": "link",
            "links": "link-data",
            "distance": {
              "signal": "linkDistance"
            }
          }
        ]
      }]
    },
    {
      "name": "links",
      "type": "path",
      "from": {
        "data": "link-data"
      },
      "interactive": true,
      "encode": {
        "update": {
          "stroke": {
            "value": "#ccc"
          },
          "strokeWidth": {
            "value": .5
          }
          
        }
      },
      "transform": [{
        "type": "linkpath",
        "require": {
          "signal": "force"
        },
        "shape": "line",
        "sourceX": "datum.source.x",
        "sourceY": "datum.source.y",
        "targetX": "datum.target.x",
        "targetY": "datum.target.y"
      }]
    },
    {  
      "type": "symbol",
      "from": {"data": "links"},
      "zindex": 2,
      "encode": {
        "enter": {
          "x": 0,
          "y": 0,
          "shape": {"value": "arrow"},
          "fill": {"value": "red"},
          "size": {"value": 100}
        },
        "update": {
          "sx": {"field": "datum.source.x"},
          "sy": {"field": "datum.source.y"},
          "tx": {"field": "datum.target.x"},
          "ty": {"field": "datum.target.y"},
          "r": {"signal": "nodeRadius"}
        }
      },
      "transform": [
        {
          "type": "formula",
          "as": "x",
          "expr": "datum.sx + (sqrt((datum.tx-datum.sx) * (datum.tx-datum.sx) + (datum.ty-datum.sy) * (datum.ty-datum.sy))-datum.r-sqrt(datum.size)/2)*cos(atan2((datum.ty-datum.sy),(datum.tx-datum.sx)))"
        },
        {
          "type": "formula",
          "as": "y",
          "expr": "datum.sy + (sqrt((datum.tx-datum.sx) * (datum.tx-datum.sx) + (datum.ty-datum.sy) * (datum.ty-datum.sy))-datum.r-sqrt(datum.size)/2)*sin(atan2((datum.ty-datum.sy),(datum.tx-datum.sx)))"
        },
        {
          "type": "formula",
          "as": "angle",
          "expr": "90 + 180/PI * atan2((datum.ty - datum.sy), (datum.tx - datum.sx))"
        }
      ]
    }
  ]);

		return marks;
	}

  static create(opts) {
		const instance = new this();
		return instance.getMarks(opts);
	}
}
