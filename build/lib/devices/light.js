'use strict';

const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {
    static CAPABILITIES = {
        onoff: ({value, data}) => ({
            ...data,
            state: !!value,
        }),
    };

    async onAdded() {
        if (this.hasCapability('onoff')) {
            await this.setCapabilityValue('onoff', false);
        }
    }
};
