function getTimestamp(id) {
    // 64-41 => 23, 64 bits total, 41 occupied by timestamp
    return Number(id >> 23n);
}

function getShardId(id) {
    return Number(
        ( id ^ ( ( id >> 23n ) << 23n ) ) >> 10n
    );
}

function getLastTenBits(id) {
    // last 10 bits used for counter value from 0 to 1023
    return Number(
        id & ((1n << 10n) - 1n)
    );
}

module.exports = {
    getTimestamp,
    getShardId,
    getLastTenBits
};
