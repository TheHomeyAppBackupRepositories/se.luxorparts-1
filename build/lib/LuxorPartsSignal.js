'use strict';


const encryption = require('./PayloadEncryption');

const { RFSignal } = require('homey-rfdriver');

module.exports = class extends RFSignal {

    static ID = 'luxorparts';

    static FREQUENCY = '433';
    static createPairCommand() {
        console.log('createPairCommand')
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

    static commandToDeviceData(command) {
        return {
            address: command.address,
            count: command.count,
            unit: command.unit,
            id: command.id
        };
    }

    static payloadToCommand(payload) {
        console.log('payloadToCommand', payload)
        payload = encryption.decryptPayload(payload);
        if (payload.length === 3) { // 3 bytes
            const data = {
                address: (payload[0] << 8) + payload[1],
                count: (payload[2] >> 6) &3,
                state: (payload[2] &0x20) ===0x20,
                unit: (payload[2]) &0x1F
            };
            console.log(JSON.stringify({
                ...data,
                id: `${data.address}:${data.unit}`
            }))
            return {
                ...data,
                id: `${data.address}:${data.unit}`
            };
        }
        return null;
    }

    static commandToPayload(data) {
        console.log('commandToPayload', JSON.stringify(data))
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
                (data.count << 6) + (Number(data.state) << 5) + data.unit

            ]
            console.log(JSON.stringify(payload));
            payload = encryption.encryptPayload(payload);
            return payload;
        }
        return null;
    }
};
