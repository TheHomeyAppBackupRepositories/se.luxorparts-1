'use strict';

const { RFDriver } = require('homey-rfdriver');
const LuxorPartsSignal = require('./LuxorPartsSignal')


module.exports = class extends RFDriver {
    static SIGNAL = LuxorPartsSignal
};
