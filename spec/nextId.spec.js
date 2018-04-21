const NextIdGenerator = require('../src/NextIdGenerator');

class NextId {
  static setGenerator(generator) {
    this.generator = generator;
  }

  constructor() {
    NextId.generator.generateId('base62')

    this.id = NextId.generator.generateId('base62');
  }

  toString() {
    return this.value;
  }
}

describe('NextId', () => {

  describe('setGenerator(generator)', () => {
    it('sets generator for to create new instances', () => {
      NextId.setGenerator('GENERATOR');
      expect(NextId.generator).toEqual('GENERATOR');
    });
  });

  describe('Configured class', () => {
    let generator;

    beforeEach(() => {
      generator = jasmine.createSpyObj('NextIdGenerator', ['generateId']);
      NextId.setGenerator(generator);
    });

    xit('generates base62 encoded id by default', () => {
      const id = new NextId();

      generator.generateId.and.callFake((type) => {
        switch(type) {
          case 'base62': return 'BASE_62_ID';
          case 'number': return 'NUMBER_ID';
        }
      });

      // expect(generator.generateId).toHaveBeenCalledWith('base62');
      expect(id.id).toBe('BASE_62_ID');
    });


  });



});
