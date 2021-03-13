// Keep the import below.
// import { _ } from '@analytics/core';
import { _ } from './../../analytics/core';

export default class LineScales {
	getScales(opts) {
		const y1 = this.getY1Scale(opts); //used to draw axes and marks in single axes mode
		const y2 = this.getY2Scale(opts); //used to draw axes in dual axis mode
		const yNormalized = this.getYNormalizedScale(opts); //used to draw marks in normalized/dual axis mode

		return _.compact([
			this.getXScale(),
			opts.showTrendline ? this.getXTrendlineScale() : null,
			y1,
			opts.dualYAxisIsEnabled ? y2 : null,
			opts.normalizationRequired ? yNormalized : null,
			this.getColorScale(opts),
		]);
	}

	getAnomalyDetectionFields(data) {
		return [
			{
				data,
				field: 'upperConfidenceBound',
			},
			{
				data,
				field: 'lowerConfidenceBound',
			},
			{
				data,
				field: 'expectedValue',
			},
		];
	}

	getXScale() {
		return {
			name: 'x',
			type: 'time',
			domain: {
				fields: [{ data: 'allData', field: 'x' }],
			},
			range: 'width',
			nice: false,
		};
	}

	getXTrendlineScale() {
		return {
			name: 'trendlineXScale',
			type: 'linear',
			domain: {
				fields: [{ data: 'allData', field: 'trendlineX' }],
			},
			range: 'width',
			nice: false,
			//we want to start the scale at 1, not 0, for trendlines - 0 in this scale will make log regression not work, because log(0) is undefined
			zero: false,
		};
	}

	getY1Scale(opts) {
		const data = opts.dualYAxisIsEnabled ? 'dualAxisDataSeries1' : 'allData';
		return {
			name: 'y1',
			...this.getSharedYScaleProperties(data, opts),
		};
	}

	getY2Scale(opts) {
		return {
			name: 'y2',
			...this.getSharedYScaleProperties('dualAxisDataSeries2', opts),
		};
	}

	getYNormalizedScale(opts) {
		return {
			name: 'yNormalized',
			...this.getSharedYScaleProperties('allData', opts),
			domain: this.getNormalizationDomain(),
		};
	}

	getSharedYScaleProperties(data, chartOpts = {}) {
		let { showTrendline, anomalyRescaleIsEnabled } = chartOpts;
		return {
			type: 'linear',
			domain: {
				fields: [
					{
						data,
						field: 'y',
					},
					...(showTrendline ? [{ data: 'trendlineData', field: 'trendlineY' }] : []),
					...(anomalyRescaleIsEnabled ? this.getAnomalyDetectionFields(data) : []),
				],
			},
			// padding: 10, //AN-178680 Be careful with padding - it can mess up dual axis - padding does some scaling of already normalized data, and the ticks and line won't line up anymore
			range: 'height',
			zero: chartOpts.forceZero,
		};
	}

	getColorScale(opts) {
		return {
			name: 'color',
			type: 'ordinal',
			domain: {
				fields: [{ data: 'allData', field: 'series' }],
				sort: false, // We do not want Vega to sort the domain so that we can deterministically set the right colors
			},
			range: opts.colors,
		};
	}

	getNormalizationDomain() {
		/*
        We are going to use a domain of [0,1]. It may seem intuitive, but there are some important nuances about why we do this.
        I've written some pseudo code that explains the journey that raw data takes in order to become pixel values that vega can draw on the screen.
        Let's look at an example where the user has turned on "anchor to zero"

        //start out with rawData
        const rawData = [10, 30, 60, 100, 300]

        //create a domain we will use for normaliziation (the max and min of the raw data)
        const rawValuesDomain = [10, 300]

        //but if forceZero, we force 0 into the domain
        if(forceZero) {
            //0 is the min, 300 is still the max
            rawValuesDomain = [0, 300]
        }

        //now create normalization scale
        scale = d3.scale().domain(rawValuesDomain).range(0, 1);

        //now go through and use our scale to create an array of normalizedValues
        const normalizedValues = rawData.map(rawValue => {

            console.log(rawValue) // -> [10, 30, 60, 100, 300]

            const normalizedValue = scale(rawValue);

            console.log(normalizedValue) // -> [.03, .1, .2, .33, 1]

            return normalizedValue;
        });

        //now we need to translate those normalized values into pixel values that vega can use to draw points
        //so we create another scale.  we need a domain and a range:

        //the pixelRange will be 0 to the height of the chart (lets assume the height of the chart is 500px)
        const heightOfTheChartInPixels = 500;
        const pixelRange = [0, heightOfTheChartInPixels]

        //the domain has to be [0,1] - it has to match the range we used during the normalization process - see notes below
        const normalizedValuesDomain = [0,1];
        * why does the domain have to be 0,1 - why can we not just get the max and min of the normalized values to create the domain?
        * eg const normalizedValuesDomain = [min(normalizedValues), max(normalizedValues)]
        * which if logged: console.log(domain) -> [.03, 1]
        * the problem with using the max and min, when you have anchor to 0, is that 0 is not actually a raw value. So you can't use the raw values here to get a max and min.  You won't get 0 as the min! 0 is not a raw data point - we built it into the domain when we first normalized our data.
        * We have to force the pixel drawing scale to have the same domain as the range we used during the normalization process, regardless of what the raw normalized data points look like

        //create the pixel scale
        const pixelScale = vega.scale().domain(normalizedValuesDomain).range(pixelRange)

        //now we can get raw pixels for vega to draw
        const pixelsToDraw = normalizedValues.map(normalizedValue => {

            console.log(normalizedValue) // -> [.03, .1, .2, .33, 1]

            const pixelValue = pixelScale(normalizedValue);

            console.log(pixelValue) // -> [0, 34, 86, 155, 500] //remember that 500px was the height of our chart! it all makes sense!

            return pixelValue;
        });

        YAY!!
        now vega can draw those points on the page!

        * A good note about this process is that it will work whether your raw values are all positive, negative, or a mix of both.  We originaly had a bug where our logic for Normalization + Anchor to Zero + Negative numbers would result in skewed charts.  Using a domain of [0,1] solves this.

        */

		return [0, 1];
	}

	static create(opts) {
		const instance = new this();
		return instance.getScales(opts);
	}
}
