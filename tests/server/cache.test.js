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

  it('should cache properly', () => {
    for(const key in content) {
      const obj = content[key];
      expect(_cache(key)).to.not.be.ok;
      _cache(key, obj);
      expect(_cache(key)).to.include({
        value: obj.value
      });
    }
  });

});