Object.defineProperty(exports, "__esModule", {
  value: true
});

// eslint-disable-next-line import/no-unresolved

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AtomIdeProvider = (function () {
  function AtomIdeProvider(createProvider) {
    _classCallCheck(this, AtomIdeProvider);

    this.messages = new Set();

    this.createProvider = createProvider;
  }

  _createClass(AtomIdeProvider, [{
    key: "reportBusyWhile",
    value: _asyncToGenerator(function* (title, f, options) {
      var busyMessage = this.reportBusy(title, options);
      try {
        return yield f();
      } finally {
        busyMessage.dispose();
      }
    })
  }, {
    key: "reportBusy",
    value: function reportBusy(title, options) {
      var _this = this;

      var provider = this.createProvider();

      if (options) {
        // TODO: options not implemented yet
      }

      provider.add(title);

      var busyMessage = {
        setTitle: function setTitle(newTitle) {
          provider.changeTitle(newTitle, title);
          // Cache the current title for consecutive title changes
          title = newTitle;
        },
        dispose: function dispose() {
          provider.dispose();
          _this.messages["delete"](busyMessage);
        }
      };
      this.messages.add(busyMessage);

      return busyMessage;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.messages.forEach(function (msg) {
        msg.dispose();
      });
      this.messages.clear();
    }
  }]);

  return AtomIdeProvider;
})();

exports.AtomIdeProvider = AtomIdeProvider;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvYXRvbS1pZGUtcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBTWEsZUFBZTtBQUlmLFdBSkEsZUFBZSxDQUlkLGNBQThCLEVBQUU7MEJBSmpDLGVBQWU7O1NBRTFCLFFBQVEsR0FBcUIsSUFBSSxHQUFHLEVBQUU7O0FBR3BDLFFBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0dBQ3RDOztlQU5VLGVBQWU7OzZCQVFGLFdBQ3RCLEtBQWEsRUFDYixDQUFtQixFQUNuQixPQUEyQixFQUNmO0FBQ1osVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEQsVUFBSTtBQUNGLGVBQU8sTUFBTSxDQUFDLEVBQUUsQ0FBQztPQUNsQixTQUFTO0FBQ1IsbUJBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN2QjtLQUNGOzs7V0FFUyxvQkFBQyxLQUFhLEVBQUUsT0FBMkIsRUFBZTs7O0FBQ2xFLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdkMsVUFBSSxPQUFPLEVBQUU7O09BRVo7O0FBRUQsY0FBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFcEIsVUFBTSxXQUFXLEdBQUc7QUFDbEIsZ0JBQVEsRUFBRSxrQkFBQyxRQUFRLEVBQWE7QUFDOUIsa0JBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUV0QyxlQUFLLEdBQUcsUUFBUSxDQUFBO1NBQ2pCO0FBQ0QsZUFBTyxFQUFFLG1CQUFNO0FBQ2Isa0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNuQixnQkFBSyxRQUFRLFVBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNuQztPQUNGLENBQUM7QUFDRixVQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFL0IsYUFBTyxXQUFXLENBQUM7S0FDcEI7OztXQUVNLG1CQUFTO0FBQ2QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDM0IsV0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ2YsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUN2Qjs7O1NBbkRVLGVBQWUiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9hdG9tLWlkZS1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tdW5yZXNvbHZlZFxuaW1wb3J0IHR5cGUgeyBCdXN5U2lnbmFsT3B0aW9ucywgQnVzeU1lc3NhZ2UgfSBmcm9tIFwiYXRvbS1pZGUvYnVzeS1zaWduYWxcIjtcbmltcG9ydCB0eXBlIFByb3ZpZGVyIGZyb20gXCIuL3Byb3ZpZGVyXCI7XG5cbmV4cG9ydCBjbGFzcyBBdG9tSWRlUHJvdmlkZXIge1xuICBjcmVhdGVQcm92aWRlcjogKCkgPT4gUHJvdmlkZXI7XG4gIG1lc3NhZ2VzOiBTZXQ8QnVzeU1lc3NhZ2U+ID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0cnVjdG9yKGNyZWF0ZVByb3ZpZGVyOiAoKSA9PiBQcm92aWRlcikge1xuICAgIHRoaXMuY3JlYXRlUHJvdmlkZXIgPSBjcmVhdGVQcm92aWRlcjtcbiAgfVxuXG4gIGFzeW5jIHJlcG9ydEJ1c3lXaGlsZTxUPihcbiAgICB0aXRsZTogc3RyaW5nLFxuICAgIGY6ICgpID0+IFByb21pc2U8VD4sXG4gICAgb3B0aW9ucz86IEJ1c3lTaWduYWxPcHRpb25zXG4gICk6IFByb21pc2U8VD4ge1xuICAgIGNvbnN0IGJ1c3lNZXNzYWdlID0gdGhpcy5yZXBvcnRCdXN5KHRpdGxlLCBvcHRpb25zKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGYoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYnVzeU1lc3NhZ2UuZGlzcG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlcG9ydEJ1c3kodGl0bGU6IHN0cmluZywgb3B0aW9ucz86IEJ1c3lTaWduYWxPcHRpb25zKTogQnVzeU1lc3NhZ2Uge1xuICAgIGNvbnN0IHByb3ZpZGVyID0gdGhpcy5jcmVhdGVQcm92aWRlcigpO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIC8vIFRPRE86IG9wdGlvbnMgbm90IGltcGxlbWVudGVkIHlldFxuICAgIH1cblxuICAgIHByb3ZpZGVyLmFkZCh0aXRsZSk7XG5cbiAgICBjb25zdCBidXN5TWVzc2FnZSA9IHtcbiAgICAgIHNldFRpdGxlOiAobmV3VGl0bGU6IHN0cmluZykgPT4ge1xuICAgICAgICBwcm92aWRlci5jaGFuZ2VUaXRsZShuZXdUaXRsZSwgdGl0bGUpO1xuICAgICAgICAvLyBDYWNoZSB0aGUgY3VycmVudCB0aXRsZSBmb3IgY29uc2VjdXRpdmUgdGl0bGUgY2hhbmdlc1xuICAgICAgICB0aXRsZSA9IG5ld1RpdGxlXG4gICAgICB9LFxuICAgICAgZGlzcG9zZTogKCkgPT4ge1xuICAgICAgICBwcm92aWRlci5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKGJ1c3lNZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMubWVzc2FnZXMuYWRkKGJ1c3lNZXNzYWdlKTtcblxuICAgIHJldHVybiBidXN5TWVzc2FnZTtcbiAgfVxuXG4gIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKG1zZyA9PiB7XG4gICAgICBtc2cuZGlzcG9zZSgpO1xuICAgIH0pO1xuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKTtcbiAgfVxufVxuIl19