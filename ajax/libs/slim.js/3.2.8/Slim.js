'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _CustomElement() {
  return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
}

;
Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(_CustomElement, HTMLElement);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, document, HTMLElement) {

  var __flags = {
    isWCSupported: 'customElements' in window && 'import' in document.createElement('link') && 'content' in document.createElement('template'),
    isIE11: !!window['MSInputMethodContext'] && !!document['documentMode'],
    isChrome: undefined,
    isEdge: undefined,
    isSafari: undefined,
    isFirefox: undefined
  };

  try {
    __flags.isChrome = /Chrome/.test(navigator.userAgent);
    __flags.isEdge = /Edge/.test(navigator.userAgent);
    __flags.isSafari = /Safari/.test(navigator.userAgent);
    __flags.isFirefox = /Firefox/.test(navigator.userAgent);

    if (__flags.isIE11 || __flags.isEdge) {
      __flags.isChrome = false;
      Object.defineProperty(Node.prototype, 'children', function () {
        return this.childNodes;
      });
    }
  } catch (err) {}

  var _$2 = '_slim_internals_'; //Symbol('Slim')

  var Internals = function Internals() {
    _classCallCheck(this, Internals);

    this.hasCustomTemplate = undefined;
    this.boundParent = null;
    this.repeater = {};
    this.bindings = {};
    this.reversed = {};
    this.inbounds = {};
    this.eventHandlers = {};
    this.internetExploderClone = null;
    this.rootElement = null;
    this.createdCallbackInvoked = false;
    this.sourceText = null;
    this.excluded = false;
    this.autoBoundAttributes = [];
  };

  var Slim = function (_CustomElement2) {
    _inherits(Slim, _CustomElement2);

    _createClass(Slim, null, [{
      key: 'dashToCamel',
      value: function dashToCamel(dash) {
        return dash.indexOf('-') < 0 ? dash : dash.replace(/-[a-z]/g, function (m) {
          return m[1].toUpperCase();
        });
      }
    }, {
      key: 'camelToDash',
      value: function camelToDash(camel) {
        return camel.replace(/([A-Z])/g, '-$1').toLowerCase();
      }
    }, {
      key: 'lookup',
      value: function lookup(target, expression, maybeRepeated) {
        var chain = expression.split('.');
        var o = void 0;
        if (maybeRepeated && maybeRepeated[_$2].repeater[chain[0]]) {
          o = maybeRepeated[_$2].repeater;
        } else {
          o = target;
        }
        var i = 0;
        while (o && i < chain.length) {
          o = o[chain[i++]];
        }
        return o;
      }

      // noinspection JSUnresolvedVariable

    }, {
      key: '_$',
      value: function _$(target) {
        target[_$2] = target[_$2] || new Internals();
        return target[_$2];
      }
    }, {
      key: 'polyFill',
      value: function polyFill(url) {
        if (!__flags.isWCSupported) {
          var existingScript = document.querySelector('script[data-is-slim-polyfill="true"]');
          if (!existingScript) {
            var script = document.createElement('script');
            script.setAttribute('data-is-slim-polyfill', 'true');
            script.src = url;
            document.head.appendChild(script);
          }
        }
      }
    }, {
      key: 'tag',
      value: function tag(tagName, tplOrClazz, clazz) {
        if (this.tagToClassDict.has(tagName)) {
          throw new Error('Unable to define tag: ' + tagName + ' already defined');
        }
        if (clazz === undefined) {
          clazz = tplOrClazz;
        } else {
          Slim.tagToTemplateDict.set(tagName, tplOrClazz);
        }
        this.tagToClassDict.set(tagName, clazz);
        this.classToTagDict.set(clazz, tagName);
        customElements.define(tagName, clazz);
      }
    }, {
      key: 'tagOf',
      value: function tagOf(clazz) {
        return this.classToTagDict.get(clazz);
      }
    }, {
      key: 'classOf',
      value: function classOf(tag) {
        return this.tagToClassDict.get(tag);
      }
    }, {
      key: 'createUniqueIndex',
      value: function createUniqueIndex() {
        this[_$2].uniqueCounter++;
        return this[_$2].uniqueCounter.toString(16);
      }
    }, {
      key: 'plugin',
      value: function plugin(phase, _plugin) {
        if (!this.plugins[phase]) {
          throw new Error('Cannot attach plugin: ' + phase + ' is not a supported phase');
        }
        this.plugins[phase].push(_plugin);
      }
    }, {
      key: 'checkCreationBlocking',
      value: function checkCreationBlocking(element) {
        if (element.attributes) {
          for (var i = 0, n = element.attributes.length; i < n; i++) {
            var attribute = element.attributes[i];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = Slim[_$2].customDirectives[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref = _step.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var test = _ref2[0];
                var directive = _ref2[1];

                var value = directive.isBlocking && test(attribute);
                if (value) {
                  return true;
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
        }
        return false;
      }
    }, {
      key: 'customDirective',
      value: function customDirective(testFn, fn, isBlocking) {
        if (this[_$2].customDirectives.has(testFn)) {
          throw new Error('Cannot register custom directive: ' + testFn + ' already registered');
        }
        fn.isBlocking = isBlocking;
        this[_$2].customDirectives.set(testFn, fn);
      }
    }, {
      key: 'executePlugins',
      value: function executePlugins(phase, target) {
        this.plugins[phase].forEach(function (fn) {
          fn(target);
        });
      }
    }, {
      key: 'qSelectAll',
      value: function qSelectAll(target, selector) {
        return [].concat(_toConsumableArray(target.querySelectorAll(selector)));
      }
    }, {
      key: 'unbind',
      value: function unbind(source, target) {
        var bindings = source[_$2].bindings;
        Object.keys(bindings).forEach(function (key) {
          var chain = bindings[key].chain.filter(function (binding) {
            return binding.target !== target;
          });
          bindings[key].chain = chain;
        });
      }
    }, {
      key: 'root',
      value: function root(target) {
        return target.__isSlim && target.useShadow ? target[_$2].rootElement || target : target;
      }
    }, {
      key: 'selectRecursive',
      value: function selectRecursive(target, force) {
        var collection = [];
        var search = function search(node, force) {
          collection.push(node);
          var allow = !node.__isSlim || node.__isSlim && !node.template || node.__isSlim && node === target || force;
          if (allow) {
            var children = [].concat(_toConsumableArray(Slim.root(node).children));
            children.forEach(function (childNode) {
              search(childNode, force);
            });
          }
        };
        search(target, force);
        return collection;
      }
    }, {
      key: 'removeChild',
      value: function removeChild(target) {
        if (typeof target.remove === 'function') {
          target.remove();
        }
        if (target.parentNode) {
          target.parentNode.removeChild(target);
        }
        if (this._$(target).internetExploderClone) {
          this.removeChild(this._$(target).internetExploderClone);
        }
      }
    }, {
      key: 'moveChildren',
      value: function moveChildren(source, target) {
        while (source.firstChild) {
          target.appendChild(source.firstChild);
        }
      }
    }, {
      key: 'wrapGetterSetter',
      value: function wrapGetterSetter(element, expression) {
        var pName = expression.split('.')[0];
        var oSetter = element.__lookupSetter__(pName);
        if (oSetter && oSetter[_$2]) return pName;
        if (typeof oSetter === 'undefined') {
          oSetter = function oSetter() {};
        }

        var srcValue = element[pName];
        this._$(element).bindings[pName] = element[_$2].bindings[pName] || {
          chain: [],
          value: srcValue
        };
        element[_$2].bindings[pName].value = srcValue;
        var newSetter = function newSetter(v) {
          oSetter.call(element, v);
          this[_$2].bindings[pName].value = v;
          this._executeBindings(pName);
        };
        newSetter[_$2] = true;
        element.__defineGetter__(pName, function () {
          return element[_$2].bindings[pName].value;
        });
        element.__defineSetter__(pName, newSetter);
        return pName;
      }
    }, {
      key: 'bindOwn',
      value: function bindOwn(target, expression, executor) {
        return Slim.bind(target, target, expression, executor);
      }
    }, {
      key: 'bind',
      value: function bind(source, target, expression, executor) {
        Slim._$(source);
        Slim._$(target);
        if (target[_$2].excluded) return;
        executor.source = source;
        executor.target = target;
        var pName = this.wrapGetterSetter(source, expression);
        if (!source[_$2].reversed[pName]) {
          source[_$2].bindings[pName].chain.push(executor);
        }
        target[_$2].inbounds[pName] = target[_$2].inbounds[pName] || [];
        target[_$2].inbounds[pName].push(executor);
        return executor;
      }
    }, {
      key: 'update',
      value: function update(target) {
        var children = Slim.selectRecursive(target);

        for (var _len = arguments.length, props = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          props[_key - 1] = arguments[_key];
        }

        if (props.length === 0) {
          return children.forEach(function (child) {
            Slim.commit(child);
          });
        }
        props.forEach(function (prop) {
          children.forEach(function (child) {
            Slim.commit(child, prop);
          });
        });
      }
    }, {
      key: 'commit',
      value: function commit(target, prop) {
        var keys = void 0;
        var $ = target[_$2];
        var chain = [];
        if (prop) {
          if ($.inbounds[prop]) {
            chain = chain.concat($.inbounds[prop] || []);
          }
          if ($.bindings[prop]) {
            chain = chain.concat($.bindings[prop].chain);
          }
        } else {
          Object.keys(target[_$2].inbounds).forEach(function (prop) {
            if ($.inbounds[prop]) {
              chain = chain.concat($.inbounds[prop] || []);
            }
            if ($.bindings[prop]) {
              chain = chain.concat($.bindings[prop].chain);
            }
          });
        }
        chain.forEach(function (x) {
          return x();
        });
      }

      /*
        Class instance
        */

    }, {
      key: 'rxInject',
      get: function get() {
        return (/\{(.+[^(\((.+)\))])\}/
        );
      }
    }, {
      key: 'rxProp',
      get: function get() {
        return (/(.+[^(\((.+)\))])/
        );
      }
    }, {
      key: 'rxMethod',
      get: function get() {
        return (/(.+)(\((.+)\)){1}/
        );
      }
    }]);

    function Slim() {
      _classCallCheck(this, Slim);

      var _this = _possibleConstructorReturn(this, (Slim.__proto__ || Object.getPrototypeOf(Slim)).call(this));

      var init = function init() {
        _this.__isSlim = true;
        Slim.debug('ctor', _this.localName);
        if (Slim.checkCreationBlocking(_this)) {
          return;
        }
        _this.createdCallback();
      };
      if (__flags.isSafari) {
        Slim.asap(init);
      } else init();
      return _this;
    }

    // Native DOM Api V1

    _createClass(Slim, [{
      key: 'createdCallback',
      value: function createdCallback() {
        if (this[_$2] && this[_$2].createdCallbackInvoked) return;
        this._initialize();
        this[_$2].createdCallbackInvoked = true;
        this.onBeforeCreated();
        Slim.executePlugins('create', this);
        this.render();
        this.onCreated();
      }

      // Native DOM Api V2

    }, {
      key: 'connectedCallback',
      value: function connectedCallback() {
        this.onAdded();
        Slim.executePlugins('added', this);
      }
    }, {
      key: 'disconnectedCallback',
      value: function disconnectedCallback() {
        this.onRemoved();
        Slim.executePlugins('removed', this);
      }
    }, {
      key: 'attributeChangedCallback',
      value: function attributeChangedCallback(attr, oldValue, newValue) {
        if (newValue !== oldValue && this.autoBoundAttributes.includes[attr]) {
          var prop = Slim.dashToCamel(attr);
          this[prop] = newValue;
        }
      }
      // Slim internal API

    }, {
      key: '_executeBindings',
      value: function _executeBindings(prop) {
        var _this2 = this;

        Slim.debug('_executeBindings', this.localName);
        var all = this[_$2].bindings;
        if (prop) {
          all = _defineProperty({}, prop, true);
        }
        Object.keys(all).forEach(function (pName) {
          var o = _this2[_$2].bindings[pName];
          o && o.chain.forEach(function (binding) {
            return binding();
          });
        });
      }
    }, {
      key: '_bindChildren',
      value: function _bindChildren(children) {
        Slim.debug('_bindChildren', this.localName);
        if (!children) {
          children = Slim.qSelectAll(this, '*');
        }
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var child = _step2.value;

            Slim._$(child);
            if (child[_$2].boundParent === this) continue;
            child[_$2].boundParent = child[_$2].boundParent || this;

            // todo: child.localName === 'style' && this.useShadow -> processStyleNodeInShadowMode

            if (child.attributes.length) {
              var i = 0;
              var n = child.attributes.length;
              while (i < n) {
                var source = this;
                var attribute = child.attributes.item(i);
                if (!child[_$2].excluded) {
                  var _iteratorNormalCompletion3 = true;
                  var _didIteratorError3 = false;
                  var _iteratorError3 = undefined;

                  try {
                    for (var _iterator3 = Slim[_$2].customDirectives[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var _ref3 = _step3.value;

                      var _ref4 = _slicedToArray(_ref3, 2);

                      var check = _ref4[0];
                      var directive = _ref4[1];

                      var match = check(attribute);
                      if (match) {
                        directive(source, child, attribute, match);
                      }
                    }
                  } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                      }
                    } finally {
                      if (_didIteratorError3) {
                        throw _iteratorError3;
                      }
                    }
                  }
                }
                i++;
              }
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }, {
      key: '_resetBindings',
      value: function _resetBindings() {
        Slim.debug('_resetBindings', this.localName);
        this[_$2].bindings = {};
      }
    }, {
      key: '_render',
      value: function _render(customTemplate) {
        var _this3 = this;

        Slim.debug('_render', this.localName);
        Slim.executePlugins('beforeRender', this);
        this[_$2].hasCustomTemplate = customTemplate;
        this._resetBindings();
        this[_$2].rootElement.innerHTML = '';[].concat(_toConsumableArray(this.childNodes)).forEach(function (childNode) {
          if (childNode.localName === 'style') {
            _this3[_$2].externalStyle = childNode;
            childNode.remove();
          }
        });
        var template = this[_$2].hasCustomTemplate || this.template;
        if (template && typeof template === 'string') {
          var frag = document.createElement('slim-root-fragment');
          frag.innerHTML = template || '';
          var scopedChildren = Slim.qSelectAll(frag, '*');
          if (this[_$2].externalStyle) {
            this._bindChildren([this[_$2].externalStyle]);
          }
          this._bindChildren(scopedChildren);
          Slim.asap(function () {
            Slim.moveChildren(frag, _this3[_$2].rootElement || _this3);
            _this3[_$2].externalStyle && _this3[_$2].rootElement.appendChild(_this3[_$2].externalStyle);
            _this3._executeBindings();
            _this3.onRender();
            Slim.executePlugins('afterRender', _this3);
            _this3.dispatchEvent(new Event('afterRender'));
          });
        }
      }
    }, {
      key: '_initialize',
      value: function _initialize() {
        var _this4 = this;

        Slim.debug('_initialize', this.localName);
        Slim._$(this);
        this[_$2].uniqueIndex = Slim.createUniqueIndex();
        if (this.useShadow) {
          if (typeof HTMLElement.prototype.attachShadow === 'undefined') {
            this[_$2].rootElement = this.createShadowRoot();
          } else {
            this[_$2].rootElement = this.attachShadow({ mode: 'open' });
          }
        } else {
          this[_$2].rootElement = this;
        }
        // this.setAttribute('slim-uq', this[_$].uniqueIndex)
        var observedAttributes = this.constructor.observedAttributes;
        if (observedAttributes) {
          observedAttributes.forEach(function (attr) {
            var pName = Slim.dashToCamel(attr);
            _this4[pName] = _this4.getAttribute(attr);
          });
        }
      }

      // Slim public / protected API

    }, {
      key: 'commit',
      value: function commit() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        Slim.commit.apply(Slim, [this].concat(args));
      }
    }, {
      key: 'update',
      value: function update() {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        Slim.update.apply(Slim, [this].concat(args));
      }
    }, {
      key: 'render',
      value: function render(tpl) {
        this._render(tpl);
      }
    }, {
      key: 'onRender',
      value: function onRender() {}
    }, {
      key: 'onBeforeCreated',
      value: function onBeforeCreated() {}
    }, {
      key: 'onCreated',
      value: function onCreated() {}
    }, {
      key: 'onAdded',
      value: function onAdded() {}
    }, {
      key: 'onRemoved',
      value: function onRemoved() {}
    }, {
      key: 'find',
      value: function find(selector) {
        return this[_$2].rootElement.querySelector(selector);
      }
    }, {
      key: 'findAll',
      value: function findAll(selector) {
        return Slim.qSelectAll(this[_$2].rootElement, selector);
      }
    }, {
      key: 'callAttribute',
      value: function callAttribute(attr, data) {
        var fnName = this.getAttribute(attr);
        if (fnName) {
          return this[_$2].boundParent[fnName](data);
        }
      }
    }, {
      key: '_isInContext',
      get: function get() {
        var node = this;
        while (node) {
          node = node.parentNode;
          if (!node) {
            return false;
          }
          if (node instanceof Document) {
            return true;
          }
        }
        return false;
      }
    }, {
      key: 'autoBoundAttributes',
      get: function get() {
        return [];
      }
    }, {
      key: 'useShadow',
      get: function get() {
        return false;
      }
    }, {
      key: 'template',
      get: function get() {
        return Slim.tagToTemplateDict.get(Slim.tagOf(this.constructor));
      }
    }]);

    return Slim;
  }(_CustomElement);

  Slim.uniqueIndex = 0;
  Slim.tagToClassDict = new Map();
  Slim.classToTagDict = new Map();
  Slim.tagToTemplateDict = new Map();
  Slim.plugins = {
    'create': [],
    'added': [],
    'beforeRender': [],
    'afterRender': [],
    'removed': []
  };

  Slim.debug = function () {};

  Slim.asap = window && window.requestAnimationFrame ? function (cb) {
    return window.requestAnimationFrame(cb);
  } : typeof setImmediate !== 'undefined' ? setImmediate : function (cb) {
    return setTimeout(cb, 0);
  };

  Slim[_$2] = {
    customDirectives: new Map(),
    uniqueCounter: 0,
    supportedNativeEvents: ['click', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mousedown', 'mouseup', 'dblclick', 'contextmenu', 'wheel', 'mouseleave', 'select', 'pointerlockchange', 'pointerlockerror', 'focus', 'blur', 'input', 'error', 'invalid', 'animationstart', 'animationend', 'animationiteration', 'reset', 'submit', 'resize', 'scroll', 'keydown', 'keypress', 'keyup', 'change']
  };

  Slim.customDirective(function (attr) {
    return attr.nodeName === 's:switch';
  }, function (source, target, attribute) {
    var expression = attribute.value;
    var oldValue = void 0;
    var anchor = document.createComment('switch:' + expression);
    target.appendChild(anchor);
    var children = [].concat(_toConsumableArray(target.children));
    var defaultChildren = children.filter(function (child) {
      return child.hasAttribute('s:default');
    });
    var fn = function fn() {
      var value = Slim.lookup(source, expression, target);
      if (String(value) === oldValue) return;
      var useDefault = true;
      children.forEach(function (child) {
        if (child.getAttribute('s:case') === String(value)) {
          if (child.__isSlim) {
            child.createdCallback();
          }
          anchor.parentNode.insertBefore(child, anchor);
          useDefault = false;
        } else {
          Slim.removeChild(child);
        }
      });
      if (useDefault) {
        defaultChildren.forEach(function (child) {
          if (child.__isSlim) {
            child.createdCallback();
          }
          anchor.parentNode.insertBefore(child, anchor);
        });
      } else {
        defaultChildren.forEach(function (child) {
          Slim.removeChild(child);
        });
      }
      oldValue = String(value);
    };
    Slim.bind(source, target, expression, fn);
  });

  Slim.customDirective(function (attr) {
    return (/^s:case$/.exec(attr.nodeName)
    );
  }, function () {}, true);
  Slim.customDirective(function (attr) {
    return (/^s:default$/.exec(attr.nodeName)
    );
  }, function () {}, true);

  // supported events (i.e. click, mouseover, change...)
  Slim.customDirective(function (attr) {
    return Slim[_$2].supportedNativeEvents.indexOf(attr.nodeName) >= 0;
  }, function (source, target, attribute) {
    var eventName = attribute.nodeName;
    var delegate = attribute.value;
    Slim._$(target).eventHandlers = target[_$2].eventHandlers || {};
    var allHandlers = target[_$2].eventHandlers;
    allHandlers[eventName] = allHandlers[eventName] || [];
    var handler = function handler(e) {
      try {
        source[delegate].call(source, e);
      } catch (err) {
        err.message = 'Could not respond to event "' + eventName + '" on ' + target.localName + ' -> "' + delegate + '" on ' + source.localName + ' ... ' + err.message;
        console.warn(err);
      }
    };
    allHandlers[eventName].push(handler);
    target.addEventListener(eventName, handler);
    handler = null;
  });

  Slim.customDirective(function (attr) {
    return attr.nodeName === 's:if';
  }, function (source, target, attribute) {
    var expression = attribute.value;
    var path = expression;
    var isNegative = false;
    if (path.charAt(0) === '!') {
      path = path.slice(1);
      isNegative = true;
    }
    var oldValue = void 0;
    var anchor = document.createComment('if:' + expression);
    target.parentNode.insertBefore(anchor, target);
    var fn = function fn() {
      var value = !!Slim.lookup(source, path, target);
      if (isNegative) {
        value = !value;
      }
      if (value === oldValue) return;
      if (value) {
        if (target.__isSlim) {
          target.createdCallback();
        }
        anchor.parentNode.insertBefore(target, anchor.nextSibling);
      } else {
        Slim.removeChild(target);
      }
      oldValue = value;
    };
    Slim.bind(source, target, path, fn);
  }, true);

  // bind (text nodes)
  Slim.customDirective(function (attr) {
    return attr.nodeName === 'bind';
  }, function (source, target) {
    Slim._$(target);
    target[_$2].sourceText = target.innerText.split('\n').join(' ');
    var updatedText = '';
    var matches = target.innerText.match(/\{\{([^\}\}]+)+\}\}/g);
    var aggProps = {};
    var textBinds = {};
    if (matches) {
      matches.forEach(function (expression) {
        var oldValue = void 0;
        var rxM = /\{\{(.+)(\((.+)\)){1}\}\}/.exec(expression);
        if (rxM) {
          var fnName = rxM[1];
          var pNames = rxM[3].split(' ').join('').split(',');
          pNames.map(function (path) {
            return path.split('.')[0];
          }).forEach(function (p) {
            return aggProps[p] = true;
          });
          textBinds[expression] = function (target) {
            var args = pNames.map(function (path) {
              return Slim.lookup(source, path, target);
            });
            var fn = source[fnName];
            var value = fn ? fn.apply(source, args) : undefined;
            if (oldValue === value) return;
            updatedText = updatedText.split(expression).join(value || '');
          };
          return;
        }
        var rxP = /\{\{(.+[^(\((.+)\))])\}\}/.exec(expression);
        if (rxP) {
          var path = rxP[1];
          aggProps[path] = true;
          textBinds[expression] = function (target) {
            var value = Slim.lookup(source, path, target);
            if (oldValue === value) return;
            updatedText = updatedText.split(expression).join(value || '');
          };
        }
      });
      var chainExecutor = function chainExecutor() {
        updatedText = target[_$2].sourceText;
        Object.keys(textBinds).forEach(function (expression) {
          textBinds[expression](target);
        });
        target.innerText = updatedText;
      };
      Object.keys(aggProps).forEach(function (prop) {
        Slim.bind(source, target, prop, chainExecutor);
      });
    }
  });

  Slim.customDirective(function (attr) {
    return attr.nodeName === 's:id';
  }, function (source, target, attribute) {
    Slim._$(target).boundParent[attribute.value] = target;
  });

  var wrappedRepeaterExecution = function wrappedRepeaterExecution(source, templateNode, attribute) {
    var path = attribute.nodeValue;
    var tProp = 'data';
    if (path.indexOf(' as')) {
      tProp = path.split(' as ')[1] || tProp;
      path = path.split(' as ')[0];
    }

    var repeater = document.createElement('slim-repeat');
    repeater[_$2].boundParent = source;
    repeater.dataProp = tProp;
    repeater.dataPath = attribute.nodeValue;
    repeater.templateNode = templateNode.cloneNode(true);
    repeater.templateNode.removeAttribute('s:repeat');
    templateNode.parentNode.insertBefore(repeater, templateNode);
    Slim.removeChild(templateNode);
    Slim.bind(source, repeater, path, function () {
      var dataSource = Slim.lookup(source, path);
      repeater.dataSource = dataSource || [];
    });
  };

  // bind:property
  Slim.customDirective(function (attr) {
    return (/^(bind):(\S+)/.exec(attr.nodeName)
    );
  }, function (source, target, attribute, match) {
    var tAttr = match[2];
    var tProp = Slim.dashToCamel(tAttr);
    var expression = attribute.value;
    var oldValue = void 0;
    var rxM = Slim.rxMethod.exec(expression);
    if (rxM) {
      var pNames = rxM[3].split(' ').join('').split(',');
      pNames.forEach(function (pName) {
        Slim.bind(source, target, pName, function () {
          var fn = Slim.lookup(source, rxM[1], target);
          var args = pNames.map(function (prop) {
            return Slim.lookup(source, prop, target);
          });
          var value = fn.apply(source, args);
          if (oldValue === value) return;
          target[tProp] = value;
          target.setAttribute(tAttr, value);
        });
      });
      return;
    }
    var rxP = Slim.rxProp.exec(expression);
    if (rxP) {
      var prop = rxP[1];
      Slim.bind(source, target, prop, function () {
        var value = Slim.lookup(source, expression, target);
        if (oldValue === value) return;
        target.setAttribute(tAttr, value);
        target[tProp] = value;
      });
    }
  });

  if (__flags.isChrome || __flags.isSafari || __flags.isFirefox) Slim.customDirective(function (attr) {
    return attr.nodeName === 's:repeat';
  }, function (source, templateNode, attribute) {
    if (__flags.isFirefox) {
      if (['option', 'td', 'tr', 'th'].indexOf(templateNode.localName) < 0) {
        return wrappedRepeaterExecution(source, templateNode, attribute);
      }
    }
    var path = attribute.value;
    var tProp = 'data';
    if (path.indexOf(' as')) {
      tProp = path.split(' as ')[1] || tProp;
      path = path.split(' as ')[0];
    }

    var clones = [];
    var hook = document.createComment(templateNode.localName + ' s:repeat="' + attribute.value + '"');
    var templateHTML = void 0;
    Slim._$(hook);
    Slim.selectRecursive(templateNode, true).forEach(function (e) {
      return Slim._$(e).excluded = true;
    });
    templateNode.parentElement.insertBefore(hook, templateNode);
    templateNode.remove();
    Slim.unbind(source, templateNode);
    Slim.asap(function () {
      templateNode.setAttribute('s:iterate', '');
      templateNode.removeAttribute('s:repeat');
      templateHTML = templateNode.outerHTML;
      templateNode.innerHTML = '';
    });
    var oldDataSource = [];
    Slim.bind(source, hook, path, function () {
      var dataSource = Slim.lookup(source, path) || [];
      var offset = 0;
      var restOfData = [];
      // get the diff
      var diff = Array(dataSource.length);
      dataSource.forEach(function (d, i) {
        if (oldDataSource[i] !== d) {
          diff[i] = true;
        }
      });
      oldDataSource = dataSource.concat();
      var indices = Object.keys(diff);
      if (dataSource.length < clones.length) {
        var disposables = clones.slice(dataSource.length);
        clones = clones.slice(0, dataSource.length);
        disposables.forEach(function (clone) {
          return clone.remove();
        });
        // unbind disposables?
        indices.forEach(function (index) {
          var clone = clones[index];[clone].concat(Slim.qSelectAll(clone, '*')).forEach(function (t) {
            t[_$2].repeater[tProp] = dataSource[index];
            Slim.commit(t, tProp);
          });
        });
      } else {
        // recycle
        clones.length && indices.forEach(function (index) {
          var clone = clones[index];
          if (!clone) return;
          [clone].concat(Slim.qSelectAll(clone, '*')).forEach(function (t) {
            t[_$2].repeater[tProp] = dataSource[index];
            Slim.commit(t, tProp);
          });
        });
        restOfData = dataSource.slice(clones.length);
        offset = clones.length;
      }
      if (!restOfData.length) return;
      // new clones
      var range = document.createRange();
      range.setStartBefore(hook);
      var html = Array(restOfData.length).fill(templateHTML).join('');
      var frag = range.createContextualFragment(html);
      var all = [];
      var i = 0;
      while (i < frag.children.length) {
        var e = frag.children.item(i);
        clones.push(e);
        all.push(e);
        Slim._$(e).repeater[tProp] = dataSource[i + offset];
        var subTree = Slim.qSelectAll(e, '*');
        subTree.forEach(function (t) {
          all.push(t);
          Slim._$(t).repeater[tProp] = dataSource[i + offset];
          Slim.commit(t, tProp);
        });
        i++;
      }
      source._bindChildren(all);
      all.forEach(function (t) {
        if (t.__isSlim) {
          t.createdCallback();
          Slim.asap(function () {
            Slim.commit(t, tProp);
            t[tProp] = t[_$2].repeater[tProp];
          });
        } else {
          Slim.commit(t, tProp);
          t[tProp] = t[_$2].repeater[tProp];
        }
      });
      hook.parentElement.insertBefore(frag, hook);
    });
    source[_$2].reversed[tProp] = true;
  }, true);else Slim.customDirective(function (attr) {
    return (/^s:repeat$/.test(attr.nodeName)
    );
  }, function (source, templateNode, attribute) {
    wrappedRepeaterExecution(source, templateNode, attribute);

    // source._executeBindings()
  }, true);

  var SlimRepeater = function (_Slim) {
    _inherits(SlimRepeater, _Slim);

    function SlimRepeater() {
      _classCallCheck(this, SlimRepeater);

      return _possibleConstructorReturn(this, (SlimRepeater.__proto__ || Object.getPrototypeOf(SlimRepeater)).apply(this, arguments));
    }

    _createClass(SlimRepeater, [{
      key: '_bindChildren',
      value: function _bindChildren(tree) {
        var _this6 = this;

        tree = Array.prototype.slice.call(tree);
        var directChildren = Array.prototype.filter.call(tree, function (child) {
          return child.parentNode.localName === 'slim-root-fragment';
        });
        directChildren.forEach(function (child, index) {
          child.setAttribute('s:iterate', _this6.dataPath + ' : ' + index);
          Slim.selectRecursive(child).forEach(function (e) {
            Slim._$(e).repeater[_this6.dataProp] = _this6.dataSource[index];
            e[_this6.dataProp] = _this6.dataSource[index];
            if (e instanceof Slim) {
              e[_this6.dataProp] = _this6.dataSource[index];
            }
          });
        });
      }
    }, {
      key: 'onRender',
      value: function onRender() {
        if (!this.boundParent) return;
        var tree = Slim.selectRecursive(this);
        this.boundParent && this.boundParent._bindChildren(tree);
        this.boundParent._executeBindings();
      }
    }, {
      key: 'render',
      value: function render() {
        var _this7 = this;

        if (!this.boundParent) return;
        Slim.qSelectAll(this, '*').forEach(function (e) {
          Slim.unbind(_this7.boundParent, e);
        });
        if (!this.dataSource || !this.templateNode || !this.boundParent) {
          return _get(SlimRepeater.prototype.__proto__ || Object.getPrototypeOf(SlimRepeater.prototype), 'render', this).call(this, '');
        }
        var newTemplate = Array(this.dataSource.length).fill(this.templateNode.outerHTML).join('');
        this.innerHTML = '';
        _get(SlimRepeater.prototype.__proto__ || Object.getPrototypeOf(SlimRepeater.prototype), 'render', this).call(this, newTemplate);
      }
    }, {
      key: 'dataSource',
      get: function get() {
        return this._dataSource;
      },
      set: function set(v) {
        if (this._dataSource !== v) {
          this._dataSource = v;
          this.render();
        }
      }
    }, {
      key: 'boundParent',
      get: function get() {
        return this[_$2].boundParent;
      }
    }]);

    return SlimRepeater;
  }(Slim);

  Slim.tag('slim-repeat', SlimRepeater);

  if (window) {
    window['Slim'] = Slim;
  }
  if (typeof module !== 'undefined') {
    module.exports.Slim = Slim;
  }
})(window, document, HTMLElement);

