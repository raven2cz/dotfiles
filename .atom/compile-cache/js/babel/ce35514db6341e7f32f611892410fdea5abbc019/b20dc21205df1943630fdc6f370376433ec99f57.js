Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _elementsHighlight = require('./elements/highlight');

var ProvidersHighlight = (function () {
  function ProvidersHighlight() {
    _classCallCheck(this, ProvidersHighlight);

    this.number = 0;
    this.providers = new Set();
  }

  _createClass(ProvidersHighlight, [{
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

      var visibleRange = _atom.Range.fromObject([textEditor.bufferPositionForScreenPosition([textEditor.getFirstVisibleScreenRow(), 0]), textEditor.bufferPositionForScreenPosition([textEditor.getLastVisibleScreenRow(), 0])]);
      // Setting this to infinity on purpose, cause the buffer position just marks visible column
      // according to element width
      visibleRange.end.column = Infinity;

      var promises = [];
      this.providers.forEach(function (provider) {
        if (scopes.some(function (scope) {
          return provider.grammarScopes.indexOf(scope) !== -1;
        })) {
          promises.push(new Promise(function (resolve) {
            resolve(provider.getIntentions({ textEditor: textEditor, visibleRange: visibleRange }));
          }).then(function (results) {
            if (atom.inDevMode()) {
              (0, _validate.suggestionsShow)(results);
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
        // Or we just don't have any results
        return [];
      }

      return results;
    })
  }, {
    key: 'paint',
    value: function paint(textEditor, intentions) {
      var markers = [];

      var _loop = function (intention) {
        var matchedText = textEditor.getTextInBufferRange(intention.range);
        var marker = textEditor.markBufferRange(intention.range);
        var element = (0, _elementsHighlight.create)(intention, matchedText.length);
        intention.created({ textEditor: textEditor, element: element, marker: marker, matchedText: matchedText });
        textEditor.decorateMarker(marker, {
          type: 'overlay',
          position: 'tail',
          item: element
        });
        marker.onDidChange(function (_ref) {
          var start = _ref.newHeadBufferPosition;
          var end = _ref.oldTailBufferPosition;

          element.textContent = _elementsHighlight.PADDING_CHARACTER.repeat(textEditor.getTextInBufferRange([start, end]).length);
        });
        markers.push(marker);
      };

      for (var intention of intentions) {
        _loop(intention);
      }
      return function () {
        markers.forEach(function (marker) {
          try {
            marker.destroy();
          } catch (_) {/* No Op */}
        });
      };
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
    }
  }]);

  return ProvidersHighlight;
})();

exports['default'] = ProvidersHighlight;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9wcm92aWRlcnMtaGlnaGxpZ2h0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRXNCLE1BQU07O3dCQUV5RCxZQUFZOztpQ0FDdEMsc0JBQXNCOztJQUc1RCxrQkFBa0I7QUFJMUIsV0FKUSxrQkFBa0IsR0FJdkI7MEJBSkssa0JBQWtCOztBQUtuQyxRQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQTtBQUNmLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtHQUMzQjs7ZUFQa0Isa0JBQWtCOztXQVExQixxQkFBQyxRQUEyQixFQUFFO0FBQ3ZDLFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQy9CLGdDQUFpQixRQUFRLENBQUMsQ0FBQTtBQUMxQixZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3QjtLQUNGOzs7V0FDVSxxQkFBQyxRQUEyQixFQUFXO0FBQ2hELGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDcEM7OztXQUNhLHdCQUFDLFFBQTJCLEVBQUU7QUFDMUMsVUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzlCLFlBQUksQ0FBQyxTQUFTLFVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUNoQztLQUNGOzs7NkJBQ1ksV0FBQyxVQUFzQixFQUFpQztBQUNuRSxVQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdkMsVUFBTSxjQUFjLEdBQUcsVUFBVSxDQUFDLHVCQUF1QixFQUFFLENBQUE7O0FBRTNELFVBQUksQ0FBQyxVQUFVLEVBQUU7QUFDZixlQUFPLEVBQUUsQ0FBQTtPQUNWOztBQUVELFVBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxnQ0FB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QUFXLENBQUMsVUFBUyxJQUE0RCxFQUFFO2NBQXJDLEtBQUssR0FBOUIsSUFBNEQsQ0FBMUQscUJBQXFCO2NBQWdDLEdBQUcsR0FBMUQsSUFBNEQsQ0FBNUIscUJBQXFCOztBQUMvRSxpQkFBTyxDQUFDLFdBQVcsR0FBRyxxQ0FBa0IsTUFBTSxDQUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQ3JHLENBQUMsQ0FBQTtBQUNGLGVBQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7OztBQWJ0QixXQUFLLElBQU0sU0FBUyxJQUFLLFVBQVUsRUFBeUI7Y0FBakQsU0FBUztPQWNuQjtBQUNELGFBQU8sWUFBVztBQUNoQixlQUFPLENBQUMsT0FBTyxDQUFDLFVBQVMsTUFBTSxFQUFFO0FBQy9CLGNBQUk7QUFDRixrQkFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1dBQ2pCLENBQUMsT0FBTyxDQUFDLEVBQUUsYUFBZTtTQUM1QixDQUFDLENBQUE7T0FDSCxDQUFBO0tBQ0Y7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN2Qjs7O1NBbEdrQixrQkFBa0I7OztxQkFBbEIsa0JBQWtCIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9wcm92aWRlcnMtaGlnaGxpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHByb3ZpZGVyIGFzIHZhbGlkYXRlUHJvdmlkZXIsIHN1Z2dlc3Rpb25zU2hvdyBhcyB2YWxpZGF0ZVN1Z2dlc3Rpb25zIH0gZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCB7IGNyZWF0ZSBhcyBjcmVhdGVFbGVtZW50LCBQQURESU5HX0NIQVJBQ1RFUiB9IGZyb20gJy4vZWxlbWVudHMvaGlnaGxpZ2h0J1xuaW1wb3J0IHR5cGUgeyBIaWdobGlnaHRQcm92aWRlciwgSGlnaGxpZ2h0SXRlbSB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb3ZpZGVyc0hpZ2hsaWdodCB7XG4gIG51bWJlcjogbnVtYmVyO1xuICBwcm92aWRlcnM6IFNldDxIaWdobGlnaHRQcm92aWRlcj47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5udW1iZXIgPSAwXG4gICAgdGhpcy5wcm92aWRlcnMgPSBuZXcgU2V0KClcbiAgfVxuICBhZGRQcm92aWRlcihwcm92aWRlcjogSGlnaGxpZ2h0UHJvdmlkZXIpIHtcbiAgICBpZiAoIXRoaXMuaGFzUHJvdmlkZXIocHJvdmlkZXIpKSB7XG4gICAgICB2YWxpZGF0ZVByb3ZpZGVyKHByb3ZpZGVyKVxuICAgICAgdGhpcy5wcm92aWRlcnMuYWRkKHByb3ZpZGVyKVxuICAgIH1cbiAgfVxuICBoYXNQcm92aWRlcihwcm92aWRlcjogSGlnaGxpZ2h0UHJvdmlkZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wcm92aWRlcnMuaGFzKHByb3ZpZGVyKVxuICB9XG4gIGRlbGV0ZVByb3ZpZGVyKHByb3ZpZGVyOiBIaWdobGlnaHRQcm92aWRlcikge1xuICAgIGlmICh0aGlzLmhhc1Byb3ZpZGVyKHByb3ZpZGVyKSkge1xuICAgICAgdGhpcy5wcm92aWRlcnMuZGVsZXRlKHByb3ZpZGVyKVxuICAgIH1cbiAgfVxuICBhc3luYyB0cmlnZ2VyKHRleHRFZGl0b3I6IFRleHRFZGl0b3IpOiBQcm9taXNlPEFycmF5PEhpZ2hsaWdodEl0ZW0+PiB7XG4gICAgY29uc3QgZWRpdG9yUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpXG4gICAgY29uc3QgYnVmZmVyUG9zaXRpb24gPSB0ZXh0RWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcblxuICAgIGlmICghZWRpdG9yUGF0aCkge1xuICAgICAgcmV0dXJuIFtdXG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGVzID0gdGV4dEVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbikuZ2V0U2NvcGVzQXJyYXkoKVxuICAgIHNjb3Blcy5wdXNoKCcqJylcblxuICAgIGNvbnN0IHZpc2libGVSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1xuICAgICAgdGV4dEVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKFt0ZXh0RWRpdG9yLmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdygpLCAwXSksXG4gICAgICB0ZXh0RWRpdG9yLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oW3RleHRFZGl0b3IuZ2V0TGFzdFZpc2libGVTY3JlZW5Sb3coKSwgMF0pLFxuICAgIF0pXG4gICAgLy8gU2V0dGluZyB0aGlzIHRvIGluZmluaXR5IG9uIHB1cnBvc2UsIGNhdXNlIHRoZSBidWZmZXIgcG9zaXRpb24ganVzdCBtYXJrcyB2aXNpYmxlIGNvbHVtblxuICAgIC8vIGFjY29yZGluZyB0byBlbGVtZW50IHdpZHRoXG4gICAgdmlzaWJsZVJhbmdlLmVuZC5jb2x1bW4gPSBJbmZpbml0eVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIHRoaXMucHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIGlmIChzY29wZXMuc29tZShzY29wZSA9PiBwcm92aWRlci5ncmFtbWFyU2NvcGVzLmluZGV4T2Yoc2NvcGUpICE9PSAtMSkpIHtcbiAgICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgICAgcmVzb2x2ZShwcm92aWRlci5nZXRJbnRlbnRpb25zKHsgdGV4dEVkaXRvciwgdmlzaWJsZVJhbmdlIH0pKVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVTdWdnZXN0aW9ucyhyZXN1bHRzKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgICAgICB9KSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgbnVtYmVyID0gKyt0aGlzLm51bWJlclxuICAgIGNvbnN0IHJlc3VsdHMgPSAoYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpKS5yZWR1Y2UoZnVuY3Rpb24oaXRlbXMsIGl0ZW0pIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgICAgIHJldHVybiBpdGVtcy5jb25jYXQoaXRlbSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVtc1xuICAgIH0sIFtdKVxuXG4gICAgaWYgKG51bWJlciAhPT0gdGhpcy5udW1iZXIgfHwgIXJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAvLyBJZiBoYXMgYmVlbiBleGVjdXRlZCBvbmUgbW9yZSB0aW1lLCBpZ25vcmUgdGhlc2UgcmVzdWx0c1xuICAgICAgLy8gT3Igd2UganVzdCBkb24ndCBoYXZlIGFueSByZXN1bHRzXG4gICAgICByZXR1cm4gW11cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG4gIHBhaW50KHRleHRFZGl0b3I6IFRleHRFZGl0b3IsIGludGVudGlvbnM6IEFycmF5PEhpZ2hsaWdodEl0ZW0+KTogKCgpID0+IHZvaWQpIHtcbiAgICBjb25zdCBtYXJrZXJzID0gW11cbiAgICBmb3IgKGNvbnN0IGludGVudGlvbiBvZiAoaW50ZW50aW9uczogQXJyYXk8SGlnaGxpZ2h0SXRlbT4pKSB7XG4gICAgICBjb25zdCBtYXRjaGVkVGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoaW50ZW50aW9uLnJhbmdlKVxuICAgICAgY29uc3QgbWFya2VyID0gdGV4dEVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoaW50ZW50aW9uLnJhbmdlKVxuICAgICAgY29uc3QgZWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQoaW50ZW50aW9uLCBtYXRjaGVkVGV4dC5sZW5ndGgpXG4gICAgICBpbnRlbnRpb24uY3JlYXRlZCh7IHRleHRFZGl0b3IsIGVsZW1lbnQsIG1hcmtlciwgbWF0Y2hlZFRleHQgfSlcbiAgICAgIHRleHRFZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgcG9zaXRpb246ICd0YWlsJyxcbiAgICAgICAgaXRlbTogZWxlbWVudCxcbiAgICAgIH0pXG4gICAgICBtYXJrZXIub25EaWRDaGFuZ2UoZnVuY3Rpb24oeyBuZXdIZWFkQnVmZmVyUG9zaXRpb246IHN0YXJ0LCBvbGRUYWlsQnVmZmVyUG9zaXRpb246IGVuZCB9KSB7XG4gICAgICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBQQURESU5HX0NIQVJBQ1RFUi5yZXBlYXQodGV4dEVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShbc3RhcnQsIGVuZF0pLmxlbmd0aClcbiAgICAgIH0pXG4gICAgICBtYXJrZXJzLnB1c2gobWFya2VyKVxuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICBtYXJrZXJzLmZvckVhY2goZnVuY3Rpb24obWFya2VyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgICB9IGNhdGNoIChfKSB7IC8qIE5vIE9wICovIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5wcm92aWRlcnMuY2xlYXIoKVxuICB9XG59XG4iXX0=