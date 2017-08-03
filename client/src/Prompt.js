const {$, P, CLASSNAME} = require('./util');

const PROMPT_CLASSNAME = CLASSNAME + '-prompt';

class Prompt {

  constructor() {
    this.loaded = false;
    this.promise = new P();
    this.wrapper = $('<div>', {id: PROMPT_CLASSNAME});
    this.container = $('<div>', {class: PROMPT_CLASSNAME + '-content'});
    this.title = $('<div>', {class: PROMPT_CLASSNAME + '-title'});
    this.message = $('<div>', {class: PROMPT_CLASSNAME + '-message'});

    const buttons = $('<div>', {class: PROMPT_CLASSNAME + '-btns'});
    this.yesBtn = $('<button>', {class: PROMPT_CLASSNAME+'-yes-btn', innerText: 'ok'});
    this.noBtn = $('<button>', {class: PROMPT_CLASSNAME+'-no-btn', innerText: 'cancel'});
    this.yesBtn.addEventListener('click', this.yes.bind(this));
    this.noBtn.addEventListener('click', this.no.bind(this));
    buttons.appendChild(this.noBtn);
    buttons.appendChild(this.yesBtn);

    this.container.appendChild(this.title);
    this.container.appendChild(this.message);
    this.container.appendChild(buttons);

    this.wrapper.appendChild(this.container);
  }

  show({title, message, yes, no}) {
    if(!this.loaded) {
      document.body.appendChild(this.wrapper);
      this.loaded = true;
    }

    this.promise = new P();

    this.title.innerText = title;
    this.message.innerText = message;
    this.yesBtn.innerText = yes;
    this.noBtn.innerText = no;

    $(this.wrapper, {
      display: 'block'
    });

    return this.promise;
  }

  hide() {
    $(this.wrapper, {
      display: 'none'
    });
  }

  yes() {
    this.promise.resolve();
    this.hide();
  }

  no() {
    this.promise.reject();
    this.hide();
  }

}

module.exports = Prompt;