const Long = require('long');
const EPOCH = require('../config/epoch');
const NextId = require('./NextId');

class NextIdGenerator {

    constructor() {
        this.sequence = 0;
    }

    setShardId(shardId) {
        if(typeof shardId !== 'number') throw new TypeError();
        if(shardId < 1 || shardId > 8191)
            throw new RangeError();
        this._shardId = shardId;
        return this;
    }

    get shardId() {
        if(!this._shardId) this._shardId = 0;
        return this._shardId;
    }

    generateId() {
        let result = Long.fromNumber(new Date().getTime() - EPOCH, true);
        result = result.shiftLeft(23);
        result = result.or(Long.fromNumber(this.shardId).shiftLeft(10));
        result = result.or(Long.fromNumber(this.sequence % 1024));
        this.sequence++;
        return result;
    }

    getNextId() {
        return new NextId(this.generateId());
    }
}

module.exports = NextIdGenerator;
