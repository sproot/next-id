const Long = require('long');
const Base62 = require('./Base62');
const Pseudo = require('./Pseudo');

class NextIdGenerator {
  static get EPOCH() {
    return new Date('Sep 8 2017 10:30 GMT+0300').getTime();
  }

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

  generateNumberId() {
    let result = Long.fromNumber(new Date().getTime() - NextIdGenerator.EPOCH, true);
    result = result.shiftLeft(23);
    result = result.or(Long.fromNumber(this.shardId).shiftLeft(10));
    result = result.or(Long.fromNumber(this.sequence % 1024));
    this.sequence++;
    return result;
  }

  generatePseudoId() {
    return Pseudo.encrypt(this.generateNumberId());
  }

  generateBase62Id() {
    return Base62.encode(this.generatePseudoId());
  }

  generateId(type) {
    if(!type) type = 'base62';
    switch (type) {
      case 'number': return this.generatePseudoId();
      case 'base62': return this.generateBase62Id();
    }
  }

  inspectId(id) {
    if(id.length <= 11) id = Base62.decode(id);
    id = Pseudo.encrypt(id);
    const timestamp = this._getTimestamp(id);
    return {
      shardId: this._getShardId(id),
      timestamp: timestamp,
      createdAt: NextIdGenerator.EPOCH + timestamp,
    };
  }

  _getTimestamp(id) {
    return id.shiftRight(23).toNumber();
  }

  _getShardId(id) {
    return id.xor(
      id.shiftRight(23).shiftLeft(23)
    ).shiftRight(10).toNumber();
  }
}

module.exports = NextIdGenerator;
