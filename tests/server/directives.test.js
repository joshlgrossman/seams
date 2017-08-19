const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const cheerio = require('cheerio');
const directives = require('../../server/directives');

describe('server/directives', () => {

  let $, $div;

  beforeEach(() => {
    $ = cheerio.load(`<html><head></head><body><div></div></body></html>`);
    $div = $('div');
  });

  describe('#content', () => {

    it('should set innerHTML to "hello world"', () => {
      directives.content($div, 'hello world');
      expect($div.html()).to.equal('hello world');
    });

  });

  describe('#text', () => {

    it('should set innerText to "hello world"', () => {
      directives.text($div, 'hello world');
      expect($div.text()).to.equal('hello world');
    });

  });

  describe('#src', () => {

    it('should set src to "/test.jpg"', () => {
      directives.src($div, '/test.jpg');
      expect($div.attr('src')).to.equal('/test.jpg');
    });

  });

  describe('#href', () => {

    it('should set href to "/test.html"', () => {
      directives.href($div, '/test.html');
      expect($div.attr('href')).to.equal('/test.html');
    });

  });

});