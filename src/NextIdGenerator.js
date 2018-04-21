const Long = require('long');

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

  generateId() {
    let result = Long.fromNumber(new Date().getTime() - NextIdGenerator.EPOCH, true);
    result = result.shiftLeft(23);
    result = result.or(Long.fromNumber(this.shardId).shiftLeft(10));
    result = result.or(Long.fromNumber(this.sequence % 1024));
    this.sequence++;
    return result;
  }

  inspectId(id) {
    return {
      shardId: this._extractShardId(id),
      issuedAt: this._extractIssuedAt(id)
    }
  }

  _extractShardId(id) {
    return id.xor(
      id.shiftRight(23).shiftLeft(23)
    ).shiftRight(10).toNumber();
  }

  _extractIssuedAt(id) {
    return new Date(NextIdGenerator.EPOCH + this._extractTimestamp(id));
  }

  _extractTimestamp(id) {
    return id.shiftRight(23).toNumber();
  }
}

module.exports = NextIdGenerator;
