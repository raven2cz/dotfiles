Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.activate = activate;
exports.deactivate = deactivate;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _help = require('./help');

var _help2 = _interopRequireDefault(_help);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _configSchemaJson = require('./config-schema.json');

var _configSchemaJson2 = _interopRequireDefault(_configSchemaJson);

'use babel';

var disposables = null;

function activate() {
    disposables = new _atom.CompositeDisposable();
    disposables.add(atom.commands.add('atom-workspace', {
        'atom-format-lua:format': function atomFormatLuaFormat(event) {
            format();
        }
    }));
}

function deactivate() {
    disposables.dispose();
}

var config = _configSchemaJson2['default'];

exports.config = config;
function format() {
    var editor = null;
    var tempfile = null;
    var wkspc = null;
    var formatterScript = null;
    var lua51path = null;
    var params = null;

    editor = atom.workspace.getActiveTextEditor();

    if (editor.getGrammar().name == 'Lua') {
        tempfile = editor.getPath();
    } else {
        return;
    }

    tempfile = editor.getPath();

    editor.save();

    var pkgDirs = atom.packages.packageDirPaths;
    for (var index = 0; index < pkgDirs.length; index++) {
        var tmpWkspc = _path2['default'].join(pkgDirs[index], 'atom-format-lua/luacode');
        try {
            var tmfFile = _path2['default'].join(tmpWkspc, 'formatter.lua');
            var fstate = _fs2['default'].statSync(tmfFile);
            if (fstate.isFile()) {
                formatterScript = tmfFile;
                wkspc = tmpWkspc;
            }
        } catch (e) {}
    }

    var osTypes = {
        'darwin': '/usr/local/bin/lua5.1',
        'freebsd': '/usr/local/bin/lua5.1',
        'linux': '/usr/bin/lua5.1',
        'sunos': 'I dont Know where the lua5.1',
        'win32': 'I dont Know where the lua5.1'
    };
    params = [formatterScript, '--file', tempfile, '--ts', atom.config.get('atom-format-lua.indentSize')];

    lua51path = atom.config.get("atom-format-lua.lua51");

    if (!lua51path) {
        lua51path = osTypes[_help2['default'].getProcessPlatform()];
    }

    proc = _child_process2['default'].spawn(lua51path, params, {
        cwd: wkspc
    });
    // proc.stdout.on('data', (data) => {
    //     console.log('out', data.asciiSlice())
    // })
    proc.stderr.on('data', function (data) {
        console.log('err', data.asciiSlice());
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLWZvcm1hdC1sdWEvbGliL2F0b20tZm9ybWF0LWx1YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFK0MsTUFBTTs7NkJBQ2pDLGVBQWU7Ozs7b0JBQ2xCLE1BQU07Ozs7b0JBQ0gsUUFBUTs7OztrQkFDYixJQUFJOzs7O2dDQUNPLHNCQUFzQjs7OztBQVBoRCxXQUFXLENBQUE7O0FBU1gsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUNoQixTQUFTLFFBQVEsR0FBRztBQUN2QixlQUFXLEdBQUcsK0JBQXlCLENBQUM7QUFDeEMsZUFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNoRCxnQ0FBd0IsRUFBRSw2QkFBQyxLQUFLLEVBQUs7QUFDakMsa0JBQU0sRUFBRSxDQUFDO1NBQ1o7S0FDSixDQUFDLENBQUMsQ0FBQTtDQUNOOztBQUVNLFNBQVMsVUFBVSxHQUFHO0FBQ3pCLGVBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtDQUN4Qjs7QUFFTSxJQUFNLE1BQU0sZ0NBQWdCLENBQUM7OztBQUVwQyxTQUFTLE1BQU0sR0FBRztBQUNkLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQztBQUNsQixRQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFFBQUksZUFBZSxHQUFHLElBQUksQ0FBQztBQUMzQixRQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDckIsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOztBQUVsQixVQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDOztBQUU5QyxRQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ25DLGdCQUFRLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQy9CLE1BQU07QUFDSCxlQUFPO0tBQ1Y7O0FBRUQsWUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFNUIsVUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVkLFFBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO0FBQzVDLFNBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ2pELFlBQUksUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUseUJBQXlCLENBQUMsQ0FBQztBQUNwRSxZQUFJO0FBQ0EsZ0JBQUksT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDbkQsZ0JBQUksTUFBTSxHQUFHLGdCQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsQyxnQkFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDakIsK0JBQWUsR0FBRyxPQUFPLENBQUM7QUFDMUIscUJBQUssR0FBRyxRQUFRLENBQUM7YUFDcEI7U0FDSixDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUU7S0FDakI7O0FBRUQsUUFBSSxPQUFPLEdBQUc7QUFDVixnQkFBUSxFQUFFLHVCQUF1QjtBQUNqQyxpQkFBUyxFQUFFLHVCQUF1QjtBQUNsQyxlQUFPLEVBQUUsaUJBQWlCO0FBQzFCLGVBQU8sRUFBRSw4QkFBOEI7QUFDdkMsZUFBTyxFQUFFLDhCQUE4QjtLQUMxQyxDQUFDO0FBQ0YsVUFBTSxHQUFHLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQzs7QUFFdEcsYUFBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0FBRXJELFFBQUksQ0FBQyxTQUFTLEVBQUU7QUFDWixpQkFBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBUSxrQkFBa0IsRUFBRSxDQUFDLENBQUM7S0FDckQ7O0FBRUQsUUFBSSxHQUFHLDJCQUFRLEtBQUssQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQ3BDLFdBQUcsRUFBRSxLQUFLO0tBQ2IsQ0FBQyxDQUFBOzs7O0FBSUYsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsSUFBSSxFQUFLO0FBQzdCLGVBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQ3pDLENBQUMsQ0FBQTtDQUNMIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLWZvcm1hdC1sdWEvbGliL2F0b20tZm9ybWF0LWx1YS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGhlbHBlcnMgZnJvbSAnLi9oZWxwJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2NvbmZpZy1zY2hlbWEuanNvbic7XG5cbmxldCBkaXNwb3NhYmxlcyA9IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIGRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCB7XG4gICAgICAgICdhdG9tLWZvcm1hdC1sdWE6Zm9ybWF0JzogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBmb3JtYXQoKTtcbiAgICAgICAgfVxuICAgIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcbiAgICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHBhY2thZ2VDb25maWc7XG5cbmZ1bmN0aW9uIGZvcm1hdCgpIHtcbiAgICBsZXQgZWRpdG9yID0gbnVsbDtcbiAgICBsZXQgdGVtcGZpbGUgPSBudWxsO1xuICAgIGxldCB3a3NwYyA9IG51bGw7XG4gICAgbGV0IGZvcm1hdHRlclNjcmlwdCA9IG51bGw7XG4gICAgbGV0IGx1YTUxcGF0aCA9IG51bGw7XG4gICAgbGV0IHBhcmFtcyA9IG51bGw7XG5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICBpZiAoZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lID09ICdMdWEnKSB7XG4gICAgICAgIHRlbXBmaWxlID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGVtcGZpbGUgPSBlZGl0b3IuZ2V0UGF0aCgpO1xuXG4gICAgZWRpdG9yLnNhdmUoKTtcblxuICAgIGxldCBwa2dEaXJzID0gYXRvbS5wYWNrYWdlcy5wYWNrYWdlRGlyUGF0aHM7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHBrZ0RpcnMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGxldCB0bXBXa3NwYyA9IHBhdGguam9pbihwa2dEaXJzW2luZGV4XSwgJ2F0b20tZm9ybWF0LWx1YS9sdWFjb2RlJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgdG1mRmlsZSA9IHBhdGguam9pbih0bXBXa3NwYywgJ2Zvcm1hdHRlci5sdWEnKTtcbiAgICAgICAgICAgIGxldCBmc3RhdGUgPSBmcy5zdGF0U3luYyh0bWZGaWxlKTtcbiAgICAgICAgICAgIGlmIChmc3RhdGUuaXNGaWxlKCkpIHtcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZXJTY3JpcHQgPSB0bWZGaWxlO1xuICAgICAgICAgICAgICAgIHdrc3BjID0gdG1wV2tzcGM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgfVxuXG4gICAgbGV0IG9zVHlwZXMgPSB7XG4gICAgICAgICdkYXJ3aW4nOiAnL3Vzci9sb2NhbC9iaW4vbHVhNS4xJyxcbiAgICAgICAgJ2ZyZWVic2QnOiAnL3Vzci9sb2NhbC9iaW4vbHVhNS4xJyxcbiAgICAgICAgJ2xpbnV4JzogJy91c3IvYmluL2x1YTUuMScsXG4gICAgICAgICdzdW5vcyc6ICdJIGRvbnQgS25vdyB3aGVyZSB0aGUgbHVhNS4xJyxcbiAgICAgICAgJ3dpbjMyJzogJ0kgZG9udCBLbm93IHdoZXJlIHRoZSBsdWE1LjEnXG4gICAgfTtcbiAgICBwYXJhbXMgPSBbZm9ybWF0dGVyU2NyaXB0LCAnLS1maWxlJywgdGVtcGZpbGUsICctLXRzJywgYXRvbS5jb25maWcuZ2V0KCdhdG9tLWZvcm1hdC1sdWEuaW5kZW50U2l6ZScpXTtcblxuICAgIGx1YTUxcGF0aCA9IGF0b20uY29uZmlnLmdldChcImF0b20tZm9ybWF0LWx1YS5sdWE1MVwiKTtcblxuICAgIGlmICghbHVhNTFwYXRoKSB7XG4gICAgICAgIGx1YTUxcGF0aCA9IG9zVHlwZXNbaGVscGVycy5nZXRQcm9jZXNzUGxhdGZvcm0oKV07XG4gICAgfVxuXG4gICAgcHJvYyA9IHByb2Nlc3Muc3Bhd24obHVhNTFwYXRoLCBwYXJhbXMsIHtcbiAgICAgICAgY3dkOiB3a3NwY1xuICAgIH0pXG4gICAgLy8gcHJvYy5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgIC8vICAgICBjb25zb2xlLmxvZygnb3V0JywgZGF0YS5hc2NpaVNsaWNlKCkpXG4gICAgLy8gfSlcbiAgICBwcm9jLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdlcnInLCBkYXRhLmFzY2lpU2xpY2UoKSk7XG4gICAgfSlcbn1cbiJdfQ==