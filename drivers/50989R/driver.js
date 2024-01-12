'use strict';

const { RFDriver } = require('homey-rfdriver');
const LuxorPartsSignal = require('../../lib/LuxorPartsSignal')


module.exports = class extends RFDriver {
    static SIGNAL = LuxorPartsSignal

    async onRFInit() {
        await super.onRFInit();

        this.homey.flow
            .getDeviceTriggerCard('50989R:received')
            .registerRunListener(async (args, state) => {
                if (state.group) {
                    return (args.state === '1') === state.state
                        && args.unit === 'g';
                }
                return (args.state === '1') === state.state
                    && args.unit.toString() === state.unit.toString();
            });
    }

};
