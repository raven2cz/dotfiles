Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _viewList = require('./view-list');

var _viewList2 = _interopRequireDefault(_viewList);

var _providersList = require('./providers-list');

var _providersList2 = _interopRequireDefault(_providersList);

var _providersHighlight = require('./providers-highlight');

var _providersHighlight2 = _interopRequireDefault(_providersHighlight);

var Intentions = (function () {
  function Intentions() {
    var _this = this;

    _classCallCheck(this, Intentions);

    this.active = null;
    this.commands = new _commands2['default']();
    this.providersList = new _providersList2['default']();
    this.providersHighlight = new _providersHighlight2['default']();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.providersList);
    this.subscriptions.add(this.providersHighlight);

    // eslint-disable-next-line arrow-parens
    this.commands.onListShow(_asyncToGenerator(function* (textEditor) {
      var results = yield _this.providersList.trigger(textEditor);
      if (!results.length) {
        return false;
      }

      var listView = new _viewList2['default']();
      var subscriptions = new _sbEventKit.CompositeDisposable();

      listView.activate(textEditor, results);
      listView.onDidSelect(function (intention) {
        intention.selected();
        subscriptions.dispose();
      });

      subscriptions.add(listView);
      subscriptions.add(function () {
        if (_this.active === subscriptions) {
          _this.active = null;
        }
      });
      subscriptions.add(_this.commands.onListMove(function (movement) {
        listView.move(movement);
      }));
      subscriptions.add(_this.commands.onListConfirm(function () {
        listView.select();
      }));
      subscriptions.add(_this.commands.onListHide(function () {
        subscriptions.dispose();
      }));
      _this.active = subscriptions;
      return true;
    }));
    // eslint-disable-next-line arrow-parens
    this.commands.onHighlightsShow(_asyncToGenerator(function* (textEditor) {
      var results = yield _this.providersHighlight.trigger(textEditor);
      if (!results.length) {
        return false;
      }

      var painted = _this.providersHighlight.paint(textEditor, results);
      var subscriptions = new _sbEventKit.CompositeDisposable();

      subscriptions.add(function () {
        if (_this.active === subscriptions) {
          _this.active = null;
        }
      });
      subscriptions.add(_this.commands.onHighlightsHide(function () {
        subscriptions.dispose();
      }));
      subscriptions.add(painted);
      _this.active = subscriptions;

      return true;
    }));
  }

  _createClass(Intentions, [{
    key: 'activate',
    value: function activate() {
      this.commands.activate();
    }
  }, {
    key: 'consumeListProvider',
    value: function consumeListProvider(provider) {
      this.providersList.addProvider(provider);
    }
  }, {
    key: 'deleteListProvider',
    value: function deleteListProvider(provider) {
      this.providersList.deleteProvider(provider);
    }
  }, {
    key: 'consumeHighlightProvider',
    value: function consumeHighlightProvider(provider) {
      this.providersHighlight.addProvider(provider);
    }
  }, {
    key: 'deleteHighlightProvider',
    value: function deleteHighlightProvider(provider) {
      this.providersHighlight.deleteProvider(provider);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.active) {
        this.active.dispose();
      }
    }
  }]);

  return Intentions;
})();

