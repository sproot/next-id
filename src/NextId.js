const EPOCH = require('../config/epoch');
const Long = require('long');
const Base62 = require('./Base62');
const Base36 = require('./Base36');
const Pseudo = require('./Pseudo');

class NextId {

    constructor(id) {
        const longNumber = this._getLongNumber(id);
        const pseudoId = Pseudo.encrypt(longNumber);

        this.id = Base62.encode(pseudoId);
        this.alphanumericId = Base36.encode(longNumber);
        this.pseudoId = pseudoId.toString();
        this.numericId = longNumber.toString();
        this.shardId = this._extractShardId(longNumber);
        this.issuedAt = this._extractIssuedAt(longNumber);
    }

    inspect() {
        return {
            id: this.id,
            alphanumericId: this.alphanumericId,
            pseudoId: this.pseudoId,
            numericId: this.numericId,
            shardId: this.shardId,
            issuedAt: this.issuedAt,
        };
    }

    toString() {
        return this.id;
    }

    _getLongNumber(id) {
        id = id.toString();
        if (this._isBase62Encoded(id)) return Pseudo.decrypt(Base62.decode(id));
        else if (this._isBase36Encoded(id)) return Base36.decode(id);
        else return Long.fromString(id, true);
    }

    _isBase62Encoded(id) {
        return id.length <= 11;
    }

    _isBase36Encoded(id) {
        return id.length > 11 && id.length <= 13;
    }

    _extractShardId(id) {
        return id.xor(
            id.shiftRight(23).shiftLeft(23)
        ).shiftRight(10).toNumber();
    }

    _extractIssuedAt(id) {
        return new Date(EPOCH + this._extractTimestamp(id));
    }

    _extractTimestamp(id) {
        return id.shiftRight(23).toNumber();
    }
}

module.exports = NextId;
