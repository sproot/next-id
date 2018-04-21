const Base62 = require('./Base62');
const Pseudo = require('./Pseudo');

class NextId {
  static setGenerator(generator) {
    this.generator = generator;
  }

  constructor() {
    const numberId = NextId.generator.generateId();
    const pseudoId = Pseudo.encrypt(numberId);
    const {shardId, issuedAt} = NextId.generator.inspectId(numberId);
    this.id = Base62.encode(pseudoId);
    this.pseudoId = pseudoId;
    this.numberId = numberId;
    this.shardId = shardId;
    this.issuedAt = issuedAt;
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
}

module.exports = NextId;
