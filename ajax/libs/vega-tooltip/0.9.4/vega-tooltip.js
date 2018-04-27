(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.vegaTooltip = {})));
}(this, (function (exports) { 'use strict';

  function stringify (obj, options) {
    options = options || {};
    var indent = JSON.stringify([1], null, get(options, 'indent', 2)).slice(2, -3);
    var addMargin = get(options, 'margins', false);
    var maxLength = (indent === '' ? Infinity : get(options, 'maxLength', 80));

    return (function _stringify (obj, currentIndent, reserved) {
      if (obj && typeof obj.toJSON === 'function') {
        obj = obj.toJSON();
      }

      var string = JSON.stringify(obj);

      if (string === undefined) {
        return string
      }

      var length = maxLength - currentIndent.length - reserved;

      if (string.length <= length) {
        var prettified = prettify(string, addMargin);
        if (prettified.length <= length) {
          return prettified
        }
      }

      if (typeof obj === 'object' && obj !== null) {
        var nextIndent = currentIndent + indent;
        var items = [];
        var delimiters;
        var comma = function (array, index) {
          return (index === array.length - 1 ? 0 : 1)
        };

        if (Array.isArray(obj)) {
          for (var index = 0; index < obj.length; index++) {
            items.push(
              _stringify(obj[index], nextIndent, comma(obj, index)) || 'null'
            );
          }
          delimiters = '[]';
        } else {
          Object.keys(obj).forEach(function (key, index, array) {
            var keyPart = JSON.stringify(key) + ': ';
            var value = _stringify(obj[key], nextIndent,
                                   keyPart.length + comma(array, index));
            if (value !== undefined) {
              items.push(keyPart + value);
            }
          });
          delimiters = '{}';
        }

        if (items.length > 0) {
          return [
            delimiters[0],
            indent + items.join(',\n' + nextIndent),
            delimiters[1]
          ].join('\n' + currentIndent)
        }
      }

      return string
    }(obj, '', 0))
  }

  // Note: This regex matches even invalid JSON strings, but since we’re
  // working on the output of `JSON.stringify` we know that only valid strings
  // are present (unless the user supplied a weird `options.indent` but in
  // that case we don’t care since the output would be invalid anyway).
  var stringOrChar = /("(?:[^\\"]|\\.)*")|[:,\][}{]/g;

  function prettify (string, addMargin) {
    var m = addMargin ? ' ' : '';
    var tokens = {
      '{': '{' + m,
      '[': '[' + m,
      '}': m + '}',
      ']': m + ']',
      ',': ', ',
      ':': ': '
    };
    return string.replace(stringOrChar, function (match, string) {
      return string ? match : tokens[match]
    })
  }

  function get (options, name, defaultValue) {
    return (name in options ? options[name] : defaultValue)
  }

  var jsonStringifyPrettyCompact = stringify;

  var stringify_ = /*#__PURE__*/Object.freeze({
    default: jsonStringifyPrettyCompact,
    __moduleExports: jsonStringifyPrettyCompact
  });

  function accessor(fn, fields, name) {
    fn.fields = fields || [];
    fn.fname = name;
    return fn;
  }

  function error(message) {
    throw Error(message);
  }

  function splitAccessPath(p) {
    var path = [],
        q = null,
        b = 0,
        n = p.length,
        s = '',
        i, j, c;

    p = p + '';

    function push() {
      path.push(s + p.substring(i, j));
      s = '';
      i = j + 1;
    }

    for (i=j=0; j<n; ++j) {
      c = p[j];
      if (c === '\\') {
        s += p.substring(i, j);
        i = ++j;
      } else if (c === q) {
        push();
        q = null;
        b = -1;
      } else if (q) {
        continue;
      } else if (i === b && c === '"') {
        i = j + 1;
        q = c;
      } else if (i === b && c === "'") {
        i = j + 1;
        q = c;
      } else if (c === '.' && !b) {
        if (j > i) {
          push();
        } else {
          i = j + 1;
        }
      } else if (c === '[') {
        if (j > i) push();
        b = i = j + 1;
      } else if (c === ']') {
        if (!b) error('Access path missing open bracket: ' + p);
        if (b > 0) push();
        b = 0;
        i = j + 1;
      }
    }

    if (b) error('Access path missing closing bracket: ' + p);
    if (q) error('Access path missing closing quote: ' + p);

    if (j > i) {
      j++;
      push();
    }

    return path;
  }

  var isArray = Array.isArray;

  function isObject(_) {
    return _ === Object(_);
  }

  function isString(_) {
    return typeof _ === 'string';
  }

  function $(x) {
    return isArray(x) ? '[' + x.map($) + ']'
      : isObject(x) || isString(x) ?
        // Output valid JSON and JS source strings.
        // See http://timelessrepo.com/json-isnt-a-javascript-subset
        JSON.stringify(x).replace('\u2028','\\u2028').replace('\u2029', '\\u2029')
      : x;
  }

  function field(field, name) {
    var path = splitAccessPath(field),
        code = 'return _[' + path.map($).join('][') + '];';

    return accessor(
      Function('_', code),
      [(field = path.length===1 ? path[0] : field)],
      name || field
    );
  }

  var empty = [];

  var id = field('id');

  var identity = accessor(function(_) { return _; }, empty, 'identity');

  var zero = accessor(function() { return 0; }, empty, 'zero');

  var one = accessor(function() { return 1; }, empty, 'one');

  var truthy = accessor(function() { return true; }, empty, 'true');

  var falsy = accessor(function() { return false; }, empty, 'false');

  var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
      }
      return t;
  };
  var __rest = (undefined && undefined.__rest) || function (s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
              t[p[i]] = s[p[i]];
      return t;
  };
  var stringify$1 = jsonStringifyPrettyCompact || stringify_;
  var DEFAULT_OPTIONS = {
      /**
       * X offset.
       */
      offsetX: 10,
      /**
       * Y offset.
       */
      offsetY: 10,
      /**
       * ID of the tooltip element.
       */
      id: 'vg-tooltip-element',
      /**
       * ID of the tooltip CSS style.
       */
      styleId: 'vega-tooltip-style',
      /**
       * The name of the theme. You can use the CSS class called [THEME]-theme to style the tooltips.
       *
       * There are two predefined themes: "light" (default) and "dark".
       */
      theme: 'light',
      /**
       * Do not use the default styles provided by Vega Tooltip. If you enable this option, you need to use your own styles. It is not necessary to disable the default style when using a custom theme.
       */
      disableDefaultStyle: false,
      /**
       * HTML sanitizer function that removes dangerous HTML to prevent XSS.
       *
       * This should be a function from string to string. You may replace it with a formatter such as a markdown formatter.
       */
      sanitize: escapeHTML,
  };
  var STYLE = "\n.vg-tooltip {\n  visibility: hidden;\n  padding: 8px;\n  position: fixed;\n  z-index: 1000;\n  font-family: sans-serif;\n  font-size: 11px;\n  border-radius: 3px;\n  box-shadow: 2px 2px 4px rgba(0,0,0,0.1);\n\n  /* The default theme is the light theme. */\n  background-color: rgba(255, 255, 255, 0.95);\n  border: 1px solid #d9d9d9;\n  color: black;\n}\n.vg-tooltip.visible {\n  visibility: visible;\n}\n.vg-tooltip h2 {\n  margin-top: 0;\n  margin-bottom: 10px;\n  font-size: 13px;\n}\n.vg-tooltip table {\n  border-spacing: 0;\n}\n.vg-tooltip td {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n.vg-tooltip td.key {\n  color: #808080;\n  max-width: 150px;\n  text-align: right;\n  padding-right: 4px;\n}\n.vg-tooltip td.value {\n  max-width: 200px;\n  text-align: left;\n}\n\n/* Dark and light color themes */\n.vg-tooltip.dark-theme {\n  background-color: rgba(32, 32, 32, 0.9);\n  border: 1px solid #f5f5f5;\n  color: white;\n}\n.vg-tooltip.dark-theme td.key {\n  color: #bfbfbf;\n}\n\n.vg-tooltip.light-theme {\n  background-color: rgba(255, 255, 255, 0.95);\n  border: 1px solid #d9d9d9;\n  color: black;\n}\n.vg-tooltip.light-theme td.key {\n  color: #808080;\n}\n";
  /**
   * Escape special HTML characters.
   *
   * @param value A string value to escape.
   */
  function escapeHTML(value) {
      return value.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  }
  /**
   * The tooltip handler class.
   */
  var Handler = /** @class */ (function () {
      /**
       * Create the tooltip handler and initialize the element and style.
       *
       * @param options Tooltip Options
       */
      function Handler(options) {
          this.options = __assign({}, DEFAULT_OPTIONS, options);
          this.call = this.handler.bind(this);
          // append a default stylesheet for tooltips to the head
          if (!this.options.disableDefaultStyle && !document.getElementById(this.options.styleId)) {
              var style = document.createElement('style');
              style.setAttribute('id', this.options.styleId);
              style.innerHTML = STYLE;
              document.querySelector('head').appendChild(style);
          }
          // append a div element that we use as a tooltip unless it already exists
          var el = document.getElementById(this.options.id);
          if (el) {
              this.el = el;
          }
          else {
              this.el = document.createElement('div');
              this.el.setAttribute('id', this.options.id);
              this.el.classList.add('vg-tooltip');
              document.querySelector('body').appendChild(this.el);
          }
      }
      /**
       * The handler function.
       */
      Handler.prototype.handler = function (handler, event, item, value) {
          // console.log(handler, event, item, value);
          if (event.vegaType === undefined) {
              this.el.classList.remove('visible', this.options.theme + "-theme");
              return;
          }
          // set the tooltip content
          this.el.innerHTML = this.formatValue(value);
          // make the tooltip visible
          this.el.classList.add('visible', this.options.theme + "-theme");
          // position the tooltip
          var tooltipWidth = this.el.getBoundingClientRect().width;
          var x = event.clientX + this.options.offsetX;
          if (x + tooltipWidth > window.innerWidth) {
              x = event.clientX - this.options.offsetX - tooltipWidth;
          }
          var tooltipHeight = this.el.getBoundingClientRect().height;
          var y = event.clientY + this.options.offsetY;
          if (y + tooltipHeight > window.innerHeight) {
              y = +event.clientY - this.options.offsetY - tooltipHeight;
          }
          this.el.setAttribute('style', "top: " + y + "px; left: " + x + "px");
      };
      /**
       * Format the value to be shown in the toolip.
       *
       * @param value The value to show in the tooltip.
       */
      Handler.prototype.formatValue = function (value) {
          var sanitize = this.options.sanitize;
          if (isArray(value)) {
              return "[" + value.map(function (v) { return sanitize(isString(v) ? v : stringify$1(v)); }).join(', ') + "]";
          }
          if (isObject(value)) {
              var content = '';
              var _a = value, title = _a.title, rest = __rest(_a, ["title"]);
              if (title) {
                  content += "<h2>" + title + "</h2>";
              }
              content += '<table>';
              for (var _i = 0, _b = Object.keys(rest); _i < _b.length; _i++) {
                  var key$$1 = _b[_i];
                  var val = rest[key$$1];
                  if (isObject(val)) {
                      val = stringify$1(val);
                  }
                  content += "<tr><td class=\"key\">" + sanitize(key$$1) + ":</td><td class=\"value\">" + sanitize(val) + "</td></tr>";
              }
              content += "</table>";
              return content;
          }
          return sanitize(String(value));
      };
      return Handler;
  }());
  /**
   * Create a tooltip handler and register it with the provided view.
   *
   * @param view The Vega view.
   * @param opt Tooltip options.
   */
  function index (view, opt) {
      var handler = new Handler(opt);
      view.tooltip(handler.call).run();
      return handler;
  }

  exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
  exports.escapeHTML = escapeHTML;
  exports.Handler = Handler;
  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=vega-tooltip.js.map
