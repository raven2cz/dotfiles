function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _libProvidersList = require('../lib/providers-list');

var _libProvidersList2 = _interopRequireDefault(_libProvidersList);

describe('ProvidersList', function () {
  var providersList = undefined;
  var editor = undefined;

  beforeEach(function () {
    if (providersList) {
      providersList.dispose();
    }
    providersList = new _libProvidersList2['default']();
    atom.workspace.destroyActivePane();
    waitsForPromise(function () {
      return atom.workspace.open(__filename).then(function () {
        editor = atom.workspace.getActiveTextEditor();
      });
    });
    atom.packages.activatePackage('language-javascript');
  });
  function addProvider(provider) {
    return providersList.addProvider(provider);
  }
  function deleteProvider(provider) {
    providersList.deleteProvider(provider);
  }

  describe('addProvider', function () {
    it('validates parameters properly', function () {
      expect(function () {
        addProvider();
      }).toThrow();
      expect(function () {
        addProvider(null);
      }).toThrow();
      expect(function () {
        addProvider(1);
      }).toThrow();
      expect(function () {
        addProvider(false);
      }).toThrow();
      expect(function () {
        addProvider(true);
      }).toThrow();

      expect(function () {
        addProvider({
          grammarScopes: false
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: null
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: true
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: 5
        });
      }).toThrow();

      expect(function () {
        addProvider({
          grammarScopes: [],
          getIntentions: false
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: [],
          getIntentions: null
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: [],
          getIntentions: true
        });
      }).toThrow();
      expect(function () {
        addProvider({
          grammarScopes: [],
          getIntentions: 20
        });
      }).toThrow();
      addProvider({
        grammarScopes: [],
        getIntentions: function getIntentions() {}
      });
    });
  });
  describe('hasProvider', function () {
    it('works properly', function () {
      var provider = {
        grammarScopes: [],
        getIntentions: function getIntentions() {
          throw new Error();
        }
      };
      expect(providersList.hasProvider(provider)).toBe(false);
      addProvider(provider);
      expect(providersList.hasProvider(provider)).toBe(true);
    });
  });
  describe('deleteProvider', function () {
    it('works properly', function () {
      deleteProvider(true);
      deleteProvider(null);
      deleteProvider(false);
      deleteProvider(50);
      var provider = {
        grammarScopes: [],
        getIntentions: function getIntentions() {
          throw new Error();
        }
      };
      expect(providersList.hasProvider(provider)).toBe(false);
      addProvider(provider);
      expect(providersList.hasProvider(provider)).toBe(true);
      providersList.deleteProvider(provider);
      expect(providersList.hasProvider(provider)).toBe(false);
    });
  });
  describe('trigger', function () {
    it('works properly', function () {
      var intention = {
        priority: 100,
        icon: 'bucket',
        'class': 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected: function selected() {
          console.log('You clicked the color picker option');
        }
      };
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return [intention];
        }
      });
      waitsForPromise(function () {
        return providersList.trigger(editor).then(function (results) {
          (0, _assert2['default'])(Array.isArray(results));
          expect(results[0]).toBe(intention);
        });
      });
    });
    it('ignores previous result from executed twice instantly', function () {
      var count = 0;
      var intentionFirst = {
        priority: 100,
        icon: 'bucket',
        'class': 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected: function selected() {
          console.log('You clicked the color picker option');
        }
      };
      var intentionSecond = {
        priority: 100,
        icon: 'bucket',
        'class': 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected: function selected() {
          console.log('You clicked the color picker option');
        }
      };
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          if (++count === 1) {
            return [intentionFirst];
          }
          return [intentionSecond];
        }
      });
      var promiseFirst = providersList.trigger(editor);
      var promiseSecond = providersList.trigger(editor);

      waitsForPromise(function () {
        return promiseFirst.then(function (results) {
          expect(results).toEqual([]);
        });
      });
      waitsForPromise(function () {
        return promiseSecond.then(function (results) {
          (0, _assert2['default'])(Array.isArray(results));
          expect(results[0]).toBe(intentionSecond);
        });
      });
    });
    it('does not enable it if providers return no results, including non-array ones', function () {
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return [];
        }
      });
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return null;
        }
      });
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return false;
        }
      });
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return 50;
        }
      });
      waitsForPromise(function () {
        return providersList.trigger(editor).then(function (results) {
          expect(results).toEqual([]);
        });
      });
    });
    it('emits an error if provider throws an error', function () {
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          throw new Error('test from provider');
        }
      });
      waitsForPromise(function () {
        return providersList.trigger(editor).then(function () {
          expect(false).toBe(true);
        }, function (e) {
          expect(e.message).toBe('test from provider');
        });
      });
    });
    it('validates suggestions properly', function () {
      addProvider({
        grammarScopes: ['*'],
        getIntentions: function getIntentions() {
          return [{}];
        }
      });
      waitsForPromise(function () {
        return providersList.trigger(editor).then(function () {
          expect(false).toBe(true);
        }, function (e) {
          expect(e instanceof Error).toBe(true);
        });
      });
    });
    it('triggers providers based on scope', function () {
      var coffeeCalled = false;
      var jsCalled = false;
      addProvider({
        grammarScopes: ['source.js'],
        getIntentions: function getIntentions() {
          jsCalled = true;
        }
      });
      addProvider({
        grammarScopes: ['source.coffee'],
        getIntentions: function getIntentions() {
          coffeeCalled = true;
        }
      });
      waitsForPromise(function () {
        return providersList.trigger(editor).then(function () {
          expect(jsCalled).toBe(true);
          expect(coffeeCalled).toBe(false);
        });
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvcHJvdmlkZXJzLWxpc3Qtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztzQkFFc0IsUUFBUTs7OztnQ0FDSix1QkFBdUI7Ozs7QUFFakQsUUFBUSxDQUFDLGVBQWUsRUFBRSxZQUFXO0FBQ25DLE1BQUksYUFBYSxZQUFBLENBQUE7QUFDakIsTUFBSSxNQUFNLFlBQUEsQ0FBQTs7QUFFVixZQUFVLENBQUMsWUFBVztBQUNwQixRQUFJLGFBQWEsRUFBRTtBQUNqQixtQkFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3hCO0FBQ0QsaUJBQWEsR0FBRyxtQ0FBbUIsQ0FBQTtBQUNuQyxRQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUE7QUFDbEMsbUJBQWUsQ0FBQyxZQUFXO0FBQ3pCLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDckQsY0FBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtPQUM5QyxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0dBQ3JELENBQUMsQ0FBQTtBQUNGLFdBQVMsV0FBVyxDQUFDLFFBQWEsRUFBRTtBQUNsQyxXQUFPLGFBQWEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDM0M7QUFDRCxXQUFTLGNBQWMsQ0FBQyxRQUFhLEVBQUU7QUFDckMsaUJBQWEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDdkM7O0FBRUQsVUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFXO0FBQ2pDLE1BQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFXO0FBQzdDLFlBQU0sQ0FBQyxZQUFXO0FBQ2hCLG1CQUFXLEVBQUUsQ0FBQTtPQUNkLENB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QUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvc3BlYy9wcm92aWRlcnMtbGlzdC1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGludmFyaWFudCBmcm9tICdhc3NlcnQnXG5pbXBvcnQgUHJvdmlkZXJzTGlzdCBmcm9tICcuLi9saWIvcHJvdmlkZXJzLWxpc3QnXG5cbmRlc2NyaWJlKCdQcm92aWRlcnNMaXN0JywgZnVuY3Rpb24oKSB7XG4gIGxldCBwcm92aWRlcnNMaXN0XG4gIGxldCBlZGl0b3JcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGlmIChwcm92aWRlcnNMaXN0KSB7XG4gICAgICBwcm92aWRlcnNMaXN0LmRpc3Bvc2UoKVxuICAgIH1cbiAgICBwcm92aWRlcnNMaXN0ID0gbmV3IFByb3ZpZGVyc0xpc3QoKVxuICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lKClcbiAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2Uub3BlbihfX2ZpbGVuYW1lKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIH0pXG4gICAgfSlcbiAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGFuZ3VhZ2UtamF2YXNjcmlwdCcpXG4gIH0pXG4gIGZ1bmN0aW9uIGFkZFByb3ZpZGVyKHByb3ZpZGVyOiBhbnkpIHtcbiAgICByZXR1cm4gcHJvdmlkZXJzTGlzdC5hZGRQcm92aWRlcihwcm92aWRlcilcbiAgfVxuICBmdW5jdGlvbiBkZWxldGVQcm92aWRlcihwcm92aWRlcjogYW55KSB7XG4gICAgcHJvdmlkZXJzTGlzdC5kZWxldGVQcm92aWRlcihwcm92aWRlcilcbiAgfVxuXG4gIGRlc2NyaWJlKCdhZGRQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCd2YWxpZGF0ZXMgcGFyYW1ldGVycyBwcm9wZXJseScsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcigpXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIobnVsbClcbiAgICAgIH0pLnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcigxKVxuICAgICAgfSkudG9UaHJvdygpXG4gICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkZFByb3ZpZGVyKGZhbHNlKVxuICAgICAgfSkudG9UaHJvdygpXG4gICAgICBleHBlY3QoZnVuY3Rpb24oKSB7XG4gICAgICAgIGFkZFByb3ZpZGVyKHRydWUpXG4gICAgICB9KS50b1Rocm93KClcblxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgICAgZ3JhbW1hclNjb3BlczogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICAgIGdyYW1tYXJTY29wZXM6IG51bGwsXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICAgIGdyYW1tYXJTY29wZXM6IHRydWUsXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICAgIGdyYW1tYXJTY29wZXM6IDUsXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcblxuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgICAgZ3JhbW1hclNjb3BlczogW10sXG4gICAgICAgICAgZ2V0SW50ZW50aW9uczogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICAgIGdyYW1tYXJTY29wZXM6IFtdLFxuICAgICAgICAgIGdldEludGVudGlvbnM6IG51bGwsXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICAgIGdyYW1tYXJTY29wZXM6IFtdLFxuICAgICAgICAgIGdldEludGVudGlvbnM6IHRydWUsXG4gICAgICAgIH0pXG4gICAgICB9KS50b1Rocm93KClcbiAgICAgIGV4cGVjdChmdW5jdGlvbigpIHtcbiAgICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICAgIGdyYW1tYXJTY29wZXM6IFtdLFxuICAgICAgICAgIGdldEludGVudGlvbnM6IDIwLFxuICAgICAgICB9KVxuICAgICAgfSkudG9UaHJvdygpXG4gICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFtdLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge30sXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCdoYXNQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCd3b3JrcyBwcm9wZXJseScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFtdLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBleHBlY3QocHJvdmlkZXJzTGlzdC5oYXNQcm92aWRlcihwcm92aWRlcikpLnRvQmUoZmFsc2UpXG4gICAgICBhZGRQcm92aWRlcihwcm92aWRlcilcbiAgICAgIGV4cGVjdChwcm92aWRlcnNMaXN0Lmhhc1Byb3ZpZGVyKHByb3ZpZGVyKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCdkZWxldGVQcm92aWRlcicsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCd3b3JrcyBwcm9wZXJseScsIGZ1bmN0aW9uKCkge1xuICAgICAgZGVsZXRlUHJvdmlkZXIodHJ1ZSlcbiAgICAgIGRlbGV0ZVByb3ZpZGVyKG51bGwpXG4gICAgICBkZWxldGVQcm92aWRlcihmYWxzZSlcbiAgICAgIGRlbGV0ZVByb3ZpZGVyKDUwKVxuICAgICAgY29uc3QgcHJvdmlkZXIgPSB7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFtdLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBleHBlY3QocHJvdmlkZXJzTGlzdC5oYXNQcm92aWRlcihwcm92aWRlcikpLnRvQmUoZmFsc2UpXG4gICAgICBhZGRQcm92aWRlcihwcm92aWRlcilcbiAgICAgIGV4cGVjdChwcm92aWRlcnNMaXN0Lmhhc1Byb3ZpZGVyKHByb3ZpZGVyKSkudG9CZSh0cnVlKVxuICAgICAgcHJvdmlkZXJzTGlzdC5kZWxldGVQcm92aWRlcihwcm92aWRlcilcbiAgICAgIGV4cGVjdChwcm92aWRlcnNMaXN0Lmhhc1Byb3ZpZGVyKHByb3ZpZGVyKSkudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxuICBkZXNjcmliZSgndHJpZ2dlcicsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCd3b3JrcyBwcm9wZXJseScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgaW50ZW50aW9uID0ge1xuICAgICAgICBwcmlvcml0eTogMTAwLFxuICAgICAgICBpY29uOiAnYnVja2V0JyxcbiAgICAgICAgY2xhc3M6ICdjdXN0b20taWNvbi1jbGFzcycsXG4gICAgICAgIHRpdGxlOiAnQ2hvb3NlIGNvbG9yIGZyb20gY29sb3JwaWNrZXInLFxuICAgICAgICBzZWxlY3RlZCgpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGNsaWNrZWQgdGhlIGNvbG9yIHBpY2tlciBvcHRpb24nKVxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJyonXSxcbiAgICAgICAgZ2V0SW50ZW50aW9ucygpIHtcbiAgICAgICAgICByZXR1cm4gW2ludGVudGlvbl1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm92aWRlcnNMaXN0LnRyaWdnZXIoZWRpdG9yKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShyZXN1bHRzKSlcbiAgICAgICAgICBleHBlY3QocmVzdWx0c1swXSkudG9CZShpbnRlbnRpb24pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gICAgaXQoJ2lnbm9yZXMgcHJldmlvdXMgcmVzdWx0IGZyb20gZXhlY3V0ZWQgdHdpY2UgaW5zdGFudGx5JywgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY291bnQgPSAwXG4gICAgICBjb25zdCBpbnRlbnRpb25GaXJzdCA9IHtcbiAgICAgICAgcHJpb3JpdHk6IDEwMCxcbiAgICAgICAgaWNvbjogJ2J1Y2tldCcsXG4gICAgICAgIGNsYXNzOiAnY3VzdG9tLWljb24tY2xhc3MnLFxuICAgICAgICB0aXRsZTogJ0Nob29zZSBjb2xvciBmcm9tIGNvbG9ycGlja2VyJyxcbiAgICAgICAgc2VsZWN0ZWQoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBjb2xvciBwaWNrZXIgb3B0aW9uJylcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IGludGVudGlvblNlY29uZCA9IHtcbiAgICAgICAgcHJpb3JpdHk6IDEwMCxcbiAgICAgICAgaWNvbjogJ2J1Y2tldCcsXG4gICAgICAgIGNsYXNzOiAnY3VzdG9tLWljb24tY2xhc3MnLFxuICAgICAgICB0aXRsZTogJ0Nob29zZSBjb2xvciBmcm9tIGNvbG9ycGlja2VyJyxcbiAgICAgICAgc2VsZWN0ZWQoKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBjb2xvciBwaWNrZXIgb3B0aW9uJylcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWycqJ10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG4gICAgICAgICAgaWYgKCsrY291bnQgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBbaW50ZW50aW9uRmlyc3RdXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBbaW50ZW50aW9uU2Vjb25kXVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb21pc2VGaXJzdCA9IHByb3ZpZGVyc0xpc3QudHJpZ2dlcihlZGl0b3IpXG4gICAgICBjb25zdCBwcm9taXNlU2Vjb25kID0gcHJvdmlkZXJzTGlzdC50cmlnZ2VyKGVkaXRvcilcblxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcHJvbWlzZUZpcnN0LnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgIGV4cGVjdChyZXN1bHRzKS50b0VxdWFsKFtdKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHByb21pc2VTZWNvbmQudGhlbihmdW5jdGlvbihyZXN1bHRzKSB7XG4gICAgICAgICAgaW52YXJpYW50KEFycmF5LmlzQXJyYXkocmVzdWx0cykpXG4gICAgICAgICAgZXhwZWN0KHJlc3VsdHNbMF0pLnRvQmUoaW50ZW50aW9uU2Vjb25kKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBlbmFibGUgaXQgaWYgcHJvdmlkZXJzIHJldHVybiBubyByZXN1bHRzLCBpbmNsdWRpbmcgbm9uLWFycmF5IG9uZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWycqJ10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG4gICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJyonXSxcbiAgICAgICAgZ2V0SW50ZW50aW9ucygpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIGFkZFByb3ZpZGVyKHtcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWycqJ10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJyonXSxcbiAgICAgICAgZ2V0SW50ZW50aW9ucygpIHtcbiAgICAgICAgICByZXR1cm4gNTBcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm92aWRlcnNMaXN0LnRyaWdnZXIoZWRpdG9yKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICBleHBlY3QocmVzdWx0cykudG9FcXVhbChbXSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICBpdCgnZW1pdHMgYW4gZXJyb3IgaWYgcHJvdmlkZXIgdGhyb3dzIGFuIGVycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcigndGVzdCBmcm9tIHByb3ZpZGVyJylcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICB3YWl0c0ZvclByb21pc2UoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm92aWRlcnNMaXN0LnRyaWdnZXIoZWRpdG9yKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGV4cGVjdChmYWxzZSkudG9CZSh0cnVlKVxuICAgICAgICB9LCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgZXhwZWN0KGUubWVzc2FnZSkudG9CZSgndGVzdCBmcm9tIHByb3ZpZGVyJylcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICBpdCgndmFsaWRhdGVzIHN1Z2dlc3Rpb25zIHByb3Blcmx5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnKiddLFxuICAgICAgICBnZXRJbnRlbnRpb25zKCkge1xuICAgICAgICAgIHJldHVybiBbe31dXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcHJvdmlkZXJzTGlzdC50cmlnZ2VyKGVkaXRvcikudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgICAgfSwgZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGV4cGVjdChlIGluc3RhbmNlb2YgRXJyb3IpLnRvQmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICBpdCgndHJpZ2dlcnMgcHJvdmlkZXJzIGJhc2VkIG9uIHNjb3BlJywgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY29mZmVlQ2FsbGVkID0gZmFsc2VcbiAgICAgIGxldCBqc0NhbGxlZCA9IGZhbHNlXG4gICAgICBhZGRQcm92aWRlcih7XG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzJ10sXG4gICAgICAgIGdldEludGVudGlvbnMoKSB7XG4gICAgICAgICAganNDYWxsZWQgPSB0cnVlXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgYWRkUHJvdmlkZXIoe1xuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5jb2ZmZWUnXSxcbiAgICAgICAgZ2V0SW50ZW50aW9ucygpIHtcbiAgICAgICAgICBjb2ZmZWVDYWxsZWQgPSB0cnVlXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgd2FpdHNGb3JQcm9taXNlKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcHJvdmlkZXJzTGlzdC50cmlnZ2VyKGVkaXRvcikudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBleHBlY3QoanNDYWxsZWQpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBleHBlY3QoY29mZmVlQ2FsbGVkKS50b0JlKGZhbHNlKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==