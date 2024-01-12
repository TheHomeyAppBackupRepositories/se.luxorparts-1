'use strict';

const encryptionTable = [
    [10, 0, 4, 12, 2, 14, 7, 5, 1, 15, 11, 13, 9, 6, 3, 8],
    [2, 12, 5, 14, 7, 4, 1, 15, 11, 13, 6, 3, 8, 9, 10, 0]
];

const decryptionTable = [
    [1, 8, 4, 14, 2, 7, 13, 6, 15, 12, 0, 10, 3, 11, 5, 9],
    [15, 6, 0, 11, 5, 2, 10, 4, 12, 13, 14, 8, 1, 9, 3, 7]
];

function decryptPayload(payload) {
    const table = decryptionTable[(payload[0] >> 5) &1]; //Check bit 21 to select the encryptiontable
    const nibbles = [];
    // create nibbles from the 3 bytes
    payload.forEach(byte => {
        nibbles.push(byte >> 4);
        nibbles.push(byte &0x0F);
    });
    
    const xors = [nibbles[2], nibbles[3], nibbles[4], nibbles[5], 0];
    const decNibbles = nibbles.slice(1).map((nibble, index) => {
        return table[nibble] ^ xors[index];
    })
    decNibbles.unshift(nibbles[0] ^9);

    const result = [];
    for (let i = 0; i < 3; i++) {
        result.push((decNibbles[i*2] << 4) + decNibbles[i*2 + 1]);
    }
    return result;
}

function encryptPayload(payload) {
    const table = encryptionTable[(payload[0] >> 5) &1]; //Check bit 21 to select the encryptiontable
    const nibbles = [];
    // create nibbles from the 3 bytes
    payload.forEach(byte => {
        nibbles.push(byte >> 4);
        nibbles.push(byte &0x0F);
    });

    const encNibbles = []; let xorCount = 0;
    encNibbles.push(table[nibbles[5]]);

    for(let i = 4; i > 0; i--) {
        encNibbles.push(table[(nibbles[i] ^ encNibbles[xorCount])]);
        xorCount++;
    }
    encNibbles.push(nibbles[0] ^9);
    // Reverse the nibbles since the last added nibble is actually the begin of the payload.
    encNibbles.reverse();

    const encPayload = [];
    for (let i = 0; i < 3; i++) {
        encPayload.push((encNibbles[i*2] << 4) + encNibbles[i*2 + 1]);
    }
    return encPayload;
}

module.exports.decryptPayload = decryptPayload;
module.exports.encryptPayload = encryptPayload;