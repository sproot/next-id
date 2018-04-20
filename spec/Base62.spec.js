const Long = require('long');
const Base62 = require('../src/Base62');

describe('Base62', () => {
  let base62;

  beforeEach(() => {
    base62 = new Base62();
  });

  describe('encode(number)', () => {
    it('encodes 0-61 numbers as 0-9a-Z', () => {
      expect(base62.encode(0)).toBe('0');
      expect(base62.encode(1)).toBe('1');
      expect(base62.encode(10)).toBe('a');
      expect(base62.encode(36)).toBe('A');
      expect(base62.encode(61)).toBe('Z');
    });

    it('encodes 62-(62*62-1=3843) numbers as two letter string', () => {
      expect(base62.encode(62)).toBe('10');
      expect(base62.encode(63)).toBe('11');
      expect(base62.encode(3843)).toBe('ZZ');
    });

    it('encodes 3844-(62^3-1=238327) numbers as 3 letter string', () => {
      expect(base62.encode(3844)).toBe('100');
      expect(base62.encode(238327)).toBe('ZZZ');
    });

    it('encodes 64 bit numbers as 11 digit value', () => {
      // 2**63 => min 64 bit number
      expect(base62.encode('9223372036854775808').length).toBe(11);
      // 2**64-1 => max 64 bit number
      expect(base62.encode('18446744073709551615').length).toBe(11);
    });
  });

  describe('decode(number)', () => {
    it('decodes single char string', () => {
      expect(base62.decode('0').toNumber()).toEqual(0);
      expect(base62.decode('1').toNumber()).toEqual(1);
      expect(base62.decode('a').toNumber()).toEqual(10);
      expect(base62.decode('A').toNumber()).toEqual(36);
      expect(base62.decode('Z').toNumber()).toEqual(61);
    });

    it('decodes complicated strings', () => {
      expect(base62.decode('100').toNumber()).toEqual(3844);
      expect(base62.decode('ZZZ').toNumber()).toEqual(238327);
      expect(base62.decode('aZl8N0y58M7').toString()).toEqual(
        '9223372036854775807'
      );
      expect(base62.decode('lYGhA16ahyf').toString()).toEqual(
        '18446744073709551615'
      );
    });
  });
});
