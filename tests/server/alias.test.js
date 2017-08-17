const {expect} = require('chai');
const alias = require('../../server/alias');

describe('alias', () => {

  const urls = {
    '/': {
      url: '/index.html',
      fileType: '.html',
      adminFile: false,
      protectedFile: false
    },
    '/test': {
      url: '/test.html',
      fileType: '.html',
      adminFile: false,
      protectedFile: false
    },
    '/test/': {
      url: '/test/index.html',
      fileType: '.html',
      adminFile: false,
      protectedFile: false
    },
    '/test/hello': {
      url: '/test/hello.html',
      fileType: '.html',
      adminFile: false,
      protectedFile: false
    },
    '/test-script.js': {
      url: '/test-script.js',
      fileType: '.js',
      adminFile: false,
      protectedFile: false
    },
    '/seams': {
      url: '/seams.html',
      fileType: '.html',
      adminFile: true,
      protectedFile: false
    },
    '/seams.ui.css': {
      url: '/seams.ui.css',
      fileType: '.css',
      adminFile: true,
      protectedFile: true
    }
  };

  for(const key in urls) {

    const {url, fileType, adminFile, protectedFile} = urls[key];
    const result = alias(key);

    describe(key, () => {
      it(`should resolve to ${url}`, () => {
        expect(result.url).to.equal(url);
      });

      it(`should be a *${fileType} file`, () => {
        expect(result.fileType).to.equal(fileType);
      });

      it(`should ${!adminFile?'not ':''}be an admin file`, () => {
        expect(result.adminFile).to.equal(adminFile);
      });

      it(`should ${!protectedFile?'not ':''}be a protected file`, () => {
        expect(result.protectedFile).to.equal(protectedFile);
      });
    });

  }

});