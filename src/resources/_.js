/* @flow */

import _ from 'lodash';

/* ::
	type TemplateOptions = {
		escape?: RegExp,
		evaluate?: RegExp,
		imports?: Object,
		interpolate?: RegExp,
		sourceURL?: string,
		variable?: string
	};
*/

/* ::
	type Lodash = {

		// Array Functions
		chunk: (array: Array<any>, size?: number) => Array<any>,
		compact: (list: Array<any>) => Array<any>,
		difference: (array: Array<any>, ...values: Array<any>) => Array<any>,
		drop: (array: Array<any>, n?: number) => Array<any>,
		dropRight: (array: Array<any>, n?: number) => Array<any>,
		dropRightWhile: (array: Array<any>, predicate: Function|Object|string, thisArg?:any) => Array<any>,
		dropWhile: (array: Array<any>, predicate: Function|Object|string, thisArg?:any) => Array<any>,
		fill: (array: Array<any>, value: any, start?: number, end?: number) => Array<any>,
		findIndex: (array: Array<any>, predicate: Function|Object|string, thisArg?:any) => number,
		findLastIndex: (array: Array<any>, predicate: Function|Object|string, thisArg?:any) => number,
		first: (array: Array<any>) => any,
		flatten: (array:Array<any>, isDeep?:boolean) => Array<any>,
		flattenDeep: (array:Array<any>) => Array<any>,
		head: (array: Array<any>) => any,
		indexOf: (array: Array<any>, value: any, fromIndex?: number) => number,
		initial: (array: Array<any>) => Array<any>,
		intersection: (...arrays: Array<any>) => Array<any>,
		last: (array: Array<any>|NodeList) => any,
		lastIndexOf: (array: Array<any>, value: any, fromIndex?: number) => number,
		pull: (array: Array<any>, values: Array<any>) => Array<any>,
		pullAt: (array: Array<any>, indexes: number|Array<number>) => Array<any>,
		remove: (array: Array<any>, predicate: Function|Object|string, thisArg?: any) => Array<any>,
		rest: (array: Array<any>) => Array<any>,
		slice: (array: Array<any>, start?: number, end?: number) => Array<any>,
		sortedIndex: (array: Array<any>, value: any, iteratee: Function|Object|string, thisArg?: any) => number,
		sortedLastIndex: (array: Array<any>, value: any, iteratee: Function|Object|string, thisArg?: any) => number,
		tail: (array: Array<any>) => Array<any>,
		take: (array: Array<any>, n?: number) => Array<any>,
		takeRight: (array: Array<any>, n?: number) => Array<any>,
		takeRightWhile: (array: Array<any>, predicate: Function|Object|string, thisArg?: any) => Array<any>,
		takeWhile: (array: Array<any>, predicate: Function|Object|string, thisArg?: any) => Array<any>,
		union: (...arrays: Array<any>) => Array<any>,
		uniq: (array: Array<any>, isSorted?: boolean, iteratee?: Function|Object|string, thisArg?: any) => Array<any>,
		unique: (array: Array<any>, isSorted?: boolean, iteratee?: Function|Object|string, thisArg?: any) => Array<any>,
		unzip: (array: Array<any>) => Array<any>,
		unzipWith: (array: Array<any>, iteratee?: Function, thisArg?: any) => Array<any>,
		without: (array: Array<any>, ...values: Array<any>) => Array<any>,
		xor: (...arrays: Array<any>) => Array<any>,
		zip: (...arrays: Array<any>) => Array<any>,
		zipObject: (props: Array<any>, values: Array<any>) => Object,
		zipWith: (arrays: Array<any>, iteratee?: Function, thisArg?: any) => Array<any>,

		// Collection Functions
		all: (collection: Array<any>|Object|string, predicate: Function|Object|string, thisArg?: any) => boolean,
		any: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => boolean,
		at: (collection: Array<any>|Object|string, ...props?: Array<number|string>) => Array<any>,
		collect: (collection: Array<any>|Object|string, iteratee: Function|Object|string, thisArg?:any) => Array<any>,
		contains: (collection: Array<any>|Object|string, target:any, fromIndex?: number) => boolean,
		countBy: (collection: Array<any>|Object|string, iteratee: Function|Object|string, thisArg?: any) => Object,
		detect: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => any,
		each: (collection: Array<any>|Object|string, iteratee:Function, thisArg?:any) => Array<any>|Object|string,
		eachRight: (collection: Array<any>|Object|string, iteratee:Function, thisArg?:any) => Array<any>|Object|string,
		every: (collection: Array<any>|Object|string, predicate: Function|Object|string, thisArg?: any) => boolean,
		filter: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => Array<any>,
		find: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => any,
		findLast: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => any,
		findWhere: (collection: Array<any>|Object|string, source:Object) => any,
		foldl: (collection: Array<any>|Object|string, iteratee: Function|Object|string, accumulator?: any, thisArg?: any) => any,
		foldr: (collection: Array<any>|Object|string, iteratee: Function|Object|string, accumulator?: any, thisArg?: any) => any,
		forEach: (collection: Array<any>|Object|string, iteratee:Function, thisArg?:any) => Array<any>|Object|string,
		forEachRight: (collection: Array<any>|Object|string, iteratee:Function, thisArg?:any) => Array<any>|Object|string,
		groupBy: (collection: Array<any>|Object|string, iteratee:Function, thisArg?:any) => Object,
		include: (collection: Array<any>|Object|string, target:any, fromIndex?: number) => boolean,
		includes: (collection: Array<any>|Object|string, target:any, fromIndex?: number) => boolean,
		indexBy: (collection: Array<any>|Object|string, iteratee:Function|Object|string, thisArg?:any) => Object,
		inject: (collection: Array<any>|Object|string, iteratee: Function|Object|string, accumulator?: any, thisArg?: any) => any,
		invoke: (collection: Array<any>|Object|string, path: Array<any>|Function|string, ...args?:Array<any>) => Array<any>,
		map: (collection: Array<any>|Object|string, iteratee: Function|Object|string, thisArg?:any) => Array<any>,
		partition: (collection:Array<any>|Object|string, predicate: Function|Object|string, thisArg?:any) => Array<any>,
		pluck: (collection: Array<any>|Object|string, path:string) => Array<any>,
		reduce: (collection: Array<any>|Object|string, iteratee: Function|Object|string, accumulator?: any, thisArg?: any) => any,
		reduceRight: (collection: Array<any>|Object|string, iteratee: Function|Object|string, accumulator?: any, thisArg?: any) => any,
		reject: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => Array<any>,
		sample: (collection: Array<any>|Object|string, n?: number) => any,
		select: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => Array<any>,
		shuffle: (collection: Array<any>|Object|string) => Array<any>,
		size: (collection: Array<any>|Object|string) => number,
		some: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => boolean,
		sortBy: (collection: Array<any>|Object|string, predicate:Function|Object|string, thisArg?:any) => Array<any>,
		sortByAll: (collection: Array<any>|Object|string, iteratees:Function|Object|string|Array<Function|Object|string>) => Array<any>,
		sortByOrder: (collection: Array<any>|Object|string, iteratees:Function|Object|string|Array<Function|Object|string>, orders:Array<string>) => Array<any>,
		where: (collection: Array<any>|Object|string, source:Object) => Array<any>,

		// Object Functions
		assign: (object: Object, sources: Array<Object>, customizer?: Function, thisArg?: any) => Object,
		create: (prototype: Object, properties?: Object) => Object,
		defaults: (object: Object, ...sources?:Array<Object>) => Object,
		defaultsDeep: (object: Object, ...sources?:Array<Object>) => Object,
		extend: (object: Object, ...sources:Array<Object>) => Object,
		findKey: (object: Object, predicate: Function|Object|string, thisArg?: any) => string|null,
		findLastKey: (object: Object, predicate?: Function|Object|string, thisArg?: any) => string|null,
		forIn: (object: Object, iteratee?: Function, thisArg?: *) => Object,
		forInRight: (object: Object, iteratee?: Function, thisArg?: *) => Object,
		forOwn: (object: Object, iteratee?: Function, thisArg?: *) => Object,
		forOwnRight: (object: Object, iteratee?: Function, thisArg?: *) => Object,
		functions: (object: Object) => Array<string>,
		get: (object: any, path: Array<string>|string|number, defaultValue?: any) => any,
		has: (object: Object, path: Array<any>|string) => boolean,
		invert: (object: Object, multiValue?: boolean) => Object,
		keys: (object: Object) => Array<string>,
		keysIn: (object: Object) => Array<string>,
		mapKeys: (object: Object, iteratee: Function|Object|string, thisArg?: any) => Object,
		mapValues: (object: Object, iteratee: Function|Object|string, thisArg?: any) => Object,
		merge: (object: Object, ...sources: Array<Object>) => Object,
		methods: (object: Object) => Array<string>,
		omit: (object: Object, predicate: Function|string|Array<string>, thisArg?:any) => Object,
		pairs: (object: Object) => Array<any>,
		pick: (object: Object, predicate: Function|string|Array<string>, thisArg?:any) => Object,
		result: (object: Object, path: Array<string>|string, defaultValue?: any) => any,
		set: (object: Object, path: Array<any>|string, value:any) => Object,
		transform: (object: Object, iteratee?: Function, accumulator?: any, thisArg?: any) => any,
		values: (object: Object) => Array<any>,
		valuesIn: (object: Object) => Array<any>,
		isPlainObject: (object: Object) => boolean,

		// String Functions
		camelCase: (string: string) => string,
		capitalize: (string: string) => string,
		deburr: (string: string) => string,
		endsWith: (string: string, target: string, position?: number) => boolean,
		escape: (string: string) => string,
		escapeRegExp: (string: string) => string,
		kebabCase: (string: string) => string,
		pad: (string: string, length?: number, chars?: string) => string,
		padLeft: (string: string, length?: number, chars?: string) => string,
		padRight: (string: string, length?: number, chars?: string) => string,
		parseInt: (string: string, radix?: number) => number,
		repeat: (string: string, n: number) => number,
		snakeCase: (string: string) => string,
		startCase: (string: string) => string,
		startsWith: (string: string, target: string, position?: number) => boolean,
		template: (string: string, options: TemplateOptions) => Function,
		trim: (string: string, chars?: string) => string,
		trimLeft: (string: string, chars?: string) => string,
		trimRight: (string: string, chars?: string) => string,
		trunc: (string: string, options: Object|number) => string,
		unescape: (string: string) => string,
		words: (string: string, pattern: RegExp|string) => Array<string>,


		// "Lang" Functions
		isElement: (value: any) => boolean,
		isString: (value: any) => boolean,
		isFunction: (value: any) => boolean,
		isArray: (value: any) => boolean,
		delay: (func: Function, wait: number, ...args?: any) => number,
		clone: (value: any) => 	any,
		isUndefined: (value: any) => boolean
	};
*/

