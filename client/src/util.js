const directives = require('../../server/directives');

class P {
  constructor() {
    this.resolve = function(){};
    this.reject = function(){};
  }
  then(func) {
    this.resolve = func;
    return this;
  }
  catch(func) {
    this.reject = func;
    return this;
  }
  static resolve(val) {
    const p = new P();
    setTimeout(() => p.resolve(val), 0);
    return p;
  }
}

class HTMLWrapper {
  constructor(el) {
    this.element = el;
  }

  html(val) {
    return typeof val === 'undefined' ?
      this.element.innerHTML :
      this.element.innerHTML = val;
  }

  text(val) {
    return typeof val === 'undefined' ?
      this.element.innerText :
      this.element.innerText = val;
  }

  attr(key, val) {
    return typeof val === 'undefined' ?
      this.element.getAttribute(key) :
      this.element.setAttribute(key, val)
  }
}

function bind(el, property) {
  const $el = new HTMLWrapper(el);
  return function(val) {
    if(property in directives) return directives[property]($el, val);
    else if (property in el) {
      return typeof val === 'undefined' ? 
        el[property] :
        el[property] = val;
    } else {
      return $el.attr(property, val);
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

function http(url, method, params) {

  if(!url) return;

  const p = new P();
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
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
http.get = (url, params) => http(url, 'GET', params);
http.post = (url, params) => http(url, 'POST', params);
http.put = (url, params) => http(url, 'PUT', params);

function storage(obj) {
  if(typeof obj === 'undefined') {
    return JSON.parse(localStorage.getItem('seams-admin'));
  } else {
    localStorage.setItem('seams-admin', JSON.stringify(obj));
  }
}

function cookie(key, val) {
  if(typeof val !== 'undefined') {
    document.cookie = `${key}=${val}`;
    return val;
  } else {
    return document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\=\\s*([^;]*).*$)|^.*$`), "$1");
  }
}

const CLASSNAME = 'seams-admin-panel';

module.exports = {
  P,
  bind,
  $,
  http,
  storage,
  cookie,
  CLASSNAME
};