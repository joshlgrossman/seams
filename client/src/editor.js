const {$, ajax} = require('./util');

const CLASSNAME = 'seams-admin-panel';

class Editor {

  constructor() {
    this.loaded = false;
    this.panel = $('<div>', {className: CLASSNAME});
    this.content = $('<div>', {className: CLASSNAME+'-content'});

    const buttons = $('<div>', {className: CLASSNAME+'-btns'});
    this.saveBtn = $('<button>', {className: CLASSNAME+'-save-btn', text: 'save'});
    this.cancelBtn = $('<button>', {className: CLASSNAME+'-cancel-btn', text: 'cancel'});
    buttons.appendChild(this.cancelBtn);
    buttons.appendChild(this.saveBtn);

    this.panel.appendChild(this.content);
    this.panel.appendChild(buttons);
  }

  show() {
    if(!this.loaded) {
      document.body.appendChild(this.panel);
      this.loaded = true;
    }

    this.panel.style = 'display:block';
  }

  hide() {
    this.panel.style = 'display:none';
  }

  save() {

  }

  cancel() {

  }


}

module.exports = Editor;