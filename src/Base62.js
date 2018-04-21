const Long = require('long');

class Base62 {
  static get ALPHABET() {
    return '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  static get base() {
    return Base62.ALPHABET.length;
  }

  static encode(number) {
    number = this.normalizeNumber(number);
    let result = '';
    do {
      result = this.ALPHABET[number.mod(this.base)] + result;
      number = number.div(this.base);
    } while (number > 0);
    return result;
  }

  static decode(string) {
    let result = Long.ZERO;
    for(let i = 0; i < string.length; i++) {
      result = result.multiply(this.base).toUnsigned();
      result = result.add(this.ALPHABET.indexOf(string[i]));
    }
    return result;
  }

  static normalizeNumber(number) {
    switch (typeof number) {
      case 'number': return Long.fromNumber(number);
      case 'string': return Long.fromString(number, true);
      default: return number;
    }
  }
}

module.exports = Base62;
