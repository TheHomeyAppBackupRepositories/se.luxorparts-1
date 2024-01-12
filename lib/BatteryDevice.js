const {ZigBeeDevice} = require("homey-zigbeedriver");
const {debug, CLUSTER} = require("zigbee-clusters");

class BatteryDevice extends ZigBeeDevice {
    async onNodeInit({zclNode}) {
        const debugMode = false;

        if (debugMode) {
            // enable debugging
            this.enableDebug();

            // Enables debug logging in zigbee-clusters
            debug(true);

            // print the node's info to the console
            this.printNode();
        }

        /*
        if (this.hasCapability('measure_battery'))
            await this.removeCapability('measure_battery').catch(this.error);

        if (!this.hasCapability('measure_battery'))
            await this.addCapability('measure_battery').catch(this.error);
        */

        /*
        if (this.isFirstInit()) {
            if (this.hasCapability('measure_battery')) {
                await this.configureAttributeReporting([{
                    endpointId: 1,
                    cluster: CLUSTER.POWER_CONFIGURATION,
                    attributeName: 'batteryPercentageRemaining',
                    //Revert to default reporting
                    minInterval: 65535,
                    maxInterval: 0,
                    minChange: 0,
                }]).catch(this.error);
            }
        }
        */

        zclNode.endpoints[1].clusters.powerConfiguration.on('attr.batteryPercentageRemaining', this.onBatteryPercentageRemainingAttributeReport.bind(this));
    }

    async onBatteryPercentageRemainingAttributeReport(payload) {
        this.log('handle report (cluster: powerConfiguration, attribute: batteryPercentageRemaining), parsed payload:', payload);
        const batteryThreshold = 15;
        const batteryPercentageRemaining = payload / 2;
        this.log("measure_battery | powerConfiguration - batteryPercentageRemaining (%): ", batteryPercentageRemaining);

        if (!this.hasCapability('measure_battery'))
            await this.addCapability('measure_battery').catch(this.error);

        if (this.hasCapability('measure_battery'))
            this.setCapabilityValue('measure_battery', batteryPercentageRemaining).catch(this.error);

        if (this.hasCapability('alarm_battery'))
            this.setCapabilityValue('alarm_battery', batteryPercentageRemaining < batteryThreshold).catch(this.error);
    }
}

module.exports = BatteryDevice;