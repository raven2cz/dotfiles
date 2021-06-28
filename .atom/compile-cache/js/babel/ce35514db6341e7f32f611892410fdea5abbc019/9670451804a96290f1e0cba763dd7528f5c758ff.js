Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ms = require("ms");

var _ms2 = _interopRequireDefault(_ms);

// eslint-disable-next-line import/no-unresolved

var _atom = require("atom");

var _provider = require("./provider");

var _provider2 = _interopRequireDefault(_provider);

var Registry = (function () {
  function Registry() {
    _classCallCheck(this, Registry);

    this.emitter = new _atom.Emitter();
    this.providers = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(this.emitter);

    this.statuses = new Map();
    this.statusHistory = [];
  }

  // Public method

  _createClass(Registry, [{
    key: "create",
    value: function create() {
      var _this = this;

      var provider = new _provider2["default"]();
      provider.onDidAdd(function (_ref) {
        var title = _ref.title;
        var options = _ref.options;

        _this.statusAdd(provider, title, options);
      });
      provider.onDidRemove(function (title) {
        _this.statusRemove(provider, title);
      });
      provider.onDidChangeTitle(function (_ref2) {
        var title = _ref2.title;
        var oldTitle = _ref2.oldTitle;

        _this.statusChangeTitle(provider, title, oldTitle);
      });
      provider.onDidClear(function () {
        _this.statusClear(provider);
      });
      provider.onDidDispose(function () {
        _this.statusClear(provider);
        _this.providers["delete"](provider);
      });
      this.providers.add(provider);
      return provider;
    }
  }, {
    key: "statusAdd",
    value: function statusAdd(provider, title, options) {
      var key = provider.id + "::" + title;
      if (this.statuses.has(key)) {
        // This will help catch bugs in providers
        throw new Error("Status '" + title + "' is already set");
      }

      var entry = {
        key: key,
        title: title,
        provider: provider,
        timeStarted: Date.now(),
        timeStopped: null,
        options: options
      };
      this.statuses.set(entry.key, entry);
      this.emitter.emit("did-update");
    }
  }, {
    key: "statusRemove",
    value: function statusRemove(provider, title) {
      var key = provider.id + "::" + title;
      var value = this.statuses.get(key);
      if (value) {
        this.pushIntoHistory(value);
        this.statuses["delete"](key);
        this.emitter.emit("did-update");
      }
    }
  }, {
    key: "statusChangeTitle",
    value: function statusChangeTitle(provider, title, oldTitle) {
      var oldKey = provider.id + "::" + oldTitle;
      var entry = this.statuses.get(oldKey);
      if (!entry) {
        return;
      }

      this.statuses["delete"](oldKey);

      entry.title = title;
      entry.key = provider.id + "::" + title;

      this.statuses.set(entry.key, entry);
      this.emitter.emit("did-update");
    }
  }, {
    key: "statusClear",
    value: function statusClear(provider) {
      var _this2 = this;

      var triggerUpdate = false;
      this.statuses.forEach(function (value) {
        if (value.provider === provider) {
          triggerUpdate = true;
          _this2.pushIntoHistory(value);
          _this2.statuses["delete"](value.key);
        }
      });
      if (triggerUpdate) {
        this.emitter.emit("did-update");
      }
    }
  }, {
    key: "pushIntoHistory",
    value: function pushIntoHistory(status) {
      status.timeStopped = Date.now();
      var i = this.statusHistory.length;
      while (i--) {
        if (this.statusHistory[i].key === status.key) {
          this.statusHistory.splice(i, 1);
          break;
        }
      }
      this.statusHistory.push(status);
      this.statusHistory = this.statusHistory.slice(-10);
    }
  }, {
    key: "getTilesActive",
    value: function getTilesActive() {
      return Array.from(this.statuses.values()).sort(function (a, b) {
        return b.timeStarted - a.timeStarted;
      });
    }
  }, {
    key: "getTilesOld",
    value: function getTilesOld() {
      var _this3 = this;

      var oldTiles = [];

      this.statusHistory.forEach(function (entry) {
        if (_this3.statuses.has(entry.key)) return;
        oldTiles.push({
          title: entry.title,
          duration: (0, _ms2["default"])((entry.timeStopped || 0) - entry.timeStarted)
        });
      });

      return oldTiles;
    }
  }, {
    key: "onDidUpdate",
    value: function onDidUpdate(callback) {
      return this.emitter.on("did-update", callback);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.subscriptions.dispose();
      for (var provider of this.providers) {
        provider.dispose();
      }
    }
  }]);

  return Registry;
})();

