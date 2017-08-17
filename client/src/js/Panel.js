const {bind, $, P, http, CLASSNAME} = require('./util');
const BasicEditor = require('./BasicEditor');
const TextEditor = require('./TextEditor');
const Prompt = require('./Prompt');

class Panel {

  constructor() {
    this.prompt = new Prompt();
    this.side = 1;
    this.loaded = false;
    this.visible = false;
    this.editors = [];
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

    if(this.visible) return;
    
    this.position(side);
    this.editors = [];

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

      this.editors.push(editor);
      this.previous[directive] = editor.binding();
      this.mapping[directive] = el.dataset[directive];

      const id = CLASSNAME + '-editor' + i;
      const input = editor.render();
      const label = $('<label>', {'for': id, innerText: directive});
      input.setAttribute('id', id);

      const container = $('<div>', {class: CLASSNAME + '-editor'});
      container.appendChild(label);
      container.appendChild(input);

      this.visible = true;
      this.content.appendChild(container);

    });

    $(this.container, {display: 'block'});
  }

  hide() {
    this.visible = false;
    $(this.container, {display: 'none'});
  }

  stale() {
    return this.editors.some(editor => editor.stale);
  }

  save() {
    if(this.stale()) {

      const promise = new P();

      this.prompt
      .show({
        title: 'Save',
        message: 'Are you sure you would like to save your changes?',
        yes: 'save changes',
        no: 'continue editing'
      })
      .then(() => {
        const params = {};

        for(const directive in this.mapping) {
          const content = this.mapping[directive];
          params[content] = bind(this.element, directive)();
        }

        http.put(window.location.pathname, params)
        this.hide();
        promise.resolve();
      }).catch(() => promise.reject());

      return promise;

    } else {
      this.hide();
      return P.reject();
    }
  }

  cancel() {
    if(this.stale()) {

      const promise = new P();

      this.prompt
      .show({
        title: 'Cancel',
        message: 'Are you sure you would like to cancel? You will lose any unsaved changes.',
        yes: 'revert changes',
        no: 'continue editing'
      })
      .then(() => {
        for(const directive in this.previous) {
          bind(this.element, directive)(this.previous[directive]);
        }
        this.hide();
        promise.resolve();
      }).catch(() => promise.reject());

      return promise;

    } else {
      this.hide();
      return P.reject();
    }

  }

}

module.exports = Panel;