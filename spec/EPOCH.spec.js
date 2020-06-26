const EPOCH = require('../config/EPOCH');

describe('EPOCH', () => {
    it('must be set to Sep 8 2017 10:30 GMT+0300 in milliseconds', () => {
        expect(EPOCH).toEqual(
            new Date('Sep 8 2017 10:30 GMT+0300').getTime()
        );
    });
});
