Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('./helpers');

var _validate = require('./validate');

var ProvidersList = (function () {
  function ProvidersList() {
    _classCallCheck(this, ProvidersList);

    this.number = 0;
    this.providers = new Set();
  }

  _createClass(ProvidersList, [{
    key: 'addProvider',
    value: function addProvider(provider) {
      if (!this.hasProvider(provider)) {
        (0, _validate.provider)(provider);
        this.providers.add(provider);
      }
    }
  }, {
    key: 'hasProvider',
    value: function hasProvider(provider) {
      return this.providers.has(provider);
    }
  }, {
    key: 'deleteProvider',
    value: function deleteProvider(provider) {
      if (this.hasProvider(provider)) {
        this.providers['delete'](provider);
      }
    }
  }, {
    key: 'trigger',
    value: _asyncToGenerator(function* (textEditor) {
      var editorPath = textEditor.getPath();
      var bufferPosition = textEditor.getCursorBufferPosition();

      if (!editorPath) {
        return [];
      }

      var scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray();
      scopes.push('*');

      var promises = [];
      this.providers.forEach(function (provider) {
        if (scopes.some(function (scope) {
          return provider.grammarScopes.indexOf(scope) !== -1;
        })) {
          promises.push(new Promise(function (resolve) {
            resolve(provider.getIntentions({ textEditor: textEditor, bufferPosition: bufferPosition }));
          }).then(function (results) {
            if (atom.inDevMode()) {
              (0, _validate.suggestionsList)(results);
            }
            return results;
          }));
        }
      });

      var number = ++this.number;
      var results = (yield Promise.all(promises)).reduce(function (items, item) {
        if (Array.isArray(item)) {
          return items.concat(item);
        }
        return items;
      }, []);

      if (number !== this.number || !results.length) {
        // If has been executed one more time, ignore these results
        // Or we don't have any results
        return [];
      }

      return (0, _helpers.processListItems)(results);
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
    }
  }]);

  return ProvidersList;
})();

exports['default'] = ProvidersList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9wcm92aWRlcnMtbGlzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3VCQUdpQyxXQUFXOzt3QkFDeUMsWUFBWTs7SUFHNUUsYUFBYTtBQUlyQixXQUpRLGFBQWEsR0FJbEI7MEJBSkssYUFBYTs7QUFLOUIsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7QUFDZixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7R0FDM0I7O2VBUGtCLGFBQWE7O1dBUXJCLHFCQUFDLFFBQXNCLEVBQUU7QUFDbEMsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDL0IsZ0NBQWlCLFFBQVEsQ0FBQyxDQUFBO0FBQzFCLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdCO0tBQ0Y7OztXQUNVLHFCQUFDLFFBQXNCLEVBQVc7QUFDM0MsYUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUNwQzs7O1dBQ2Esd0JBQUMsUUFBc0IsRUFBRTtBQUNyQyxVQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUIsWUFBSSxDQUFDLFNBQVMsVUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ2hDO0tBQ0Y7Ozs2QkFDWSxXQUFDLFVBQXNCLEVBQTRCO0FBQzlELFVBQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN2QyxVQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTs7QUFFM0QsVUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNmLGVBQU8sRUFBRSxDQUFBO09BQ1Y7O0FBRUQsVUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLGdDQUFnQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFBO0FBQzNGLFlBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRWhCLFVBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUN4QyxZQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQSxLQUFLO2lCQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUFBLENBQUMsRUFBRTtBQUN0RSxrQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRTtBQUMxQyxtQkFBTyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFFLGNBQWMsRUFBZCxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUE7V0FDaEUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLE9BQU8sRUFBRTtBQUN4QixnQkFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDcEIsNkNBQW9CLE9BQU8sQ0FBQyxDQUFBO2FBQzdCO0FBQ0QsbUJBQU8sT0FBTyxDQUFBO1dBQ2YsQ0FBQyxDQUFDLENBQUE7U0FDSjtPQUNGLENBQUMsQ0FBQTs7QUFFRixVQUFNLE1BQU0sR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDNUIsVUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBRSxNQUFNLENBQUMsVUFBUyxLQUFLLEVBQUUsSUFBSSxFQUFFO0FBQ3pFLFlBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN2QixpQkFBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzFCO0FBQ0QsZUFBTyxLQUFLLENBQUE7T0FDYixFQUFFLEVBQUUsQ0FBQyxDQUFBOztBQUVOLFVBQUksTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFOzs7QUFHN0MsZUFBTyxFQUFFLENBQUE7T0FDVjs7QUFFRCxhQUFPLCtCQUFpQixPQUFPLENBQUMsQ0FBQTtLQUNqQzs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ3ZCOzs7U0FqRWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9wcm92aWRlcnMtbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBwcm9jZXNzTGlzdEl0ZW1zIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHsgcHJvdmlkZXIgYXMgdmFsaWRhdGVQcm92aWRlciwgc3VnZ2VzdGlvbnNMaXN0IGFzIHZhbGlkYXRlU3VnZ2VzdGlvbnMgfSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IHR5cGUgeyBMaXN0UHJvdmlkZXIsIExpc3RJdGVtIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvdmlkZXJzTGlzdCB7XG4gIG51bWJlcjogbnVtYmVyO1xuICBwcm92aWRlcnM6IFNldDxMaXN0UHJvdmlkZXI+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubnVtYmVyID0gMFxuICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IFNldCgpXG4gIH1cbiAgYWRkUHJvdmlkZXIocHJvdmlkZXI6IExpc3RQcm92aWRlcikge1xuICAgIGlmICghdGhpcy5oYXNQcm92aWRlcihwcm92aWRlcikpIHtcbiAgICAgIHZhbGlkYXRlUHJvdmlkZXIocHJvdmlkZXIpXG4gICAgICB0aGlzLnByb3ZpZGVycy5hZGQocHJvdmlkZXIpXG4gICAgfVxuICB9XG4gIGhhc1Byb3ZpZGVyKHByb3ZpZGVyOiBMaXN0UHJvdmlkZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlcnMuaGFzKHByb3ZpZGVyKVxuICB9XG4gIGRlbGV0ZVByb3ZpZGVyKHByb3ZpZGVyOiBMaXN0UHJvdmlkZXIpIHtcbiAgICBpZiAodGhpcy5oYXNQcm92aWRlcihwcm92aWRlcikpIHtcbiAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlcilcbiAgICB9XG4gIH1cbiAgYXN5bmMgdHJpZ2dlcih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogUHJvbWlzZTxBcnJheTxMaXN0SXRlbT4+IHtcbiAgICBjb25zdCBlZGl0b3JQYXRoID0gdGV4dEVkaXRvci5nZXRQYXRoKClcbiAgICBjb25zdCBidWZmZXJQb3NpdGlvbiA9IHRleHRFZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuXG4gICAgaWYgKCFlZGl0b3JQYXRoKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICBjb25zdCBzY29wZXMgPSB0ZXh0RWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKGJ1ZmZlclBvc2l0aW9uKS5nZXRTY29wZXNBcnJheSgpXG4gICAgc2NvcGVzLnB1c2goJyonKVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIHRoaXMucHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIGlmIChzY29wZXMuc29tZShzY29wZSA9PiBwcm92aWRlci5ncmFtbWFyU2NvcGVzLmluZGV4T2Yoc2NvcGUpICE9PSAtMSkpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgcmVzb2x2ZShwcm92aWRlci5nZXRJbnRlbnRpb25zKHsgdGV4dEVkaXRvciwgYnVmZmVyUG9zaXRpb24gfSkpXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzdWx0cykge1xuICAgICAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZVN1Z2dlc3Rpb25zKHJlc3VsdHMpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHRzXG4gICAgICAgIH0pKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zdCBudW1iZXIgPSArK3RoaXMubnVtYmVyXG4gICAgY29uc3QgcmVzdWx0cyA9IChhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcykpLnJlZHVjZShmdW5jdGlvbihpdGVtcywgaXRlbSkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1zLmNvbmNhdChpdGVtKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZW1zXG4gICAgfSwgW10pXG5cbiAgICBpZiAobnVtYmVyICE9PSB0aGlzLm51bWJlciB8fCAhcmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgIC8vIElmIGhhcyBiZWVuIGV4ZWN1dGVkIG9uZSBtb3JlIHRpbWUsIGlnbm9yZSB0aGVzZSByZXN1bHRzXG4gICAgICAvLyBPciB3ZSBkb24ndCBoYXZlIGFueSByZXN1bHRzXG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICByZXR1cm4gcHJvY2Vzc0xpc3RJdGVtcyhyZXN1bHRzKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5wcm92aWRlcnMuY2xlYXIoKVxuICB9XG59XG4iXX0=