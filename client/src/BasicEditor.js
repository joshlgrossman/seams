const {bind, $, CLASSNAME} = require('./util');
const Editor = require('./Editor');

class BasicEditor extends Editor {

  constructor(element, property) {
    super(element, property);
  }

  render() {
    const input = $('<input>', {
      class: CLASSNAME + '-input',
      type: 'text'
    });

    input.value = this.binding();

    input.addEventListener('input', () => {
      this.binding(input.value);
    });

    return input;
  }

}

module.exports = BasicEditor;