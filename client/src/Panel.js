const {bind, $, http, CLASSNAME} = require('./util');
const BasicEditor = require('./BasicEditor');
const TextEditor = require('./TextEditor');

class Panel {

  constructor() {
    this.side = 1;
    this.loaded = false;
    this.container = $('<div>', {id: CLASSNAME, class: CLASSNAME + this.side});
    this.content = $('<div>', {class: CLASSNAME+'-content'});

    const buttons = $('<div>', {class: CLASSNAME+'-btns'});
    this.saveBtn = $('<button>', {class: CLASSNAME+'-save-btn', innerText: 'save'});
    this.cancelBtn = $('<button>', {class: CLASSNAME+'-cancel-btn', innerText: 'cancel'});
    this.saveBtn.addEventListener('click', this.save.bind(this));
    this.cancelBtn.addEventListener('click', this.cancel.bind(this));
    buttons.appendChild(this.cancelBtn);
    buttons.appendChild(this.saveBtn);

    const sidebar = $('<div>', {class: CLASSNAME+'-sidebar'});
    sidebar.addEventListener('click', () => this.position(!this.side));

    this.container.appendChild(sidebar);
    this.container.appendChild(this.content);
    this.container.appendChild(buttons);
  }

  position(side) {
    this.side = side;
    this.container.className = `${CLASSNAME}-${
      this.side ? 'right' : 'left'
    }`;
  }

  show(el, directives, side) {
    if(!this.loaded) {
      document.body.appendChild(this.container);
      this.loaded = true;
    }
    
    this.position(side);

    this.content.innerHTML = '';
    this.previous = {};
    this.mapping = {};
    this.element = el;

    directives.forEach((directive, i) => {
      let editor;

      switch(directive) {
        case 'content': editor = new TextEditor(el, directive); break;
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

    http.put(window.location.pathname, params)
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