const Long = require('long');
const Base62 = require('../src/Base62');

const NextIdGenerator = require('../src/NextIdGenerator');

describe('NextIdGenerator', () => {
  const timeNow = new Date();
  let generator;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(timeNow);
    generator = new NextIdGenerator();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('EPOCH', () => {
    it('sets epoch to Sep 8 2017 10:30 GMT+0300 in milliseconds', () => {
      expect(NextIdGenerator.EPOCH).toEqual(
        new Date('Sep 8 2017 10:30 GMT+0300').getTime()
      );
    });
  });

  describe('static setShardId', () => {
    it('sets to zero as a default', () => {
      expect(generator.shardId).toBe(0);
    });

    it('sets the shardId', () => {
      expect(generator.setShardId(1)).toBe(generator);
      expect(generator.shardId).toEqual(1);
    });

    describe('throws an Error exception', () => {
      it('when value is not integer', () => {
        expect(() => generator.setShardId('String')).toThrowError(TypeError);
        expect(() => generator.setShardId({})).toThrowError(TypeError);
        expect(() => generator.setShardId([])).toThrowError(TypeError);
        expect(() => generator.setShardId(null)).toThrowError(TypeError);
      });

      it('when value undeflows 1', () => {
        expect(() => generator.setShardId(0)).toThrowError(RangeError);
      });

      it('when value overflows 8191', () => {
        expect(() => generator.setShardId(8192)).toThrowError(RangeError);
      });
    });
  });

  describe('sequence', () => {
    it('is 0 by default', () => {
      expect(generator.sequence).toEqual(0);
    });

    it('gets incremented by each nextId() call', () => {
      generator.generateNumberId();
      expect(generator.sequence).toBe(1);
      generator.generateNumberId();
      expect(generator.sequence).toBe(2);
    });
  });

  describe('generateNumberId()', () => {
    // 64 bits total, 41 occupied by timestamp
    const timeShift = 64-41;
    // last 10 bits used for counter value from 0 to 1023
    const countShift = 10;

    function getShardId(id) {
      return id.xor(
        id.shiftRight(timeShift).shiftLeft(timeShift)
      ).shiftRight(countShift).toNumber();
    }

    function getLastTenBits(id) {
      return id.and(Long.ONE.shiftLeft(countShift)-Long.ONE);
    }

    it ('holds time since epoch in milliseconds as first 41 bits', () => {
      expect(
        generator.generateNumberId().shiftRight(timeShift).toNumber()
      ).toEqual(
        timeNow.getTime() - NextIdGenerator.EPOCH
      );
    });

    it('uses next 13 bits for shardId giving 8191 possible shards', () => {
      generator.setShardId(8191);
      expect(getShardId(generator.generateNumberId())).toEqual(8191);

      generator.setShardId(13);
      expect(getShardId(generator.generateNumberId())).toEqual(13);
    });

    it('uses last 10 bits as sequential counter', () => {
      const lastBits = getLastTenBits(generator.generateNumberId());
      expect(lastBits).toBeGreaterThan(-1);
      expect(lastBits).toBeLessThan(1024);
    });
  });

  describe('nextId(type)', () => {
    beforeEach(() => {
      spyOn(generator, 'generateNumberId').and.returnValue('INST_ID');
      spyOn(generator, 'pseudoEncrypt').and.returnValue('PSEUDO_NUMBER');
    });

    it('nextId(number) returns uniq id as Long number', () => {
      const id = generator.generateId('number');
      expect(generator.pseudoEncrypt).toHaveBeenCalledWith('INST_ID');
      expect(id).toBe('PSEUDO_NUMBER');
    });

    describe('nextId(base62)', () => {
      beforeEach(() => {
        spyOn(Base62, 'encode').and.returnValue('BASE62_STRING');
      });

      it('returns uniq id as base62 encoded string', () => {
        const id = generator.generateId('base62');
        expect(Base62.encode).toHaveBeenCalledWith('PSEUDO_NUMBER');
        expect(id).toBe('BASE62_STRING');
      });
    });
  });

  describe('inspectId(id)', () => {
    it('retrieves usefull info from id', () => {
      generator.setShardId(133);
      expect(
        generator.inspectId(generator.generateId())
      ).toEqual({
        shardId: 133,
        timestamp: timeNow.getTime() - NextIdGenerator.EPOCH,
        createdAt: timeNow.getTime()
      });
    });

    it('retrieves usefull info from number id', () => {
      generator.setShardId(1221);
      expect(
        generator.inspectId(generator.generateId('number'))
      ).toEqual({
        shardId: 1221,
        timestamp: timeNow.getTime() - NextIdGenerator.EPOCH,
        createdAt: timeNow.getTime()
      });
    })
  });
});