///////////    ObersvableList overrides     //////////////////////////
//Some lodash function will bypass the methods overridden by ObservableList, so we will print a warning to the console if they are used
//For example _.pull will use Array.splice.call() under the covers, which will bypass the Observable List's splice method, and no change events will get fired
let methodsThatRequireWarning = ['pull', 'remove', 'fill', 'pullAt']; //all the methods that mutate the passed in array
methodsThatRequireWarning.forEach(method => {
	if (_[method]) {
		let originalFn = _[method];
		_[method] = (...args) => {
			let array = args[0];
			if (array.isObservableList) {
				console.error(
					`WARNING: Do not use _.${method} with an observable list - change events will not be emitted. Check ObservableList.js for the appropriate helper function`,
				);
			}
			return originalFn.apply(_, args);
		};
	}
});

_.an = _.an || {};

// Gets a value, and allows for a function to be used, with params.
_.an.get = function(obj, path, defaultValue, ...params) {
	let val = _.get(obj, path);
	if (_.isFunction(val)) {
		val = val.apply(obj, params);
	}
	if (val === undefined) {
		val = defaultValue;
	}
	return val;
};

// Lodash should have isDefined, so we are adding it ;)
_.isDefined = function(val) {
	return !_.isUndefined(val);
};

_.noConflict();

export default _;
