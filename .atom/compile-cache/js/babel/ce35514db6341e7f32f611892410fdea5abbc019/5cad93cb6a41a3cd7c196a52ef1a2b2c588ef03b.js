Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _lodashGet = require('lodash.get');

var _lodashGet2 = _interopRequireDefault(_lodashGet);

var _lodashSet = require('lodash.set');

var _lodashSet2 = _interopRequireDefault(_lodashSet);

var _regexes = require('./regexes');

'use babel';

var makeContainer = function makeContainer(_ref) {
  var items = _ref.items;
  var size = _ref.size;
  var onClick = _ref.onClick;
  var isInteractive = _ref.isInteractive;

  var container = document.createElement('div');
  container.classList.add('highlight-color-container');

  if (isInteractive) {
    container.classList.add('interactive');
  }

  container.style.setProperty('--highlight-color-line-height', size + 'px');

  var _loop = function (_ref2) {
    var color = _ref2.color;
    var resultRange = _ref2.resultRange;

    var element = document.createElement('div');
    element.classList.add('highlight-color-item');
    element.style.setProperty('--highlight-color-color', color);

    if (isInteractive) {
      element.addEventListener('click', function () {
        return onClick(resultRange);
      });
    }

    container.appendChild(element);
  };

  for (var _ref2 of items) {
    _loop(_ref2);
  }

  return container;
};

var HighlightColors = function HighlightColors() {
  var _this = this;

  _classCallCheck(this, HighlightColors);

  this.subscriptions = new _atom.CompositeDisposable();
  this.results = {};
  this.decorations = {};
  this.config = {
    highlightCssNamedColors: {
      title: 'Highlight named colors',
      description: '\nBy default, highlight-colors will highlight named css colors like `red`, `blue` or `rebeccapurple`.\nThis can cause issues with text where those color names are part of something else, like an html class name: `.button-red`.\nDisable this option to turn off highlighting of named css colors.\n      ',
      type: 'boolean',
      'default': true
    }
  };

  this.consumeColorPicker = function (service) {
    _this.colorPickerService = service;

    var editorIds = Object.keys(_this.results);

    atom.workspace.getTextEditors().filter(function (_ref3) {
      var id = _ref3.id;
      return !editorIds.includes(id);
    }).forEach(_this.updateDecorations);

    return new _atom.Disposable(_this.consumeColorPicker);
  };

  this.openColorPicker = function (range, editor) {
    editor.setCursorBufferPosition(range.start);
    _this.colorPickerService.open();
  };

  this.activate = function () {
    _this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      _this.results[editor.id] = _this.results[editor.id] || {};
      _this.decorations[editor.id] = _this.decorations[editor.id] || [];

      editor.onDidChange(function () {
        return _this.updateDecorations(editor);
      });

      setTimeout(function () {
        _this.updateDecorations(editor);
      }, 10);
    }), atom.config.observe('highlight-colors.highlightCssNamedColors', function () {
      atom.workspace.getTextEditors().forEach(function (editor) {
        _this.updateDecorations(editor);
      });
    }));
  };

  this.updateDecorations = function (editor) {
    for (var decoration of _this.decorations[editor.id]) {
      decoration.getMarker().destroy();
    }

    _this.decorations[editor.id] = [];
    _this.results[editor.id] = {};
    var lineHeight = editor.getLineHeightInPixels();

    var searchRegex = undefined;

    if (atom.config.get('highlight-colors.highlightCssNamedColors')) {
      searchRegex = [].concat(_toConsumableArray(_regexes.cssColorRegex), [_regexes.cssNamedColorRegex]);
    } else {
      searchRegex = _regexes.cssColorRegex;
    }

    editor.scan(new RegExp(searchRegex.join('|'), 'gi'), function (result) {
      var row = (0, _lodashGet2['default'])(_this.results, [editor.id, result.range.start.row]);
      var match = {
        resultRange: result.range,
        range: editor.bufferRangeForBufferRow(result.range.start.row),
        color: result.matchText
      };

      if (row) {
        (0, _lodashSet2['default'])(_this.results, [editor.id, result.range.start.row, row.length], match);
      } else {
        (0, _lodashSet2['default'])(_this.results, [editor.id, result.range.start.row], [match]);
      }
    });

    for (var row in _this.results[editor.id]) {
      _this.results[editor.id][row].sort(function (_ref4, _ref5) {
        var rangeA = _ref4.range;
        var rangeB = _ref5.range;
        return rangeA.compare(rangeB);
      });
      var rightMostRange = _this.results[editor.id][row][_this.results[editor.id][row].length - 1].range;

      _this.decorations[editor.id].push(editor.decorateMarker(editor.markBufferRange(rightMostRange), {
        type: 'overlay',
        'class': 'highlight-color',
        item: makeContainer({
          items: _this.results[editor.id][row],
          size: lineHeight,
          onClick: function onClick(range) {
            return _this.openColorPicker(range, editor);
          },
          isInteractive: _this.colorPickerService !== undefined
        }),
        position: 'head',
        avoidOverflow: false
      }));
    }
  };

  this.deactivate = function () {
    _this.subscriptions.dispose();
  };
};

