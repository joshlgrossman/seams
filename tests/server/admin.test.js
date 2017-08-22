const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const admin = require('../../server/admin');

describe('server/admin', () => {

  function stub() {
    const stub = () => stub;
    stub.prepend = () => {
      stub.prepend.called = (stub.prepend.called|0) + 1;
      return stub;
    };
    stub.addClass = () => {
      stub.addClass.called = (stub.addClass.called|0) + 1;
      return stub;
    };
    return stub;
  }

  describe('#inject', () => {

    let $;

    beforeEach(() => {
      $ = stub();
    });

    it('should prepend scripts and add class', () => {
      admin.inject('test', $);
      expect($.prepend.called).to.equal(2);
      expect($.addClass.called).to.equal(1);
    });

  });

  describe('#cookie', () => {

    it('should return "seams-jwt"', () => {
      expect(admin.cookie()).to.equal('seams-jwt');
    });

    it('should return "test-key123"', () => {
      expect(admin.cookie('seams-jwt=test-key123')).to.equal('test-key123');
    });

    it('should not be ok', () => {
      expect(admin.cookie('seams-jwt=')).to.not.be.ok;
    });

  });

});