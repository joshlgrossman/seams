const {describe, it, beforeEach, afterEach, before, after} = require('mocha');
const {expect} = require('chai');
const createDom = require('jsdom-global');
const {$} = require('../../client/src/js/util');


describe('client/util', () => {

  let destroyDom;

  before(() => {
    destroyDom = createDom();
  });

  after(() => {
    destroyDom();
  });

  describe('#$', () => {

    let el;

    beforeEach(() => {
      el = document.createElement('div');
      document.body.appendChild(el);
    });

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

});