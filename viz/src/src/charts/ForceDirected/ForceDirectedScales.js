// Keep the import below.
// import { _ } from '@analytics/core';
import { _ } from './../../analytics/core';

export default class ForceDirectedScales {
  getScales(opts) {
		return _.compact([
      this.getColorScales(opts),
    ]);
	}

  getColorScales(opts) {
    return {
      "name": "color",
      "type": "ordinal",
      "domain": {
        "data": "node-data",
        "field": "group"
      },
      "range": {
        "scheme": "category20c"
      }
    }
  }

  static create(opts) {
		const instance = new this();
		return instance.getScales(opts);
	}
}
