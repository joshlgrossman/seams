(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('./util'),
    bind = _require.bind,
    $ = _require.$,
    CLASSNAME = _require.CLASSNAME;

var Editor = require('./Editor');

var BasicEditor = function (_Editor) {
  _inherits(BasicEditor, _Editor);

  function BasicEditor(element, property) {
    _classCallCheck(this, BasicEditor);

    return _possibleConstructorReturn(this, (BasicEditor.__proto__ || Object.getPrototypeOf(BasicEditor)).call(this, element, property));
  }

  _createClass(BasicEditor, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var input = $('<input>', {
        type: 'text',
        value: this.binding()
      });

      input.addEventListener('input', function () {
        _this2.binding(input.value);
      });

      return input;
    }
  }]);

  return BasicEditor;
}(Editor);

module.exports = BasicEditor;

},{"./Editor":2,"./util":7}],2:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./util'),
    bind = _require.bind;

var Editor = function Editor(element, property) {
  _classCallCheck(this, Editor);

  this.element = element;
  this.property = property;
  this.binding = bind(element, property);
};

module.exports = Editor;

},{"./util":7}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./util'),
    bind = _require.bind,
    $ = _require.$,
    ajax = _require.ajax,
    CLASSNAME = _require.CLASSNAME;

var BasicEditor = require('./BasicEditor');
var TextEditor = require('./TextEditor');

var Panel = function () {
  function Panel() {
    var _this = this;

    _classCallCheck(this, Panel);

    this.side = '-right';
    this.loaded = false;
    this.container = $('<div>', { id: CLASSNAME, class: CLASSNAME + this.side });
    this.content = $('<div>', { class: CLASSNAME + '-content' });

    var buttons = $('<div>', { class: CLASSNAME + '-btns' });
    this.saveBtn = $('<button>', { class: CLASSNAME + '-save-btn', innerText: 'save' });
    this.cancelBtn = $('<button>', { class: CLASSNAME + '-cancel-btn', innerText: 'cancel' });
    this.saveBtn.addEventListener('click', this.save.bind(this));
    this.cancelBtn.addEventListener('click', this.cancel.bind(this));
    buttons.appendChild(this.cancelBtn);
    buttons.appendChild(this.saveBtn);

    var sidebar = $('<div>', { class: CLASSNAME + '-sidebar' });
    sidebar.addEventListener('click', function () {
      _this.side = _this.side === '-right' ? '-left' : '-right';
      _this.container.className = CLASSNAME + _this.side;
    });

    this.container.appendChild(sidebar);
    this.container.appendChild(this.content);
    this.container.appendChild(buttons);
  }

  _createClass(Panel, [{
    key: 'show',
    value: function show(el, directives) {
      var _this2 = this;

      if (!this.loaded) {
        document.body.appendChild(this.container);
        this.loaded = true;
      }

      this.content.innerHTML = '';
      this.previous = {};
      this.mapping = {};
      this.element = el;

      directives.forEach(function (directive, i) {
        var editor = void 0;

        switch (directive) {
          case 'content':
            editor = new TextEditor(el, directive);break;
          default:
            editor = new BasicEditor(el, directive);
        }

        _this2.previous[directive] = editor.binding();
        _this2.mapping[directive] = el.dataset[directive];

        var id = CLASSNAME + '-editor' + i;
        var input = editor.render();
        var label = $('<label>', { 'for': id, innerText: directive });
        input.setAttribute('id', id);

        var container = $('<div>', { class: CLASSNAME + '-editor' });
        container.appendChild(label);
        container.appendChild(input);

        _this2.content.appendChild(container);
      });

      this.container.style = 'display:block';
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.container.style = 'display:none';
    }
  }, {
    key: 'save',
    value: function save() {
      var params = {};

      for (var directive in this.mapping) {
        var content = this.mapping[directive];
        params[content] = bind(this.element, directive)();
      }

      ajax.put(window.location.pathname, params);
      this.hide();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      for (var directive in this.previous) {
        bind(this.element, directive)(this.previous[directive]);
      }
      this.hide();
    }
  }]);

  return Panel;
}();

