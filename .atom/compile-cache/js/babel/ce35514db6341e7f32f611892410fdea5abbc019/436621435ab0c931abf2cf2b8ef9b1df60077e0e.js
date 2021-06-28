Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fontsSetFontSize = require('./fonts/set-font-size');

var _fontsSetFontSize2 = _interopRequireDefault(_fontsSetFontSize);

var _helperToggleClassName = require('./helper/toggle-class-name');

var _helperToggleClassName2 = _interopRequireDefault(_helperToggleClassName);

require('./colors');

require('./fonts');

require('./tab-bar');

require('./user-interface');

'use babel';

var classNames = {
    // Fonts
    'amu-paint-cursor': atom.config.get('atom-material-ui.colors.paintCursor'),

    // Tabs settings
    'amu-compact-tab-bar': atom.config.get('atom-material-ui.tabs.compactTabs'),
    'amu-no-tab-min-width': atom.config.get('atom-material-ui.tabs.noTabMinWidth'),
    'amu-tinted-tab-bar': atom.config.get('atom-material-ui.tabs.tintedTabBar'),
    'amu-stretched-tabs': atom.config.get('atom-material-ui.tabs.stretchedTabs'),

    // General UI settings
    'amu-use-animations': atom.config.get('atom-material-ui.ui.useAnimations'),
    'amu-panel-contrast': atom.config.get('atom-material-ui.ui.panelContrast'),
    'amu-panel-shadows': atom.config.get('atom-material-ui.ui.panelShadows')
};

exports['default'] = {
    activate: function activate() {
        Object.keys(classNames).forEach(function (className) {
            return (0, _helperToggleClassName2['default'])(className, classNames[className]);
        });

        (0, _fontsSetFontSize2['default'])(atom.config.get('atom-material-ui.fonts.fontSize'));
    },

    deactivate: function deactivate() {
        // Reset all the things!
        Object.keys(classNames).forEach(function (className) {
            return (0, _helperToggleClassName2['default'])(className, false);
        });
        (0, _fontsSetFontSize2['default'])(null);
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztnQ0FFd0IsdUJBQXVCOzs7O3FDQUNuQiw0QkFBNEI7Ozs7UUFDakQsVUFBVTs7UUFDVixTQUFTOztRQUNULFdBQVc7O1FBQ1gsa0JBQWtCOztBQVB6QixXQUFXLENBQUM7O0FBU1osSUFBTSxVQUFVLEdBQUc7O0FBRWYsc0JBQWtCLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUNBQXFDLENBQUM7OztBQUcxRSx5QkFBcUIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsQ0FBQztBQUMzRSwwQkFBc0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQztBQUM5RSx3QkFBb0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQztBQUMzRSx3QkFBb0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsQ0FBQzs7O0FBRzVFLHdCQUFvQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDO0FBQzFFLHdCQUFvQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDO0FBQzFFLHVCQUFtQixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDO0NBQzNFLENBQUM7O3FCQUVhO0FBQ1gsWUFBUSxFQUFBLG9CQUFHO0FBQ1AsY0FBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxTQUFTO21CQUNyQyx3Q0FBZ0IsU0FBUyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUFDLENBQ3JELENBQUM7O0FBRUYsMkNBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDO0tBQ25FOztBQUVELGNBQVUsRUFBQSxzQkFBRzs7QUFFVCxjQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7bUJBQUksd0NBQWdCLFNBQVMsRUFBRSxLQUFLLENBQUM7U0FBQSxDQUFDLENBQUM7QUFDaEYsMkNBQVksSUFBSSxDQUFDLENBQUM7S0FDckI7Q0FDSiIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvYXRvbS1tYXRlcmlhbC11aS9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgc2V0Rm9udFNpemUgZnJvbSAnLi9mb250cy9zZXQtZm9udC1zaXplJztcbmltcG9ydCB0b2dnbGVDbGFzc05hbWUgZnJvbSAnLi9oZWxwZXIvdG9nZ2xlLWNsYXNzLW5hbWUnO1xuaW1wb3J0ICcuL2NvbG9ycyc7XG5pbXBvcnQgJy4vZm9udHMnO1xuaW1wb3J0ICcuL3RhYi1iYXInO1xuaW1wb3J0ICcuL3VzZXItaW50ZXJmYWNlJztcblxuY29uc3QgY2xhc3NOYW1lcyA9IHtcbiAgICAvLyBGb250c1xuICAgICdhbXUtcGFpbnQtY3Vyc29yJzogYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLmNvbG9ycy5wYWludEN1cnNvcicpLFxuXG4gICAgLy8gVGFicyBzZXR0aW5nc1xuICAgICdhbXUtY29tcGFjdC10YWItYmFyJzogYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnRhYnMuY29tcGFjdFRhYnMnKSxcbiAgICAnYW11LW5vLXRhYi1taW4td2lkdGgnOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudGFicy5ub1RhYk1pbldpZHRoJyksXG4gICAgJ2FtdS10aW50ZWQtdGFiLWJhcic6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS50YWJzLnRpbnRlZFRhYkJhcicpLFxuICAgICdhbXUtc3RyZXRjaGVkLXRhYnMnOiBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkudGFicy5zdHJldGNoZWRUYWJzJyksXG5cbiAgICAvLyBHZW5lcmFsIFVJIHNldHRpbmdzXG4gICAgJ2FtdS11c2UtYW5pbWF0aW9ucyc6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS51aS51c2VBbmltYXRpb25zJyksXG4gICAgJ2FtdS1wYW5lbC1jb250cmFzdCc6IGF0b20uY29uZmlnLmdldCgnYXRvbS1tYXRlcmlhbC11aS51aS5wYW5lbENvbnRyYXN0JyksXG4gICAgJ2FtdS1wYW5lbC1zaGFkb3dzJzogYXRvbS5jb25maWcuZ2V0KCdhdG9tLW1hdGVyaWFsLXVpLnVpLnBhbmVsU2hhZG93cycpLFxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGFjdGl2YXRlKCkge1xuICAgICAgICBPYmplY3Qua2V5cyhjbGFzc05hbWVzKS5mb3JFYWNoKGNsYXNzTmFtZSA9PiAoXG4gICAgICAgICAgICB0b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCBjbGFzc05hbWVzW2NsYXNzTmFtZV0pKSxcbiAgICAgICAgKTtcblxuICAgICAgICBzZXRGb250U2l6ZShhdG9tLmNvbmZpZy5nZXQoJ2F0b20tbWF0ZXJpYWwtdWkuZm9udHMuZm9udFNpemUnKSk7XG4gICAgfSxcblxuICAgIGRlYWN0aXZhdGUoKSB7XG4gICAgICAgIC8vIFJlc2V0IGFsbCB0aGUgdGhpbmdzIVxuICAgICAgICBPYmplY3Qua2V5cyhjbGFzc05hbWVzKS5mb3JFYWNoKGNsYXNzTmFtZSA9PiB0b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCBmYWxzZSkpO1xuICAgICAgICBzZXRGb250U2l6ZShudWxsKTtcbiAgICB9LFxufTtcbiJdfQ==