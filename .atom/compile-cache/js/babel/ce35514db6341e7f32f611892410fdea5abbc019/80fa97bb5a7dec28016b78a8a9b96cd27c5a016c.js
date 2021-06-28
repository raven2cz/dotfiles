function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libHighlightColors = require('../lib/highlight-colors');

var _libHighlightColors2 = _interopRequireDefault(_libHighlightColors);

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

'use babel';

describe('HighlightColors', function () {
  var workspaceElement = undefined,
      activationPromise = undefined;

  beforeEach(function () {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('highlight-colors');
  });

  describe('when the highlight-colors:toggle event is triggered', function () {
    it('hides and shows the modal panel', function () {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.highlight-colors')).not.toExist();

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'highlight-colors:toggle');

      waitsForPromise(function () {
        return activationPromise;
      });

      runs(function () {
        expect(workspaceElement.querySelector('.highlight-colors')).toExist();

        var highlightColorsElement = workspaceElement.querySelector('.highlight-colors');
        expect(highlightColorsElement).toExist();

        var highlightColorsPanel = atom.workspace.panelForItem(highlightColorsElement);
        expect(highlightColorsPanel.isVisible()).toBe(true);
        atom.commands.dispatch(workspaceElement, 'highlight-colors:toggle');
        expect(highlightColorsPanel.isVisible()).toBe(false);
      });
    });

    it('hides and shows the view', function () {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement);

      expect(workspaceElement.querySelector('.highlight-colors')).not.toExist();

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'highlight-colors:toggle');

      waitsForPromise(function () {
        return activationPromise;
      });

      runs(function () {
        // Now we can test for view visibility
        var highlightColorsElement = workspaceElement.querySelector('.highlight-colors');
        expect(highlightColorsElement).toBeVisible();
        atom.commands.dispatch(workspaceElement, 'highlight-colors:toggle');
        expect(highlightColorsElement).not.toBeVisible();
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9oaWdobGlnaHQtY29sb3JzL3NwZWMvaGlnaGxpZ2h0LWNvbG9ycy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O2tDQUU0Qix5QkFBeUI7Ozs7Ozs7OztBQUZyRCxXQUFXLENBQUM7O0FBU1osUUFBUSxDQUFDLGlCQUFpQixFQUFFLFlBQU07QUFDaEMsTUFBSSxnQkFBZ0IsWUFBQTtNQUFFLGlCQUFpQixZQUFBLENBQUM7O0FBRXhDLFlBQVUsQ0FBQyxZQUFNO0FBQ2Ysb0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELHFCQUFpQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUM7R0FDdkUsQ0FBQyxDQUFDOztBQUVILFVBQVEsQ0FBQyxxREFBcUQsRUFBRSxZQUFNO0FBQ3BFLE1BQUUsQ0FBQyxpQ0FBaUMsRUFBRSxZQUFNOzs7QUFHMUMsWUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDOzs7O0FBSTFFLFVBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLHlCQUF5QixDQUFDLENBQUM7O0FBRXBFLHFCQUFlLENBQUMsWUFBTTtBQUNwQixlQUFPLGlCQUFpQixDQUFDO09BQzFCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsWUFBTTtBQUNULGNBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUV0RSxZQUFJLHNCQUFzQixHQUFHLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ2pGLGNBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUV6QyxZQUFJLG9CQUFvQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDL0UsY0FBTSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BELFlBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLHlCQUF5QixDQUFDLENBQUM7QUFDcEUsY0FBTSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3RELENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsMEJBQTBCLEVBQUUsWUFBTTs7Ozs7OztBQU9uQyxhQUFPLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXRDLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7OztBQUkxRSxVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDOztBQUVwRSxxQkFBZSxDQUFDLFlBQU07QUFDcEIsZUFBTyxpQkFBaUIsQ0FBQztPQUMxQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQU07O0FBRVQsWUFBSSxzQkFBc0IsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUNqRixjQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUM3QyxZQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3BFLGNBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztPQUNsRCxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1jb2xvcnMvc3BlYy9oaWdobGlnaHQtY29sb3JzLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IEhpZ2hsaWdodENvbG9ycyBmcm9tICcuLi9saWIvaGlnaGxpZ2h0LWNvbG9ycyc7XG5cbi8vIFVzZSB0aGUgY29tbWFuZCBgd2luZG93OnJ1bi1wYWNrYWdlLXNwZWNzYCAoY21kLWFsdC1jdHJsLXApIHRvIHJ1biBzcGVjcy5cbi8vXG4vLyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbi8vIG9yIGBmZGVzY3JpYmVgKS4gUmVtb3ZlIHRoZSBgZmAgdG8gdW5mb2N1cyB0aGUgYmxvY2suXG5cbmRlc2NyaWJlKCdIaWdobGlnaHRDb2xvcnMnLCAoKSA9PiB7XG4gIGxldCB3b3Jrc3BhY2VFbGVtZW50LCBhY3RpdmF0aW9uUHJvbWlzZTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKTtcbiAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdoaWdobGlnaHQtY29sb3JzJyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aGVuIHRoZSBoaWdobGlnaHQtY29sb3JzOnRvZ2dsZSBldmVudCBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgaXQoJ2hpZGVzIGFuZCBzaG93cyB0aGUgbW9kYWwgcGFuZWwnLCAoKSA9PiB7XG4gICAgICAvLyBCZWZvcmUgdGhlIGFjdGl2YXRpb24gZXZlbnQgdGhlIHZpZXcgaXMgbm90IG9uIHRoZSBET00sIGFuZCBubyBwYW5lbFxuICAgICAgLy8gaGFzIGJlZW4gY3JlYXRlZFxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmhpZ2hsaWdodC1jb2xvcnMnKSkubm90LnRvRXhpc3QoKTtcblxuICAgICAgLy8gVGhpcyBpcyBhbiBhY3RpdmF0aW9uIGV2ZW50LCB0cmlnZ2VyaW5nIGl0IHdpbGwgY2F1c2UgdGhlIHBhY2thZ2UgdG8gYmVcbiAgICAgIC8vIGFjdGl2YXRlZC5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ2hpZ2hsaWdodC1jb2xvcnM6dG9nZ2xlJyk7XG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG4gICAgICAgIHJldHVybiBhY3RpdmF0aW9uUHJvbWlzZTtcbiAgICAgIH0pO1xuXG4gICAgICBydW5zKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLmhpZ2hsaWdodC1jb2xvcnMnKSkudG9FeGlzdCgpO1xuXG4gICAgICAgIGxldCBoaWdobGlnaHRDb2xvcnNFbGVtZW50ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaGlnaGxpZ2h0LWNvbG9ycycpO1xuICAgICAgICBleHBlY3QoaGlnaGxpZ2h0Q29sb3JzRWxlbWVudCkudG9FeGlzdCgpO1xuXG4gICAgICAgIGxldCBoaWdobGlnaHRDb2xvcnNQYW5lbCA9IGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShoaWdobGlnaHRDb2xvcnNFbGVtZW50KTtcbiAgICAgICAgZXhwZWN0KGhpZ2hsaWdodENvbG9yc1BhbmVsLmlzVmlzaWJsZSgpKS50b0JlKHRydWUpO1xuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdoaWdobGlnaHQtY29sb3JzOnRvZ2dsZScpO1xuICAgICAgICBleHBlY3QoaGlnaGxpZ2h0Q29sb3JzUGFuZWwuaXNWaXNpYmxlKCkpLnRvQmUoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaGlkZXMgYW5kIHNob3dzIHRoZSB2aWV3JywgKCkgPT4ge1xuICAgICAgLy8gVGhpcyB0ZXN0IHNob3dzIHlvdSBhbiBpbnRlZ3JhdGlvbiB0ZXN0IHRlc3RpbmcgYXQgdGhlIHZpZXcgbGV2ZWwuXG5cbiAgICAgIC8vIEF0dGFjaGluZyB0aGUgd29ya3NwYWNlRWxlbWVudCB0byB0aGUgRE9NIGlzIHJlcXVpcmVkIHRvIGFsbG93IHRoZVxuICAgICAgLy8gYHRvQmVWaXNpYmxlKClgIG1hdGNoZXJzIHRvIHdvcmsuIEFueXRoaW5nIHRlc3RpbmcgdmlzaWJpbGl0eSBvciBmb2N1c1xuICAgICAgLy8gcmVxdWlyZXMgdGhhdCB0aGUgd29ya3NwYWNlRWxlbWVudCBpcyBvbiB0aGUgRE9NLiBUZXN0cyB0aGF0IGF0dGFjaCB0aGVcbiAgICAgIC8vIHdvcmtzcGFjZUVsZW1lbnQgdG8gdGhlIERPTSBhcmUgZ2VuZXJhbGx5IHNsb3dlciB0aGFuIHRob3NlIG9mZiBET00uXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpO1xuXG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaGlnaGxpZ2h0LWNvbG9ycycpKS5ub3QudG9FeGlzdCgpO1xuXG4gICAgICAvLyBUaGlzIGlzIGFuIGFjdGl2YXRpb24gZXZlbnQsIHRyaWdnZXJpbmcgaXQgY2F1c2VzIHRoZSBwYWNrYWdlIHRvIGJlXG4gICAgICAvLyBhY3RpdmF0ZWQuXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICdoaWdobGlnaHQtY29sb3JzOnRvZ2dsZScpO1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UoKCkgPT4ge1xuICAgICAgICByZXR1cm4gYWN0aXZhdGlvblByb21pc2U7XG4gICAgICB9KTtcblxuICAgICAgcnVucygoKSA9PiB7XG4gICAgICAgIC8vIE5vdyB3ZSBjYW4gdGVzdCBmb3IgdmlldyB2aXNpYmlsaXR5XG4gICAgICAgIGxldCBoaWdobGlnaHRDb2xvcnNFbGVtZW50ID0gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuaGlnaGxpZ2h0LWNvbG9ycycpO1xuICAgICAgICBleHBlY3QoaGlnaGxpZ2h0Q29sb3JzRWxlbWVudCkudG9CZVZpc2libGUoKTtcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnaGlnaGxpZ2h0LWNvbG9yczp0b2dnbGUnKTtcbiAgICAgICAgZXhwZWN0KGhpZ2hsaWdodENvbG9yc0VsZW1lbnQpLm5vdC50b0JlVmlzaWJsZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=