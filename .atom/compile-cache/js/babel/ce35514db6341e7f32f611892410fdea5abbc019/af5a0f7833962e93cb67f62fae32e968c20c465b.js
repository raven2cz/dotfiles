var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _jasmineFix = require('jasmine-fix');

var _distBusySignal = require('../dist/busy-signal');

var _distBusySignal2 = _interopRequireDefault(_distBusySignal);

var _helpers = require('./helpers');

var SignalRegistry = (function () {
  function SignalRegistry() {
    _classCallCheck(this, SignalRegistry);

    this.texts = [];
  }

  _createClass(SignalRegistry, [{
    key: 'clear',
    value: function clear() {
      this.texts.splice(0);
    }
  }, {
    key: 'add',
    value: function add(text) {
      if (this.texts.includes(text)) {
        throw new TypeError('\'' + text + '\' already added');
      }
      this.texts.push(text);
    }
  }, {
    key: 'remove',
    value: function remove(text) {
      var index = this.texts.indexOf(text);
      if (index !== -1) {
        this.texts.splice(index, 1);
      }
    }
  }], [{
    key: 'create',
    value: function create() {
      var registry = new SignalRegistry();
      spyOn(registry, 'add').andCallThrough();
      spyOn(registry, 'remove').andCallThrough();
      spyOn(registry, 'clear').andCallThrough();
      return registry;
    }
  }]);

  return SignalRegistry;
})();

