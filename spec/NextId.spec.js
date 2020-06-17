const NextIdGenerator = require('../src/NextIdGenerator');
const NextId = require('../src/NextId');

describe('NextId', () => {
    const ID = '4NDOQTdcN2c';
    const ALPHANUMERIC_ID = '18NFJ40799O2';
    const NUMBER_ID = '163250664653193266';
    const PSEUDO_ID = '4029209053283093212';

    function assertValidID(id) {
        expect(id.id).toEqual(ID);
        expect(id.numericId).toEqual(NUMBER_ID);
        expect(id.pseudoId).toEqual(PSEUDO_ID);
        expect(id.alphanumericId).toEqual(ALPHANUMERIC_ID);
    }

    it('recognizes number id', () => {
        assertValidID(new NextId(NUMBER_ID));
    });

    it('recognizes base62 encoded id', () => {
        assertValidID(new NextId(ID));
    });

    it('recognizes base36 encoded id', () => {
        assertValidID(new NextId(ALPHANUMERIC_ID));
    });

    describe('information extraction', () => {
        const timeNow = new Date();

        beforeEach(() => {
            jasmine.clock().install();
            jasmine.clock().mockDate(timeNow);
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it('extracts shardId form id value', () => {
            let numericId = new NextIdGenerator().setShardId(128).generateNumericId();
            expect(new NextId(numericId).shardId).toBe(128);

            numericId = new NextIdGenerator().setShardId(345).generateNumericId();
            expect(new NextId(numericId).shardId).toBe(345);

            numericId = new NextIdGenerator().setShardId(2455).generateNumericId();
            expect(new NextId(numericId).shardId).toBe(2455);
        });

        it('extracts issuedAt form id value', () => {
            const numericId = new NextIdGenerator().generateNumericId();
            expect(
                new NextId(numericId).issuedAt.toISOString()
            ).toBe(timeNow.toISOString());
        });
    });

    describe('toString()', () => {
        it('it return id value', () => {
            const id = new NextId(ID);
            expect(id.toString()).toBe(id.id);
        });
    });
});
