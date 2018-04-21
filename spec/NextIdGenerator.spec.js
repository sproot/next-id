const Long = require('long');
const EPOCH = require('../config/epoch');
const { getTimestamp, getShardId, getLastTenBits } = require('./support/helpers');

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
      generator.generateId();
      expect(generator.sequence).toBe(1);
      generator.generateId();
      expect(generator.sequence).toBe(2);
    });
  });

  describe('generateId()', () => {
    it ('holds time since epoch in milliseconds as first 41 bits', () => {
      expect(
        getTimestamp(generator.generateId())
      ).toEqual(
        timeNow.getTime() - EPOCH
      );
    });

    it('uses next 13 bits for shardId giving 8191 possible shards', () => {
      generator.setShardId(8191);
      expect(getShardId(generator.generateId())).toEqual(8191);

      generator.setShardId(13);
      expect(getShardId(generator.generateId())).toEqual(13);
    });

    it('uses last 10 bits as sequential counter', () => {
      const lastBits = getLastTenBits(generator.generateId());
      expect(lastBits).toBeGreaterThan(-1);
      expect(lastBits).toBeLessThan(1024);
    });
  });
});
