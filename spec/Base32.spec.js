const Base36 = require('../src/Base36');

describe('Base36', () => {
  describe('encode(number)', () => {
    it('encodes 0-35 numbers as 0-9A-Z', () => {
      expect(Base36.encode(0)).toBe('0');
      expect(Base36.encode(1)).toBe('1');
      expect(Base36.encode(10)).toBe('A');
      expect(Base36.encode(35)).toBe('Z');
    });

    it('encodes 36-(36*36-1=1295) numbers as two letter string', () => {
      expect(Base36.encode(36)).toBe('10');
      expect(Base36.encode(37)).toBe('11');
      expect(Base36.encode(1295)).toBe('ZZ');
    });

    it('encodes 1296-(36^3-1=46655) numbers as 3 letter string', () => {
      expect(Base36.encode(1296)).toBe('100');
      expect(Base36.encode(46655)).toBe('ZZZ');
    });

    it('encodes 64 bit numbers as 13 digit value', () => {
      // 2^63 => min 64 bit number
      expect(Base36.encode('9223372036854775808').length).toBe(13);
      // 2^64-1 => max 64 bit number
      expect(Base36.encode('18446744073709551615').length).toBe(13);
    });
  });

  describe('decode(number)', () => {
    it('decodes single char string', () => {
      expect(Base36.decode('0').toNumber()).toEqual(0);
      expect(Base36.decode('1').toNumber()).toEqual(1);
      expect(Base36.decode('A').toNumber()).toEqual(10);
      expect(Base36.decode('Z').toNumber()).toEqual(35);
    });

    it('decodes complicated strings', () => {
      expect(Base36.decode('100').toNumber()).toEqual(1296);
      expect(Base36.decode('ZZZ').toNumber()).toEqual(46655);
      expect(Base36.decode('AZl8N0Y58M7').toString()).toEqual(
        '40114038810774751'
      );
    });
  });
});
