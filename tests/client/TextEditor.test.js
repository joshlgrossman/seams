const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const TextEditor = require('../../client/src/js/TextEditor');

describe('client/TextEditor', () => {

  const markdown = {
    heading: ['##test#', '<h2>test</h2>'],
    italic: ['_test_', '<em>test</em>'],
    bold: ['*test*', '<strong>test</strong>'],
    link: ['[test](url)', '<a href="url">test</a>'],
    monospace: ['`test`', '<code>test</code>'],
    linebreak: ['test\n\nnewline', 'test<br>newline'],
    image: ['![test](url)', '<img src="url" alt="test">'],
    complex: [
      '![test](img)\n\n###_*test [link](url)*_#',
      '<img src="img" alt="test"><br><h3><em><strong>test <a href="url">link</a></strong></em></h3>'
    ]
  };

  let editor;

  beforeEach(() => {
    editor = new TextEditor({}, '');
  });

  describe('#eval', () => {

    for (const key in markdown) {
      const [md, mu] = markdown[key];
      it(`should parse ${key} markdown into markup`, () => {
        expect(editor.eval(md)).to.equal(mu);
      });
    }

  });

  describe('#uneval', () => {

    for (const key in markdown) {
      const [md, mu] = markdown[key];
      it(`should parse ${key} markup into markdown`, () => {
        expect(editor.uneval(mu)).to.equal(md);
      });
    }

  });

});