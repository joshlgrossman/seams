const {bind, $, ajax, CLASSNAME} = require('./util');
const BasicEditor = require('./BasicEditor');

class Panel {

  constructor() {
    this.loaded = false;
    this.container = $('<div>', {class: CLASSNAME});
    this.content = $('<div>', {class: CLASSNAME+'-content'});

    const buttons = $('<div>', {class: CLASSNAME+'-btns'});
    this.saveBtn = $('<button>', {class: CLASSNAME+'-save-btn', innerText: 'save'});
    this.cancelBtn = $('<button>', {class: CLASSNAME+'-cancel-btn', innerText: 'cancel'});
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

    directives.forEach((directive, i) => {
      let editor;

      switch(directive) {
        default: editor = new BasicEditor(el, directive);
      }

      this.previous[directive] = editor.binding();
      this.mapping[directive] = el.dataset[directive];

      const id = CLASSNAME + '-editor' + i;
      const input = editor.render();
      const label = $('<label>', {'for': id, innerText: directive});
      input.setAttribute('id', id);

      const container = $('<div>', {class: CLASSNAME + '-editor'});
      container.appendChild(label);
      container.appendChild(input);

      this.content.appendChild(container);

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