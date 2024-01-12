'use strict';

const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;

class MotionDevice extends ZwaveDevice {

	async onNodeInit() {

		// print the node's info to the console
		// this.printNode();

		// enable debugging
		// this.enableDebug();

		this.registerCapability('alarm_tamper', 'NOTIFICATION');
		this.registerCapability('alarm_motion', 'NOTIFICATION');
		this.registerCapability('measure_battery', 'BATTERY');
	}
}

module.exports = MotionDevice;