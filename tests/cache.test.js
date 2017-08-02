const {expect} = require('chai');
const cache = require('../server/cache');

describe('cache', () => {
  const _cache = cache(100000);
  const content = {
    'test 1': {value: 'hello'},
    'test 2': {value: 'world'}
  };

  for(const key in content) {
    const {value} = content[key];

    it(`${key} should not be cached`, () => {
      expect(_cache(key)).to.not.be.ok;
      _cache(key, value);
    });

  }

});