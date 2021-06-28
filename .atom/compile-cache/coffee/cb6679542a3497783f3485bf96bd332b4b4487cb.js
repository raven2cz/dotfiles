(function() {
  var CompositeDisposable,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      historySize: {
        description: 'Number of edit location to keep in history.',
        type: 'integer',
        "default": 50
      }
    },
    subscriptions: null,
    lastEditPosition: null,
    historyPosition: 0,
    history: [],
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.historyMaxSize = atom.config.get('goto-last-edit.historySize');
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'goto-last-edit:back': (function(_this) {
          return function() {
            return _this.run(true);
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'goto-last-edit:forward': (function(_this) {
          return function() {
            return _this.run(false);
          };
        })(this)
      }));
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return editor.onDidStopChanging(function() {
            return _this.saveCursorPosition(editor);
          });
        };
      })(this)));
    },
    saveCursorPosition: function(editor) {
      var ref;
      if (editor.buffer.previousModifiedStatus || editor.isModified()) {
        this.lastEditPosition = {
          pane: atom.workspace.getActivePane(),
          editor: editor,
          position: (ref = editor.cursors[0]) != null ? ref.getBufferPosition() : void 0
        };
        if (!this.hasNotChangedPosition()) {
          return this.pushInHistory(this.lastEditPosition);
        }
      }
    },
    pushInHistory: function() {
      var elementsToRemove;
      if (this.historyPosition < this.history.length - 1) {
        this.history.splice(this.historyPosition);
      }
      if (this.history.length >= this.historyMaxSize) {
        elementsToRemove = this.history.length - this.historyMaxSize + 1;
        this.history.splice(0, elementsToRemove);
        this.historyPosition -= elementsToRemove;
      }
      this.history.push(this.lastEditPosition);
      return this.historyPosition++;
    },
    hasNotChangedPosition: function() {
      var last, ref, ref1;
      if (this.history.length > 0) {
        last = this.history[this.history.length - 1];
        return last.editor === this.lastEditPosition.editor && ((ref = last.position) != null ? ref.row : void 0) === ((ref1 = this.lastEditPosition.position) != null ? ref1.row : void 0);
      } else {
        return false;
      }
    },
    run: function(goBack) {
      var options, ref, ref1, ref2;
      if (this.history.length > 0) {
        this.lastEditPosition = goBack ? this.history[this.historyPosition - 1] : this.history[this.historyPosition + 1];
        if (this.lastEditPosition) {
          this.historyPosition = goBack ? this.historyPosition - 1 : this.historyPosition + 1;
          if (((ref = this.lastEditPosition.editor.buffer.file) != null ? ref.path : void 0) && this.lastEditPosition.position) {
            options = {
              initialLine: this.lastEditPosition.position.row,
              initialColumn: this.lastEditPosition.position.column,
              activatePane: true,
              searchAllPanes: true
            };
            return atom.workspace.open((ref1 = this.lastEditPosition.editor.buffer.file) != null ? ref1.path : void 0, options);
          } else {
            if (ref2 = this.lastEditPosition.editor, indexOf.call(atom.workspace.getTextEditors(), ref2) < 0) {
              return;
            }
            if (this.lastEditPosition.pane !== atom.workspace.getActivePane()) {
              this.lastEditPosition.pane.activate();
            }
            if (this.lastEditPosition.editor !== atom.workspace.getActiveTextEditor()) {
              atom.workspace.getActivePane().activateItem(this.lastEditPosition.editor);
            }
            atom.workspace.getActiveTextEditor().setCursorBufferPosition(this.lastEditPosition.position, {
              autoscroll: false
            });
            return atom.workspace.getActiveTextEditor().scrollToCursorPosition({
              center: true
            });
          }
        } else if (!goBack && this.historyPosition === this.history.length - 1) {
          return this.historyPosition++;
        }
      }
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2dvdG8tbGFzdC1lZGl0L2xpYi9nb3RvLWxhc3QtZWRpdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsV0FBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLDZDQUFiO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7T0FERjtLQURGO0lBTUEsYUFBQSxFQUFlLElBTmY7SUFPQSxnQkFBQSxFQUFrQixJQVBsQjtJQVFBLGVBQUEsRUFBaUIsQ0FSakI7SUFTQSxPQUFBLEVBQVMsRUFUVDtJQVdBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7TUFDUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEI7TUFFbEIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDakI7UUFBQSxxQkFBQSxFQUF1QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxHQUFELENBQUssSUFBTDtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF2QjtPQURpQixDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO1FBQUEsd0JBQUEsRUFBMEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsR0FBRCxDQUFLLEtBQUw7VUFB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LENBQUEsT0FBTyxDQUFDLE1BQVQsR0FBa0IsQ0FBeEQ7aUJBQ0gsSUFBQyxDQUFBLGVBQUQsR0FERztTQXhCUDs7SUFERyxDQXZETDtJQW1GQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRFUsQ0FuRlo7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBoaXN0b3J5U2l6ZTpcbiAgICAgIGRlc2NyaXB0aW9uOiAnTnVtYmVyIG9mIGVkaXQgbG9jYXRpb24gdG8ga2VlcCBpbiBoaXN0b3J5LidcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogNTBcblxuICBzdWJzY3JpcHRpb25zOiBudWxsXG4gIGxhc3RFZGl0UG9zaXRpb246IG51bGxcbiAgaGlzdG9yeVBvc2l0aW9uOiAwXG4gIGhpc3Rvcnk6IFtdXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGhpc3RvcnlNYXhTaXplID0gYXRvbS5jb25maWcuZ2V0KCdnb3RvLWxhc3QtZWRpdC5oaXN0b3J5U2l6ZScpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdnb3RvLWxhc3QtZWRpdDpiYWNrJzogPT4gQHJ1bih0cnVlKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ2dvdG8tbGFzdC1lZGl0OmZvcndhcmQnOiA9PiBAcnVuKGZhbHNlKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nID0+IEBzYXZlQ3Vyc29yUG9zaXRpb24oZWRpdG9yKVxuXG4gIHNhdmVDdXJzb3JQb3NpdGlvbjogKGVkaXRvcikgLT5cbiAgICBpZiBlZGl0b3IuYnVmZmVyLnByZXZpb3VzTW9kaWZpZWRTdGF0dXMgb3IgZWRpdG9yLmlzTW9kaWZpZWQoKVxuXG4gICAgICBAbGFzdEVkaXRQb3NpdGlvbiA9IHtcbiAgICAgICAgcGFuZTogYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLFxuICAgICAgICBlZGl0b3I6IGVkaXRvcixcbiAgICAgICAgcG9zaXRpb246IGVkaXRvci5jdXJzb3JzWzBdPy5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICB9XG4gICAgICAjYWRkIHBvc2l0aW9uIHRvIGhpc3Rvcnkgb25seSBpZiBkaWZmZXJlbnRcbiAgICAgIEBwdXNoSW5IaXN0b3J5KEBsYXN0RWRpdFBvc2l0aW9uKSB1bmxlc3MgQGhhc05vdENoYW5nZWRQb3NpdGlvbigpXG5cbiAgcHVzaEluSGlzdG9yeTogKCkgLT5cbiAgICAjaWYgdXNlciBpcyBpbiB0aGUgbWlkZGxlIG9mIHRoZSBoaXN0b3J5LCBzcGxpY2UgdGhlIGZvcndhcmQgZWxlbWVudHNcbiAgICBpZiAoQGhpc3RvcnlQb3NpdGlvbiA8IEBoaXN0b3J5Lmxlbmd0aCAtIDEpXG4gICAgICBAaGlzdG9yeS5zcGxpY2UoQGhpc3RvcnlQb3NpdGlvbilcbiAgICAjaWYgdXNlciBpcyBhdCB0aGUgZW5kIG9mIHRoZSBoaXN0b3J5LCByZW1vdmUgZmlyc3RzIGVsZW1lbnRzIChGSUZPKVxuICAgIGlmIChAaGlzdG9yeS5sZW5ndGggPj0gQGhpc3RvcnlNYXhTaXplKVxuICAgICAgZWxlbWVudHNUb1JlbW92ZSA9IEBoaXN0b3J5Lmxlbmd0aCAtIEBoaXN0b3J5TWF4U2l6ZSArIDFcbiAgICAgIEBoaXN0b3J5LnNwbGljZSgwLCBlbGVtZW50c1RvUmVtb3ZlKVxuICAgICAgQGhpc3RvcnlQb3NpdGlvbiAtPSBlbGVtZW50c1RvUmVtb3ZlXG4gICAgQGhpc3RvcnkucHVzaChAbGFzdEVkaXRQb3NpdGlvbilcbiAgICBAaGlzdG9yeVBvc2l0aW9uKytcblxuICAjY29udmVuaWVudCBtZXRob2QgdG8gY2hlY2sgaWYgdGhlIGNoYW5nZSB3YXMgbWFkZSBvbiBhIHNlcGFyYXRlIGxpbmVcbiAgI2NvbXBhcmVkIHRvIHRoZSBsYXRlc3QgZW50cnkgaW4gdGhlIGhpc3RvcnlcbiAgaGFzTm90Q2hhbmdlZFBvc2l0aW9uOiAtPlxuICAgIGlmIEBoaXN0b3J5Lmxlbmd0aCA+IDBcbiAgICAgIGxhc3QgPSBAaGlzdG9yeVtAaGlzdG9yeS5sZW5ndGggLSAxXVxuICAgICAgcmV0dXJuIGxhc3QuZWRpdG9yIGlzIEBsYXN0RWRpdFBvc2l0aW9uLmVkaXRvciBhbmQgbGFzdC5wb3NpdGlvbj8ucm93IGlzIEBsYXN0RWRpdFBvc2l0aW9uLnBvc2l0aW9uPy5yb3dcbiAgICBlbHNlXG4gICAgICBmYWxzZVxuXG4gIHJ1bjogKGdvQmFjayktPlxuICAgIGlmIEBoaXN0b3J5Lmxlbmd0aCA+IDBcbiAgICAgIEBsYXN0RWRpdFBvc2l0aW9uID0gaWYgZ29CYWNrIHRoZW4gQGhpc3RvcnlbQGhpc3RvcnlQb3NpdGlvbiAtIDFdIGVsc2UgQGhpc3RvcnlbQGhpc3RvcnlQb3NpdGlvbiArIDFdXG4gICAgICBpZiBAbGFzdEVkaXRQb3NpdGlvblxuICAgICAgICBAaGlzdG9yeVBvc2l0aW9uID0gaWYgZ29CYWNrIHRoZW4gQGhpc3RvcnlQb3NpdGlvbiAtIDEgZWxzZSBAaGlzdG9yeVBvc2l0aW9uICsgMVxuICAgICAgICBpZiBAbGFzdEVkaXRQb3NpdGlvbi5lZGl0b3IuYnVmZmVyLmZpbGU/LnBhdGggYW5kIEBsYXN0RWRpdFBvc2l0aW9uLnBvc2l0aW9uXG4gICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGluaXRpYWxMaW5lOiBAbGFzdEVkaXRQb3NpdGlvbi5wb3NpdGlvbi5yb3csXG4gICAgICAgICAgICBpbml0aWFsQ29sdW1uOiBAbGFzdEVkaXRQb3NpdGlvbi5wb3NpdGlvbi5jb2x1bW4sXG4gICAgICAgICAgICBhY3RpdmF0ZVBhbmU6IHRydWUsXG4gICAgICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKEBsYXN0RWRpdFBvc2l0aW9uLmVkaXRvci5idWZmZXIuZmlsZT8ucGF0aCwgb3B0aW9ucylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlmIEBsYXN0RWRpdFBvc2l0aW9uLmVkaXRvciBub3QgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgaWYgQGxhc3RFZGl0UG9zaXRpb24ucGFuZSBpc250IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgICAgQGxhc3RFZGl0UG9zaXRpb24ucGFuZS5hY3RpdmF0ZSgpXG4gICAgICAgICAgaWYgQGxhc3RFZGl0UG9zaXRpb24uZWRpdG9yIGlzbnQgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGVJdGVtKEBsYXN0RWRpdFBvc2l0aW9uLmVkaXRvcilcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oXG4gICAgICAgICAgICBAbGFzdEVkaXRQb3NpdGlvbi5wb3NpdGlvbixcbiAgICAgICAgICAgIGF1dG9zY3JvbGw6IGZhbHNlXG4gICAgICAgICAgKVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKGNlbnRlcjogdHJ1ZSlcbiAgICAgIGVsc2UgaWYgbm90IGdvQmFjayBhbmQgQGhpc3RvcnlQb3NpdGlvbiA9PSBAaGlzdG9yeS5sZW5ndGggLSAxXG4gICAgICAgIEBoaXN0b3J5UG9zaXRpb24rK1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4iXX0=
