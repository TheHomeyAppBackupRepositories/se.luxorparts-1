'use strict';

const LuxorParts = require('./../LuxorPartsDevice');

module.exports = class extends LuxorParts {

	static RX_ENABLED = true;

	async onCommandMatch(command) {
		const { address } = await this.getData();
		const match = address === command.address;
		return match
	}

	// static payloadToCommand(payload) {
	// 	const data = super.payloadToCommand(payload);
	// 	if (!data) return data;
	//
	// 	data.id = data.address;
	// 	data.state = data.state ? 1:0; //convert to number for flows.
	// 	return data;
	// }
};