exports["default"] = Registry;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztrQkFFZSxJQUFJOzs7Ozs7b0JBRTBCLE1BQU07O3dCQUU5QixZQUFZOzs7O0lBR1osUUFBUTtBQVFoQixXQVJRLFFBQVEsR0FRYjswQkFSSyxRQUFROztBQVN6QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7QUFDN0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzNCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVyQyxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDMUIsUUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7R0FDekI7Ozs7ZUFoQmtCLFFBQVE7O1dBa0JyQixrQkFBYTs7O0FBQ2pCLFVBQU0sUUFBUSxHQUFHLDJCQUFjLENBQUM7QUFDaEMsY0FBUSxDQUFDLFFBQVEsQ0FBQyxVQUFDLElBQWtCLEVBQUs7WUFBckIsS0FBSyxHQUFQLElBQWtCLENBQWhCLEtBQUs7WUFBRSxPQUFPLEdBQWhCLElBQWtCLENBQVQsT0FBTzs7QUFDakMsY0FBSyxTQUFTLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztPQUMxQyxDQUFDLENBQUM7QUFDSCxjQUFRLENBQUMsV0FBVyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQzVCLGNBQUssWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNwQyxDQUFDLENBQUM7QUFDSCxjQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBQyxLQUFtQixFQUFLO1lBQXRCLEtBQUssR0FBUCxLQUFtQixDQUFqQixLQUFLO1lBQUUsUUFB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RCxVQUFNLFFBQVEsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ2xDLFlBQUksT0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPO0FBQ3pDLGdCQUFRLENBQUMsSUFBSSxDQUFDO0FBQ1osZUFBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO0FBQ2xCLGtCQUFRLEVBQUUscUJBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQSxHQUFJLEtBQUssQ0FBQyxXQUFXLENBQUM7U0FDM0QsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDOztBQUVILGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7V0FDVSxxQkFBQyxRQUFrQixFQUFlO0FBQzNDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsV0FBSyxJQUFNLFFBQVEsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ3JDLGdCQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDcEI7S0FDRjs7O1NBcElrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL3JlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IG1zIGZyb20gXCJtc1wiO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSBcImF0b21cIjtcblxuaW1wb3J0IFByb3ZpZGVyIGZyb20gXCIuL3Byb3ZpZGVyXCI7XG5pbXBvcnQgdHlwZSB7IFNpZ25hbEludGVybmFsLCBTaWduYWxPcHRpb25zIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVnaXN0cnkge1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBwcm92aWRlcnM6IFNldDxQcm92aWRlcj47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgc3RhdHVzZXM6IE1hcDxzdHJpbmcsIFNpZ25hbEludGVybmFsPjtcbiAgc3RhdHVzSGlzdG9yeTogQXJyYXk8U2lnbmFsSW50ZXJuYWw+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5wcm92aWRlcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcik7XG5cbiAgICB0aGlzLnN0YXR1c2VzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuc3RhdHVzSGlzdG9yeSA9IFtdO1xuICB9XG4gIC8vIFB1YmxpYyBtZXRob2RcbiAgY3JlYXRlKCk6IFByb3ZpZGVyIHtcbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBQcm92aWRlcigpO1xuICAgIHByb3ZpZGVyLm9uRGlkQWRkKCh7IHRpdGxlLCBvcHRpb25zIH0pID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzQWRkKHByb3ZpZGVyLCB0aXRsZSwgb3B0aW9ucyk7XG4gICAgfSk7XG4gICAgcHJvdmlkZXIub25EaWRSZW1vdmUodGl0bGUgPT4ge1xuICAgICAgdGhpcy5zdGF0dXNSZW1vdmUocHJvdmlkZXIsIHRpdGxlKTtcbiAgICB9KTtcbiAgICBwcm92aWRlci5vbkRpZENoYW5nZVRpdGxlKCh7IHRpdGxlLCBvbGRUaXRsZSB9KSA9PiB7XG4gICAgICB0aGlzLnN0YXR1c0NoYW5nZVRpdGxlKHByb3ZpZGVyLCB0aXRsZSwgb2xkVGl0bGUpO1xuICAgIH0pO1xuICAgIHByb3ZpZGVyLm9uRGlkQ2xlYXIoKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0dXNDbGVhcihwcm92aWRlcik7XG4gICAgfSk7XG4gICAgcHJvdmlkZXIub25EaWREaXNwb3NlKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzQ2xlYXIocHJvdmlkZXIpO1xuICAgICAgdGhpcy5wcm92aWRlcnMuZGVsZXRlKHByb3ZpZGVyKTtcbiAgICB9KTtcbiAgICB0aGlzLnByb3ZpZGVycy5hZGQocHJvdmlkZXIpO1xuICAgIHJldHVybiBwcm92aWRlcjtcbiAgfVxuICBzdGF0dXNBZGQocHJvdmlkZXI6IFByb3ZpZGVyLCB0aXRsZTogc3RyaW5nLCBvcHRpb25zPzogP1NpZ25hbE9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBrZXkgPSBgJHtwcm92aWRlci5pZH06OiR7dGl0bGV9YDtcbiAgICBpZiAodGhpcy5zdGF0dXNlcy5oYXMoa2V5KSkge1xuICAgICAgLy8gVGhpcyB3aWxsIGhlbHAgY2F0Y2ggYnVncyBpbiBwcm92aWRlcnNcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhdHVzICcke3RpdGxlfScgaXMgYWxyZWFkeSBzZXRgKTtcbiAgICB9XG5cbiAgICBjb25zdCBlbnRyeSA9IHtcbiAgICAgIGtleSxcbiAgICAgIHRpdGxlLFxuICAgICAgcHJvdmlkZXIsXG4gICAgICB0aW1lU3RhcnRlZDogRGF0ZS5ub3coKSxcbiAgICAgIHRpbWVTdG9wcGVkOiBudWxsLFxuICAgICAgb3B0aW9uc1xuICAgIH07XG4gICAgdGhpcy5zdGF0dXNlcy5zZXQoZW50cnkua2V5LCBlbnRyeSk7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtdXBkYXRlXCIpO1xuICB9XG4gIHN0YXR1c1JlbW92ZShwcm92aWRlcjogUHJvdmlkZXIsIHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBrZXkgPSBgJHtwcm92aWRlci5pZH06OiR7dGl0bGV9YDtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuc3RhdHVzZXMuZ2V0KGtleSk7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnB1c2hJbnRvSGlzdG9yeSh2YWx1ZSk7XG4gICAgICB0aGlzLnN0YXR1c2VzLmRlbGV0ZShrZXkpO1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtdXBkYXRlXCIpO1xuICAgIH1cbiAgfVxuICBzdGF0dXNDaGFuZ2VUaXRsZShwcm92aWRlcjogUHJvdmlkZXIsIHRpdGxlOiBzdHJpbmcsIG9sZFRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBvbGRLZXkgPSBgJHtwcm92aWRlci5pZH06OiR7b2xkVGl0bGV9YDtcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuc3RhdHVzZXMuZ2V0KG9sZEtleSk7XG4gICAgaWYgKCFlbnRyeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc3RhdHVzZXMuZGVsZXRlKG9sZEtleSk7XG5cbiAgICBlbnRyeS50aXRsZSA9IHRpdGxlO1xuICAgIGVudHJ5LmtleSA9IGAke3Byb3ZpZGVyLmlkfTo6JHt0aXRsZX1gO1xuXG4gICAgdGhpcy5zdGF0dXNlcy5zZXQoZW50cnkua2V5LCBlbnRyeSk7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtdXBkYXRlXCIpO1xuICB9XG4gIHN0YXR1c0NsZWFyKHByb3ZpZGVyOiBQcm92aWRlcik6IHZvaWQge1xuICAgIGxldCB0cmlnZ2VyVXBkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5zdGF0dXNlcy5mb3JFYWNoKHZhbHVlID0+IHtcbiAgICAgIGlmICh2YWx1ZS5wcm92aWRlciA9PT0gcHJvdmlkZXIpIHtcbiAgICAgICAgdHJpZ2dlclVwZGF0ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucHVzaEludG9IaXN0b3J5KHZhbHVlKTtcbiAgICAgICAgdGhpcy5zdGF0dXNlcy5kZWxldGUodmFsdWUua2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodHJpZ2dlclVwZGF0ZSkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtdXBkYXRlXCIpO1xuICAgIH1cbiAgfVxuICBwdXNoSW50b0hpc3Rvcnkoc3RhdHVzOiBTaWduYWxJbnRlcm5hbCk6IHZvaWQge1xuICAgIHN0YXR1cy50aW1lU3RvcHBlZCA9IERhdGUubm93KCk7XG4gICAgbGV0IGkgPSB0aGlzLnN0YXR1c0hpc3RvcnkubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIGlmICh0aGlzLnN0YXR1c0hpc3RvcnlbaV0ua2V5ID09PSBzdGF0dXMua2V5KSB7XG4gICAgICAgIHRoaXMuc3RhdHVzSGlzdG9yeS5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnN0YXR1c0hpc3RvcnkucHVzaChzdGF0dXMpO1xuICAgIHRoaXMuc3RhdHVzSGlzdG9yeSA9IHRoaXMuc3RhdHVzSGlzdG9yeS5zbGljZSgtMTApO1xuICB9XG4gIGdldFRpbGVzQWN0aXZlKCk6IEFycmF5PFNpZ25hbEludGVybmFsPiB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5zdGF0dXNlcy52YWx1ZXMoKSkuc29ydChcbiAgICAgIChhLCBiKSA9PiBiLnRpbWVTdGFydGVkIC0gYS50aW1lU3RhcnRlZFxuICAgICk7XG4gIH1cbiAgZ2V0VGlsZXNPbGQoKTogQXJyYXk8eyB0aXRsZTogc3RyaW5nLCBkdXJhdGlvbjogc3RyaW5nIH0+IHtcbiAgICBjb25zdCBvbGRUaWxlcyA9IFtdO1xuXG4gICAgdGhpcy5zdGF0dXNIaXN0b3J5LmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdHVzZXMuaGFzKGVudHJ5LmtleSkpIHJldHVybjtcbiAgICAgIG9sZFRpbGVzLnB1c2goe1xuICAgICAgICB0aXRsZTogZW50cnkudGl0bGUsXG4gICAgICAgIGR1cmF0aW9uOiBtcygoZW50cnkudGltZVN0b3BwZWQgfHwgMCkgLSBlbnRyeS50aW1lU3RhcnRlZClcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG9sZFRpbGVzO1xuICB9XG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrOiBGdW5jdGlvbik6IElEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKFwiZGlkLXVwZGF0ZVwiLCBjYWxsYmFjayk7XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIGZvciAoY29uc3QgcHJvdmlkZXIgb2YgdGhpcy5wcm92aWRlcnMpIHtcbiAgICAgIHByb3ZpZGVyLmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==