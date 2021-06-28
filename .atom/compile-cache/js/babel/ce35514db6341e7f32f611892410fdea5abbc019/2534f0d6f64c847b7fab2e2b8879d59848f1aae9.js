Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

'use babel';

var MaterialColorAutocomplete = (function () {
	function MaterialColorAutocomplete() {
		_classCallCheck(this, MaterialColorAutocomplete);

		this.provider = null;
		this.subscriptions = null;
	}

	_createClass(MaterialColorAutocomplete, [{
		key: 'activate',
		value: function activate() {
			this.subscriptions = new _atom.CompositeDisposable();
		}
	}, {
		key: 'deactivate',
		value: function deactivate() {
			if (this.subscriptions) {
				this.subscriptions.dispose();
			}
			this.provider = null;
			this.subscriptions = null;
		}
	}, {
		key: 'getProvider',
		value: function getProvider() {
			if (this.provider) {
				return this.provider;
			}
			this.provider = new _provider2['default']();

			return this.provider;
		}
	}]);

	return MaterialColorAutocomplete;
})();

exports['default'] = new MaterialColorAutocomplete();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9tYXRlcmlhbC1jb2xvcnMvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFb0MsTUFBTTs7d0JBQ3JCLFlBQVk7Ozs7QUFIakMsV0FBVyxDQUFDOztJQUtOLHlCQUF5QjtBQUNuQixVQUROLHlCQUF5QixHQUNoQjt3QkFEVCx5QkFBeUI7O0FBRTdCLE1BQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0VBQzFCOztjQUpJLHlCQUF5Qjs7U0FNdEIsb0JBQUc7QUFDVixPQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0dBQy9DOzs7U0FFUyxzQkFBRztBQUNaLE9BQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN2QixRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCO0FBQ0QsT0FBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDckIsT0FBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7R0FDMUI7OztTQUVVLHVCQUFHO0FBQ2IsT0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2xCLFdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUNyQjtBQUNELE9BQUksQ0FBQyxRQUFRLEdBQUcsMkJBQWMsQ0FBQzs7QUFFL0IsVUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0dBQ3JCOzs7UUF6QkkseUJBQXlCOzs7cUJBNEJoQixJQUFJLHlCQUF5QixFQUFFIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9tYXRlcmlhbC1jb2xvcnMvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IFByb3ZpZGVyIGZyb20gJy4vcHJvdmlkZXInO1xuXG5jbGFzcyBNYXRlcmlhbENvbG9yQXV0b2NvbXBsZXRlIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5wcm92aWRlciA9IG51bGw7XG5cdFx0dGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcblx0fVxuXG5cdGFjdGl2YXRlKCkge1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cdH1cblxuXHRkZWFjdGl2YXRlKCkge1xuXHRcdGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcblx0XHRcdHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG5cdFx0fVxuXHRcdHRoaXMucHJvdmlkZXIgPSBudWxsO1xuXHRcdHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG5cdH1cblxuXHRnZXRQcm92aWRlcigpIHtcblx0XHRpZiAodGhpcy5wcm92aWRlcikge1xuXHRcdFx0cmV0dXJuIHRoaXMucHJvdmlkZXI7XG5cdFx0fVxuXHRcdHRoaXMucHJvdmlkZXIgPSBuZXcgUHJvdmlkZXIoKTtcblxuXHRcdHJldHVybiB0aGlzLnByb3ZpZGVyO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBNYXRlcmlhbENvbG9yQXV0b2NvbXBsZXRlKCk7XG4iXX0=