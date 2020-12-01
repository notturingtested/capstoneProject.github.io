import { _ } from './../analytics/core';  
//import { _ } from analytics/core';

/*
 * Class fields: 
 * this.dataSets
 * 
 * rawDataSet: {
 *  data?: [], 
 *  y?: [] 
 * }
 * 
 */ 
export default class DataFormatter {
  // Turn datasets into an array and map over the values. 
	setDataSets(dataSets = []) {
		if (!Array.isArray(dataSets)) {
			dataSets = [dataSets];
		}
		return dataSets.map(dataSet => this.setDataSet(dataSet));
	}

	// this.dataSets will always have been initialized as an array in _setDataSets
	// each dataSet must always have the field 'data'
	// the 'data' field must always be an array.
	setDataSet(rawDataSet = {}) {
		// 1. Grab data property from the raw data
		let data = rawDataSet.hasOwnProperty('data') ? rawDataSet.data : [];

		// 2. If there is no data property on the raw data set, use the value of the y property instead
		if (!rawDataSet.data && Array.isArray(rawDataSet.y)) {
			// We will loop over data. If there is no data, then we will look at 'y' to see if it has any data.
			data = rawDataSet.y.slice();
		}

		// 3. Make sure data is an array
		if (data !== undefined && !Array.isArray(data)) {
			data = [data];
		}
		if (data === undefined) {
			data = [];
		}

		// 4. Push a new DataSet instance (constructed with the data array created in steps 1-3) onto the dataSets array
		return new DataSet(rawDataSet, this.dataSets, data);
	}
}

/* 
 * Class fields: 
 * this.index => length of the datasets. 
 * this._rawData => rawDataSet
 * this.data => data passed to the function or rawDataSet.data
 * 
 * props passed to constructor: 
 * rawDataSet => a single raw data set 
 * dataSets => all of the raw data sets 
 * data => data from raw dataset (comes from data or y properties)
 * 
 */ 
export class DataSet {
	// Identifies the dataSetData, which should be an array of objects.
	// Each object in the array will be passed to the DataPoint constructor
	constructor(rawDataSet, dataSets = [], data = null) {
		this.index = dataSets.length;
		this._rawData = rawDataSet;
		let dataSetData = data !== null ? data : rawDataSet.data;
		this.data = dataSetData.map((o, i) => new DataPoint(i, o, this, dataSets));
	}

	value(prop) {
		if (prop === 'data') {
			return this.data;
		}
		return this._rawData?.[prop];
	}

	hasValue(prop) {
		return this._rawData.hasOwnProperty(prop);
	}
}

/* 
 * Class fields: 
 * this.index => the index of the rawDataSet in data. 
 * this._data => data passed to the function 
 * 
 * props passed to constructor: 
 * index => the index of the rawDataSet in data.
 * data => data
 * dataSet => the dataSet object
 * dataSets => all of the raw data sets 
 * 
 */
export class DataPoint {
	constructor(index, data, dataSet, dataSets) {
		this.index = index;
		this._data = data;

		// Define like this so we don't get a circular dependency when converting to JSON.
		Object.defineProperty(this, '_data', { get: () => data });
		Object.defineProperty(this, '_dataSet', { get: () => dataSet });
		Object.defineProperty(this, '_dataSets', { get: () => dataSets });
	}

	/*
		A value is returned in the following way:
			1. Check the dataSet's rawData for the property. If it is there, return its value from the array, or by calling the function. Otherwise alias 'prop' to the mapped string value
			2. Look on data for the property. If there, return it.
			3. Otherwise, return the default value for "x" or "y".
	*/
	value(prop) {
		if (this._dataSet.hasValue(prop)) {
			let rawValue = this._dataSet._rawData[prop];
			if (typeof rawValue === 'string') {
				// Find the value in the data base off the mapped key.
				prop = rawValue; // For example x:'date' changes prop to 'date'.
			} else if (Array.isArray(rawValue)) {
				return rawValue[this.index];
			} else if (typeof rawValue === 'function') {
				return rawValue(this, this.index);
			} else if (typeof rawValue === 'object') {
				return rawValue;
			}
		}

		let result = this._data[prop];

		if (result !== undefined) {
			return result;
		}

		if (prop === 'x') {
			// For x, we can return the current index.
			return this.index;
		}

		if (prop === 'y' && typeof this._data !== 'object') {
			return this._data;
		}

		return undefined; // Nothing is there.
	}

	hasValue(prop) {
		return this._dataSet.hasValue(prop) || this._data.hasOwnProperty(prop);
	}
}
