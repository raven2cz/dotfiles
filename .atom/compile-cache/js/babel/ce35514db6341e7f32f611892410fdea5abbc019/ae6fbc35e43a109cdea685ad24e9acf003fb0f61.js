function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _jasmineFix = require('jasmine-fix');

'use babel';

var _require$provideLinter = require('../lib/init.js').provideLinter();

var lint = _require$provideLinter.lint;

var badFile = path.join(__dirname, 'fixtures', 'bad.lua');
var goodFile = path.join(__dirname, 'fixtures', 'good.lua');

describe('The Lua provider for Linter', function () {
  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    atom.workspace.destroyActivePaneItem();
    yield atom.packages.activatePackage('linter-lua');
  }));

  (0, _jasmineFix.it)('checks a file with syntax error with luac and reports the correct message', _asyncToGenerator(function* () {
    atom.config.set('linter-lua.executablePath', 'luac');
    var excerpt = "')' expected (to close '(' at line 18) near 'end'";
    var editor = yield atom.workspace.open(badFile);
    var messages = yield lint(editor);

    expect(messages.length).toBe(1);
    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(excerpt);
    expect(messages[0].location.file).toBe(badFile);
    expect(messages[0].location.position).toEqual([[18, 0], [18, 3]]);
  }));

  (0, _jasmineFix.it)('checks a file with syntax error with luajit and reports the correct message', _asyncToGenerator(function* () {
    atom.config.set('linter-lua.executablePath', 'luajit');
    var excerpt = "')' expected (to close '(' at line 18) near 'end'";
    var editor = yield atom.workspace.open(badFile);
    var messages = yield lint(editor);

    expect(messages.length).toBe(1);
    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(excerpt);
    expect(messages[0].location.file).toBe(badFile);
    expect(messages[0].location.position).toEqual([[18, 0], [18, 3]]);
  }));

  (0, _jasmineFix.it)('finds nothing wrong with a valid file using luac', _asyncToGenerator(function* () {
    atom.config.set('linter-lua.executablePath', 'luac');
    var editor = yield atom.workspace.open(goodFile);
    var messages = yield lint(editor);
    expect(messages.length).toBe(0);
  }));

  (0, _jasmineFix.it)('finds nothing wrong with a valid file using luajit', _asyncToGenerator(function* () {
    atom.config.set('linter-lua.executablePath', 'luajit');
    var editor = yield atom.workspace.open(goodFile);
    var messages = yield lint(editor);
    expect(messages.length).toBe(0);
  }));
});

// eslint-disable-next-line no-unused-vars
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItbHVhL3NwZWMvbGludGVyLWx1YS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRXNCLE1BQU07O0lBQWhCLElBQUk7OzBCQUlULGFBQWE7O0FBTnBCLFdBQVcsQ0FBQzs7NkJBUUssT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsYUFBYSxFQUFFOztJQUFsRCxJQUFJLDBCQUFKLElBQUk7O0FBRVosSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzVELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQzs7QUFFOUQsUUFBUSxDQUFDLDZCQUE2QixFQUFFLFlBQU07QUFDNUMsZ0RBQVcsYUFBWTtBQUNyQixRQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUM7QUFDdkMsVUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNuRCxFQUFDLENBQUM7O0FBRUgsc0JBQUcsMkVBQTJFLG9CQUFFLGFBQVk7QUFDMUYsUUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMkJBQTJCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckQsUUFBTSxPQUFPLEdBQUcsbURBQW1ELENBQUM7QUFDcEUsUUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsRCxRQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFcEMsVUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsVUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENB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LCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBpdCwgZml0LCB3YWl0LCBiZWZvcmVFYWNoLCBhZnRlckVhY2gsXG59IGZyb20gJ2phc21pbmUtZml4JztcblxuY29uc3QgeyBsaW50IH0gPSByZXF1aXJlKCcuLi9saWIvaW5pdC5qcycpLnByb3ZpZGVMaW50ZXIoKTtcblxuY29uc3QgYmFkRmlsZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdiYWQubHVhJyk7XG5jb25zdCBnb29kRmlsZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycsICdnb29kLmx1YScpO1xuXG5kZXNjcmliZSgnVGhlIEx1YSBwcm92aWRlciBmb3IgTGludGVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKGFzeW5jICgpID0+IHtcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKTtcbiAgICBhd2FpdCBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbGludGVyLWx1YScpO1xuICB9KTtcblxuICBpdCgnY2hlY2tzIGEgZmlsZSB3aXRoIHN5bnRheCBlcnJvciB3aXRoIGx1YWMgYW5kIHJlcG9ydHMgdGhlIGNvcnJlY3QgbWVzc2FnZScsIGFzeW5jICgpID0+IHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci1sdWEuZXhlY3V0YWJsZVBhdGgnLCAnbHVhYycpO1xuICAgIGNvbnN0IGV4Y2VycHQgPSBcIicpJyBleHBlY3RlZCAodG8gY2xvc2UgJygnIGF0IGxpbmUgMTgpIG5lYXIgJ2VuZCdcIjtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGJhZEZpbGUpO1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpO1xuXG4gICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKTtcbiAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJyk7XG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmV4Y2VycHQpLnRvQmUoZXhjZXJwdCk7XG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUoYmFkRmlsZSk7XG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMTgsIDBdLCBbMTgsIDNdXSk7XG4gIH0pO1xuXG4gIGl0KCdjaGVja3MgYSBmaWxlIHdpdGggc3ludGF4IGVycm9yIHdpdGggbHVhaml0IGFuZCByZXBvcnRzIHRoZSBjb3JyZWN0IG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItbHVhLmV4ZWN1dGFibGVQYXRoJywgJ2x1YWppdCcpO1xuICAgIGNvbnN0IGV4Y2VycHQgPSBcIicpJyBleHBlY3RlZCAodG8gY2xvc2UgJygnIGF0IGxpbmUgMTgpIG5lYXIgJ2VuZCdcIjtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGJhZEZpbGUpO1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpO1xuXG4gICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKTtcbiAgICBleHBlY3QobWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ2Vycm9yJyk7XG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmV4Y2VycHQpLnRvQmUoZXhjZXJwdCk7XG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLmZpbGUpLnRvQmUoYmFkRmlsZSk7XG4gICAgZXhwZWN0KG1lc3NhZ2VzWzBdLmxvY2F0aW9uLnBvc2l0aW9uKS50b0VxdWFsKFtbMTgsIDBdLCBbMTgsIDNdXSk7XG4gIH0pO1xuXG4gIGl0KCdmaW5kcyBub3RoaW5nIHdyb25nIHdpdGggYSB2YWxpZCBmaWxlIHVzaW5nIGx1YWMnLCBhc3luYyAoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItbHVhLmV4ZWN1dGFibGVQYXRoJywgJ2x1YWMnKTtcbiAgICBjb25zdCBlZGl0b3IgPSBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGdvb2RGaWxlKTtcbiAgICBjb25zdCBtZXNzYWdlcyA9IGF3YWl0IGxpbnQoZWRpdG9yKTtcbiAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApO1xuICB9KTtcblxuICBpdCgnZmluZHMgbm90aGluZyB3cm9uZyB3aXRoIGEgdmFsaWQgZmlsZSB1c2luZyBsdWFqaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItbHVhLmV4ZWN1dGFibGVQYXRoJywgJ2x1YWppdCcpO1xuICAgIGNvbnN0IGVkaXRvciA9IGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZ29vZEZpbGUpO1xuICAgIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgbGludChlZGl0b3IpO1xuICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMCk7XG4gIH0pO1xufSk7XG4iXX0=