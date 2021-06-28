Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

var _dataColors = require('../data/colors');

var _dataColors2 = _interopRequireDefault(_dataColors);

'use babel';

var Provider = (function (_Disposable) {
	_inherits(Provider, _Disposable);

	function Provider() {
		_classCallCheck(this, Provider);

		_get(Object.getPrototypeOf(Provider.prototype), 'constructor', this).call(this);
		this.selector = '.text.html.basic, .source.js, .source.css, .source.css.less, .source.css.scss, .source.sass, .source.stylus, .source.jsx';
		this.suggestionPriority = 0;
	}

	_createClass(Provider, [{
		key: 'getSuggestions',
		value: function getSuggestions(_ref) {
			var prefix = _ref.prefix;
			var bufferPosition = _ref.bufferPosition;
			var editor = _ref.editor;

			var line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);

			if (line.includes('#mc')) {
				var suggestions = [];
				for (var color in _dataColors2['default']) {
					suggestions.push({
						replacementPrefix: '#mc',
						text: _dataColors2['default'][color],
						leftLabelHTML: '<div style="background-color:' + _dataColors2['default'][color] + '" class="color-preview"></div>',
						rightLabelHTML: '<div class="color-name">' + color + '</div>'
					});
				}
				return suggestions;
			}
			return [];
		}
	}]);

	return Provider;
})(_atom.Disposable);

exports['default'] = Provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9tYXRlcmlhbC1jb2xvcnMvbGliL3Byb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O29CQUUyQixNQUFNOzswQkFDZCxnQkFBZ0I7Ozs7QUFIbkMsV0FBVyxDQUFDOztJQUtTLFFBQVE7V0FBUixRQUFROztBQUNqQixVQURTLFFBQVEsR0FDZDt3QkFETSxRQUFROztBQUUzQiw2QkFGbUIsUUFBUSw2Q0FFbkI7QUFDUixNQUFJLENBQUMsUUFBUSxHQUNaLDBIQUEwSCxDQUFDO0FBQzVILE1BQUksQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLENBQUM7RUFDNUI7O2NBTm1CLFFBQVE7O1NBUWQsd0JBQUMsSUFBa0MsRUFBRTtPQUFsQyxNQUFNLEdBQVIsSUFBa0MsQ0FBaEMsTUFBTTtPQUFFLGNBQWMsR0FBeEIsSUFBa0MsQ0FBeEIsY0FBYztPQUFFLE1BQU0sR0FBaEMsSUFBa0MsQ0FBUixNQUFNOztBQUM5QyxPQUFNLElBQUksR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQ2xDLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFDdkIsY0FBYyxDQUNkLENBQUMsQ0FBQzs7QUFFSCxPQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDekIsUUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLFNBQUssSUFBSSxLQUFLLDZCQUFZO0FBQ3pCLGdCQUFXLENBQUMsSUFBSSxDQUFDO0FBQ2hCLHVCQUFpQixFQUFFLEtBQUs7QUFDeEIsVUFBSSxFQUFFLHdCQUFPLEtBQUssQ0FBQztBQUNuQixtQkFBYSxvQ0FDWix3QkFBTyxLQUFLLENBQUMsbUNBQ2tCO0FBQ2hDLG9CQUFjLCtCQUE2QixLQUFLLFdBQVE7TUFDeEQsQ0FBQyxDQUFDO0tBQ0g7QUFDRCxXQUFPLFdBQVcsQ0FBQztJQUNuQjtBQUNELFVBQU8sRUFBRSxDQUFDO0dBQ1Y7OztRQTdCbUIsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL21hdGVyaWFsLWNvbG9ycy9saWIvcHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGNvbG9ycyBmcm9tICcuLi9kYXRhL2NvbG9ycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3ZpZGVyIGV4dGVuZHMgRGlzcG9zYWJsZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zZWxlY3RvciA9XG5cdFx0XHQnLnRleHQuaHRtbC5iYXNpYywgLnNvdXJjZS5qcywgLnNvdXJjZS5jc3MsIC5zb3VyY2UuY3NzLmxlc3MsIC5zb3VyY2UuY3NzLnNjc3MsIC5zb3VyY2Uuc2FzcywgLnNvdXJjZS5zdHlsdXMsIC5zb3VyY2UuanN4Jztcblx0XHR0aGlzLnN1Z2dlc3Rpb25Qcmlvcml0eSA9IDA7XG5cdH1cblxuXHRnZXRTdWdnZXN0aW9ucyh7IHByZWZpeCwgYnVmZmVyUG9zaXRpb24sIGVkaXRvciB9KSB7XG5cdFx0Y29uc3QgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbXG5cdFx0XHRbYnVmZmVyUG9zaXRpb24ucm93LCAwXSxcblx0XHRcdGJ1ZmZlclBvc2l0aW9uXG5cdFx0XSk7XG5cblx0XHRpZiAobGluZS5pbmNsdWRlcygnI21jJykpIHtcblx0XHRcdGxldCBzdWdnZXN0aW9ucyA9IFtdO1xuXHRcdFx0Zm9yIChsZXQgY29sb3IgaW4gY29sb3JzKSB7XG5cdFx0XHRcdHN1Z2dlc3Rpb25zLnB1c2goe1xuXHRcdFx0XHRcdHJlcGxhY2VtZW50UHJlZml4OiAnI21jJyxcblx0XHRcdFx0XHR0ZXh0OiBjb2xvcnNbY29sb3JdLFxuXHRcdFx0XHRcdGxlZnRMYWJlbEhUTUw6IGA8ZGl2IHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjoke1xuXHRcdFx0XHRcdFx0Y29sb3JzW2NvbG9yXVxuXHRcdFx0XHRcdH1cIiBjbGFzcz1cImNvbG9yLXByZXZpZXdcIj48L2Rpdj5gLFxuXHRcdFx0XHRcdHJpZ2h0TGFiZWxIVE1MOiBgPGRpdiBjbGFzcz1cImNvbG9yLW5hbWVcIj4ke2NvbG9yfTwvZGl2PmBcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gc3VnZ2VzdGlvbnM7XG5cdFx0fVxuXHRcdHJldHVybiBbXTtcblx0fVxufVxuIl19