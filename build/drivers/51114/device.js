'use strict';

const ZwaveDevice = require('homey-zwavedriver').ZwaveDevice;

class SmokeSensorDevice extends ZwaveDevice {

    async onNodeInit() {

        // print the node's info to the console
        // this.printNode();

        this.registerCapability('measure_battery', 'BATTERY');
        this.registerCapability('alarm_smoke', 'NOTIFICATION');

        // Initial value
        this.setCapabilityValue("alarm_smoke", false).catch(this.error);
    }
}

module.exports = SmokeSensorDevice;
