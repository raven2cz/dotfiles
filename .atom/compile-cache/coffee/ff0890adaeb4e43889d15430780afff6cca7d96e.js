(function() {
  var slice = [].slice;

  module.exports = function() {
    return {
      bindings: {},
      emit: function() {
        var _bindings, _callback, args, event, i, len;
        event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (!(_bindings = this.bindings[event])) {
          return;
        }
        for (i = 0, len = _bindings.length; i < len; i++) {
          _callback = _bindings[i];
          _callback.apply(null, args);
        }
      },
      on: function(event, callback) {
        if (!this.bindings[event]) {
          this.bindings[event] = [];
        }
        this.bindings[event].push(callback);
        return callback;
      },
      off: function(event, callback) {
        var _binding, _bindings, _i;
        if (!(_bindings = this.bindings[event])) {
          return;
        }
        _i = _bindings.length;
        while (_i-- && (_binding = _bindings[_i])) {
          if (_binding === callback) {
            _bindings.splice(_i, 1);
          }
        }
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2NvbG9yLXBpY2tlci9saWIvbW9kdWxlcy9FbWl0dGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLSTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQTtXQUNiO01BQUEsUUFBQSxFQUFVLEVBQVY7TUFFQSxJQUFBLEVBQU0sU0FBQTtBQUNGLFlBQUE7UUFERyxzQkFBTztRQUNWLElBQUEsQ0FBYyxDQUFBLFNBQUEsR0FBWSxJQUFDLENBQUEsUUFBUyxDQUFBLEtBQUEsQ0FBdEIsQ0FBZDtBQUFBLGlCQUFBOztBQUNBLGFBQUEsMkNBQUE7O1VBQUEsU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsSUFBaEIsRUFBc0IsSUFBdEI7QUFBQTtNQUZFLENBRk47TUFPQSxFQUFBLEVBQUksU0FBQyxLQUFELEVBQVEsUUFBUjtRQUNBLElBQUEsQ0FBNkIsSUFBQyxDQUFBLFFBQVMsQ0FBQSxLQUFBLENBQXZDO1VBQUEsSUFBQyxDQUFBLFFBQVMsQ0FBQSxLQUFBLENBQVYsR0FBbUIsR0FBbkI7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsQ0FBQSxLQUFBLENBQU0sQ0FBQyxJQUFqQixDQUFzQixRQUF0QjtBQUNBLGVBQU87TUFIUCxDQVBKO01BWUEsR0FBQSxFQUFLLFNBQUMsS0FBRCxFQUFRLFFBQVI7QUFDRCxZQUFBO1FBQUEsSUFBQSxDQUFjLENBQUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxRQUFTLENBQUEsS0FBQSxDQUF0QixDQUFkO0FBQUEsaUJBQUE7O1FBRUEsRUFBQSxHQUFLLFNBQVMsQ0FBQztBQUFRLGVBQU0sRUFBQSxFQUFBLElBQVMsQ0FBQSxRQUFBLEdBQVcsU0FBVSxDQUFBLEVBQUEsQ0FBckIsQ0FBZjtVQUNuQixJQUFHLFFBQUEsS0FBWSxRQUFmO1lBQTZCLFNBQVMsQ0FBQyxNQUFWLENBQWlCLEVBQWpCLEVBQXFCLENBQXJCLEVBQTdCOztRQURtQjtNQUh0QixDQVpMOztFQURhO0FBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICBFbWl0dGVyXG4jICBhIHJlYWxseSBsaWdodHdlaWdodCB0YWtlIG9uIGFuIEVtaXR0ZXJcbiMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSAtPlxuICAgICAgICBiaW5kaW5nczoge31cblxuICAgICAgICBlbWl0OiAoZXZlbnQsIGFyZ3MuLi4pIC0+XG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIF9iaW5kaW5ncyA9IEBiaW5kaW5nc1tldmVudF1cbiAgICAgICAgICAgIF9jYWxsYmFjay5hcHBseSBudWxsLCBhcmdzIGZvciBfY2FsbGJhY2sgaW4gX2JpbmRpbmdzXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBvbjogKGV2ZW50LCBjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBiaW5kaW5nc1tldmVudF0gPSBbXSB1bmxlc3MgQGJpbmRpbmdzW2V2ZW50XVxuICAgICAgICAgICAgQGJpbmRpbmdzW2V2ZW50XS5wdXNoIGNhbGxiYWNrXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2tcblxuICAgICAgICBvZmY6IChldmVudCwgY2FsbGJhY2spIC0+XG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIF9iaW5kaW5ncyA9IEBiaW5kaW5nc1tldmVudF1cblxuICAgICAgICAgICAgX2kgPSBfYmluZGluZ3MubGVuZ3RoOyB3aGlsZSBfaS0tIGFuZCBfYmluZGluZyA9IF9iaW5kaW5nc1tfaV1cbiAgICAgICAgICAgICAgICBpZiBfYmluZGluZyBpcyBjYWxsYmFjayB0aGVuIF9iaW5kaW5ncy5zcGxpY2UgX2ksIDFcbiAgICAgICAgICAgIHJldHVyblxuIl19
