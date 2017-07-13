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

function bind(el, property) {
  return function(val) {
    if(typeof val !== 'undefined') {
      switch(property) {
        case 'content': el.innerHTML = val; break;
        case 'text': el.innerText = val; break;
        default: el.setAttribute(property, val);
      }
    } else {
      switch(property) {
        case 'content': return el.innerHTML; break;
        case 'text': return el.innerText; break;
        default: return el.getAttribute(property);
      }
    }
  }
}

function $(tagOrSelector, options = {}) {

  if(!~tagOrSelector.indexOf('<')) return [...document.querySelectorAll(tagOrSelector)];

  const el = document.createElement(tagOrSelector.replace(/\<|\>/g, ''));
  for(const key in options) {
    bind(el, key)(options[key]);
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

const CLASSNAME = 'seams-admin-panel';

module.exports = {
  P,
  bind,
  $,
  ajax,
  CLASSNAME
};