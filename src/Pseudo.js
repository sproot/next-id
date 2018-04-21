const Long = require('long');

class Pseudo {
  static encrypt(number) {
    switch(typeof number) {
      case 'number':
        number = Long.fromNumber(number);
        break;
      case 'string':
        number = Long.fromString(number);
        break;
    }

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

  static decrypt(number) {
    return this.encrypt(number);
  }
}

module.exports = Pseudo;
