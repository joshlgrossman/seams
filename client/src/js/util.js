const directives = require('../../../server/directives');

const undef = val => typeof val === 'undefined';
const string = val => typeof val === 'string';
const object = val => typeof val === 'object';

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
  static reject(err) {
    const p = new P();
    setTimeout(() => p.reject(err), 0);
    return p;
  }
}

class HTMLWrapper {
  constructor(el) {
    this.element = el;
  }

  html(val) {
    return undef(val) ?
      this.element.innerHTML :
      this.element.innerHTML = val;
  }

  text(val) {
    return undef(val) ?
      this.element.innerText :
      this.element.innerText = val;
  }

  attr(key, val) {
    if(undef(val)) return this.element.getAttribute(key)
    else return this.element.setAttribute(key, val), val;
  }

  css(key, val) {
    let styles = (this.attr('style') || '');
    const re = new RegExp(`\s*${key}\s*:\s*([^;]*)`);
    if(undef(val)) {
      const style = (styles.match(re) || [])[1];
      if(string(style)) return style.trim();
      else return '';
    } else {
      styles = `${styles.replace(re, '')};${key}:${val};`.replace(/;+\s*;+/g,';');
      return this.attr('style', styles);
    }
  }
}

function bind(el, property) {
  const $el = new HTMLWrapper(el);
  return function(val) {
    if(property in directives) return directives[property]($el, val);
    else if (property in el) {
      return undef(val) ? 
        el[property] :
        el[property] = val;
    } else {
      return $el.attr(property, val);
    }
  }
}

function $(tagOrSelector, options = {}, toggle = true) {

  if(tagOrSelector instanceof HTMLElement) {
    const el = tagOrSelector;

    if(string(options)) {
      const className = options.replace('.', '');
      if(toggle) {
        if(el.className.indexOf(className) === -1)
          el.className += ' '+className;
      } else {
        const re = new RegExp(`\\s*${className}\\s*`);
        el.className = el.className.replace(re,'');
      }
    } else if (object(options)) {
      const arr = [];
      for(const prop in options) arr.push(`${prop}:${options[prop]}`);
      el.setAttribute('style', arr.join(';'));
    }

    return el;

  } else {

    if (!~tagOrSelector.indexOf('<')) return [...document.querySelectorAll(tagOrSelector)];

    const el = document.createElement(tagOrSelector.replace(/\<|\>/g, ''));
    for (const key in options) {
      bind(el, key)(options[key]);
    }

    return el;

  }

}

function http(url, method, params) {

  if(!url) return P.reject();

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
http.post = (url, params) => http(url, 'POST', params);
http.put = (url, params) => http(url, 'PUT', params);
http.get = (url, params) => {
  const paramArray = [];
  for(const key in params) {
    const encodedKey = encodeURIComponent(key);
    const encodedVal = encodeURIComponent(params[key]);
    paramArray.push(`${encodedKey}=${encodedVal}`);
  }
  url += `?${paramArray.join('&')}`;
  http(url, 'GET', {});
};

function cookie(key, val) {
  if(!undef(val)) {
    document.cookie = `${key}=${val};${!val?'expires=Thu, 01 Jan 1970 00:00:00 UTC;':''}path=/;`
    return val;
  } else {
    return document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\=\\s*([^;]*).*$)|^.*$`), "$1");
  }
}

const CLASSNAME = 'seams-admin-panel';

module.exports = {
  undef,
  string,
  object,
  P,
  CLASSNAME,
  bind,
  $,
  http,
  cookie
};