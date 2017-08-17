const {expect} = require('chai');
const admin = require('../../server/admin');

describe('admin', () => {

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