module.exports = Panel;

},{"./BasicEditor":1,"./TextEditor":4,"./util":7}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('./util'),
    $ = _require.$;

var Editor = require('./Editor');

var evals = {
  heading: /(#+)(.*?)#+/g,
  italic: /_(.+?)_/g,
  bold: /\*(.+?)\*/g,
  link: /([^!])\[(.+?)\]\((.+?)\)/g,
  monospace: /`(.+?)`/g,
  linebreak: /\n\n/g,
  image: /\!\[(.+?)\]\((.+?)\)/g
};

var unevals = {
  heading: /<h(\d)>(.*?)<\/h\d>/g,
  italic: /<em>(.*?)<\/em>/g,
  bold: /<strong>(.*?)<\/strong>/g,
  link: /<a href="([^"]*)">(.*?)<\/a>/g,
  monospace: /<code>(.*?)<\/code>/g,
  linebreak: /<br>/g,
  image: /<img src="([^"]*)" alt="([^"]*)">/g
};

var TextEditor = function (_Editor) {
  _inherits(TextEditor, _Editor);

  function TextEditor(element, property) {
    _classCallCheck(this, TextEditor);

    var _this = _possibleConstructorReturn(this, (TextEditor.__proto__ || Object.getPrototypeOf(TextEditor)).call(this, element, property));

    _this.text = '';
    return _this;
  }

  _createClass(TextEditor, [{
    key: 'eval',
    value: function _eval(str) {

      return str.replace(evals.italic, '<em>$1</em>').replace(evals.bold, '<strong>$1</strong>').replace(evals.link, '$1<a href="$3">$2</a>').replace(evals.monospace, '<code>$1</code>').replace(evals.linebreak, '<br>').replace(evals.image, '<img src="$2" alt="$1">').replace(evals.heading, function (match, p1, p2) {
        var num = p1.length;
        return '<h' + num + '>' + p2 + '</h' + num + '>';
      });
    }
  }, {
    key: 'uneval',
    value: function uneval(str) {

      return str.replace(unevals.italic, '_$1_').replace(unevals.bold, '*$1*').replace(unevals.link, '[$2]($1)').replace(unevals.monospace, '`$1`').replace(unevals.linebreak, '\n\n').replace(unevals.image, '![$2]($1)').replace(unevals.heading, function (match, p1, p2) {
        var num = +p1;
        var s = '';
        while (num-- > 0) {
          s += '#';
        }return '' + s + p2 + '#';
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var value = this.uneval(this.binding());
      var lines = value.split('\n') || [];
      var height = (1 + lines.length + lines.reduce(function (r, v) {
        return r + v.length / 40 | 0;
      }, 0)) * 20;

      var ta = $('<textarea>', {
        value: value,
        style: 'height:' + height + 'px'
      });

      ta.addEventListener('input', function (e) {
        _this2.binding(_this2.eval(ta.value));
      });

      return ta;
    }
  }]);

  return TextEditor;
}(Editor);

module.exports = TextEditor;

},{"./Editor":2,"./util":7}],5:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./util'),
    $ = _require.$;

var Panel = require('./Panel');

var UI = function UI(directives) {
  var _this = this;

  _classCallCheck(this, UI);

  this.panel = new Panel();

  var nodes = [];
  var id = 0;

  var _loop = function _loop(i) {
    var directive = directives[i];

    $('*[data-' + directives[i] + ']').forEach(function (el) {
      if (el.dataset.seamsId) {
        nodes[el.dataset.seamsId].directives.push(directive);
      } else {
        nodes[el.dataset.seamsId = id++] = { el: el, directives: [directive] };
      }
    });
  };

  for (var i = 0; i < directives.length; i++) {
    _loop(i);
  }

  nodes.forEach(function (_ref) {
    var el = _ref.el,
        directives = _ref.directives;


    el.addEventListener('click', function (evt) {
      _this.panel.show(el, directives);
      evt.stopPropagation();
      evt.preventDefault();
    });
  });
};

module.exports = UI;

},{"./Panel":3,"./util":7}],6:[function(require,module,exports){
'use strict';

var UI = require('./UI');
var directives = require('../../server/directives');

window.addEventListener('load', function () {

  var ui = new UI(Object.keys(directives));
});

},{"../../server/directives":8,"./UI":5}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var directives = require('../../server/directives');

var P = function () {
  function P() {
    _classCallCheck(this, P);

    this.resolve = function () {};
    this.reject = function () {};
  }

  _createClass(P, [{
    key: 'then',
    value: function then(func) {
      this.resolve = func;
      return this;
    }
  }, {
    key: 'catch',
    value: function _catch(func) {
      this.reject = func;
      return this;
    }
  }], [{
    key: 'resolve',
    value: function resolve(val) {
      var p = new P();
      setTimeout(function () {
        return p.resolve(val);
      }, 0);
      return p;
    }
  }]);

  return P;
}();

var HTMLWrapper = function () {
  function HTMLWrapper(el) {
    _classCallCheck(this, HTMLWrapper);

    this.element = el;
  }

  _createClass(HTMLWrapper, [{
    key: 'html',
    value: function html(val) {
      return typeof val === 'undefined' ? this.element.innerHTML : this.element.innerHTML = val;
    }
  }, {
    key: 'text',
    value: function text(val) {
      return typeof val === 'undefined' ? this.element.innerText : this.element.innerText = val;
    }
  }, {
    key: 'attr',
    value: function attr(key, val) {
      return typeof val === 'undefined' ? this.element.getAttribute(key) : this.element.setAttribute(key, val);
    }
  }]);

  return HTMLWrapper;
}();

function bind(el, property) {
  var $el = new HTMLWrapper(el);
  return function (val) {
    if (property in directives) return directives[property]($el, val);else if (property in el) {
      return typeof val === 'undefined' ? el[property] : el[property] = val;
    } else {
      return $el.attr(property, val);
    }
  };
}

function $(tagOrSelector) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


  if (!~tagOrSelector.indexOf('<')) return [].concat(_toConsumableArray(document.querySelectorAll(tagOrSelector)));

  var el = document.createElement(tagOrSelector.replace(/\<|\>/g, ''));
  for (var key in options) {
    bind(el, key)(options[key]);
  }

  return el;
}

function ajax(url, type, params) {

  if (!url) return;

  var p = new P();
  var xhr = new XMLHttpRequest();
  xhr.open(type, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        try {
          p.resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          p.reject(e);
        }
      } else p.reject(xhr.status);
    }
  };
  xhr.send(JSON.stringify(params));

  return p;
}
ajax.get = function (url, params) {
  return ajax(url, 'GET', params);
};
ajax.post = function (url, params) {
  return ajax(url, 'POST', params);
};
ajax.put = function (url, params) {
  return ajax(url, 'PUT', params);
};

function storage(obj) {
  if (typeof obj === 'undefined') {
    return JSON.parse(localStorage.getItem('seams-admin'));
  } else {
    localStorage.setItem('seams-admin', JSON.stringify(obj));
  }
}

function cookie(key, val) {
  if (typeof val === 'undefined') {
    document.cookie = key + '=' + val;
    return val;
  } else {
    return document.cookie.replace(new RegExp('(?:(?:^|.*;\\s*)' + key + '\\s*=\\s*([^;]*).*$)|^.*$'), "$1");
  }
}

var CLASSNAME = 'seams-admin-panel';

module.exports = {
  P: P,
  bind: bind,
  $: $,
  ajax: ajax,
  storage: storage,
  CLASSNAME: CLASSNAME
};

},{"../../server/directives":8}],8:[function(require,module,exports){
'use strict';

module.exports = {
  'content': function content($el, _content) {
    return _content === undefined ? $el.html() : $el.html(_content);
  },
  'text': function text($el, content) {
    return content === undefined ? $el.text() : $el.text(content);
  },
  'src': function src($el, content) {
    return content === undefined ? $el.attr('src') : $el.attr('src', content);
  },
  'href': function href($el, content) {
    return content === undefined ? $el.attr('href') : $el.attr('href', content);
  }
};

},{}]},{},[6]);
