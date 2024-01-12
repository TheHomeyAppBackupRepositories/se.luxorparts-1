'use strict';

require("inspector").open(9228, "0.0.0.0", false);

const Homey = require('homey');

class Luxorparts extends Homey.App {
	
	onInit() {
		this.log('Cleverio is running...');
	}
	
}

module.exports = Luxorparts;