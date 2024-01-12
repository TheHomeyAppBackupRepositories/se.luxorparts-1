'use strict';

const encryption = require('./PayloadEncryption');
const { RFDevice } = require('homey-rfdriver');

module.exports = class extends RFDevice {

    static createPairCommand() {
        const data = {
            address: Math.round((Math.random() * 0xFFFE)) +1,
            count: 1,
            unit: Math.round(Math.random() * 0x1F),
            state: true,
            onoff: true
        }
        data.id= `${data.address}:${data.unit}`;
        return data;
    }

    static payloadToCommand(payload) {
        payload = encryption.decryptPayload(payload);
        if (payload.length === 3) { // 3 bytes
            const data = {
                address: (payload[0] << 8) + payload[1],
                count: (payload[2] >> 6) &3,
                state: (payload[2] &0x20) ===0x20,
                unit: (payload[2]) &0x1F
            };
            return {
                ...data,
                id: `${data.address}:${data.unit}`
            };
        }
        return null;
    }

    static commandToPayload(data) {
        if(
            data &&
            typeof data.address !== 'undefined'&&
            typeof data.unit !== 'undefined'&&
            typeof data.count !== 'undefined' &&
            typeof data.state !== 'undefined'
        ) { 
            let payload = [
                data.address >> 8,
                data.address & 0xFF,
                (data.count << 6) + (Number(typeof data.onoff === 'boolean' ? data.onoff : data.state) << 5) + data.unit

            ]
            payload = encryption.encryptPayload(payload);
            return payload;
        }
        return null;
    }
};
