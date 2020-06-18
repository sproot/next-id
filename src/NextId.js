const EPOCH = require('../config/EPOCH');
const Base62 = require('./Base62');
const Base36 = require('./Base36');
const Pseudo = require('./Pseudo');

class NextId {

    constructor(id) {
        const bigInt = this._getBigInt(id);
        const pseudoId = Pseudo.encrypt(bigInt);

        this.id = Base62.encode(pseudoId);
        this.alphanumericId = Base36.encode(bigInt);
        this.pseudoId = pseudoId.toString();
        this.numericId = bigInt.toString();
        this.shardId = this._extractShardId(bigInt);
        this.issuedAt = this._extractIssuedAt(bigInt);
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

    _getBigInt(id) {
        id = id.toString();
        if (this._isBase62Encoded(id)) return Pseudo.decrypt(Base62.decode(id));
        else if (this._isBase36Encoded(id)) return Base36.decode(id);
        else return BigInt(id);
    }

    _isBase62Encoded(id) {
        return id.match(/^[0-9A-Za-z]{0,11}$/);
    }

    _isBase36Encoded(id) {
        return Boolean(id.match(/^[0-9A-Z]{11,13}$/));
    }

    _extractShardId(id) {
        return Number(
            ( id ^ ( (id >> 23n) << 23n ) ) >> 10n
        );
    }

    _extractIssuedAt(id) {
        return new Date(EPOCH + this._extractTimestamp(id));
    }

    _extractTimestamp(id) {
        return Number(id >> 23n);
    }
}

module.exports = NextId;
