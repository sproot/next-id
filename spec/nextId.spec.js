const Long = require('long');

const NextIdGenerator = require('../src/NextIdGenerator');
const NextId = require('../src/NextId');

describe('NextId', () => {
    const ID = '4NDOQTdcN2c';
    const ALPHANUM = '18NFJ40799O2';
    const NUMBER_ID = Long.fromString('163250664653193266', true);
    const PSEUDO_ID = Long.fromString('4029209053283093212', true);

    function assertValidID(id) {
        expect(id.id).toEqual(ID);
        expect(id.numberId).toEqual(NUMBER_ID);
        expect(id.pseudoId).toEqual(PSEUDO_ID);
        expect(id.alphanum).toEqual(ALPHANUM);
    }

    it('recognizes number id', () => {
        assertValidID(new NextId(NUMBER_ID));
    });

    it('recognizes base62 encoded id', () => {
        assertValidID(new NextId(ID));
    });

    it('recognizes base36 encoded id', () => {
        assertValidID(new NextId(ALPHANUM));
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
            let numberId = new NextIdGenerator().setShardId(128).generateId();
            expect(new NextId(numberId).shardId).toBe(128);

            numberId = new NextIdGenerator().setShardId(345).generateId();
            expect(new NextId(numberId).shardId).toBe(345);

            numberId = new NextIdGenerator().setShardId(2455).generateId();
            expect(new NextId(numberId).shardId).toBe(2455);
        });

        it('extracts issuedAt form id value', () => {
            const numberId = new NextIdGenerator().generateId();
            expect(
                new NextId(numberId).issuedAt.toISOString()
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
