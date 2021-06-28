Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _cssColorList = require('css-color-list');

var _cssColorList2 = _interopRequireDefault(_cssColorList);

'use babel';

var cssColorRegex = ['#(?:[0-9a-f]{2}){2,4}', '#[0-9a-f]{3}', 'rgb\\((-?\\d+%\\s*,\\s*){2}(-?\\d+%\\s*)\\)', 'rgba\\((-?\\d+\\s*,\\s*){3}(-?\\d+(\\.\\d+)?\\s*)\\)', 'rgba\\((-?\\d+%\\s*,\\s*){3}(-?\\d+(\\.\\d+)?\\s*)\\)', 'hsl\\((-?\\d+\\s*,\\s*)(-?\\d+%\\s*,\\s*)(-?\\d+%\\s*)\\)', 'hsla\\((-?\\d+\\s*,\\s*)(-?\\d+%\\s*,\\s*){2}(-?\\d+(\\.\\d+)?\\s*)\\)'];

exports.cssColorRegex = cssColorRegex;
var cssNamedColorRegex = [].concat(_toConsumableArray((0, _cssColorList2['default'])()), ['transparent']).map(function (color) {
  return '\\b' + color + '\\b';
}).join('|');
exports.cssNamedColorRegex = cssNamedColorRegex;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtY29sb3JzL2xpYi9yZWdleGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzRCQUV5QixnQkFBZ0I7Ozs7QUFGekMsV0FBVyxDQUFBOztBQUlKLElBQU0sYUFBYSxHQUFHLENBQzNCLHVCQUF1QixFQUN2QixjQUFjLEVBQ2QsNkNBQTZDLEVBQzdDLHNEQUFzRCxFQUN0RCx1REFBdUQsRUFDdkQsMkRBQTJELEVBQzNELHdFQUF3RSxDQUN6RSxDQUFBOzs7QUFFTSxJQUFNLGtCQUFrQixHQUFHLDZCQUFJLGdDQUFjLElBQUUsYUFBYSxHQUNoRSxHQUFHLENBQUMsVUFBQSxLQUFLO2lCQUFVLEtBQUs7Q0FBSyxDQUFDLENBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvaGlnaGxpZ2h0LWNvbG9ycy9saWIvcmVnZXhlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBjc3NDb2xvckxpc3QgZnJvbSAnY3NzLWNvbG9yLWxpc3QnXG5cbmV4cG9ydCBjb25zdCBjc3NDb2xvclJlZ2V4ID0gW1xuICAnIyg/OlswLTlhLWZdezJ9KXsyLDR9JyxcbiAgJyNbMC05YS1mXXszfScsXG4gICdyZ2JcXFxcKCgtP1xcXFxkKyVcXFxccyosXFxcXHMqKXsyfSgtP1xcXFxkKyVcXFxccyopXFxcXCknLFxuICAncmdiYVxcXFwoKC0/XFxcXGQrXFxcXHMqLFxcXFxzKil7M30oLT9cXFxcZCsoXFxcXC5cXFxcZCspP1xcXFxzKilcXFxcKScsXG4gICdyZ2JhXFxcXCgoLT9cXFxcZCslXFxcXHMqLFxcXFxzKil7M30oLT9cXFxcZCsoXFxcXC5cXFxcZCspP1xcXFxzKilcXFxcKScsXG4gICdoc2xcXFxcKCgtP1xcXFxkK1xcXFxzKixcXFxccyopKC0/XFxcXGQrJVxcXFxzKixcXFxccyopKC0/XFxcXGQrJVxcXFxzKilcXFxcKScsXG4gICdoc2xhXFxcXCgoLT9cXFxcZCtcXFxccyosXFxcXHMqKSgtP1xcXFxkKyVcXFxccyosXFxcXHMqKXsyfSgtP1xcXFxkKyhcXFxcLlxcXFxkKyk/XFxcXHMqKVxcXFwpJyxcbl1cblxuZXhwb3J0IGNvbnN0IGNzc05hbWVkQ29sb3JSZWdleCA9IFsuLi5jc3NDb2xvckxpc3QoKSwgJ3RyYW5zcGFyZW50J11cbiAgLm1hcChjb2xvciA9PiBgXFxcXGIke2NvbG9yfVxcXFxiYClcbiAgLmpvaW4oJ3wnKVxuIl19