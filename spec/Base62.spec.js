const Base62 = require('../src/Base62');

describe('Base62', () => {
    describe('encode(number)', () => {
        it('encodes 0-61 numbers as 0-9a-Z', () => {
            expect(Base62.encode(0)).toBe('0');
            expect(Base62.encode(1)).toBe('1');
            expect(Base62.encode(10)).toBe('a');
            expect(Base62.encode(36)).toBe('A');
            expect(Base62.encode(61)).toBe('Z');
        });

        it('encodes 62-(62*62-1=3843) numbers as two letter string', () => {
            expect(Base62.encode(62)).toBe('10');
            expect(Base62.encode(63)).toBe('11');
            expect(Base62.encode(3843)).toBe('ZZ');
        });

        it('encodes 3844-(62^3-1=238327) numbers as 3 letter string', () => {
            expect(Base62.encode(3844)).toBe('100');
            expect(Base62.encode(238327)).toBe('ZZZ');
        });

        it('encodes 64 bit numbers as 11 digit value', () => {
            // 2**63 => min 64 bit number
            expect(Base62.encode(9223372036854775808n).length).toBe(11);
            // 2**64-1 => max 64 bit number
            expect(Base62.encode(18446744073709551615n).length).toBe(11);
        });
    });

    describe('decode(number)', () => {
        it('decodes single char string', () => {
            expect(Base62.decode('0')).toEqual(0n);
            expect(Base62.decode('1')).toEqual(1n);
            expect(Base62.decode('a')).toEqual(10n);
            expect(Base62.decode('A')).toEqual(36n);
            expect(Base62.decode('Z')).toEqual(61n);
        });

        it('decodes complicated strings', () => {
            expect(Base62.decode('100')).toEqual(3844n);
            expect(Base62.decode('ZZZ')).toEqual(238327n);
            expect(Base62.decode('aZl8N0y58M7')).toEqual(9223372036854775807n);
            expect(Base62.decode('lYGhA16ahyf')).toEqual(18446744073709551615n);
        });
    });
});
