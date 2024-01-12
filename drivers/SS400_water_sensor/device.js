'use strict';

const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, CLUSTER } = require('zigbee-clusters');
const BatteryDevice = require('../../lib/BatteryDevice');

class WaterSensor extends BatteryDevice {

    async onNodeInit({zclNode}) {
        await super.onNodeInit({zclNode});

        if (this.isFirstInit())
        {
            this.log("SS400 Water Sensor added, setting default values");
            await this.setCapabilityValue('alarm_water', false).catch(this.error);
            await this.setCapabilityValue('alarm_battery', false).catch(this.error);
        }

        // alarm_contact
        zclNode.endpoints[1].clusters[CLUSTER.IAS_ZONE.NAME].onZoneStatusChangeNotification = payload => {
            this.onIASZoneStatusChangeNotification(payload);
        }
    }

    onIASZoneStatusChangeNotification({zoneStatus, extendedStatus, zoneId, delay,}) {
        this.log('IASZoneStatusChangeNotification received:', zoneStatus, extendedStatus, zoneId, delay);
        this.setCapabilityValue('alarm_water', zoneStatus.alarm1).catch(this.error);
        this.setCapabilityValue('alarm_battery', zoneStatus.battery).catch(this.error);
    }

    onDeleted() {
        this.log("SS400 Water Sensor removed")
    }
}

module.exports = WaterSensor;