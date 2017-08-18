const {describe, it} = require('mocha');
const {expect} = require('chai');
const cache = require('../../server/cache');

describe('server/cache', () => {

  let _cache, content;

  before(() => {
    _cache = cache(100000);
    content = {
      'test 1': {value: 'hello'},
      'test 2': {value: 'world'}
    };
  });

  for(const key in content) {
    const {value} = content[key];

    it(`${key} should cache properly`, () => {
      expect(_cache(key)).to.not.be.ok;
      _cache(key, value);
      expect(_cache(key)).to.equal(value);
    });

  }

});