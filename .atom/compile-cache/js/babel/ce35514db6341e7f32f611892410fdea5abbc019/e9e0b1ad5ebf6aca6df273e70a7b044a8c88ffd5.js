Object.defineProperty(exports, '__esModule', {
  value: true
});

/** @jsx jsx */
// eslint-disable-next-line no-unused-vars

var _vanillaJsx = require('vanilla-jsx');

var _helpers = require('../helpers');

exports['default'] = (0, _vanillaJsx.createClass)({
  renderView: function renderView(suggestions, selectCallback) {
    var className = 'select-list popover-list';
    if (suggestions.length > 7) {
      className += ' intentions-scroll';
    }

    this.suggestions = suggestions;
    this.suggestionsCount = suggestions.length;
    this.suggestionsIndex = -1;
    this.selectCallback = selectCallback;

    return (0, _vanillaJsx.jsx)(
      'intentions-list',
      { 'class': className, id: 'intentions-list' },
      (0, _vanillaJsx.jsx)(
        'ol',
        { 'class': 'list-group', ref: 'list' },
        suggestions.map(function (suggestion) {
          return (0, _vanillaJsx.jsx)(
            'li',
            null,
            (0, _vanillaJsx.jsx)(
              'span',
              { 'class': suggestion[_helpers.$class], 'on-click': function () {
                  selectCallback(suggestion);
                } },
              suggestion.title
            )
          );
        })
      )
    );
  },
  move: function move(movement) {
    var newIndex = this.suggestionsIndex;

    if (movement === 'up') {
      newIndex--;
    } else if (movement === 'down') {
      newIndex++;
    } else if (movement === 'move-to-top') {
      newIndex = 0;
    } else if (movement === 'move-to-bottom') {
      newIndex = this.suggestionsCount;
    }
    // TODO: Implement page up/down
    newIndex %= this.suggestionsCount;
    if (newIndex < 0) {
      newIndex = this.suggestionsCount + newIndex;
    }
    this.selectIndex(newIndex);
  },
  selectIndex: function selectIndex(index) {
    if (this.refs.active) {
      this.refs.active.classList.remove('selected');
    }

    this.refs.active = this.refs.list.children[index];
    this.refs.active.classList.add('selected');

    this.refs.active.scrollIntoViewIfNeeded(false);
    this.suggestionsIndex = index;
  },
  select: function select() {
    this.selectCallback(this.suggestions[this.suggestionsIndex]);
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9lbGVtZW50cy9saXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7MEJBSWlDLGFBQWE7O3VCQUN2QixZQUFZOztxQkFHcEIsNkJBQVk7QUFDekIsWUFBVSxFQUFBLG9CQUFDLFdBQVcsRUFBRSxjQUFjLEVBQUU7QUFDdEMsUUFBSSxTQUFTLEdBQUcsMEJBQTBCLENBQUE7QUFDMUMsUUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUMxQixlQUFTLElBQUksb0JBQW9CLENBQUE7S0FDbEM7O0FBRUQsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUE7QUFDMUMsUUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQzFCLFFBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFBOztBQUVwQyxXQUFPOztRQUFpQixTQUFPLFNBQVMsQUFBQyxFQUFDLEVBQUUsRUFBQyxpQkFBaUI7TUFDNUQ7O1VBQUksU0FBTSxZQUFZLEVBQUMsR0FBRyxFQUFDLE1BQU07UUFDOUIsV0FBVyxDQUFDLEdBQUcsQ0FBQyxVQUFTLFVBQVUsRUFBRTtBQUNwQyxpQkFBTzs7O1lBQ0w7O2dCQUFNLFNBQU8sVUFBVSxpQkFBUSxBQUFDLEVBQUMsWUFBVSxZQUFXO0FBQ3BELGdDQUFjLENBQUMsVUFBVSxDQUFDLENBQUE7aUJBQzNCLEFBQUM7Y0FBRSxVQUFVLENBQUMsS0FBSzthQUFRO1dBQ3pCLENBQUE7U0FDTixDQUFDO09BQ0M7S0FDVyxDQUFBO0dBQ25CO0FBQ0QsTUFBSSxFQUFBLGNBQUMsUUFBc0IsRUFBRTtBQUMzQixRQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7O0FBRXBDLFFBQUksUUFBUSxLQUFLLElBQUksRUFBRTtBQUNyQixjQUFRLEVBQUUsQ0FBQTtLQUNYLE1BQU0sSUFBSSxRQUFRLEtBQUssTUFBTSxFQUFFO0FBQzlCLGNBQVEsRUFBRSxDQUFBO0tBQ1gsTUFBTSxJQUFJLFFBQVEsS0FBSyxhQUFhLEVBQUU7QUFDckMsY0FBUSxHQUFHLENBQUMsQ0FBQTtLQUNiLE1BQU0sSUFBSSxRQUFRLEtBQUssZ0JBQWdCLEVBQUU7QUFDeEMsY0FBUSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQTtLQUNqQzs7QUFFRCxZQUFRLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFBO0FBQ2pDLFFBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtBQUNoQixjQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQTtLQUM1QztBQUNELFFBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDM0I7QUFDRCxhQUFXLEVBQUEscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFFBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDcEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUM5Qzs7QUFFRCxRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDakQsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTs7QUFFMUMsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDOUMsUUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQTtHQUM5QjtBQUNELFFBQU0sRUFBQSxrQkFBRztBQUNQLFFBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFBO0dBQzdEO0NBQ0YsQ0FBQyIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvZWxlbWVudHMvbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8qKiBAanN4IGpzeCAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG5pbXBvcnQgeyBjcmVhdGVDbGFzcywganN4IH0gZnJvbSAndmFuaWxsYS1qc3gnXG5pbXBvcnQgeyAkY2xhc3MgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaXN0TW92ZW1lbnQgfSBmcm9tICcuLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQ2xhc3Moe1xuICByZW5kZXJWaWV3KHN1Z2dlc3Rpb25zLCBzZWxlY3RDYWxsYmFjaykge1xuICAgIGxldCBjbGFzc05hbWUgPSAnc2VsZWN0LWxpc3QgcG9wb3Zlci1saXN0J1xuICAgIGlmIChzdWdnZXN0aW9ucy5sZW5ndGggPiA3KSB7XG4gICAgICBjbGFzc05hbWUgKz0gJyBpbnRlbnRpb25zLXNjcm9sbCdcbiAgICB9XG5cbiAgICB0aGlzLnN1Z2dlc3Rpb25zID0gc3VnZ2VzdGlvbnNcbiAgICB0aGlzLnN1Z2dlc3Rpb25zQ291bnQgPSBzdWdnZXN0aW9ucy5sZW5ndGhcbiAgICB0aGlzLnN1Z2dlc3Rpb25zSW5kZXggPSAtMVxuICAgIHRoaXMuc2VsZWN0Q2FsbGJhY2sgPSBzZWxlY3RDYWxsYmFja1xuXG4gICAgcmV0dXJuIDxpbnRlbnRpb25zLWxpc3QgY2xhc3M9e2NsYXNzTmFtZX0gaWQ9XCJpbnRlbnRpb25zLWxpc3RcIj5cbiAgICAgIDxvbCBjbGFzcz1cImxpc3QtZ3JvdXBcIiByZWY9XCJsaXN0XCI+XG4gICAgICAgIHtzdWdnZXN0aW9ucy5tYXAoZnVuY3Rpb24oc3VnZ2VzdGlvbikge1xuICAgICAgICAgIHJldHVybiA8bGk+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz17c3VnZ2VzdGlvblskY2xhc3NdfSBvbi1jbGljaz17ZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHNlbGVjdENhbGxiYWNrKHN1Z2dlc3Rpb24pXG4gICAgICAgICAgICB9fT57c3VnZ2VzdGlvbi50aXRsZX08L3NwYW4+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgfSl9XG4gICAgICA8L29sPlxuICAgIDwvaW50ZW50aW9ucy1saXN0PlxuICB9LFxuICBtb3ZlKG1vdmVtZW50OiBMaXN0TW92ZW1lbnQpIHtcbiAgICBsZXQgbmV3SW5kZXggPSB0aGlzLnN1Z2dlc3Rpb25zSW5kZXhcblxuICAgIGlmIChtb3ZlbWVudCA9PT0gJ3VwJykge1xuICAgICAgbmV3SW5kZXgtLVxuICAgIH0gZWxzZSBpZiAobW92ZW1lbnQgPT09ICdkb3duJykge1xuICAgICAgbmV3SW5kZXgrK1xuICAgIH0gZWxzZSBpZiAobW92ZW1lbnQgPT09ICdtb3ZlLXRvLXRvcCcpIHtcbiAgICAgIG5ld0luZGV4ID0gMFxuICAgIH0gZWxzZSBpZiAobW92ZW1lbnQgPT09ICdtb3ZlLXRvLWJvdHRvbScpIHtcbiAgICAgIG5ld0luZGV4ID0gdGhpcy5zdWdnZXN0aW9uc0NvdW50XG4gICAgfVxuICAgIC8vIFRPRE86IEltcGxlbWVudCBwYWdlIHVwL2Rvd25cbiAgICBuZXdJbmRleCAlPSB0aGlzLnN1Z2dlc3Rpb25zQ291bnRcbiAgICBpZiAobmV3SW5kZXggPCAwKSB7XG4gICAgICBuZXdJbmRleCA9IHRoaXMuc3VnZ2VzdGlvbnNDb3VudCArIG5ld0luZGV4XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0SW5kZXgobmV3SW5kZXgpXG4gIH0sXG4gIHNlbGVjdEluZGV4KGluZGV4KSB7XG4gICAgaWYgKHRoaXMucmVmcy5hY3RpdmUpIHtcbiAgICAgIHRoaXMucmVmcy5hY3RpdmUuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKVxuICAgIH1cblxuICAgIHRoaXMucmVmcy5hY3RpdmUgPSB0aGlzLnJlZnMubGlzdC5jaGlsZHJlbltpbmRleF1cbiAgICB0aGlzLnJlZnMuYWN0aXZlLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJylcblxuICAgIHRoaXMucmVmcy5hY3RpdmUuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZChmYWxzZSlcbiAgICB0aGlzLnN1Z2dlc3Rpb25zSW5kZXggPSBpbmRleFxuICB9LFxuICBzZWxlY3QoKSB7XG4gICAgdGhpcy5zZWxlY3RDYWxsYmFjayh0aGlzLnN1Z2dlc3Rpb25zW3RoaXMuc3VnZ2VzdGlvbnNJbmRleF0pXG4gIH0sXG59KVxuIl19