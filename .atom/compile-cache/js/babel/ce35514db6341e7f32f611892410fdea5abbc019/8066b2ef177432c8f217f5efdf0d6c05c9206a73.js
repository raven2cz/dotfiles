function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _jasmineFix = require("jasmine-fix");

var _libRegistry = require("../lib/registry");

var _libRegistry2 = _interopRequireDefault(_libRegistry);

var _libAtomIdeProvider = require("../lib/atom-ide-provider");

describe("Atom IDE Provider", function () {
  var registry = undefined;
  var atomIdeProvider = undefined;

  beforeEach(function () {
    registry = new _libRegistry2["default"]();
    atomIdeProvider = new _libAtomIdeProvider.AtomIdeProvider(function () {
      return registry.create();
    });
  });
  afterEach(function () {
    atomIdeProvider.dispose();
    registry.dispose();
  });

  function validateTiles(actual, expected) {
    expect(actual.length).toBe(expected.length);

    actual.forEach(function (entry, index) {
      expect(entry.title).toBe(expected[index]);
    });
  }
  function validateOldTiles(oldTitles, titles) {
    var checkDuration = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    expect(oldTitles.length).toBe(titles.length);

    titles.forEach(function (title, index) {
      expect(oldTitles[index].title).toBe(title);
      if (checkDuration) {
        expect(oldTitles[index].duration === "1ms" || oldTitles[index].duration === "0ms").toBe(true);
      }
    });
  }

  describe("reportBusy", function () {
    (0, _jasmineFix.it)("adds titles", function () {
      atomIdeProvider.reportBusy("Hello");
      validateTiles(registry.getTilesActive(), ["Hello"]);
    });
    (0, _jasmineFix.it)("adds removed ones to history", _asyncToGenerator(function* () {
      atomIdeProvider.reportBusy("Boy");
      yield (0, _jasmineFix.wait)(1);
      var msg = atomIdeProvider.reportBusy("Hey");

      validateTiles(registry.getTilesActive(), ["Hey", "Boy"]);
      expect(registry.getTilesOld()).toEqual([]);

      msg.dispose();
      validateTiles(registry.getTilesActive(), ["Boy"]);
      validateOldTiles(registry.getTilesOld(), ["Hey"], false);
    }));
    (0, _jasmineFix.it)("can set a new title", function () {
      var msg = atomIdeProvider.reportBusy("Hi");
      validateTiles(registry.getTilesActive(), ["Hi"]);
      msg.setTitle("Howdy");
      validateTiles(registry.getTilesActive(), ["Howdy"]);
      msg.setTitle("Whatsup");
      validateTiles(registry.getTilesActive(), ["Whatsup"]);
      msg.dispose();
      validateTiles(registry.getTilesActive(), []);
      validateOldTiles(registry.getTilesOld(), ["Whatsup"], false);
    });
  });
  describe("reportBusyWhile", function () {
    function waitWithValue(timeout, v) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          return resolve(v);
        }, timeout);
      });
    }
    (0, _jasmineFix.it)("adds titles", _asyncToGenerator(function* () {
      var prom = atomIdeProvider.reportBusyWhile("Hello", function () {
        return waitWithValue(1, "Bazinga!");
      });
      validateTiles(registry.getTilesActive(), ["Hello"]);
      var v = yield prom;
      expect(v).toBe("Bazinga!");
      validateTiles(registry.getTilesActive(), []);
      validateOldTiles(registry.getTilesOld(), ["Hello"], false);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9zcGVjL2F0b20taWRlLXByb3ZpZGVyLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzswQkFFeUIsYUFBYTs7MkJBQ2pCLGlCQUFpQjs7OztrQ0FDTiwwQkFBMEI7O0FBRzFELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxZQUFXO0FBQ3ZDLE1BQUksUUFBUSxZQUFBLENBQUM7QUFDYixNQUFJLGVBQWUsWUFBQSxDQUFDOztBQUVwQixZQUFVLENBQUMsWUFBVztBQUNwQixZQUFRLEdBQUcsOEJBQWMsQ0FBQztBQUMxQixtQkFBZSxHQUFHLHdDQUFvQjthQUFNLFFBQVEsQ0FBQyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUM7R0FDaEUsQ0FBQyxDQUFDO0FBQ0gsV0FBUyxDQUFDLFlBQVc7QUFDbkIsbUJBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMxQixZQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDcEIsQ0FBQyxDQUFDOztBQUVILFdBQVMsYUFBYSxDQUNwQixNQUE2QixFQUM3QixRQUF1QixFQUN2QjtBQUNBLFVBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFNUMsVUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUs7QUFDL0IsWUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDM0MsQ0FBQyxDQUFDO0dBQ0o7QUFDRCxXQUFTLGdCQUFnQixDQUN2QixTQUFxRCxFQUNyRCxNQUFxQixFQUVyQjtRQURBLGFBQXNCLHlEQUFHLElBQUk7O0FBRTdCLFVBQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7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QUFNLElBQUksR0FBRyxlQUFlLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRTtlQUNwRCxhQUFhLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQztPQUFBLENBQzdCLENBQUM7QUFDRixtQkFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDcEQsVUFBTSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUM7QUFDckIsWUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMzQixtQkFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM3QyxzQkFBZ0IsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1RCxFQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL3NwZWMvYXRvbS1pZGUtcHJvdmlkZXItc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGl0LCB3YWl0IH0gZnJvbSBcImphc21pbmUtZml4XCI7XG5pbXBvcnQgUmVnaXN0cnkgZnJvbSBcIi4uL2xpYi9yZWdpc3RyeVwiO1xuaW1wb3J0IHsgQXRvbUlkZVByb3ZpZGVyIH0gZnJvbSBcIi4uL2xpYi9hdG9tLWlkZS1wcm92aWRlclwiO1xuaW1wb3J0IHR5cGUgeyBTaWduYWxJbnRlcm5hbCB9IGZyb20gXCIuLi9saWIvdHlwZXNcIjtcblxuZGVzY3JpYmUoXCJBdG9tIElERSBQcm92aWRlclwiLCBmdW5jdGlvbigpIHtcbiAgbGV0IHJlZ2lzdHJ5O1xuICBsZXQgYXRvbUlkZVByb3ZpZGVyO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgcmVnaXN0cnkgPSBuZXcgUmVnaXN0cnkoKTtcbiAgICBhdG9tSWRlUHJvdmlkZXIgPSBuZXcgQXRvbUlkZVByb3ZpZGVyKCgpID0+IHJlZ2lzdHJ5LmNyZWF0ZSgpKTtcbiAgfSk7XG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBhdG9tSWRlUHJvdmlkZXIuZGlzcG9zZSgpO1xuICAgIHJlZ2lzdHJ5LmRpc3Bvc2UoKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVUaWxlcyhcbiAgICBhY3R1YWw6IEFycmF5PFNpZ25hbEludGVybmFsPixcbiAgICBleHBlY3RlZDogQXJyYXk8c3RyaW5nPlxuICApIHtcbiAgICBleHBlY3QoYWN0dWFsLmxlbmd0aCkudG9CZShleHBlY3RlZC5sZW5ndGgpO1xuXG4gICAgYWN0dWFsLmZvckVhY2goKGVudHJ5LCBpbmRleCkgPT4ge1xuICAgICAgZXhwZWN0KGVudHJ5LnRpdGxlKS50b0JlKGV4cGVjdGVkW2luZGV4XSk7XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gdmFsaWRhdGVPbGRUaWxlcyhcbiAgICBvbGRUaXRsZXM6IEFycmF5PHsgdGl0bGU6IHN0cmluZywgZHVyYXRpb246IHN0cmluZyB9PixcbiAgICB0aXRsZXM6IEFycmF5PHN0cmluZz4sXG4gICAgY2hlY2tEdXJhdGlvbjogYm9vbGVhbiA9IHRydWVcbiAgKSB7XG4gICAgZXhwZWN0KG9sZFRpdGxlcy5sZW5ndGgpLnRvQmUodGl0bGVzLmxlbmd0aCk7XG5cbiAgICB0aXRsZXMuZm9yRWFjaChmdW5jdGlvbih0aXRsZSwgaW5kZXgpIHtcbiAgICAgIGV4cGVjdChvbGRUaXRsZXNbaW5kZXhdLnRpdGxlKS50b0JlKHRpdGxlKTtcbiAgICAgIGlmIChjaGVja0R1cmF0aW9uKSB7XG4gICAgICAgIGV4cGVjdChcbiAgICAgICAgICBvbGRUaXRsZXNbaW5kZXhdLmR1cmF0aW9uID09PSBcIjFtc1wiIHx8XG4gICAgICAgICAgICBvbGRUaXRsZXNbaW5kZXhdLmR1cmF0aW9uID09PSBcIjBtc1wiXG4gICAgICAgICkudG9CZSh0cnVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlc2NyaWJlKFwicmVwb3J0QnVzeVwiLCBmdW5jdGlvbigpIHtcbiAgICBpdChcImFkZHMgdGl0bGVzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbUlkZVByb3ZpZGVyLnJlcG9ydEJ1c3koXCJIZWxsb1wiKTtcbiAgICAgIHZhbGlkYXRlVGlsZXMocmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSwgW1wiSGVsbG9cIl0pO1xuICAgIH0pO1xuICAgIGl0KFwiYWRkcyByZW1vdmVkIG9uZXMgdG8gaGlzdG9yeVwiLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGF0b21JZGVQcm92aWRlci5yZXBvcnRCdXN5KFwiQm95XCIpO1xuICAgICAgYXdhaXQgd2FpdCgxKTtcbiAgICAgIGNvbnN0IG1zZyA9IGF0b21JZGVQcm92aWRlci5yZXBvcnRCdXN5KFwiSGV5XCIpO1xuXG4gICAgICB2YWxpZGF0ZVRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzQWN0aXZlKCksIFtcIkhleVwiLCBcIkJveVwiXSk7XG4gICAgICBleHBlY3QocmVnaXN0cnkuZ2V0VGlsZXNPbGQoKSkudG9FcXVhbChbXSk7XG5cbiAgICAgIG1zZy5kaXNwb3NlKCk7XG4gICAgICB2YWxpZGF0ZVRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzQWN0aXZlKCksIFtcIkJveVwiXSk7XG4gICAgICB2YWxpZGF0ZU9sZFRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzT2xkKCksIFtcIkhleVwiXSwgZmFsc2UpO1xuICAgIH0pO1xuICAgIGl0KFwiY2FuIHNldCBhIG5ldyB0aXRsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGF0b21JZGVQcm92aWRlci5yZXBvcnRCdXN5KFwiSGlcIik7XG4gICAgICB2YWxpZGF0ZVRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzQWN0aXZlKCksIFtcIkhpXCJdKTtcbiAgICAgIG1zZy5zZXRUaXRsZShcIkhvd2R5XCIpO1xuICAgICAgdmFsaWRhdGVUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc0FjdGl2ZSgpLCBbXCJIb3dkeVwiXSk7XG4gICAgICBtc2cuc2V0VGl0bGUoXCJXaGF0c3VwXCIpXG4gICAgICB2YWxpZGF0ZVRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzQWN0aXZlKCksIFtcIldoYXRzdXBcIl0pO1xuICAgICAgbXNnLmRpc3Bvc2UoKTtcbiAgICAgIHZhbGlkYXRlVGlsZXMocmVnaXN0cnkuZ2V0VGlsZXNBY3RpdmUoKSwgW10pO1xuICAgICAgdmFsaWRhdGVPbGRUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc09sZCgpLCBbXCJXaGF0c3VwXCJdLCBmYWxzZSk7XG4gICAgfSk7XG4gIH0pO1xuICBkZXNjcmliZShcInJlcG9ydEJ1c3lXaGlsZVwiLCBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiB3YWl0V2l0aFZhbHVlKHRpbWVvdXQsIHYpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmVzb2x2ZSh2KSwgdGltZW91dCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaXQoXCJhZGRzIHRpdGxlc1wiLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHByb20gPSBhdG9tSWRlUHJvdmlkZXIucmVwb3J0QnVzeVdoaWxlKFwiSGVsbG9cIiwgKCkgPT5cbiAgICAgICAgd2FpdFdpdGhWYWx1ZSgxLCBcIkJhemluZ2EhXCIpXG4gICAgICApO1xuICAgICAgdmFsaWRhdGVUaWxlcyhyZWdpc3RyeS5nZXRUaWxlc0FjdGl2ZSgpLCBbXCJIZWxsb1wiXSk7XG4gICAgICBjb25zdCB2ID0gYXdhaXQgcHJvbTtcbiAgICAgIGV4cGVjdCh2KS50b0JlKFwiQmF6aW5nYSFcIik7XG4gICAgICB2YWxpZGF0ZVRpbGVzKHJlZ2lzdHJ5LmdldFRpbGVzQWN0aXZlKCksIFtdKTtcbiAgICAgIHZhbGlkYXRlT2xkVGlsZXMocmVnaXN0cnkuZ2V0VGlsZXNPbGQoKSwgW1wiSGVsbG9cIl0sIGZhbHNlKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==