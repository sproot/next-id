const Long = require('long');

class Base62 {
  static get ALPHABET() {
    return '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  }

  get base() {
    return Base62.ALPHABET.length;
  }

  encode(number) {
    number = this._normalizeNumber(number);
    let result = '';
    do {
      result = Base62.ALPHABET[number.mod(this.base)] + result;
      number = number.div(this.base);
    } while (number > 0);
    return result;
  }

  decode(string) {
    let result = Long.ZERO;
    for(let i = 0; i < string.length; i++) {
      result = result.multiply(this.base).toUnsigned();
      result = result.add(Base62.ALPHABET.indexOf(string[i]));
    }
    return result;
  }

  _normalizeNumber(number) {
    switch (typeof number) {
      case 'number':
        return Long.fromNumber(number);
      case 'string':
        return Long.fromString(number, true);
    }
  }
}

module.exports = Base62;
