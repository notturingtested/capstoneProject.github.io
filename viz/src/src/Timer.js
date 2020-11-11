/*
	Example:
	// If you are in a loop that will be called multiple times, possibly asynchronously, then pass the start to the stop.
	let start = app.timer.start('runningReport');
	app.timer.stop('runningReport', start);  // This will return the duration for that iteration. That loop interation will also be added to the total duration.

	timer.timers will have something similar to this:
	{
		runningReport: {duration: 7, count: 3, times: [3,2,2], start: 1596839643982}
	}
*/

export default class Timer {
	constructor() {
		this._recordIndividualTimings = false;
		this.timers = {};
	}

	start(name) {
		if (!this.timers[name]) {
			this.timers[name] = { duration: 0, count: 0, times: [] };
		}
		this.timers[name].start = Date.now();
		return this.timers[name].start;
	}

	stop(name, optionalStart) {
		let timer = this.timers[name];
		timer.count++;
		let newDuration = Date.now() - (optionalStart ?? timer.start);
		timer.duration += newDuration;
		if (this._recordIndividualTimings) {
			timer.times.push(newDuration);
		}
		return newDuration;
	}
}
