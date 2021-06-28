Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// eslint-disable-next-line import/no-unresolved

var _atom = require("atom");

var _helpers = require("./helpers");

var Provider = (function () {
  function Provider() {
    _classCallCheck(this, Provider);

    this.id = (0, _helpers.generateRandom)();
    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  // Public

  _createClass(Provider, [{
    key: "add",
    value: function add(title, options) {
      this.emitter.emit("did-add", { title: title, options: options });
    }

    // Public
  }, {
    key: "remove",
    value: function remove(title) {
      this.emitter.emit("did-remove", title);
    }

    // Public
  }, {
    key: "changeTitle",
    value: function changeTitle(title, oldTitle) {
      this.emitter.emit("did-change-title", { title: title, oldTitle: oldTitle });
    }

    // Public
  }, {
    key: "clear",
    value: function clear() {
      this.emitter.emit("did-clear");
    }
  }, {
    key: "onDidAdd",
    value: function onDidAdd(callback) {
      return this.emitter.on("did-add", callback);
    }
  }, {
    key: "onDidRemove",
    value: function onDidRemove(callback) {
      return this.emitter.on("did-remove", callback);
    }
  }, {
    key: "onDidChangeTitle",
    value: function onDidChangeTitle(callback) {
      return this.emitter.on("did-change-title", callback);
    }
  }, {
    key: "onDidClear",
    value: function onDidClear(callback) {
      return this.emitter.on("did-clear", callback);
    }
  }, {
    key: "onDidDispose",
    value: function onDidDispose(callback) {
      return this.emitter.on("did-dispose", callback);
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.emitter.emit("did-dispose");
      this.subscriptions.dispose();
    }
  }]);

  return Provider;
})();

exports["default"] = Provider;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFHNkMsTUFBTTs7dUJBQ3BCLFdBQVc7O0lBR3JCLFFBQVE7QUFLaEIsV0FMUSxRQUFRLEdBS2I7MEJBTEssUUFBUTs7QUFNekIsUUFBSSxDQUFDLEVBQUUsR0FBRyw4QkFBZ0IsQ0FBQztBQUMzQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUM7QUFDN0IsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7QUFFL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3RDOzs7O2VBWGtCLFFBQVE7O1dBY3hCLGFBQUMsS0FBYSxFQUFFLE9BQXdCLEVBQUU7QUFDM0MsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNsRDs7Ozs7V0FFSyxnQkFBQyxLQUFhLEVBQUU7QUFDcEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3hDOzs7OztXQUVVLHFCQUFDLEtBQWEsRUFBRSxRQUFnQixFQUFFO0FBQzNDLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUM1RDs7Ozs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ2hDOzs7V0FFTyxrQkFDTixRQUFrRSxFQUNyRDtBQUNiLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzdDOzs7V0FDVSxxQkFBQyxRQUFnQyxFQUFlO0FBQ3pELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2hEOzs7V0FDZSwwQkFDZCxRQUE4RCxFQUNqRDtBQUNiLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDdEQ7OztXQUNTLG9CQUFDLFFBQW1CLEVBQWU7QUFDM0MsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDL0M7OztXQUNXLHNCQUFDLFFBQWtCLEVBQWU7QUFDNUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDakQ7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDakMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUM5Qjs7O1NBckRrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvbGliL3Byb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby11bnJlc29sdmVkXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSBcImF0b21cIjtcbmltcG9ydCB7IGdlbmVyYXRlUmFuZG9tIH0gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHR5cGUgeyBTaWduYWxPcHRpb25zIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvdmlkZXIge1xuICBpZDogc3RyaW5nO1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSBnZW5lcmF0ZVJhbmRvbSgpO1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKTtcbiAgfVxuXG4gIC8vIFB1YmxpY1xuICBhZGQodGl0bGU6IHN0cmluZywgb3B0aW9ucz86ID9TaWduYWxPcHRpb25zKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtYWRkXCIsIHsgdGl0bGUsIG9wdGlvbnMgfSk7XG4gIH1cbiAgLy8gUHVibGljXG4gIHJlbW92ZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtcmVtb3ZlXCIsIHRpdGxlKTtcbiAgfVxuICAvLyBQdWJsaWNcbiAgY2hhbmdlVGl0bGUodGl0bGU6IHN0cmluZywgb2xkVGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLWNoYW5nZS10aXRsZVwiLCB7IHRpdGxlLCBvbGRUaXRsZSB9KTtcbiAgfVxuICAvLyBQdWJsaWNcbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJkaWQtY2xlYXJcIik7XG4gIH1cblxuICBvbkRpZEFkZChcbiAgICBjYWxsYmFjazogKGFkZDogeyB0aXRsZTogc3RyaW5nLCBvcHRpb25zOiA/U2lnbmFsT3B0aW9ucyB9KSA9PiBhbnlcbiAgKTogSURpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oXCJkaWQtYWRkXCIsIGNhbGxiYWNrKTtcbiAgfVxuICBvbkRpZFJlbW92ZShjYWxsYmFjazogKHRpdGxlOiBzdHJpbmcpID0+IGFueSk6IElEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKFwiZGlkLXJlbW92ZVwiLCBjYWxsYmFjayk7XG4gIH1cbiAgb25EaWRDaGFuZ2VUaXRsZShcbiAgICBjYWxsYmFjazogKGNoYW5nZTogeyB0aXRsZTogc3RyaW5nLCBvbGRUaXRsZTogc3RyaW5nIH0pID0+IGFueVxuICApOiBJRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbihcImRpZC1jaGFuZ2UtdGl0bGVcIiwgY2FsbGJhY2spO1xuICB9XG4gIG9uRGlkQ2xlYXIoY2FsbGJhY2s6ICgpID0+IGFueSk6IElEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKFwiZGlkLWNsZWFyXCIsIGNhbGxiYWNrKTtcbiAgfVxuICBvbkRpZERpc3Bvc2UoY2FsbGJhY2s6IEZ1bmN0aW9uKTogSURpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oXCJkaWQtZGlzcG9zZVwiLCBjYWxsYmFjayk7XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KFwiZGlkLWRpc3Bvc2VcIik7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfVxufVxuIl19