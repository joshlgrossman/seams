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
        class: CLASSNAME + '-input',
        type: 'text'
      });

      input.value = this.binding();

      input.addEventListener('input', function () {
        _this2.binding(input.value);
      });

      return input;
    }
  }]);

  return BasicEditor;
}(Editor);

module.exports = BasicEditor;

},{"./Editor":2,"./util":6}],2:[function(require,module,exports){
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

},{"./util":6}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('./util'),
    bind = _require.bind,
    $ = _require.$,
    ajax = _require.ajax,
    CLASSNAME = _require.CLASSNAME;

var BasicEditor = require('./BasicEditor');

var Panel = function () {
  function Panel() {
    _classCallCheck(this, Panel);

    this.loaded = false;
    this.container = $('<div>', { class: CLASSNAME });
    this.content = $('<div>', { class: CLASSNAME + '-content' });

    var buttons = $('<div>', { class: CLASSNAME + '-btns' });
    this.saveBtn = $('<button>', { class: CLASSNAME + '-save-btn', innerText: 'save' });
    this.cancelBtn = $('<button>', { class: CLASSNAME + '-cancel-btn', innerText: 'cancel' });
    this.saveBtn.addEventListener('click', this.save.bind(this));
    this.cancelBtn.addEventListener('click', this.cancel.bind(this));
    buttons.appendChild(this.cancelBtn);
    buttons.appendChild(this.saveBtn);

    this.container.appendChild(this.content);
    this.container.appendChild(buttons);
  }

  _createClass(Panel, [{
    key: 'show',
    value: function show(el, directives) {
      var _this = this;

      if (!this.loaded) {
        document.body.appendChild(this.container);
        this.loaded = true;
      }

      this.content.innerHTML = '';
      this.previous = {};
      this.mapping = {};
      this.element = el;

      directives.forEach(function (directive) {
        var editor = void 0;

        switch (directive) {
          default:
            editor = new BasicEditor(el, directive);
        }

        _this.previous[directive] = editor.binding();
        _this.mapping[directive] = el.dataset[directive];

        _this.content.appendChild(editor.render());
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

      ajax(window.location.pathname, params);
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

},{"./BasicEditor":1,"./util":6}],4:[function(require,module,exports){
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

},{"./Panel":3,"./util":6}],5:[function(require,module,exports){
'use strict';

var UI = require('./UI');
var directives = require('../../server/directives');

window.addEventListener('load', function () {

  var ui = new UI(Object.keys(directives));
});

},{"../../server/directives":7,"./UI":4}],6:[function(require,module,exports){
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

function ajax(url, params) {

  if (!url) return;

  var p = new P();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
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

function session(obj) {
  if (typeof obj === 'undefined') {
    return JSON.parse(sessionStorage.getItem('seams-admin'));
  } else {
    sessionStorage.setItem('seams-admin', JSON.stringify(obj));
  }
}

var CLASSNAME = 'seams-admin-panel';

module.exports = {
  P: P,
  bind: bind,
  $: $,
  ajax: ajax,
  session: session,
  CLASSNAME: CLASSNAME
};

},{"../../server/directives":7}],7:[function(require,module,exports){
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

},{}]},{},[5]);