describe('BusySignal', function () {
  var busySignal = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    // Activate activation hook
    atom.packages.triggerDeferredActivationHooks();
    atom.packages.triggerActivationHook('core:loaded-shell-environment');

    yield atom.packages.loadPackage('linter-ui-default');
    busySignal = new _distBusySignal2['default']();
    busySignal.attach(SignalRegistry);
  }));
  afterEach(function () {
    busySignal.dispose();
  });

  it('tells the registry when linting is in progress without adding duplicates', function () {
    var linterA = (0, _helpers.getLinter)();
    var texts = busySignal.provider && busySignal.provider.texts;
    expect(texts).toEqual([]);
    busySignal.didBeginLinting(linterA, '/');
    expect(texts).toEqual(['some on /']);
    busySignal.didFinishLinting(linterA, '/');
    busySignal.didFinishLinting(linterA, '/');
    expect(texts).toEqual([]);
    busySignal.didBeginLinting(linterA, '/');
    busySignal.didBeginLinting(linterA, '/');
    expect(texts).toEqual(['some on /']);
    busySignal.didFinishLinting(linterA, '/');
    expect(texts).toEqual([]);
  });
  it('shows one line per file and one for all project scoped ones', function () {
    var linterA = (0, _helpers.getLinter)('A');
    var linterB = (0, _helpers.getLinter)('B');
    var linterC = (0, _helpers.getLinter)('C');
    var linterD = (0, _helpers.getLinter)('D');
    var linterE = (0, _helpers.getLinter)('E');
    busySignal.didBeginLinting(linterA, '/a');
    busySignal.didBeginLinting(linterA, '/aa');
    busySignal.didBeginLinting(linterB, '/b');
    busySignal.didBeginLinting(linterC, '/b');
    busySignal.didBeginLinting(linterD);
    busySignal.didBeginLinting(linterE);
    var texts = busySignal.provider && busySignal.provider.texts;
    // Test initial state
    expect(texts).toEqual(['A on /a', 'A on /aa', 'B on /b', 'C on /b', 'D', 'E']);
    // Test finish event for no file for a linter
    busySignal.didFinishLinting(linterA);
    expect(texts).toEqual(['A on /a', 'A on /aa', 'B on /b', 'C on /b', 'D', 'E']);
    // Test finish of a single file of a linter with two files running
    busySignal.didFinishLinting(linterA, '/a');
    expect(texts).toEqual(['A on /aa', 'B on /b', 'C on /b', 'D', 'E']);
    // Test finish of the last remaining file for linterA
    busySignal.didFinishLinting(linterA, '/aa');
    expect(texts).toEqual(['B on /b', 'C on /b', 'D', 'E']);
    // Test finish of first linter of two running on '/b'
    busySignal.didFinishLinting(linterB, '/b');
    expect(texts).toEqual(['C on /b', 'D', 'E']);
    // Test finish of second (last) linter running on '/b'
    busySignal.didFinishLinting(linterC, '/b');
    expect(texts).toEqual(['D', 'E']);
    // Test finish even for an unkown file for a linter
    busySignal.didFinishLinting(linterD, '/b');
    expect(texts).toEqual(['D', 'E']);
    // Test finishing a project linter (no file)
    busySignal.didFinishLinting(linterD);
    expect(texts).toEqual(['E']);
    // Test finishing the last linter
    busySignal.didFinishLinting(linterE);
    expect(texts).toEqual([]);
  });
  it('clears everything on dispose', function () {
    var linterA = (0, _helpers.getLinter)();
    busySignal.didBeginLinting(linterA, '/a');
    var texts = busySignal.provider && busySignal.provider.texts;
    expect(texts).toEqual(['some on /a']);
    busySignal.dispose();
    expect(texts).toEqual([]);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9zcGVjL2J1c3ktc2luZ2FsLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7MEJBRTJCLGFBQWE7OzhCQUNqQixxQkFBcUI7Ozs7dUJBQ2xCLFdBQVc7O0lBRS9CLGNBQWM7QUFFUCxXQUZQLGNBQWMsR0FFSjswQkFGVixjQUFjOztBQUdoQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtHQUNoQjs7ZUFKRyxjQUFjOztXQUtiLGlCQUFHO0FBQ04sVUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDckI7OztXQUNFLGFBQUMsSUFBSSxFQUFFO0FBQ1IsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUM3QixjQUFNLElBQUksU0FBUyxRQUFLLElBQUksc0JBQWtCLENBQUE7T0FDL0M7QUFDRCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN0Qjs7O1dBQ0ssZ0JBQUMsSUFBSSxFQUFFO0FBQ1gsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdEMsVUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO09BQzVCO0tBQ0Y7OztXQUNZLGtCQUFHO0FBQ2QsVUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQTtBQUNyQyxXQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQ3ZDLFdBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsY0FBYyxFQUFFLENBQUE7QUFDMUMsV0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUN6QyxhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1NBMUJHLGNBQWM7OztBQTZCcEIsUUFBUSxDQUFDLFlBQVksRUFBRSxZQUFZO0FBQ2pDLE1BQUksVUFBVSxZQUFBLENBQUE7O0FBRWQsZ0RBQVcsYUFBa0I7O0FBRTNCLFFBQUksQ0FBQyxRQUFRLENBQUMsOEJBQThCLEVBQUUsQ0FBQTtBQUM5QyxRQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLCtCQUErQixDQUFDLENBQUE7O0FBRXBFLFVBQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUNwRCxjQUFVLEdBQUcsaUNBQWdCLENBQUE7QUFDN0IsY0FBVSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtHQUNsQyxFQUFDLENBQUE7QUFDRixXQUFTLENBQUMsWUFBWTtBQUNwQixjQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDckIsQ0FBQyxDQUFBOztBQUVGLElBQUUsQ0FBQywwRUFBMEUsRUFBRSxZQUFZO0FBQ3pGLFFBQU0sT0FBTyxHQUFHLHlCQUFXLENBQUE7QUFDM0IsUUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQTtBQUM5RCxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3pCLGNBQVUsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ3hDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO0FBQ3BDLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDekMsY0FBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN6QyxVQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3pCLGNBQVUsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ3hDLGNBQVUsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ3hDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO0FBQ3BDLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDekMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtHQUMxQixDQUFDLENBQUE7QUFDRixJQUFFLENBQUMsNkRBQTZELEVBQUUsWUFBWTtBQUM1RSxRQUFNLE9BQU8sR0FBRyx3QkFBVSxHQUFHLENBQUMsQ0FBQTtBQUM5QixRQUFNLE9BQU8sR0FBRyx3QkFBVSxHQUFHLENBQUMsQ0FBQTtBQUM5QixRQUFNLE9BQU8sR0FBRyx3QkFBVSxHQUFHLENBQUMsQ0FBQTtBQUM5QixRQUFNLE9BQU8sR0FBRyx3QkFBVSxHQUFHLENBQUMsQ0FBQTtBQUM5QixRQUFNLE9BQU8sR0FBRyx3QkFBVSxHQUFHLENBQUMsQ0FBQTtBQUM5QixjQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUN6QyxjQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUMxQyxjQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUN6QyxjQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUN6QyxjQUFVLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ25DLGNBQVUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDbkMsUUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLFFBQVEsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQTs7QUFFOUQsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTs7QUFFOUUsY0FBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7O0FBRTlFLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDMUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBOztBQUVuRSxjQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzNDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBOztBQUV2RCxjQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzFDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7O0FBRTVDLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDMUMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBOztBQUVqQyxjQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzFDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQTs7QUFFakMsY0FBVSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBOztBQUU1QixjQUFVLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtHQUMxQixDQUFDLENBQUE7QUFDRixJQUFFLENBQUMsOEJBQThCLEVBQUUsWUFBWTtBQUM3QyxRQUFNLE9BQU8sR0FBRyx5QkFBVyxDQUFBO0FBQzNCLGNBQVUsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ3pDLFFBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUE7QUFDOUQsVUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUE7QUFDckMsY0FBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3BCLFVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUE7R0FDMUIsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9zcGVjL2J1c3ktc2luZ2FsLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBiZWZvcmVFYWNoIH0gZnJvbSAnamFzbWluZS1maXgnXG5pbXBvcnQgQnVzeVNpZ25hbCBmcm9tICcuLi9kaXN0L2J1c3ktc2lnbmFsJ1xuaW1wb3J0IHsgZ2V0TGludGVyIH0gZnJvbSAnLi9oZWxwZXJzJ1xuXG5jbGFzcyBTaWduYWxSZWdpc3RyeSB7XG4gIHRleHRzOiBBcnJheTxzdHJpbmc+XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGV4dHMgPSBbXVxuICB9XG4gIGNsZWFyKCkge1xuICAgIHRoaXMudGV4dHMuc3BsaWNlKDApXG4gIH1cbiAgYWRkKHRleHQpIHtcbiAgICBpZiAodGhpcy50ZXh0cy5pbmNsdWRlcyh0ZXh0KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJyR7dGV4dH0nIGFscmVhZHkgYWRkZWRgKVxuICAgIH1cbiAgICB0aGlzLnRleHRzLnB1c2godGV4dClcbiAgfVxuICByZW1vdmUodGV4dCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy50ZXh0cy5pbmRleE9mKHRleHQpXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy50ZXh0cy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG4gIHN0YXRpYyBjcmVhdGUoKSB7XG4gICAgY29uc3QgcmVnaXN0cnkgPSBuZXcgU2lnbmFsUmVnaXN0cnkoKVxuICAgIHNweU9uKHJlZ2lzdHJ5LCAnYWRkJykuYW5kQ2FsbFRocm91Z2goKVxuICAgIHNweU9uKHJlZ2lzdHJ5LCAncmVtb3ZlJykuYW5kQ2FsbFRocm91Z2goKVxuICAgIHNweU9uKHJlZ2lzdHJ5LCAnY2xlYXInKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgcmV0dXJuIHJlZ2lzdHJ5XG4gIH1cbn1cblxuZGVzY3JpYmUoJ0J1c3lTaWduYWwnLCBmdW5jdGlvbiAoKSB7XG4gIGxldCBidXN5U2lnbmFsXG5cbiAgYmVmb3JlRWFjaChhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgLy8gQWN0aXZhdGUgYWN0aXZhdGlvbiBob29rXG4gICAgYXRvbS5wYWNrYWdlcy50cmlnZ2VyRGVmZXJyZWRBY3RpdmF0aW9uSG9va3MoKVxuICAgIGF0b20ucGFja2FnZXMudHJpZ2dlckFjdGl2YXRpb25Ib29rKCdjb3JlOmxvYWRlZC1zaGVsbC1lbnZpcm9ubWVudCcpXG5cbiAgICBhd2FpdCBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKCdsaW50ZXItdWktZGVmYXVsdCcpXG4gICAgYnVzeVNpZ25hbCA9IG5ldyBCdXN5U2lnbmFsKClcbiAgICBidXN5U2lnbmFsLmF0dGFjaChTaWduYWxSZWdpc3RyeSlcbiAgfSlcbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICBidXN5U2lnbmFsLmRpc3Bvc2UoKVxuICB9KVxuXG4gIGl0KCd0ZWxscyB0aGUgcmVnaXN0cnkgd2hlbiBsaW50aW5nIGlzIGluIHByb2dyZXNzIHdpdGhvdXQgYWRkaW5nIGR1cGxpY2F0ZXMnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbGludGVyQSA9IGdldExpbnRlcigpXG4gICAgY29uc3QgdGV4dHMgPSBidXN5U2lnbmFsLnByb3ZpZGVyICYmIGJ1c3lTaWduYWwucHJvdmlkZXIudGV4dHNcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoW10pXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ3NvbWUgb24gLyddKVxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJBLCAnLycpXG4gICAgYnVzeVNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlckEsICcvJylcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoW10pXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGJ1c3lTaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlckEsICcvJylcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoWydzb21lIG9uIC8nXSlcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQSwgJy8nKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbXSlcbiAgfSlcbiAgaXQoJ3Nob3dzIG9uZSBsaW5lIHBlciBmaWxlIGFuZCBvbmUgZm9yIGFsbCBwcm9qZWN0IHNjb3BlZCBvbmVzJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxpbnRlckEgPSBnZXRMaW50ZXIoJ0EnKVxuICAgIGNvbnN0IGxpbnRlckIgPSBnZXRMaW50ZXIoJ0InKVxuICAgIGNvbnN0IGxpbnRlckMgPSBnZXRMaW50ZXIoJ0MnKVxuICAgIGNvbnN0IGxpbnRlckQgPSBnZXRMaW50ZXIoJ0QnKVxuICAgIGNvbnN0IGxpbnRlckUgPSBnZXRMaW50ZXIoJ0UnKVxuICAgIGJ1c3lTaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlckEsICcvYScpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy9hYScpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQiwgJy9iJylcbiAgICBidXN5U2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXJDLCAnL2InKVxuICAgIGJ1c3lTaWduYWwuZGlkQmVnaW5MaW50aW5nKGxpbnRlckQpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyRSlcbiAgICBjb25zdCB0ZXh0cyA9IGJ1c3lTaWduYWwucHJvdmlkZXIgJiYgYnVzeVNpZ25hbC5wcm92aWRlci50ZXh0c1xuICAgIC8vIFRlc3QgaW5pdGlhbCBzdGF0ZVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ0Egb24gL2EnLCAnQSBvbiAvYWEnLCAnQiBvbiAvYicsICdDIG9uIC9iJywgJ0QnLCAnRSddKVxuICAgIC8vIFRlc3QgZmluaXNoIGV2ZW50IGZvciBubyBmaWxlIGZvciBhIGxpbnRlclxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJBKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ0Egb24gL2EnLCAnQSBvbiAvYWEnLCAnQiBvbiAvYicsICdDIG9uIC9iJywgJ0QnLCAnRSddKVxuICAgIC8vIFRlc3QgZmluaXNoIG9mIGEgc2luZ2xlIGZpbGUgb2YgYSBsaW50ZXIgd2l0aCB0d28gZmlsZXMgcnVubmluZ1xuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJBLCAnL2EnKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ0Egb24gL2FhJywgJ0Igb24gL2InLCAnQyBvbiAvYicsICdEJywgJ0UnXSlcbiAgICAvLyBUZXN0IGZpbmlzaCBvZiB0aGUgbGFzdCByZW1haW5pbmcgZmlsZSBmb3IgbGludGVyQVxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJBLCAnL2FhJylcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoWydCIG9uIC9iJywgJ0Mgb24gL2InLCAnRCcsICdFJ10pXG4gICAgLy8gVGVzdCBmaW5pc2ggb2YgZmlyc3QgbGludGVyIG9mIHR3byBydW5uaW5nIG9uICcvYidcbiAgICBidXN5U2lnbmFsLmRpZEZpbmlzaExpbnRpbmcobGludGVyQiwgJy9iJylcbiAgICBleHBlY3QodGV4dHMpLnRvRXF1YWwoWydDIG9uIC9iJywgJ0QnLCAnRSddKVxuICAgIC8vIFRlc3QgZmluaXNoIG9mIHNlY29uZCAobGFzdCkgbGludGVyIHJ1bm5pbmcgb24gJy9iJ1xuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJDLCAnL2InKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ0QnLCAnRSddKVxuICAgIC8vIFRlc3QgZmluaXNoIGV2ZW4gZm9yIGFuIHVua293biBmaWxlIGZvciBhIGxpbnRlclxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJELCAnL2InKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ0QnLCAnRSddKVxuICAgIC8vIFRlc3QgZmluaXNoaW5nIGEgcHJvamVjdCBsaW50ZXIgKG5vIGZpbGUpXG4gICAgYnVzeVNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlckQpXG4gICAgZXhwZWN0KHRleHRzKS50b0VxdWFsKFsnRSddKVxuICAgIC8vIFRlc3QgZmluaXNoaW5nIHRoZSBsYXN0IGxpbnRlclxuICAgIGJ1c3lTaWduYWwuZGlkRmluaXNoTGludGluZyhsaW50ZXJFKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbXSlcbiAgfSlcbiAgaXQoJ2NsZWFycyBldmVyeXRoaW5nIG9uIGRpc3Bvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbGludGVyQSA9IGdldExpbnRlcigpXG4gICAgYnVzeVNpZ25hbC5kaWRCZWdpbkxpbnRpbmcobGludGVyQSwgJy9hJylcbiAgICBjb25zdCB0ZXh0cyA9IGJ1c3lTaWduYWwucHJvdmlkZXIgJiYgYnVzeVNpZ25hbC5wcm92aWRlci50ZXh0c1xuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbJ3NvbWUgb24gL2EnXSlcbiAgICBidXN5U2lnbmFsLmRpc3Bvc2UoKVxuICAgIGV4cGVjdCh0ZXh0cykudG9FcXVhbChbXSlcbiAgfSlcbn0pXG4iXX0=