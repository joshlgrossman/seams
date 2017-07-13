const {bind, $, ajax, CLASSNAME} = require('./util');
const BasicEditor = require('./BasicEditor');

class Panel {

  constructor() {
    this.loaded = false;
    this.container = $('<div>', {className: CLASSNAME});
    this.content = $('<div>', {className: CLASSNAME+'-content'});

    const buttons = $('<div>', {className: CLASSNAME+'-btns'});
    this.saveBtn = $('<button>', {className: CLASSNAME+'-save-btn', text: 'save'});
    this.cancelBtn = $('<button>', {className: CLASSNAME+'-cancel-btn', text: 'cancel'});
    this.saveBtn.addEventListener('click', this.save.bind(this));
    this.cancelBtn.addEventListener('click', this.cancel.bind(this));
    buttons.appendChild(this.cancelBtn);
    buttons.appendChild(this.saveBtn);

    this.container.appendChild(this.content);
    this.container.appendChild(buttons);
  }

  show(el, directives) {
    if(!this.loaded) {
      document.body.appendChild(this.container);
      this.loaded = true;
    }

    this.content.innerHTML = '';
    this.previous = {};
    this.mapping = {};
    this.element = el;

    directives.forEach(directive => {
      let editor;

      switch(directive) {
        default: editor = new BasicEditor(el, directive);
      }

      this.previous[directive] = editor.binding();
      this.mapping[directive] = el.dataset[directive];

      this.content.appendChild(editor.render());

    });

    this.container.style = 'display:block';
  }

  hide() {
    this.container.style = 'display:none';
  }

  save() {
    const params = {};

    for(const directive in this.mapping) {
      const content = this.mapping[directive];
      params[content] = bind(this.element, directive)();
    }

    ajax(window.location.pathname, params)
    this.hide();
  }

  cancel() {
    for(const directive in this.previous) {
      bind(this.element, directive)(this.previous[directive]);
    }
    this.hide();
  }

}

module.exports = Panel;