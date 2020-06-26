const Pseudo = require('../src/Pseudo');

describe('Pseudo', () => {
    describe('static encrypt(number)', () => {
        it('implements 64bit numbers Feistel algorithm  ', () => {
            expect(Pseudo.encrypt(1)).toBe(2652534423816930296n);
            expect(Pseudo.encrypt(2)).toBe(667412736878761070n);
            expect(Pseudo.encrypt(3)).toBe(1324215868541576419n);
            expect(Pseudo.encrypt(4)).toBe(4491277083411598576n);
            expect(Pseudo.encrypt(5)).toBe(174934417645116781n);
            expect(Pseudo.encrypt(6)).toBe(4125364355537137114n);
            expect(Pseudo.encrypt(7)).toBe(2253238117080874568n);
        });

        it('takes BigInt values as an argument', () => {
            expect(Pseudo.encrypt(2835217030863818694n)).toBe(44528873266082996n);
            expect(Pseudo.encrypt(1061193016228543981n)).toBe(876685637073655892n);
            expect(Pseudo.encrypt(106233016228543981n)).toBe(3575034868883328731n);
        });

        it('takes String as an argument as well', () => {
            expect(Pseudo.encrypt('1')).toBe(2652534423816930296n);
            expect(Pseudo.encrypt('2')).toBe(667412736878761070n);
        });
    });

    describe('static decrypt(number)', () => {
        it('is self reversible', () => {
            expect(Pseudo.decrypt(Pseudo.encrypt(1))).toBe(1n);
            expect(Pseudo.decrypt(Pseudo.encrypt(2))).toBe(2n);
            expect(Pseudo.decrypt(Pseudo.encrypt(3))).toBe(3n);
            expect(
                Pseudo.decrypt(Pseudo.encrypt(2835217030863818694n))
            ).toBe(2835217030863818694n);
            expect(
                Pseudo.decrypt(Pseudo.encrypt(876685637073655892n))
            ).toBe(876685637073655892n);
        });
    });
});
