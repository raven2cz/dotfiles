function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

'use babel';

var helpers = undefined;

var REGEX = /^.+?:.+?:(\d+):\s+(.+?(?:near (.+)|$))/g;

var loadDeps = function loadDeps() {
  if (!helpers) {
    helpers = require('atom-linter');
  }
};

var parseLuacOutput = function parseLuacOutput(output, file, editor) {
  var messages = [];
  var match = REGEX.exec(output);
  while (match !== null) {
    var line = Number.parseInt(match[1], 10) - 1;
    messages.push({
      severity: 'error',
      excerpt: match[2],
      location: {
        file: file,
        position: helpers.generateRange(editor, line)
      }
    });
    match = REGEX.exec(output);
  }
  return messages;
};

module.exports = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();
    var depsCallbackID = undefined;
    var installLinterLuaDeps = function installLinterLuaDeps() {
      _this.idleCallbacks['delete'](depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-lua');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterLuaDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-lua.executablePath', function (value) {
      _this.executablePath = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'Lua',
      grammarScopes: ['source.lua'],
      scope: 'file',
      lintsOnChange: true,
      lint: _asyncToGenerator(function* (editor) {
        if (!atom.workspace.isTextEditor(editor)) {
          // If we somehow get fed an invalid TextEditor just immediately return
          return null;
        }

        var filePath = editor.getPath();
        if (!filePath) {
          return null;
        }

        loadDeps();

        var args = [];

        if (_this2.executablePath.indexOf('luajit') !== -1) {
          args.push('-bl');
        } else {
          args.push('-p');
        }

        args.push('-'); // to indicate that the input is in stdin

        var stdin = editor.getText();

        var execOptions = {
          stdin: stdin,
          stream: 'stderr',
          uniqueKey: 'linter-lua::' + filePath,
          allowEmptyStderr: true
        };

        var output = undefined;
        try {
          output = yield helpers.exec(_this2.executablePath, args, execOptions);
        } catch (e) {
          if (e.message === 'Process execution timed out') {
            atom.notifications.addInfo('linter-lua: ' + _this2.executablePath + ' timed out', {
              description: 'A timeout occured while executing ' + _this2.executablePath + ', it could be due to lower resources ' + 'or a temporary overload.'
            });
          } else {
            atom.notifications.addError('linter-lua: Unexpected error', { description: e.message });
          }
          return null;
        }

        if (editor.getText() !== stdin || output === null) {
          // File has changed since the lint was triggered, tell Linter not to update or
          // process was canceled by newer process
          return null;
        }

        return parseLuacOutput(output, filePath, editor);
      })
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItbHVhL2xpYi9pbml0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBR29DLE1BQU07O0FBSDFDLFdBQVcsQ0FBQzs7QUFLWixJQUFJLE9BQU8sWUFBQSxDQUFDOztBQUVaLElBQU0sS0FBSyxHQUFHLHlDQUF5QyxDQUFDOztBQUV4RCxJQUFNLFFBQVEsR0FBRyxTQUFYLFFBQVEsR0FBUztBQUNyQixNQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osV0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztHQUNsQztDQUNGLENBQUM7O0FBRUYsSUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFLO0FBQ2hELE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNwQixNQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLFNBQU8sS0FBSyxLQUFLLElBQUksRUFBRTtBQUNyQixRQUFNLElBQUksR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0MsWUFBUSxDQUFDLElBQUksQ0FBQztBQUNaLGNBQVEsRUFBRSxPQUFPO0FBQ2pCLGFBQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLGNBQVEsRUFBRTtBQUNSLFlBQUksRUFBSixJQUFJO0FBQ0osZ0JBQVEsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7T0FDOUM7S0FDRixDQUFDLENBQUM7QUFDSCxTQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM1QjtBQUNELFNBQU8sUUFBUSxDQUFDO0NBQ2pCLENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFVB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QU8sa0JBQWdCLE9BQUssY0FBYyxpQkFBYztBQUN6RSx5QkFBVyxFQUFFLHVDQUFxQyxPQUFLLGNBQWMsNkNBQ3RELDBCQUEwQjthQUMxQyxDQUFDLENBQUM7V0FDSixNQUFNO0FBQ0wsZ0JBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLDhCQUE4QixFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1dBQ3pGO0FBQ0QsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsWUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssS0FBSyxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7OztBQUdqRCxpQkFBTyxJQUFJLENBQUM7U0FDYjs7QUFFRCxlQUFPLGVBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQ2xELENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRixDQUFDIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItbHVhL2xpYi9pbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsIGltcG9ydC9leHRlbnNpb25zXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5cbmxldCBoZWxwZXJzO1xuXG5jb25zdCBSRUdFWCA9IC9eLis/Oi4rPzooXFxkKyk6XFxzKyguKz8oPzpuZWFyICguKyl8JCkpL2c7XG5cbmNvbnN0IGxvYWREZXBzID0gKCkgPT4ge1xuICBpZiAoIWhlbHBlcnMpIHtcbiAgICBoZWxwZXJzID0gcmVxdWlyZSgnYXRvbS1saW50ZXInKTtcbiAgfVxufTtcblxuY29uc3QgcGFyc2VMdWFjT3V0cHV0ID0gKG91dHB1dCwgZmlsZSwgZWRpdG9yKSA9PiB7XG4gIGNvbnN0IG1lc3NhZ2VzID0gW107XG4gIGxldCBtYXRjaCA9IFJFR0VYLmV4ZWMob3V0cHV0KTtcbiAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgY29uc3QgbGluZSA9IE51bWJlci5wYXJzZUludChtYXRjaFsxXSwgMTApIC0gMTtcbiAgICBtZXNzYWdlcy5wdXNoKHtcbiAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgZXhjZXJwdDogbWF0Y2hbMl0sXG4gICAgICBsb2NhdGlvbjoge1xuICAgICAgICBmaWxlLFxuICAgICAgICBwb3NpdGlvbjogaGVscGVycy5nZW5lcmF0ZVJhbmdlKGVkaXRvciwgbGluZSksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIG1hdGNoID0gUkVHRVguZXhlYyhvdXRwdXQpO1xuICB9XG4gIHJldHVybiBtZXNzYWdlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KCk7XG4gICAgbGV0IGRlcHNDYWxsYmFja0lEO1xuICAgIGNvbnN0IGluc3RhbGxMaW50ZXJMdWFEZXBzID0gKCkgPT4ge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShkZXBzQ2FsbGJhY2tJRCk7XG4gICAgICBpZiAoIWF0b20uaW5TcGVjTW9kZSgpKSB7XG4gICAgICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLWx1YScpO1xuICAgICAgfVxuICAgICAgbG9hZERlcHMoKTtcbiAgICB9O1xuICAgIGRlcHNDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soaW5zdGFsbExpbnRlckx1YURlcHMpO1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5hZGQoZGVwc0NhbGxiYWNrSUQpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZShcbiAgICAgICAgJ2xpbnRlci1sdWEuZXhlY3V0YWJsZVBhdGgnLFxuICAgICAgICAodmFsdWUpID0+IHsgdGhpcy5leGVjdXRhYmxlUGF0aCA9IHZhbHVlOyB9LFxuICAgICAgKSxcbiAgICApO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2tJRCA9PiB3aW5kb3cuY2FuY2VsSWRsZUNhbGxiYWNrKGNhbGxiYWNrSUQpKTtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9LFxuXG4gIHByb3ZpZGVMaW50ZXIoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6ICdMdWEnLFxuICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UubHVhJ10sXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludHNPbkNoYW5nZTogdHJ1ZSxcbiAgICAgIGxpbnQ6IGFzeW5jIChlZGl0b3IpID0+IHtcbiAgICAgICAgaWYgKCFhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IoZWRpdG9yKSkge1xuICAgICAgICAgIC8vIElmIHdlIHNvbWVob3cgZ2V0IGZlZCBhbiBpbnZhbGlkIFRleHRFZGl0b3IganVzdCBpbW1lZGlhdGVseSByZXR1cm5cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgaWYgKCFmaWxlUGF0aCkge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbG9hZERlcHMoKTtcblxuICAgICAgICBjb25zdCBhcmdzID0gW107XG5cbiAgICAgICAgaWYgKHRoaXMuZXhlY3V0YWJsZVBhdGguaW5kZXhPZignbHVhaml0JykgIT09IC0xKSB7XG4gICAgICAgICAgYXJncy5wdXNoKCctYmwnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhcmdzLnB1c2goJy1wJyk7XG4gICAgICAgIH1cblxuICAgICAgICBhcmdzLnB1c2goJy0nKTsgLy8gdG8gaW5kaWNhdGUgdGhhdCB0aGUgaW5wdXQgaXMgaW4gc3RkaW5cblxuICAgICAgICBjb25zdCBzdGRpbiA9IGVkaXRvci5nZXRUZXh0KCk7XG5cbiAgICAgICAgY29uc3QgZXhlY09wdGlvbnMgPSB7XG4gICAgICAgICAgc3RkaW4sXG4gICAgICAgICAgc3RyZWFtOiAnc3RkZXJyJyxcbiAgICAgICAgICB1bmlxdWVLZXk6IGBsaW50ZXItbHVhOjoke2ZpbGVQYXRofWAsXG4gICAgICAgICAgYWxsb3dFbXB0eVN0ZGVycjogdHJ1ZSxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgb3V0cHV0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG91dHB1dCA9IGF3YWl0IGhlbHBlcnMuZXhlYyh0aGlzLmV4ZWN1dGFibGVQYXRoLCBhcmdzLCBleGVjT3B0aW9ucyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoZS5tZXNzYWdlID09PSAnUHJvY2VzcyBleGVjdXRpb24gdGltZWQgb3V0Jykge1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oYGxpbnRlci1sdWE6ICR7dGhpcy5leGVjdXRhYmxlUGF0aH0gdGltZWQgb3V0YCwge1xuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogYEEgdGltZW91dCBvY2N1cmVkIHdoaWxlIGV4ZWN1dGluZyAke3RoaXMuZXhlY3V0YWJsZVBhdGh9LCBpdCBjb3VsZCBiZSBkdWUgdG8gbG93ZXIgcmVzb3VyY2VzIGBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICsgJ29yIGEgdGVtcG9yYXJ5IG92ZXJsb2FkLicsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdsaW50ZXItbHVhOiBVbmV4cGVjdGVkIGVycm9yJywgeyBkZXNjcmlwdGlvbjogZS5tZXNzYWdlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlZGl0b3IuZ2V0VGV4dCgpICE9PSBzdGRpbiB8fCBvdXRwdXQgPT09IG51bGwpIHtcbiAgICAgICAgICAvLyBGaWxlIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBsaW50IHdhcyB0cmlnZ2VyZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGUgb3JcbiAgICAgICAgICAvLyBwcm9jZXNzIHdhcyBjYW5jZWxlZCBieSBuZXdlciBwcm9jZXNzXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2VMdWFjT3V0cHV0KG91dHB1dCwgZmlsZVBhdGgsIGVkaXRvcik7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19