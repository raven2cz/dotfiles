(function() {
  module.exports = function(colorPicker) {
    return {
      Emitter: (require('../modules/Emitter'))(),
      element: null,
      color: null,
      emitFormatChanged: function(format) {
        return this.Emitter.emit('formatChanged', format);
      },
      onFormatChanged: function(callback) {
        return this.Emitter.on('formatChanged', callback);
      },
      activate: function() {
        this.element = {
          el: (function() {
            var _classPrefix, _el;
            _classPrefix = colorPicker.element.el.className;
            _el = document.createElement('div');
            _el.classList.add(_classPrefix + "-format");
            return _el;
          })(),
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        colorPicker.element.add(this.element.el);
        setTimeout((function(_this) {
          return function() {
            var Color, _activeButton, _buttons, _format, i, len, ref, results;
            Color = colorPicker.getExtension('Color');
            _buttons = [];
            _activeButton = null;
            colorPicker.onBeforeOpen(function() {
              var _button, i, len, results;
              results = [];
              for (i = 0, len = _buttons.length; i < len; i++) {
                _button = _buttons[i];
                results.push(_button.deactivate());
              }
              return results;
            });
            Color.onOutputFormat(function(format) {
              var _button, i, len, results;
              results = [];
              for (i = 0, len = _buttons.length; i < len; i++) {
                _button = _buttons[i];
                if (format === _button.format || format === (_button.format + "A")) {
                  _button.activate();
                  results.push(_activeButton = _button);
                } else {
                  results.push(_button.deactivate());
                }
              }
              return results;
            });
            ref = ['RGB', 'HEX', 'HSL', 'HSV', 'VEC'];
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              _format = ref[i];
              results.push((function(_format) {
                var Format, _button, _isClicking, hasChild;
                Format = _this;
                _button = {
                  el: (function() {
                    var _el;
                    _el = document.createElement('button');
                    _el.classList.add(Format.element.el.className + "-button");
                    _el.innerHTML = _format;
                    return _el;
                  })(),
                  format: _format,
                  addClass: function(className) {
                    this.el.classList.add(className);
                    return this;
                  },
                  removeClass: function(className) {
                    this.el.classList.remove(className);
                    return this;
                  },
                  activate: function() {
                    return this.addClass('is--active');
                  },
                  deactivate: function() {
                    return this.removeClass('is--active');
                  }
                };
                _buttons.push(_button);
                if (!_activeButton) {
                  if (_format === atom.config.get('color-picker.preferredFormat')) {
                    _activeButton = _button;
                    _button.activate();
                  }
                }
                hasChild = function(element, child) {
                  var _parent;
                  if (child && (_parent = child.parentNode)) {
                    if (child === element) {
                      return true;
                    } else {
                      return hasChild(element, _parent);
                    }
                  }
                  return false;
                };
                _isClicking = false;
                colorPicker.onMouseDown(function(e, isOnPicker) {
                  if (!(isOnPicker && hasChild(_button.el, e.target))) {
                    return;
                  }
                  e.preventDefault();
                  return _isClicking = true;
                });
                colorPicker.onMouseMove(function(e) {
                  return _isClicking = false;
                });
                colorPicker.onMouseUp(function(e) {
                  if (!_isClicking) {
                    return;
                  }
                  if (_activeButton) {
                    _activeButton.deactivate();
                  }
                  _button.activate();
                  _activeButton = _button;
                  return _this.emitFormatChanged(_format);
                });
                return _this.element.add(_button.el);
              })(_format));
            }
            return results;
          };
        })(this));
        return this;
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2NvbG9yLXBpY2tlci9saWIvZXh0ZW5zaW9ucy9Gb3JtYXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtJO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxXQUFEO1dBQ2I7TUFBQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsb0JBQVIsQ0FBRCxDQUFBLENBQUEsQ0FBVDtNQUVBLE9BQUEsRUFBUyxJQUZUO01BR0EsS0FBQSxFQUFPLElBSFA7TUFTQSxpQkFBQSxFQUFtQixTQUFDLE1BQUQ7ZUFDZixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxlQUFkLEVBQStCLE1BQS9CO01BRGUsQ0FUbkI7TUFXQSxlQUFBLEVBQWlCLFNBQUMsUUFBRDtlQUNiLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGVBQVosRUFBNkIsUUFBN0I7TUFEYSxDQVhqQjtNQWlCQSxRQUFBLEVBQVUsU0FBQTtRQUNOLElBQUMsQ0FBQSxPQUFELEdBQ0k7VUFBQSxFQUFBLEVBQU8sQ0FBQSxTQUFBO0FBQ0gsZ0JBQUE7WUFBQSxZQUFBLEdBQWUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDdEMsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO1lBQ04sR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQXNCLFlBQUYsR0FBZ0IsU0FBcEM7QUFFQSxtQkFBTztVQUxKLENBQUEsQ0FBSCxDQUFBLENBQUo7VUFRQSxHQUFBLEVBQUssU0FBQyxPQUFEO1lBQ0QsSUFBQyxDQUFBLEVBQUUsQ0FBQyxXQUFKLENBQWdCLE9BQWhCO0FBQ0EsbUJBQU87VUFGTixDQVJMOztRQVdKLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBcEIsQ0FBd0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFqQztRQUlBLFVBQUEsQ0FBVyxDQUFBLFNBQUEs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QkFDcEIsV0FBQSxHQUFjO2dCQURNLENBQXhCO2dCQUdBLFdBQVcsQ0FBQyxTQUFaLENBQXNCLFNBQUMsQ0FBRDtrQkFDbEIsSUFBQSxDQUFjLFdBQWQ7QUFBQSwyQkFBQTs7a0JBRUEsSUFBOEIsYUFBOUI7b0JBQUEsYUFBYSxDQUFDLFVBQWQsQ0FBQSxFQUFBOztrQkFDQSxPQUFPLENBQUMsUUFBUixDQUFBO2tCQUNBLGFBQUEsR0FBZ0I7eUJBRWhCLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixPQUFuQjtnQkFQa0IsQ0FBdEI7dUJBVUEsS0FBQyxDQUFBLE9BQU8sQ0FBQyxHQUFULENBQWEsT0FBTyxDQUFDLEVBQXJCO2NBckR1RCxDQUFBLENBQUgsQ0FBSSxPQUFKO0FBQXhEOztVQXRCTztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWDtBQTRFQSxlQUFPO01BN0ZELENBakJWOztFQURhO0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICBDb2xvciBQaWNrZXIvZXh0ZW5zaW9uczogRm9ybWF0XG4jICBUaGUgZWxlbWVudCBwcm92aWRpbmcgVUkgdG8gY29udmVydCBiZXR3ZWVuIGNvbG9yIGZvcm1hdHNcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSAoY29sb3JQaWNrZXIpIC0+XG4gICAgICAgIEVtaXR0ZXI6IChyZXF1aXJlICcuLi9tb2R1bGVzL0VtaXR0ZXInKSgpXG5cbiAgICAgICAgZWxlbWVudDogbnVsbFxuICAgICAgICBjb2xvcjogbnVsbFxuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgU2V0IHVwIGV2ZW50cyBhbmQgaGFuZGxpbmdcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgIyBGb3JtYXQgQ2hhbmdlZCBldmVudFxuICAgICAgICBlbWl0Rm9ybWF0Q2hhbmdlZDogKGZvcm1hdCkgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ2Zvcm1hdENoYW5nZWQnLCBmb3JtYXRcbiAgICAgICAgb25Gb3JtYXRDaGFuZ2VkOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnZm9ybWF0Q2hhbmdlZCcsIGNhbGxiYWNrXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBDcmVhdGUgYW5kIGFjdGl2YXRlIEZvcm1hdCBlbGVtZW50XG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGFjdGl2YXRlOiAtPlxuICAgICAgICAgICAgQGVsZW1lbnQgPVxuICAgICAgICAgICAgICAgIGVsOiBkbyAtPlxuICAgICAgICAgICAgICAgICAgICBfY2xhc3NQcmVmaXggPSBjb2xvclBpY2tlci5lbGVtZW50LmVsLmNsYXNzTmFtZVxuICAgICAgICAgICAgICAgICAgICBfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgICAgICAgICAgICAgICAgIF9lbC5jbGFzc0xpc3QuYWRkIFwiI3sgX2NsYXNzUHJlZml4IH0tZm9ybWF0XCJcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2VsXG5cbiAgICAgICAgICAgICAgICAjIEFkZCBhIGNoaWxkIG9uIHRoZSBDb2xvciBlbGVtZW50XG4gICAgICAgICAgICAgICAgYWRkOiAoZWxlbWVudCkgLT5cbiAgICAgICAgICAgICAgICAgICAgQGVsLmFwcGVuZENoaWxkIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgIGNvbG9yUGlja2VyLmVsZW1lbnQuYWRkIEBlbGVtZW50LmVsXG5cbiAgICAgICAgIyAgQWRkIGNvbnZlcnNpb24gYnV0dG9ucyAjZmYwXG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBzZXRUaW1lb3V0ID0+XG4gICAgICAgICAgICAgICAgQ29sb3IgPSBjb2xvclBpY2tlci5nZXRFeHRlbnNpb24gJ0NvbG9yJ1xuXG4gICAgICAgICAgICAgICAgX2J1dHRvbnMgPSBbXVxuICAgICAgICAgICAgICAgIF9hY3RpdmVCdXR0b24gPSBudWxsXG5cbiAgICAgICAgICAgICAgICAjIE9uIGNvbG9yIHBpY2tlciBvcGVuLCByZXNldFxuICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uQmVmb3JlT3BlbiAtPiBmb3IgX2J1dHRvbiBpbiBfYnV0dG9uc1xuICAgICAgICAgICAgICAgICAgICBfYnV0dG9uLmRlYWN0aXZhdGUoKVxuXG4gICAgICAgICAgICAgICAgIyBPbiBDb2xvciBlbGVtZW50IG91dHB1dCBmb3JtYXQsIGFjdGl2YXRlIGFwcGxpY2FibGUgYnV0dG9uXG4gICAgICAgICAgICAgICAgQ29sb3Iub25PdXRwdXRGb3JtYXQgKGZvcm1hdCkgLT4gZm9yIF9idXR0b24gaW4gX2J1dHRvbnNcbiAgICAgICAgICAgICAgICAgICAgIyBUT0RPIHRoaXMgaXMgaW5lZmZpY2llbnQuIFRoZXJlIHNob3VsZCBiZSBhIHdheSB0byBlYXNpbHlcbiAgICAgICAgICAgICAgICAgICAgIyBjaGVjayBpZiBgZm9ybWF0YCBpcyBpbiBgX2J1dHRvbi5mb3JtYXRgLCBpbmNsdWRpbmcgdGhlXG4gICAgICAgICAgICAgICAgICAgICMgYWxwaGEgY2hhbm5lbFxuICAgICAgICAgICAgICAgICAgICBpZiBmb3JtYXQgaXMgX2J1dHRvbi5mb3JtYXQgb3IgZm9ybWF0IGlzIFwiI3sgX2J1dHRvbi5mb3JtYXQgfUFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgX2J1dHRvbi5hY3RpdmF0ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBfYWN0aXZlQnV0dG9uID0gX2J1dHRvblxuICAgICAgICAgICAgICAgICAgICBlbHNlIF9idXR0b24uZGVhY3RpdmF0ZSgpXG5cbiAgICAgICAgICAgICAgICAjIENyZWF0ZSBmb3JtYXR0aW5nIGJ1dHRvbnNcbiAgICAgICAgICAgICAgICAjIFRPRE8gc2FtZSBhcyBzZXR0aW5nLCBnbG9iYWxpemVcbiAgICAgICAgICAgICAgICBmb3IgX2Zvcm1hdCBpbiBbJ1JHQicsICdIRVgnLCAnSFNMJywgJ0hTVicsICdWRUMnXSB0aGVuIGRvIChfZm9ybWF0KSA9PlxuICAgICAgICAgICAgICAgICAgICBGb3JtYXQgPSB0aGlzXG5cbiAgICAgICAgICAgICAgICAgICAgIyBDcmVhdGUgdGhlIGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBfYnV0dG9uID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsOiBkbyAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgJ2J1dHRvbidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZWwuY2xhc3NMaXN0LmFkZCBcIiN7IEZvcm1hdC5lbGVtZW50LmVsLmNsYXNzTmFtZSB9LWJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2VsLmlubmVySFRNTCA9IF9mb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2VsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IF9mb3JtYXRcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBVdGlsaXR5IGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgYWRkQ2xhc3M6IChjbGFzc05hbWUpIC0+IEBlbC5jbGFzc0xpc3QuYWRkIGNsYXNzTmFtZTsgcmV0dXJuIHRoaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiAoY2xhc3NOYW1lKSAtPiBAZWwuY2xhc3NMaXN0LnJlbW92ZSBjbGFzc05hbWU7IHJldHVybiB0aGlzXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2YXRlOiAtPiBAYWRkQ2xhc3MgJ2lzLS1hY3RpdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWFjdGl2YXRlOiAtPiBAcmVtb3ZlQ2xhc3MgJ2lzLS1hY3RpdmUnXG4gICAgICAgICAgICAgICAgICAgIF9idXR0b25zLnB1c2ggX2J1dHRvblxuXG4gICAgICAgICAgICAgICAgICAgICMgU2V0IGluaXRpYWwgZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgIHVubGVzcyBfYWN0aXZlQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBfZm9ybWF0IGlzIGF0b20uY29uZmlnLmdldCAnY29sb3ItcGlja2VyLnByZWZlcnJlZEZvcm1hdCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfYWN0aXZlQnV0dG9uID0gX2J1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9idXR0b24uYWN0aXZhdGUoKVxuXG4gICAgICAgICAgICAgICAgICAgICMgQ2hhbmdlIGNvbG9yIGZvcm1hdCBvbiBjbGlja1xuICAgICAgICAgICAgICAgICAgICBoYXNDaGlsZCA9IChlbGVtZW50LCBjaGlsZCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGNoaWxkIGFuZCBfcGFyZW50ID0gY2hpbGQucGFyZW50Tm9kZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGNoaWxkIGlzIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBoYXNDaGlsZCBlbGVtZW50LCBfcGFyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgX2lzQ2xpY2tpbmcgPSBub1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uTW91c2VEb3duIChlLCBpc09uUGlja2VyKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBpc09uUGlja2VyIGFuZCBoYXNDaGlsZCBfYnV0dG9uLmVsLCBlLnRhcmdldFxuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgICAgICAgICAgICBfaXNDbGlja2luZyA9IHllc1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uTW91c2VNb3ZlIChlKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgX2lzQ2xpY2tpbmcgPSBub1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yUGlja2VyLm9uTW91c2VVcCAoZSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgX2lzQ2xpY2tpbmdcblxuICAgICAgICAgICAgICAgICAgICAgICAgX2FjdGl2ZUJ1dHRvbi5kZWFjdGl2YXRlKCkgaWYgX2FjdGl2ZUJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgX2J1dHRvbi5hY3RpdmF0ZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBfYWN0aXZlQnV0dG9uID0gX2J1dHRvblxuXG4gICAgICAgICAgICAgICAgICAgICAgICBAZW1pdEZvcm1hdENoYW5nZWQgX2Zvcm1hdFxuXG4gICAgICAgICAgICAgICAgICAgICMgQWRkIGJ1dHRvbiB0byB0aGUgcGFyZW50IEZvcm1hdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIEBlbGVtZW50LmFkZCBfYnV0dG9uLmVsXG4gICAgICAgICAgICByZXR1cm4gdGhpc1xuIl19