exports['default'] = new HighlightColors();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtY29sb3JzL2xpYi9oaWdobGlnaHQtY29sb3JzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWdELE1BQU07O3lCQUN0QyxZQUFZOzs7O3lCQUNaLFlBQVk7Ozs7dUJBRXNCLFdBQVc7O0FBTjdELFdBQVcsQ0FBQTs7QUFRWCxJQUFNLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUksSUFBdUMsRUFBSztNQUExQyxLQUFLLEdBQVAsSUFBdUMsQ0FBckMsS0FBSztNQUFFLElBQUksR0FBYixJQUF1QyxDQUE5QixJQUFJO01BQUUsT0FBTyxHQUF0QixJQUF1QyxDQUF4QixPQUFPO01BQUUsYUFBYSxHQUFyQyxJQUF1QyxDQUFmLGFBQWE7O0FBQzFELE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0MsV0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQTs7QUFFcEQsTUFBSSxhQUFhLEVBQUU7QUFDakIsYUFBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUE7R0FDdkM7O0FBRUQsV0FBUyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsK0JBQStCLEVBQUssSUFBSSxRQUFLLENBQUE7OztRQUU5RCxLQUFLLFNBQUwsS0FBSztRQUFFLFdBQVcsU0FBWCxXQUFXOztBQUMzQixRQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzdDLFdBQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUE7QUFDN0MsV0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDLENBQUE7O0FBRTNELFFBQUksYUFBYSxFQUFFO0FBQ2pCLGFBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVB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R0FBRyxZQUFNO0FBQ2pCLFVBQUssYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQzdCOzs7cUJBR1ksSUFBSSxlQUFlLEVBQUUiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1jb2xvcnMvbGliL2hpZ2hsaWdodC1jb2xvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCdcbmltcG9ydCBzZXQgZnJvbSAnbG9kYXNoLnNldCdcblxuaW1wb3J0IHsgY3NzQ29sb3JSZWdleCwgY3NzTmFtZWRDb2xvclJlZ2V4IH0gZnJvbSAnLi9yZWdleGVzJ1xuXG5jb25zdCBtYWtlQ29udGFpbmVyID0gKHsgaXRlbXMsIHNpemUsIG9uQ2xpY2ssIGlzSW50ZXJhY3RpdmUgfSkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0LWNvbG9yLWNvbnRhaW5lcicpXG5cbiAgaWYgKGlzSW50ZXJhY3RpdmUpIHtcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaW50ZXJhY3RpdmUnKVxuICB9XG5cbiAgY29udGFpbmVyLnN0eWxlLnNldFByb3BlcnR5KCctLWhpZ2hsaWdodC1jb2xvci1saW5lLWhlaWdodCcsIGAke3NpemV9cHhgKVxuXG4gIGZvciAobGV0IHsgY29sb3IsIHJlc3VsdFJhbmdlIH0gb2YgaXRlbXMpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodC1jb2xvci1pdGVtJylcbiAgICBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWhpZ2hsaWdodC1jb2xvci1jb2xvcicsIGNvbG9yKVxuXG4gICAgaWYgKGlzSW50ZXJhY3RpdmUpIHtcbiAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBvbkNsaWNrKHJlc3VsdFJhbmdlKSlcbiAgICB9XG5cbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZWxlbWVudClcbiAgfVxuXG4gIHJldHVybiBjb250YWluZXJcbn1cblxuY2xhc3MgSGlnaGxpZ2h0Q29sb3JzIHtcbiAgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgcmVzdWx0cyA9IHt9XG4gIGRlY29yYXRpb25zID0ge31cbiAgY29uZmlnID0ge1xuICAgIGhpZ2hsaWdodENzc05hbWVkQ29sb3JzOiB7XG4gICAgICB0aXRsZTogJ0hpZ2hsaWdodCBuYW1lZCBjb2xvcnMnLFxuICAgICAgZGVzY3JpcHRpb246IGBcbkJ5IGRlZmF1bHQsIGhpZ2hsaWdodC1jb2xvcnMgd2lsbCBoaWdobGlnaHQgbmFtZWQgY3NzIGNvbG9ycyBsaWtlIFxcYHJlZFxcYCwgXFxgYmx1ZVxcYCBvciBcXGByZWJlY2NhcHVycGxlXFxgLlxuVGhpcyBjYW4gY2F1c2UgaXNzdWVzIHdpdGggdGV4dCB3aGVyZSB0aG9zZSBjb2xvciBuYW1lcyBhcmUgcGFydCBvZiBzb21ldGhpbmcgZWxzZSwgbGlrZSBhbiBodG1sIGNsYXNzIG5hbWU6IFxcYC5idXR0b24tcmVkXFxgLlxuRGlzYWJsZSB0aGlzIG9wdGlvbiB0byB0dXJuIG9mZiBoaWdobGlnaHRpbmcgb2YgbmFtZWQgY3NzIGNvbG9ycy5cbiAgICAgIGAsXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZWZhdWx0OiB0cnVlLFxuICAgIH0sXG4gIH1cblxuICBjb25zdW1lQ29sb3JQaWNrZXIgPSBzZXJ2aWNlID0+IHtcbiAgICB0aGlzLmNvbG9yUGlja2VyU2VydmljZSA9IHNlcnZpY2VcblxuICAgIGNvbnN0IGVkaXRvcklkcyA9IE9iamVjdC5rZXlzKHRoaXMucmVzdWx0cylcblxuICAgIGF0b20ud29ya3NwYWNlXG4gICAgICAuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgLmZpbHRlcigoeyBpZCB9KSA9PiAhZWRpdG9ySWRzLmluY2x1ZGVzKGlkKSlcbiAgICAgIC5mb3JFYWNoKHRoaXMudXBkYXRlRGVjb3JhdGlvbnMpXG5cbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUodGhpcy5jb25zdW1lQ29sb3JQaWNrZXIpXG4gIH1cblxuICBvcGVuQ29sb3JQaWNrZXIgPSAocmFuZ2UsIGVkaXRvcikgPT4ge1xuICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihyYW5nZS5zdGFydClcbiAgICB0aGlzLmNvbG9yUGlja2VyU2VydmljZS5vcGVuKClcbiAgfVxuXG4gIGFjdGl2YXRlID0gKCkgPT4ge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgICAgdGhpcy5yZXN1bHRzW2VkaXRvci5pZF0gPSB0aGlzLnJlc3VsdHNbZWRpdG9yLmlkXSB8fCB7fVxuICAgICAgICB0aGlzLmRlY29yYXRpb25zW2VkaXRvci5pZF0gPSB0aGlzLmRlY29yYXRpb25zW2VkaXRvci5pZF0gfHwgW11cblxuICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2UoKCkgPT4gdGhpcy51cGRhdGVEZWNvcmF0aW9ucyhlZGl0b3IpKVxuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlRGVjb3JhdGlvbnMoZWRpdG9yKVxuICAgICAgICB9LCAxMClcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnaGlnaGxpZ2h0LWNvbG9ycy5oaWdobGlnaHRDc3NOYW1lZENvbG9ycycsICgpID0+IHtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoKGVkaXRvciA9PiB7XG4gICAgICAgICAgdGhpcy51cGRhdGVEZWNvcmF0aW9ucyhlZGl0b3IpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIClcbiAgfVxuXG4gIHVwZGF0ZURlY29yYXRpb25zID0gZWRpdG9yID0+IHtcbiAgICBmb3IgKGNvbnN0IGRlY29yYXRpb24gb2YgdGhpcy5kZWNvcmF0aW9uc1tlZGl0b3IuaWRdKSB7XG4gICAgICBkZWNvcmF0aW9uLmdldE1hcmtlcigpLmRlc3Ryb3koKVxuICAgIH1cblxuICAgIHRoaXMuZGVjb3JhdGlvbnNbZWRpdG9yLmlkXSA9IFtdXG4gICAgdGhpcy5yZXN1bHRzW2VkaXRvci5pZF0gPSB7fVxuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKClcblxuICAgIGxldCBzZWFyY2hSZWdleFxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LWNvbG9ycy5oaWdobGlnaHRDc3NOYW1lZENvbG9ycycpKSB7XG4gICAgICBzZWFyY2hSZWdleCA9IFsuLi5jc3NDb2xvclJlZ2V4LCBjc3NOYW1lZENvbG9yUmVnZXhdXG4gICAgfSBlbHNlIHtcbiAgICAgIHNlYXJjaFJlZ2V4ID0gY3NzQ29sb3JSZWdleFxuICAgIH1cblxuICAgIGVkaXRvci5zY2FuKG5ldyBSZWdFeHAoc2VhcmNoUmVnZXguam9pbignfCcpLCAnZ2knKSwgcmVzdWx0ID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IGdldCh0aGlzLnJlc3VsdHMsIFtlZGl0b3IuaWQsIHJlc3VsdC5yYW5nZS5zdGFydC5yb3ddKVxuICAgICAgY29uc3QgbWF0Y2ggPSB7XG4gICAgICAgIHJlc3VsdFJhbmdlOiByZXN1bHQucmFuZ2UsXG4gICAgICAgIHJhbmdlOiBlZGl0b3IuYnVmZmVyUmFuZ2VGb3JCdWZmZXJSb3cocmVzdWx0LnJhbmdlLnN0YXJ0LnJvdyksXG4gICAgICAgIGNvbG9yOiByZXN1bHQubWF0Y2hUZXh0LFxuICAgICAgfVxuXG4gICAgICBpZiAocm93KSB7XG4gICAgICAgIHNldChcbiAgICAgICAgICB0aGlzLnJlc3VsdHMsXG4gICAgICAgICAgW2VkaXRvci5pZCwgcmVzdWx0LnJhbmdlLnN0YXJ0LnJvdywgcm93Lmxlbmd0aF0sXG4gICAgICAgICAgbWF0Y2hcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0KHRoaXMucmVzdWx0cywgW2VkaXRvci5pZCwgcmVzdWx0LnJhbmdlLnN0YXJ0LnJvd10sIFttYXRjaF0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGZvciAoY29uc3Qgcm93IGluIHRoaXMucmVzdWx0c1tlZGl0b3IuaWRdKSB7XG4gICAgICB0aGlzLnJlc3VsdHNbZWRpdG9yLmlkXVtyb3ddLnNvcnQoXG4gICAgICAgICh7IHJhbmdlOiByYW5nZUEgfSwgeyByYW5nZTogcmFuZ2VCIH0pID0+IHJhbmdlQS5jb21wYXJlKHJhbmdlQilcbiAgICAgIClcbiAgICAgIGNvbnN0IHJpZ2h0TW9zdFJhbmdlID0gdGhpcy5yZXN1bHRzW2VkaXRvci5pZF1bcm93XVtcbiAgICAgICAgdGhpcy5yZXN1bHRzW2VkaXRvci5pZF1bcm93XS5sZW5ndGggLSAxXG4gICAgICBdLnJhbmdlXG5cbiAgICAgIHRoaXMuZGVjb3JhdGlvbnNbZWRpdG9yLmlkXS5wdXNoKFxuICAgICAgICBlZGl0b3IuZGVjb3JhdGVNYXJrZXIoZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShyaWdodE1vc3RSYW5nZSksIHtcbiAgICAgICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICAgICAgY2xhc3M6ICdoaWdobGlnaHQtY29sb3InLFxuICAgICAgICAgIGl0ZW06IG1ha2VDb250YWluZXIoe1xuICAgICAgICAgICAgaXRlbXM6IHRoaXMucmVzdWx0c1tlZGl0b3IuaWRdW3Jvd10sXG4gICAgICAgICAgICBzaXplOiBsaW5lSGVpZ2h0LFxuICAgICAgICAgICAgb25DbGljazogcmFuZ2UgPT4gdGhpcy5vcGVuQ29sb3JQaWNrZXIocmFuZ2UsIGVkaXRvciksXG4gICAgICAgICAgICBpc0ludGVyYWN0aXZlOiB0aGlzLmNvbG9yUGlja2VyU2VydmljZSAhPT0gdW5kZWZpbmVkLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIHBvc2l0aW9uOiAnaGVhZCcsXG4gICAgICAgICAgYXZvaWRPdmVyZmxvdzogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgZGVhY3RpdmF0ZSA9ICgpID0+IHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEhpZ2hsaWdodENvbG9ycygpXG4iXX0=