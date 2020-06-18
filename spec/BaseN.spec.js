const BaseN = require('../src/BaseN');

describe('BaseN', () => {
    describe('ALPHABET', () => {
        it('it provides [0-9A-Z] alphabet as an example', () => {
            expect(BaseN.ALPHABET).toMatch(/[0-9A-Z]{36}/);
        });
    });
});
