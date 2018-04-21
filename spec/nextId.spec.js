const Long = require('long');
const NextId = require('../src/NextId');

describe('NextId', () => {
  const timeNow = new Date();
  const ID = '4NDOQTdcN2c';
  const NUMBER_ID = Long.fromString('163250664653193266', true);
  const PSEUDO_ID = Long.fromString('4029209053283093212', true);
  let id;

  beforeEach(() => {
    const generator = jasmine.createSpyObj(
      'NextIdGenerator', ['generateId', 'inspectId']
    );
    NextId.setGenerator(generator);
    generator.generateId.and.returnValue(NUMBER_ID);
    generator.inspectId.and.returnValue({
      shardId: 'SHARD_ID',
      issuedAt: 'ISSUED_AT'
    });
    id = new NextId();
  });

  describe('setGenerator(generator)', () => {
    it('sets generator for to create new instances', () => {
      NextId.setGenerator('GENERATOR');
      expect(NextId.generator).toEqual('GENERATOR');
    });
  });

  describe('constructor()', () => {
    it('assigns numberId as a result from generator call', () => {
      expect(id.numberId).toEqual(NUMBER_ID);
    });

    it('assigns pseudoId property as Pseudo encrypted string', () => {
      expect(id.pseudoId).toEqual(PSEUDO_ID);
    });

    it('assigns id property as Base62 encoded Pseudo encrypted id', () => {
      expect(id.id).toEqual(ID);
    });

    it('assigns shardId property', () => {
      expect(id.shardId).toBe('SHARD_ID');
    });

    it('assigns issuedAt property', () => {
      expect(id.issuedAt).toBe('ISSUED_AT');
    });
  });

  describe('toString()', () => {
    it('it return id value', () => {
      expect(id.toString()).toBe(id.id);
    });
  });
});
