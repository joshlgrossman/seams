const tagRegExp = /^\<([a-zA-Z]+)\>$/g;

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
    static resolve(val) {
      const p = new P();
      setTimeout(() => p.resolve(val), 0);
      return p;
    }
  }

function $(tagOrSelector, options = {}) {

  if(!tagRegExp.test(tagOrSelector)) return [...document.querySelectorAll(tagOrSelector)];

  const el = document.createElement(tagOrSelector.replace(/\<|\>/g, ''));
  for(const key in options) {
    switch(key) {
      case 'content': el.innerHTML = options[key]; break;
      case 'text': el.innerText = options[key]; break;
      default: el.setAttribute(key, options[key]);
    }
  }

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

module.exports = {
  P,
  $,
  ajax
};