function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libFontsSetFontSize = require('../../lib/fonts/set-font-size');

var _libFontsSetFontSize2 = _interopRequireDefault(_libFontsSetFontSize);

'use babel';

describe('Font size setter', function () {
    var root = document.documentElement;

    it('should be able to change root element\'s font-size', function () {
        expect(root.style.fontSize).toBe('');
        (0, _libFontsSetFontSize2['default'])(22);
        expect(root.style.fontSize).toBe('22px');
    });

    it('should be able to unset root element\'s font-size', function () {
        (0, _libFontsSetFontSize2['default'])(22);
        expect(root.style.fontSize).toBe('22px');
        (0, _libFontsSetFontSize2['default'])(null);
        expect(root.style.fontSize).toBe('');
    });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL3NwZWMvZm9udHMvc2V0LWZvbnQtc2l6ZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O21DQUV3QiwrQkFBK0I7Ozs7QUFGdkQsV0FBVyxDQUFDOztBQUlaLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxZQUFNO0FBQy9CLFFBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7O0FBRXRDLE1BQUUsQ0FBQyxvREFBb0QsRUFBRSxZQUFNO0FBQzNELGNBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQyw4Q0FBWSxFQUFFLENBQUMsQ0FBQztBQUNoQixjQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDNUMsQ0FBQyxDQUFDOztBQUVILE1BQUUsQ0FBQyxtREFBbUQsRUFBRSxZQUFNO0FBQzFELDhDQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ2hCLGNBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6Qyw4Q0FBWSxJQUFJLENBQUMsQ0FBQztBQUNsQixjQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDeEMsQ0FBQyxDQUFDO0NBQ04sQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL3NwZWMvZm9udHMvc2V0LWZvbnQtc2l6ZS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBzZXRGb250U2l6ZSBmcm9tICcuLi8uLi9saWIvZm9udHMvc2V0LWZvbnQtc2l6ZSc7XG5cbmRlc2NyaWJlKCdGb250IHNpemUgc2V0dGVyJywgKCkgPT4ge1xuICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGFibGUgdG8gY2hhbmdlIHJvb3QgZWxlbWVudFxcJ3MgZm9udC1zaXplJywgKCkgPT4ge1xuICAgICAgICBleHBlY3Qocm9vdC5zdHlsZS5mb250U2l6ZSkudG9CZSgnJyk7XG4gICAgICAgIHNldEZvbnRTaXplKDIyKTtcbiAgICAgICAgZXhwZWN0KHJvb3Quc3R5bGUuZm9udFNpemUpLnRvQmUoJzIycHgnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgYWJsZSB0byB1bnNldCByb290IGVsZW1lbnRcXCdzIGZvbnQtc2l6ZScsICgpID0+IHtcbiAgICAgICAgc2V0Rm9udFNpemUoMjIpO1xuICAgICAgICBleHBlY3Qocm9vdC5zdHlsZS5mb250U2l6ZSkudG9CZSgnMjJweCcpO1xuICAgICAgICBzZXRGb250U2l6ZShudWxsKTtcbiAgICAgICAgZXhwZWN0KHJvb3Quc3R5bGUuZm9udFNpemUpLnRvQmUoJycpO1xuICAgIH0pO1xufSk7XG4iXX0=