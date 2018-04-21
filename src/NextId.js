const EPOCH = require('../config/epoch');
const Long = require('long');
const Base62 = require('./Base62');
const Pseudo = require('./Pseudo');

class NextId {
  
  constructor(id) {
    const numberId = this._getNumberId(id);
    const pseudoId = Pseudo.encrypt(numberId);
    this.id = Base62.encode(pseudoId);
    this.pseudoId = pseudoId;
    this.numberId = numberId;
    this.shardId  = this._extractShardId(numberId);
    this.issuedAt = this._extractIssuedAt(numberId);
  }

  inspect() {
    return {
      id: this.id,
      pseudoId: this.pseudoId.toString(),
      numberId: this.numberId.toString(),
      shardId: this.shardId,
      issuedAt: this.issuedAt,
    }
  }

  toString() {
    return this.id;
  }

  _getNumberId(id) {
    id = id.toString();
    return this._isBase62Encoded(id)  ?
      Pseudo.decrypt(Base62.decode(id)) :
      Long.fromString(id, true);
  }

  _isBase62Encoded(id) {
    return id.length <= 11;
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
