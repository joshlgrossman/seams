const {bind} = require('./util');

class Editor {

  constructor(element, property) {
    this.stale = false;
    this.element = element;
    this.property = property;
    this.binding = bind(element, property);
  }

}

module.exports = Editor;