const Long = require('long');
const NextId = require('../src/NextId');

describe('nextId', () => {
  const timeNow = new Date();
  let nextId;

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(timeNow);
    nextId = new NextId();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('sets epoch to Sep 8 2017 10:30 GMT+0300 in milliseconds', () => {
    expect(NextId.EPOCH).toEqual(
      new Date('Sep 8 2017 10:30 GMT+0300').getTime()
    );
  });

  describe('setShardId', () => {
    it('sets to zero as a default', () => {
      expect(nextId.shardId).toBe(0);
    });

    it('sets the shardId', () => {
      expect(nextId.setShardId(1)).toBe(nextId);
      expect(nextId.shardId).toEqual(1);
    });

    describe('throws an Error exception', () => {
      it('when value is not integer', () => {
        expect(() => nextId.setShardId('String')).toThrowError(TypeError);
        expect(() => nextId.setShardId({})).toThrowError(TypeError);
        expect(() => nextId.setShardId([])).toThrowError(TypeError);
        expect(() => nextId.setShardId(null)).toThrowError(TypeError);
      });

      it('when value undeflows 1', () => {
        expect(() => nextId.setShardId(0)).toThrowError(RangeError);
      });

      it('when value overflows 8191', () => {
        expect(() => nextId.setShardId(8192)).toThrowError(RangeError);
      });
    });
  });

  describe('sequence', () => {
    it('is 0 by default', () => {
      expect(nextId.sequence).toEqual(0);
    });

    it('gets incremented by each nextId() call', () => {
      nextId.instId();
      expect(nextId.sequence).toBe(1);
      nextId.instId();
      expect(nextId.sequence).toBe(2);
    });
  });

  describe('instId()', () => {
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
        nextId.instId().shiftRight(timeShift).toNumber()
      ).toEqual(
        timeNow.getTime() - NextId.EPOCH
      );
    });

    it('uses next 13 bits for shardId giving 8191 possible shards', () => {
      nextId.setShardId(8191);
      expect(getShardId(nextId.instId())).toEqual(8191);

      nextId.setShardId(13);
      expect(getShardId(nextId.instId())).toEqual(13);
    });

    it('uses last 10 bits as sequential counter', () => {
      const lastBits = getLastTenBits(nextId.instId());
      expect(lastBits).toBeGreaterThan(-1);
      expect(lastBits).toBeLessThan(1024);
    });
  });

  describe('pseudoEncrypt(number)', () => {
    it('implements 64bit numbers Feistel algorithm  ', () => {
      expect(
        nextId.pseudoEncrypt(Long.fromNumber(1)).toString()
      ).toBe('2652534423816930296');
      expect(
        nextId.pseudoEncrypt(Long.fromNumber(2)).toString()
      ).toBe('667412736878761070');
      expect(
        nextId.pseudoEncrypt(Long.fromNumber(3)).toString()
      ).toBe('1324215868541576419');
      expect(
        nextId.pseudoEncrypt(Long.fromNumber(4)).toString()
      ).toBe('4491277083411598576');
      expect(
        nextId.pseudoEncrypt(Long.fromNumber(5)).toString()
      ).toBe('174934417645116781');
      expect(
        nextId.pseudoEncrypt(Long.fromNumber(6)).toString()
      ).toBe('4125364355537137114');
      expect(
        nextId.pseudoEncrypt(Long.fromNumber(7)).toString()
      ).toBe('2253238117080874568');
      expect(
        nextId.pseudoEncrypt(Long.fromString('2835217030863818694')).toString()
      ).toBe('44528873266082996');
      expect(
        nextId.pseudoEncrypt(Long.fromString('1061193016228543981')).toString()
      ).toBe('876685637073655892');
      expect(
        nextId.pseudoEncrypt(Long.fromString('106233016228543981')).toString()
      ).toBe('3575034868883328731');
    });

    it('is self revertable', () => {
      expect(
        nextId.pseudoEncrypt(nextId.pseudoEncrypt(Long.fromNumber(1))).toNumber()
      ).toBe(1);
      expect(
        nextId.pseudoEncrypt(nextId.pseudoEncrypt(Long.fromNumber(2))).toNumber()
      ).toBe(2);
      expect(
        nextId.pseudoEncrypt(nextId.pseudoEncrypt(Long.fromNumber(3))).toNumber()
      ).toBe(3);
      expect(
        nextId.pseudoEncrypt(
          nextId.pseudoEncrypt(Long.fromString('2835217030863818694'))
        ).toString()
      ).toBe('2835217030863818694');
      expect(
        nextId.pseudoEncrypt(
          nextId.pseudoEncrypt(Long.fromString('876685637073655892'))
        ).toString()
      ).toBe('876685637073655892');
    });
  });

  describe('nextId(number)', () => {
    it('returns uniq id as Long number', () => {
      spyOn(nextId, 'pseudoEncrypt').and.returnValue('PSEUDO_NUMBER');
      spyOn(nextId, 'instId').and.returnValue('INST_ID');

      const id = nextId.nextId('number');

      expect(nextId.pseudoEncrypt).toHaveBeenCalledWith('INST_ID');
      expect(id).toBe('PSEUDO_NUMBER');
    });
  });
});
