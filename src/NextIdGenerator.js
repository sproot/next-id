const Long = require('long');
const Base62 = require('./Base62');

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

  generateNumberId() {
    let result = Long.fromNumber(new Date().getTime() - NextIdGenerator.EPOCH, true);
    result = result.shiftLeft(23);
    result = result.or(Long.fromNumber(this.shardId).shiftLeft(10));
    result = result.or(Long.fromNumber(this.sequence % 1024));
    this.sequence++;
    return result;
  }

  generatePseudoId() {
    return this.pseudoEncrypt(this.generateNumberId());
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
    id = this.pseudoEncrypt(id);
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
//
// id: lkpdpkefpep
// generateNumberId: 39393933939
// pseudoId: 320023203023023
// shardId: 3113133123
// timestamp: 442244424
// createdAt: date


// new NextId('320023203023023')


module.exports = NextIdGenerator;
