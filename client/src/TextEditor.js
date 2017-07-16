const {$} = require('./util');
const Editor = require('./Editor');

class TextEditor extends Editor {

  constructor(element, property) {
    super(element, property);
    this.text = '';
  }

  render() {
    const ta = $('<textarea>', {
      value: this.binding()
    });

    this.text = this.binding();

    ta.addEventListener('input', e => {
      this.binding(ta.value);
    });

    return ta;
  }

}

module.exports = TextEditor;