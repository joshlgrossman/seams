const {describe, it, before} = require('mocha');
const {expect} = require('chai');
const cache = require('../../server/cache');

describe('server/cache', () => {

  let _cache, content, expire;

  before(() => {
    expire = 10;
    _cache = cache(expire);
    content = {
      'test 1': {value: 'hello'},
      'test 2': {value: 'world'}
    };
  });

  it('should cache', () => {
    for(const key in content) {
      const obj = content[key];
      expect(_cache(key)).to.not.be.ok;
      _cache(key, obj);
      expect(_cache(key)).to.include({value: obj.value});
    }
  });

  it('should expire', done => {
    const key = 'hello';
    const obj = {value: 'world'};
    expect(_cache(key)).to.not.be.ok;
    _cache(key, obj);
    expect(_cache(key)).to.include({value: obj.value});
    setTimeout(() => {
      expect(_cache(key)).to.not.be.ok;
      done();
    }, expire);
  });

});