const {$} = require('./util');
const Editor = require('./Editor');

const evals = {
  heading: /(#+)(.*?)#+/g,
  italic: /_(.+?)_/g,
  bold: /\*(.+?)\*/g,
  link: /([^!])\[(.+?)\]\((.+?)\)/g,
  monospace: /`(.+?)`/g,
  linebreak: /\n\n/g,
  image: /\!\[(.+?)\]\((.+?)\)/g
};

const unevals = {
  heading: /<h(\d)>(.*?)<\/h\d>/g,
  italic: /<em>(.*?)<\/em>/g,
  bold: /<strong>(.*?)<\/strong>/g,
  link: /<a href="([^"]*)">(.*?)<\/a>/g,
  monospace: /<code>(.*?)<\/code>/g,
  linebreak: /<br>/g,
  image: /<img src="([^"]*)" alt="([^"]*)">/g,
};

class TextEditor extends Editor {

  constructor(element, property) {
    super(element, property);
    this.text = '';
  }

  eval(str) {

    return str.replace(evals.italic, '<em>$1</em>')
      .replace(evals.bold, '<strong>$1</strong>')
      .replace(evals.link, '$1<a href="$3">$2</a>')
      .replace(evals.monospace, '<code>$1</code>')
      .replace(evals.linebreak, '<br>')
      .replace(evals.image, '<img src="$2" alt="$1">')
      .replace(evals.heading, (match, p1, p2) => {
        const num = p1.length;
        return `<h${num}>${p2}</h${num}>`;
      });

  }

  uneval(str) {

    return str.replace(unevals.italic, '_$1_')
      .replace(unevals.bold, '*$1*')
      .replace(unevals.link, '[$2]($1)')
      .replace(unevals.monospace, '`$1`')
      .replace(unevals.linebreak, '\n\n')
      .replace(unevals.image, '![$2]($1)')
      .replace(unevals.heading, (match, p1, p2) => {
        let num = +p1;
        let s = '';
        while(num-- > 0) s += '#';
        return `${s}${p2}#`;
      });

  }

  render() {
    const value = this.uneval(this.binding());
    const lines = value.split('\n') || [];
    const height = (1 + lines.length + lines.reduce((r,v) => r + (v.length/40)|0,0)) * 20;

    const ta = $('<textarea>', {
      value,
      style: `height:${height}px`
    });

    ta.addEventListener('input', e => {
      this.binding(this.eval(ta.value));
    });

    return ta;
  }

}

module.exports = TextEditor;