exports['default'] = Intentions;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzswQkFFZ0QsY0FBYzs7d0JBRXpDLFlBQVk7Ozs7d0JBQ1osYUFBYTs7Ozs2QkFDUixrQkFBa0I7Ozs7a0NBQ2IsdUJBQXVCOzs7O0lBR2pDLFVBQVU7QUFNbEIsV0FOUSxVQUFVLEdBTWY7OzswQkFOSyxVQUFVOztBQU8zQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLGFBQWEsR0FBRyxnQ0FBbUIsQ0FBQTtBQUN4QyxRQUFJLENBQUMsa0JBQWtCLEdBQUcscUNBQXdCLENBQUE7QUFDbEQsUUFBSSxDQUFDLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUMxQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7O0FBRy9DLFFBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxtQkFBQyxXQUFPLFVBQVUsRUFBSztBQUM3QyxVQUFNLE9BQU8sR0FBRyxNQUFNLE1BQUssYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUM1RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNuQixlQUFPLEtBQUssQ0FBQTtPQUNiOztBQUVELFVBQU0sUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDL0IsVUFBTSxhQUFhLEdBQUcscUNBQXlCLENBQUE7O0FBRS9DLGNBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxD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QixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3RCO0tBQ0Y7OztTQS9Ga0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlIH0gZnJvbSAnc2ItZXZlbnQta2l0J1xuXG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcydcbmltcG9ydCBMaXN0VmlldyBmcm9tICcuL3ZpZXctbGlzdCdcbmltcG9ydCBQcm92aWRlcnNMaXN0IGZyb20gJy4vcHJvdmlkZXJzLWxpc3QnXG5pbXBvcnQgUHJvdmlkZXJzSGlnaGxpZ2h0IGZyb20gJy4vcHJvdmlkZXJzLWhpZ2hsaWdodCdcbmltcG9ydCB0eXBlIHsgTGlzdFByb3ZpZGVyLCBIaWdobGlnaHRQcm92aWRlciB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEludGVudGlvbnMge1xuICBhY3RpdmU6ID9EaXNwb3NhYmxlO1xuICBjb21tYW5kczogQ29tbWFuZHM7XG4gIHByb3ZpZGVyc0xpc3Q6IFByb3ZpZGVyc0xpc3Q7XG4gIHByb3ZpZGVyc0hpZ2hsaWdodDogUHJvdmlkZXJzSGlnaGxpZ2h0O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICB0aGlzLmNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICB0aGlzLnByb3ZpZGVyc0xpc3QgPSBuZXcgUHJvdmlkZXJzTGlzdCgpXG4gICAgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQgPSBuZXcgUHJvdmlkZXJzSGlnaGxpZ2h0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnByb3ZpZGVyc0xpc3QpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnByb3ZpZGVyc0hpZ2hsaWdodClcblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBhcnJvdy1wYXJlbnNcbiAgICB0aGlzLmNvbW1hbmRzLm9uTGlzdFNob3coYXN5bmMgKHRleHRFZGl0b3IpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLnByb3ZpZGVyc0xpc3QudHJpZ2dlcih0ZXh0RWRpdG9yKVxuICAgICAgaWYgKCFyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlzdFZpZXcgPSBuZXcgTGlzdFZpZXcoKVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgICAgbGlzdFZpZXcuYWN0aXZhdGUodGV4dEVkaXRvciwgcmVzdWx0cylcbiAgICAgIGxpc3RWaWV3Lm9uRGlkU2VsZWN0KGZ1bmN0aW9uKGludGVudGlvbikge1xuICAgICAgICBpbnRlbnRpb24uc2VsZWN0ZWQoKVxuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSlcblxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQobGlzdFZpZXcpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gc3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcy5vbkxpc3RNb3ZlKGZ1bmN0aW9uKG1vdmVtZW50KSB7XG4gICAgICAgIGxpc3RWaWV3Lm1vdmUobW92ZW1lbnQpXG4gICAgICB9KSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMub25MaXN0Q29uZmlybShmdW5jdGlvbigpIHtcbiAgICAgICAgbGlzdFZpZXcuc2VsZWN0KClcbiAgICAgIH0pKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSkpXG4gICAgICB0aGlzLmFjdGl2ZSA9IHN1YnNjcmlwdGlvbnNcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSlcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgYXJyb3ctcGFyZW5zXG4gICAgdGhpcy5jb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGFzeW5jICh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5wcm92aWRlcnNIaWdobGlnaHQudHJpZ2dlcih0ZXh0RWRpdG9yKVxuICAgICAgaWYgKCFyZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFpbnRlZCA9IHRoaXMucHJvdmlkZXJzSGlnaGxpZ2h0LnBhaW50KHRleHRFZGl0b3IsIHJlc3VsdHMpXG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gc3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChwYWludGVkKVxuICAgICAgdGhpcy5hY3RpdmUgPSBzdWJzY3JpcHRpb25zXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSlcbiAgfVxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmNvbW1hbmRzLmFjdGl2YXRlKClcbiAgfVxuICBjb25zdW1lTGlzdFByb3ZpZGVyKHByb3ZpZGVyOiBMaXN0UHJvdmlkZXIpIHtcbiAgICB0aGlzLnByb3ZpZGVyc0xpc3QuYWRkUHJvdmlkZXIocHJvdmlkZXIpXG4gIH1cbiAgZGVsZXRlTGlzdFByb3ZpZGVyKHByb3ZpZGVyOiBMaXN0UHJvdmlkZXIpIHtcbiAgICB0aGlzLnByb3ZpZGVyc0xpc3QuZGVsZXRlUHJvdmlkZXIocHJvdmlkZXIpXG4gIH1cbiAgY29uc3VtZUhpZ2hsaWdodFByb3ZpZGVyKHByb3ZpZGVyOiBIaWdobGlnaHRQcm92aWRlcikge1xuICAgIHRoaXMucHJvdmlkZXJzSGlnaGxpZ2h0LmFkZFByb3ZpZGVyKHByb3ZpZGVyKVxuICB9XG4gIGRlbGV0ZUhpZ2hsaWdodFByb3ZpZGVyKHByb3ZpZGVyOiBIaWdobGlnaHRQcm92aWRlcikge1xuICAgIHRoaXMucHJvdmlkZXJzSGlnaGxpZ2h0LmRlbGV0ZVByb3ZpZGVyKHByb3ZpZGVyKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgdGhpcy5hY3RpdmUuZGlzcG9zZSgpXG4gICAgfVxuICB9XG59XG4iXX0=