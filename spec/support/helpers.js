const Long = require('long');

// 64 bits total, 41 occupied by timestamp
const timeShift = 64-41;

// last 10 bits used for counter value from 0 to 1023
const countShift = 10;

function getTimestamp(id) {
    return id.shiftRight(timeShift).toNumber();
}

function getShardId(id) {
    return id.xor(
        id.shiftRight(timeShift).shiftLeft(timeShift)
    ).shiftRight(countShift).toNumber();
}

function getLastTenBits(id) {
    return id.and(Long.ONE.shiftLeft(countShift)-Long.ONE);
}

module.exports = {
    getTimestamp,
    getShardId,
    getLastTenBits
};
