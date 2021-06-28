function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libHelperToCamelCase = require('../../lib/helper/to-camel-case');

var _libHelperToCamelCase2 = _interopRequireDefault(_libHelperToCamelCase);

'use babel';

describe('camelCaseHelper', function () {
    it('should convert spaces to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello world')).toEqual('helloWorld');
    });

    it('should convert lisp-case to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello-world')).toEqual('helloWorld');
    });

    it('should convert snake_case to camelCase', function () {
        expect((0, _libHelperToCamelCase2['default'])('hello_world')).toEqual('helloWorld');
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL3NwZWMvaGVscGVyL3RvLWNhbWVsLWNhc2Utc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQ0FFd0IsZ0NBQWdDOzs7O0FBRnhELFdBQVcsQ0FBQzs7QUFJWixRQUFRLENBQUMsaUJBQWlCLEVBQUUsWUFBTTtBQUM5QixNQUFFLENBQUMsb0NBQW9DLEVBQUUsWUFBTTtBQUMzQyxjQUFNLENBQUMsdUNBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDNUQsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyx1Q0FBdUMsRUFBRSxZQUFNO0FBQzlDLGNBQU0sQ0FBQyx1Q0FBWSxhQUFhLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM1RCxDQUFDLENBQUM7O0FBRUgsTUFBRSxDQUFDLHdDQUF3QyxFQUFFLFlBQU07QUFDL0MsY0FBTSxDQUFDLHVDQUFZLGFBQWEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzVELENBQUMsQ0FBQztDQUNOLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9zcGVjL2hlbHBlci90by1jYW1lbC1jYXNlLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHRvQ2FtZWxDYXNlIGZyb20gJy4uLy4uL2xpYi9oZWxwZXIvdG8tY2FtZWwtY2FzZSc7XG5cbmRlc2NyaWJlKCdjYW1lbENhc2VIZWxwZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHNwYWNlcyB0byBjYW1lbENhc2UnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh0b0NhbWVsQ2FzZSgnaGVsbG8gd29ybGQnKSkudG9FcXVhbCgnaGVsbG9Xb3JsZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IGxpc3AtY2FzZSB0byBjYW1lbENhc2UnLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdCh0b0NhbWVsQ2FzZSgnaGVsbG8td29ybGQnKSkudG9FcXVhbCgnaGVsbG9Xb3JsZCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHNuYWtlX2Nhc2UgdG8gY2FtZWxDYXNlJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QodG9DYW1lbENhc2UoJ2hlbGxvX3dvcmxkJykpLnRvRXF1YWwoJ2hlbGxvV29ybGQnKTtcbiAgICB9KTtcbn0pO1xuIl19