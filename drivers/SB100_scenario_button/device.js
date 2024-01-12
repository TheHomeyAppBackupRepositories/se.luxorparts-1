const BatteryDevice = require('../../lib/BatteryDevice');

class SB100ScenarioButton extends BatteryDevice {
    async onNodeInit({zclNode}) {
        let lastFrameId = 0;

        const node = await this.homey.zigbee.getNode(this);
        node.handleFrame = (endpointId, clusterId, frame, meta) => {
            if (clusterId === 6) {
                const frameId = frame[1];
                this.log("endpointId:", endpointId, ", clusterId:", clusterId, ", frame:", frame, ", meta:", meta, ", frameId:", frameId);
                this.log("Frame JSON data:", frame.toJSON());

                if (lastFrameId !== frameId) {
                    lastFrameId = frameId;
                    this.log("Triggering buttonCommandParser");
                    this.buttonCommandParser(frame);
                }
            }
        };

        this._buttonPressedTriggerDevice = this.homey.flow.getDeviceTriggerCard('scenario_button')
            .registerRunListener(async (args, state) => {
                return (null, args.action === state.action);
            });
    }

    buttonCommandParser(frame) {
        var action = frame[3] === 0 ? 'oneClick' : 'twoClicks';
        return this._buttonPressedTriggerDevice.trigger(this, {}, {action: `${action}`})
            .then(() => this.log(`Triggered Scenario Button, action=${action}`))
            .catch(err => this.error('Error triggering Scenario Button', err));
    }

    onDeleted() {
        this.log("SB100 Scenario Button removed")
    }
}

module.exports = SB100ScenarioButton;