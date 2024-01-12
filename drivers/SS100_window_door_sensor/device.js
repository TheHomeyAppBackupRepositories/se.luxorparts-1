const { ZigBeeDevice } = require('homey-zigbeedriver');
const { debug, Cluster, CLUSTER } = require('zigbee-clusters');
const BatteryDevice = require('../../lib/BatteryDevice');

class DoorWindowSensor extends BatteryDevice {

  async onNodeInit({ zclNode }) {
    await super.onNodeInit({ zclNode });

    zclNode.endpoints[1].clusters.iasZone.onZoneStatusChangeNotification = data => {
      this.log('handle report (cluster: iasZone, attribute: zoneStatusChangeNotification), parsed payload:', data);
      this.payloadReported(data);
    };
  }

  payloadReported(data) {
    if(data.zoneStatus) {
      if (data.zoneStatus['alarm1'] !== this.getCapabilityValue('alarm_contact'))
        this.setCapabilityValue("alarm_contact", data.zoneStatus['alarm1']).catch(this.error);
      if (data.zoneStatus['tamper'] !== this.getCapabilityValue('alarm_tamper'))
        this.setCapabilityValue("alarm_tamper", data.zoneStatus['tamper']).catch(this.error);
      if (data.zoneStatus['battery'] !== this.getCapabilityValue('alarm_battery'))
        this.setCapabilityValue("alarm_battery", data.zoneStatus['battery']).catch(this.error);
    }
  }}

module.exports = DoorWindowSensor;
