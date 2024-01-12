'use strict';

const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;

class DoorSensorDevice extends ZwaveDevice {

	async onNodeInit() {

		// print the node's info to the console
		// this.printNode();

		// enable debugging
		// this.enableDebug();

        this.registerCapability('measure_battery', 'BATTERY');

        this.registerCapability('alarm_contact', 'SENSOR_BINARY');
        this.registerCapability('alarm_tamper', 'NOTIFICATION');
	}
}

module.exports = DoorSensorDevice;