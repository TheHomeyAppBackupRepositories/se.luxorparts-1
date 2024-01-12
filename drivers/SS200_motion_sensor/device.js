const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug } = require('zigbee-clusters');
const BatteryDevice = require('../../lib/BatteryDevice')

class SS200MotionSensor extends BatteryDevice {

  async onNodeInit({zclNode}) {
    await super.onNodeInit({zclNode})

    zclNode.endpoints[1].clusters.iasZone.onZoneStatusChangeNotification = data => {
      this.log('handle report (cluster: iasZone, attribute: zoneStatusChangeNotification), parsed payload:', data);
      this.payloadReported(data);
    };

    zclNode.endpoints[1].clusters.iasZone.onZoneEnrollRequest = (data) => {
      this.log('handle report (cluster: iasZone, attribute: zoneEnrollRequest), parsed payload:', data);
      zclNode.endpoints[1].clusters.iasZone.zoneEnrollResponse({
        enrollResponseCode: 0, // Success
        zoneId: 10, // Choose a zone id
      });

      this.payloadReported(data);
    };
  }

  payloadReported(data) {
    if (data.zoneStatus) {
      if (data.zoneStatus['alarm1'])
        this.onMotionReport();
      if (data.zoneStatus['battery'] !== this.getCapabilityValue('alarm_battery'))
        this.log('battery alarm changed', data.zoneStatus['battery']);
        this.setCapabilityValue("alarm_battery", data.zoneStatus['battery']).catch(this.error);
    }
  }

  onMotionReport() {
    this.log('alarm_motion triggered');
    this.setCapabilityValue('alarm_motion', true).catch(this.error);

    // set a timeout after which the alarm_motion capability is reset
    if (this.alarmMotionTimeout) clearTimeout(this.alarmMotionTimeout);

    this.alarmMotionTimeout = setTimeout(() => {
      this.log('manual alarm_motion reset');
      this.setCapabilityValue('alarm_motion', false).catch(this.error);
    }, 70 * 1000);
  }

  onDeleted() {
    this.log("SS200 Motion Sensor removed")
  }
}

module.exports = SS200MotionSensor;
