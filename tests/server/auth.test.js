const {expect} = require('chai');
const auth = require('../../server/auth');

describe('auth', () => {
  const json = {this: 'is', a: 'test'};
  const encoded = 'eyJ0aGlzIjoiaXMiLCJhIjoidGVzdCJ9';

  describe('#base64Encode', () => {

    it(`should return "${encoded}"`, () => {
      expect(auth.base64Encode(json)).to.equal(encoded);
    });

  });

  describe('#base64Decode', () => {

    it(`should return {this: "is", a: "test"}`, () => {
      expect(auth.base64Decode(encoded)).to.include(json);
    });

  });

});