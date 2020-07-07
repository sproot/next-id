const EPOCH = require('../config/EPOCH');
const NextId = require('./NextId');

class NextIdGenerator {

    constructor() {
        this.sequence = 0;
    }

    setShardId(shardId) {
        if(!Number.isInteger(shardId)) throw new TypeError();
        if(shardId < 0 || shardId > 8191)
            throw new RangeError();
        this._shardId = shardId;
        return this;
    }

    get shardId() {
        if(!this._shardId) this._shardId = 0;
        return this._shardId;
    }

    generateBigIntId() {
        let result = BigInt(new Date().getTime() - EPOCH);
        result = result << 23n;
        result = result | (BigInt(this.shardId) << 10n);
        result = result | (BigInt(this.sequence % 1024));
        this.sequence++;
        return result;
    }

    generateNumericId() {
        return new NextId(this.generateBigIntId()).numericId;
    }

    generateAlphanumericId() {
        return new NextId(this.generateBigIntId()).alphanumericId;
    }

    generateId() {
        return new NextId(this.generateBigIntId()).id;
    }

    generate({ format } = {}) {
        switch(format) {
            case 'numeric':
                return this.generateNumericId();
            case 'alphanumeric':
                return this.generateAlphanumericId();
            default:
                return this.generateId();
        }
    }

    inspect(id) {
        return new NextId(id).inspect();
    }
}

module.exports = NextIdGenerator;
