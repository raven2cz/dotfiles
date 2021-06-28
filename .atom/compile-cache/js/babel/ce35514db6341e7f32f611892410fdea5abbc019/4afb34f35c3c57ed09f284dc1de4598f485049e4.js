Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = buildColorSettings;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _tinycolor2 = require('tinycolor2');

var _tinycolor22 = _interopRequireDefault(_tinycolor2);

'use babel';

function buildColorSettings() {
    var baseColor = arguments.length <= 0 || arguments[0] === undefined ? '#009688' : arguments[0];
    var accentColor = arguments.length <= 1 || arguments[1] === undefined ? '#FFFFFF' : arguments[1];

    var newAccent = typeof accentColor === 'object' ? accentColor.toHexString() : accentColor;

    var newBase = typeof baseColor === 'object' ? baseColor.toHexString() : baseColor;

    var luminance = (0, _tinycolor22['default'])(newBase).getLuminance();
    var accentTextColor = '#666';

    if (luminance <= 0.3 && luminance > 0.22) {
        accentTextColor = 'rgba(255,255,255,0.9)';
    } else if (luminance <= 0.22) {
        accentTextColor = 'rgba(255,255,255,0.8)';
    } else if (luminance > 0.3) {
        accentTextColor = 'rgba(0,0,0,0.6)';
    }

    return '\n        @accent-color: ' + newAccent + ';\n        @accent-text-color: ' + accentTextColor + ';\n        @base-color: ' + newBase + ';\n    ';
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9jb2xvcnMvYnVpbGQtY29sb3Itc2V0dGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O3FCQUl3QixrQkFBa0I7Ozs7MEJBRnBCLFlBQVk7Ozs7QUFGbEMsV0FBVyxDQUFDOztBQUlHLFNBQVMsa0JBQWtCLEdBQWlEO1FBQWhELFNBQVMseURBQUcsU0FBUztRQUFFLFdBQVcseURBQUcsU0FBUzs7QUFDckYsUUFBTSxTQUFTLEdBQUcsQUFBQyxPQUFPLFdBQVcsS0FBSyxRQUFRLEdBQzlDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsR0FDekIsV0FBVyxDQUFDOztBQUVoQixRQUFNLE9BQU8sR0FBRyxBQUFDLE9BQU8sU0FBUyxLQUFLLFFBQVEsR0FDMUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxHQUN2QixTQUFTLENBQUM7O0FBRWQsUUFBTSxTQUFTLEdBQUcsNkJBQVUsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDcEQsUUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDOztBQUU3QixRQUFJLFNBQVMsSUFBSSxHQUFHLElBQUksU0FBUyxHQUFHLElBQUksRUFBRTtBQUN0Qyx1QkFBZSxHQUFHLHVCQUF1QixDQUFDO0tBQzdDLE1BQU0sSUFBSSxTQUFTLElBQUksSUFBSSxFQUFFO0FBQzFCLHVCQUFlLEdBQUcsdUJBQXVCLENBQUM7S0FDN0MsTUFBTSxJQUFJLFNBQVMsR0FBRyxHQUFHLEVBQUU7QUFDeEIsdUJBQWUsR0FBRyxpQkFBaUIsQ0FBQztLQUN2Qzs7QUFFRCx5Q0FDcUIsU0FBUyx1Q0FDSixlQUFlLGdDQUN0QixPQUFPLGFBQ3hCO0NBQ0wiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2NvbG9ycy9idWlsZC1jb2xvci1zZXR0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgdGlueWNvbG9yIGZyb20gJ3Rpbnljb2xvcjInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZENvbG9yU2V0dGluZ3MoYmFzZUNvbG9yID0gJyMwMDk2ODgnLCBhY2NlbnRDb2xvciA9ICcjRkZGRkZGJykge1xuICAgIGNvbnN0IG5ld0FjY2VudCA9ICh0eXBlb2YgYWNjZW50Q29sb3IgPT09ICdvYmplY3QnKSA/XG4gICAgICAgIGFjY2VudENvbG9yLnRvSGV4U3RyaW5nKCkgOlxuICAgICAgICBhY2NlbnRDb2xvcjtcblxuICAgIGNvbnN0IG5ld0Jhc2UgPSAodHlwZW9mIGJhc2VDb2xvciA9PT0gJ29iamVjdCcpID9cbiAgICAgICAgYmFzZUNvbG9yLnRvSGV4U3RyaW5nKCkgOlxuICAgICAgICBiYXNlQ29sb3I7XG5cbiAgICBjb25zdCBsdW1pbmFuY2UgPSB0aW55Y29sb3IobmV3QmFzZSkuZ2V0THVtaW5hbmNlKCk7XG4gICAgbGV0IGFjY2VudFRleHRDb2xvciA9ICcjNjY2JztcblxuICAgIGlmIChsdW1pbmFuY2UgPD0gMC4zICYmIGx1bWluYW5jZSA+IDAuMjIpIHtcbiAgICAgICAgYWNjZW50VGV4dENvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMC45KSc7XG4gICAgfSBlbHNlIGlmIChsdW1pbmFuY2UgPD0gMC4yMikge1xuICAgICAgICBhY2NlbnRUZXh0Q29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwwLjgpJztcbiAgICB9IGVsc2UgaWYgKGx1bWluYW5jZSA+IDAuMykge1xuICAgICAgICBhY2NlbnRUZXh0Q29sb3IgPSAncmdiYSgwLDAsMCwwLjYpJztcbiAgICB9XG5cbiAgICByZXR1cm4gYFxuICAgICAgICBAYWNjZW50LWNvbG9yOiAke25ld0FjY2VudH07XG4gICAgICAgIEBhY2NlbnQtdGV4dC1jb2xvcjogJHthY2NlbnRUZXh0Q29sb3J9O1xuICAgICAgICBAYmFzZS1jb2xvcjogJHtuZXdCYXNlfTtcbiAgICBgO1xufVxuIl19