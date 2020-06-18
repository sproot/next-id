const Pseudo = require('../src/Pseudo');

describe('Pseudo', () => {
    describe('static encrypt(number)', () => {
        it('implements 64bit numbers Feistel algorithm  ', () => {
            expect(Pseudo.encrypt(1).toString()).toBe('2652534423816930296');
            expect(Pseudo.encrypt(2).toString()).toBe('667412736878761070');
            expect(Pseudo.encrypt(3).toString()).toBe('1324215868541576419');
            expect(Pseudo.encrypt(4).toString()).toBe('4491277083411598576');
            expect(Pseudo.encrypt(5).toString()).toBe('174934417645116781');
            expect(Pseudo.encrypt(6).toString()).toBe('4125364355537137114');
            expect(Pseudo.encrypt(7).toString()).toBe('2253238117080874568');
            expect(
                Pseudo.encrypt('2835217030863818694').toString()
            ).toBe('44528873266082996');
            expect(
                Pseudo.encrypt('1061193016228543981').toString()
            ).toBe('876685637073655892');
            expect(
                Pseudo.encrypt('106233016228543981').toString()
            ).toBe('3575034868883328731');
        });
    });

    describe('static decrypt(number)', () => {
        it('is self reversible', () => {
            expect(Pseudo.decrypt(Pseudo.encrypt(1)).toNumber()).toBe(1);
            expect(Pseudo.decrypt(Pseudo.encrypt(2)).toNumber()).toBe(2);
            expect(Pseudo.decrypt(Pseudo.encrypt(3)).toNumber()).toBe(3);
            expect(
                Pseudo.decrypt(Pseudo.encrypt('2835217030863818694')).toString()
            ).toBe('2835217030863818694');
            expect(
                Pseudo.decrypt(Pseudo.encrypt('876685637073655892')).toString()
            ).toBe('876685637073655892');
        });
    });
});
