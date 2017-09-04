const {describe, it, beforeEach, afterEach, before, after} = require('mocha');
const {expect} = require('chai');
const createDom = require('jsdom-global');
const {$, bind, undef, string, object} = require('../../client/src/js/util');

describe('client/util', () => {

  let destroyDom, el;

  before(() => {
    destroyDom = createDom();
  });

  after(() => {
    destroyDom();
  });

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  describe('#$', () => {

    describe('string', () => {

      it('should select the element', () => {
        expect($('div')[0]).to.equal(el);
      });

      it('should create an element', () => {
        expect($('<div>')).to.be.an.instanceOf(HTMLElement);
      });

    });

    describe('HTMLElement', () => {

      beforeEach(() => {
        el.className = 'first-class';
        el.style = '';
      });

      it('should add a class', () => {
        $(el, '.second-class', true);
        expect(el.className).to.equal('first-class second-class');
      });

      it('should remove a class', () => {
        $(el, '.first-class', false);
        expect(el.className).to.equal('');
      });

      it('should change style', () => {
        const style = {
          display: 'block',
          color: 'red'
        };
        $(el, style);
        const computed = window.getComputedStyle(el, null);
        expect(computed.getPropertyValue('display')).to.equal('block');
        expect(computed.getPropertyValue('color')).to.equal('red');
      });

    });

  });

  describe('#bind', () => {

    let binding;

    describe('content', () => {

      beforeEach(() => {
        binding = bind(el, 'content');
        el.innerHTML = 'test';
      });

      it('should set innerHTML', () => {
        binding('hello world');
        expect(el.innerHTML).to.equal('hello world');
      });

      it('should get the innerHTML', () => {
        expect(binding()).to.equal('test');
      });

    });

    describe('src', () => {

      beforeEach(() => {
        binding = bind(el, 'src');
        el.setAttribute('src', 'test');
      });

      it('should set the src', () => {
        binding('hello world');
        expect(el.getAttribute('src')).to.equal('hello world');
      });

      it('should get the src', () => {
        expect(binding()).to.equal('test');
      });

    });

  });

  describe('#undef', () => {

    it('should return true when undefined', () => {
      expect(undef()).to.be.true;
    });

    it('should return false when not undefined', () => {
      expect(undef(0)).to.be.false;
    });

  });

  describe('#string', () => {

    it('should return true when string', () => {
      expect(string('')).to.be.true;
    });

    it('should return false when not a string', () => {
      expect(string(0)).to.be.false;
    });

  });

  describe('#object', () => {

    it('should return true when object', () => {
      expect(object({})).to.be.true;
    });

    it('should return false when not an object', () => {
      expect(object(0)).to.be.false;
    });

  });

});