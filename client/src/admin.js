window.addEventListener('load', function(){

  const PANEL = 'seams-admin-panel';
  const TITLE = `${PANEL}-title`;
  const CONTENT = `${PANEL}-content`;
  const INPUT = `${PANEL}-input`;
  const SAVE = `${PANEL}-save-btn`;
  const CANCEL = `${PANEL}-cancel-btn`;

  class P {
    constructor() {
      this.resolve = function(){};
      this.reject = function(){};
    }
    then(func) {
      this.resolve = func;
      return this;
    }
    ['catch'](func) {
      this.reject = func;
      return this;
    }
  }

  function html(tag, className, directive) {
    const el = document.createElement(tag);
    el.className = className;
    if(typeof directive !== 'undefined') el.dataset.directive = directive;
    return el;
  }

  function ajax(url, params) {
    if(!url) return;
    const p = new P();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = () => {
      if(xhr.readyState === XMLHttpRequest.DONE) {
        if(xhr.status === 200) {
          try { p.resolve(JSON.parse(xhr.responseText)); }
          catch (e) { p.reject(e); }
        } else p.reject(xhr.status);
      }
    };
    xhr.send(JSON.stringify(params));

    return p;
  }

  class Editor {

    constructor() {
      this.initialize();
      this.hide();
    }

    initialize() {
      this._panel = html('div', PANEL);
      this._title = html('div', TITLE);
      this._content = html('div', CONTENT);

      const buttons = html('div', `${PANEL}-btns`);
      this._save = html('button', SAVE);
      this._cancel = html('button', CANCEL);

      this._save.innerText = 'save';
      this._cancel.innerText = 'cancel';

      buttons.appendChild(this._save);
      buttons.appendChild(this._cancel);

      this._panel.appendChild(this._title);
      this._panel.appendChild(this._content);
      this._panel.appendChild(buttons);

      this._save.addEventListener('click', this.save.bind(this));
      this._cancel.addEventListener('click', this.cancel.bind(this));

      document.body.appendChild(this._panel);
    }

    save() {
      const data = {};

      for(const directive in this._directives) {
        const content = this._directives[directive];
        data[content] = this.bind(this._currentElement, directive)();
      }

      ajax(window.location.pathname, data)
      this.hide();
    }

    cancel() {
      for(const directive in this._previous) {
        this.bind(this._currentElement, directive)(this._previous[directive]);
      }

      this.hide();
    }

    show($el, directives) {
      this._panel.style = 'display:block';
      this._content.innerHTML = '';
      this._currentElement = $el;
      this._previous = {};
      this._directives = {};

      for(let i = 0; i < directives.length; i++) {
        const directive = directives[i];
        const input = html('input', INPUT, directive);
        const binding = this.bind($el, directive);

        this._previous[directive] = input.value = binding();
        this._directives[directive] = $el.dataset[directive];

        input.addEventListener('input', e => {
          binding(input.value);
        });

        this._content.appendChild(input);
      }
    }

    hide() {
      this._panel.style = 'display:none';
    }

    bind($el, directive) {
      return function(val) {
        if(typeof val === 'undefined') {
          switch(directive) {
            case 'content': return $el.innerHTML;
            default: return $el.getAttribute(directive);
          }
        } else {
          switch(directive) {
            case 'content': return $el.innerHTML = val;
            default: $el.setAttribute(directive, val); return val;
          }
        }
      }
    }

  }

  class UI {

    constructor() {
      this._editor = new Editor();
      this.initialize();
    }

    initialize() {
      const nodes = [];
      let id = 0;

      for(let i = 0; i < directives.length; i++) {
        const directive = directives[i];
        const $els = document.querySelectorAll(`*[data-${directives[i]}]`);

        for(let j = 0; j < $els.length; j++) {
          const $el = $els[j];

          if($el.dataset.seamsId) {
            nodes[$el.dataset.seamsId].directives.push(directive)
          } else {
            $el.dataset.seamsId = id;
            nodes[id++] = {$el, directives: [directive]};
          }
        }

      }

      nodes.forEach(({$el, directives}) => {

        $el.addEventListener('click', evt => {
          this._editor.show($el, directives);
          evt.stopPropagation();
          evt.preventDefault();
        });

      });

    }

  }

  const ui = new UI(); 

});