// Keep the import below.
// import { _ } from '@analytics/core';
import { _ } from './../../analytics/core';

export default class ForceDirectedMarks {
  getMarks(opts) {
		const marks = _.compact([
    this.getNodeMarks(opts), 
    this.getNodeTextMarks(opts), 
    this.getLinkMarks(opts)
  ]);

		return marks;
  }
  
  getNodeMarks(opts) {
    return {
      name: "nodes",
      type: "symbol",
      zindex: 1,
      from: {
        data: "node-data"
      },
      on: [{
          trigger: "fix",
          modify: "node",
          values: "fix === true ? {fx: node.x, fy: node.y} : {fx: fix[0], fy: fix[1]}"
        },
        {
          trigger: "!fix",
          modify: "node",
          values: "{fx: null, fy: null}"
        }
      ],
      encode: {
        enter: {
          fill: {
            scale: "color",
            field: "group"
          },
          stroke: {
            value: "white"
          },
          tooltip: {
            signal: "{Name: datum.name, Value: format(datum.volume, ',')}"
          },
          size: {
            scale: "size", 
            field: "volume"
          }
        },
        update: {
          size: {
            signal: "datum.volume ? datum.volume / 100 * nodeRadius / 10 : nodeRadius * nodeRadius * 2"
          },
          cursor: {
            value: "pointer"
          }
        }
      },

      transform: [this.getForceTransform(opts)]
    }; 
  }

  getForceTransform(opts) {
    return {
      type: "force",
      iterations: 300,
      restart: {
        signal: "restart"
      },
      static: {
        signal: "static"
      },
      signal: "force",
      forces: [{
          force: "center",
          x: {
            signal: "cx"
          },
          y: {
            signal: "cy"
          }
        },
        {
          force: "collide",
          radius: {
            signal: "nodeRadius"
          }
        },
        {
          force: "nbody",
          strength: {
            signal: "nodeCharge"
          }
        },
        {
          force: "link",
          links: "link-data",
          distance: {
            signal: "linkDistance"
          }
        }
      ]
    }
  }

  getNodeTextMarks(opts) {
    return {
      type: "text",
      name: "node-text",
      from: {data: "nodes"},
      zindex: 2,
      encode: {
        enter: {
          align: {value: "center"},
          baseline: {value: "middle"},
          fontSize: {value: 12}, 
          fill: {value: "white"}
        },
        update: {
          text: {signal: "substring(datum.datum.name, 0, floor(nodeRadius / 2.5))"},
          x: {signal: "datum.x"},
          y: {signal: "datum.y"}
        }
      }
    }
  }

  getLinkMarks(opts) {
    return {
      type: "path",
      from: {
        data: "link-data"
      },
      interactive: false,
      encode: {
        update: {
          stroke: {
            value: "#ccc"
          },
          strokeWidth: {
            value: 0.5
          },
          tooltip: {value: "{left}"}
        }
      },
      transform: [{
        type: "linkpath",
        require: {
          signal: "force"
        },
        shape: "line",
        sourceX: "datum.source.x",
        sourceY: "datum.source.y",
        targetX: "datum.target.x",
        targetY: "datum.target.y"
      }]
    }
  }

  static create(opts) {
		const instance = new this();
		return instance.getMarks(opts);
	}
}
