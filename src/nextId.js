const Long = require('long');

class NextId {
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

  instId() {
    let result = Long.fromNumber(new Date().getTime() - NextId.EPOCH, true);
    result = result.shiftLeft(23);
    result = result.or(Long.fromNumber(this.shardId).shiftLeft(10));
    result = result.or(Long.fromNumber(this.sequence % 1024));
    this.sequence++;
    return result;
  }

  pseudoEncrypt(number) {
    const BITMASK = Long.fromNumber(4294967295);
    let l1, l2, r1, r2;
    l1 = number.shiftRight(32).and(BITMASK);
    r1 = number.and(BITMASK);
    for(let i=0; i<3; i++) {
      l2 = r1;
      r2 = l1.xor(Math.round(
        ((1366.0 * r1 + 150889) % 714025 / 714025.0) * (32767*32767)
      ));
      l1 = l2;
      r1 = r2;
    }
    return r1.shiftLeft(32).add(l1);
  }

  nextId(type) {
    if(!type) type = 'number';
    const id = this.pseudoEncrypt(this.instId());
    switch (type) {
      case 'number':
        return id;
        break;
    }
  }
}

module.exports = NextId;
