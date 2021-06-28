Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line import/no-unresolved

var _atom = require("atom");

var _disposify = require("disposify");

var _disposify2 = _interopRequireDefault(_disposify);

var _element = require("./element");

var _element2 = _interopRequireDefault(_element);

var _registry = require("./registry");

var _registry2 = _interopRequireDefault(_registry);

var _atomIdeProvider = require("./atom-ide-provider");

var BusySignal = (function () {
  function BusySignal() {
    var _this = this;

    _classCallCheck(this, BusySignal);

    this.element = new _element2["default"]();
    this.registry = new _registry2["default"]();
    this.atomIdeProvider = new _atomIdeProvider.AtomIdeProvider(function () {
      return _this.registry.create();
    });
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.element);
    this.subscriptions.add(this.registry);

    this.registry.onDidUpdate(function () {
      _this.element.update(_this.registry.getTilesActive(), _this.registry.getTilesOld());
    });
  }

  _createClass(BusySignal, [{
    key: "attach",
    value: function attach(statusBar) {
      this.subscriptions.add((0, _disposify2["default"])(statusBar.addRightTile({
        item: this.element,
        priority: 500
      })));
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return BusySignal;
})();

exports["default"] = BusySignal;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07O3lCQUNwQixXQUFXOzs7O3VCQUNiLFdBQVc7Ozs7d0JBQ1YsWUFBWTs7OzsrQkFDRCxxQkFBcUI7O0lBRWhDLFVBQVU7QUFNbEIsV0FOUSxVQUFVLEdBTWY7OzswQkFOSyxVQUFVOztBQU8zQixRQUFJLENBQUMsT0FBTyxHQUFHLDBCQUFhLENBQUM7QUFDN0IsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxlQUFlLEdBQUcscUNBQW9CO2FBQU0sTUFBSyxRQUFRLENBQUMsTUFBTSxFQUFFO0tBQUEsQ0FBQyxDQUFDO0FBQ3pFLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7O0FBRS9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXRDLFFBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLFlBQU07QUFDOUIsWUFBSyxPQUFPLENBQUMsTUFBTSxDQUNqQixNQUFLLFFBQVEsQ0FBQyxjQUFjLEVBQUUsRUFDOUIsTUFBSyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQzVCLENBQUM7S0FDSCxDQUFDLENBQUM7R0FDSjs7ZUFyQmtCLFVBQVU7O1dBc0J2QixnQkFBQyxTQUFpQixFQUFFO0FBQ3hCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQiw0QkFDRSxTQUFTLENBQUMsWUFBWSxDQUFDO0FBQ3JCLFlBQUksRUFBRSxJQUFJLENBQUMsT0FBTztBQUNsQixnQkFBUSxFQUFFLEdBQUc7T0FDZCxDQUFDLENBQ0gsQ0FDRixDQUFDO0tBQ0g7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM5Qjs7O1NBbENrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLXVucmVzb2x2ZWRcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiO1xuaW1wb3J0IGRpc3Bvc2lmeSBmcm9tIFwiZGlzcG9zaWZ5XCI7XG5pbXBvcnQgRWxlbWVudCBmcm9tIFwiLi9lbGVtZW50XCI7XG5pbXBvcnQgUmVnaXN0cnkgZnJvbSBcIi4vcmVnaXN0cnlcIjtcbmltcG9ydCB7IEF0b21JZGVQcm92aWRlciB9IGZyb20gXCIuL2F0b20taWRlLXByb3ZpZGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1c3lTaWduYWwge1xuICBlbGVtZW50OiBFbGVtZW50O1xuICByZWdpc3RyeTogUmVnaXN0cnk7XG4gIGF0b21JZGVQcm92aWRlcjogQXRvbUlkZVByb3ZpZGVyO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZWxlbWVudCA9IG5ldyBFbGVtZW50KCk7XG4gICAgdGhpcy5yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpO1xuICAgIHRoaXMuYXRvbUlkZVByb3ZpZGVyID0gbmV3IEF0b21JZGVQcm92aWRlcigoKSA9PiB0aGlzLnJlZ2lzdHJ5LmNyZWF0ZSgpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5yZWdpc3RyeSk7XG5cbiAgICB0aGlzLnJlZ2lzdHJ5Lm9uRGlkVXBkYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuZWxlbWVudC51cGRhdGUoXG4gICAgICAgIHRoaXMucmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSxcbiAgICAgICAgdGhpcy5yZWdpc3RyeS5nZXRUaWxlc09sZCgpXG4gICAgICApO1xuICAgIH0pO1xuICB9XG4gIGF0dGFjaChzdGF0dXNCYXI6IE9iamVjdCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBkaXNwb3NpZnkoXG4gICAgICAgIHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgICAgIGl0ZW06IHRoaXMuZWxlbWVudCxcbiAgICAgICAgICBwcmlvcml0eTogNTAwXG4gICAgICAgIH0pXG4gICAgICApXG4gICAgKTtcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH1cbn1cbiJdfQ==