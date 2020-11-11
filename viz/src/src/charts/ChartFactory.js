export default class ChartFactory {
	static create(type, opts = {}) {
		if (!ChartFactory.registeredCharts[type]) {
			throw new Error(`Remember to add ChartFactory.registerChart(${type}); to ${type}.js.`);
		}
		return new ChartFactory.registeredCharts[type](opts);
	}
}

ChartFactory.registeredCharts = {};
ChartFactory.registerChart = (jsClass, keyName) => {
	ChartFactory.registeredCharts[keyName || jsClass.name] = jsClass;
};
