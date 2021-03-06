function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libElementsList = require('../lib/elements/list');

var _libElementsList2 = _interopRequireDefault(_libElementsList);

var _helpers = require('./helpers');

describe('Intentions list element', function () {
  it('has a complete working lifecycle', function () {
    var element = new _libElementsList2['default']();
    var suggestions = [(0, _helpers.createSuggestion)('Suggestion 1', jasmine.createSpy('suggestion.selected.0'), 'someClass', 'someIcon'), (0, _helpers.createSuggestion)('Suggestion 2', jasmine.createSpy('suggestion.selected.1')), (0, _helpers.createSuggestion)('Suggestion 3', jasmine.createSpy('suggestion.selected.2'), 'anotherClass')];

    var selected = jasmine.createSpy('suggestion.selected');
    var rendered = element.render(suggestions, selected);

    expect(rendered.refs.list.children.length).toBe(3);
    expect(rendered.refs.list.children[0].textContent).toBe('Suggestion 1');
    expect(rendered.refs.list.children[1].textContent).toBe('Suggestion 2');
    expect(rendered.refs.list.children[2].textContent).toBe('Suggestion 3');
    expect(rendered.refs.list.children[0].children[0].className).toBe('someClass icon icon-someIcon');
    expect(rendered.refs.list.children[2].children[0].className).toBe('anotherClass');
    expect(element.suggestionsIndex).toBe(-1);

    element.move('down');

    expect(element.suggestionsIndex).toBe(0);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[0].textContent);

    element.move('down');

    expect(element.suggestionsIndex).toBe(1);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[1].textContent);

    element.move('down');

    expect(element.suggestionsIndex).toBe(2);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[2].textContent);

    element.move('up');

    expect(element.suggestionsIndex).toBe(1);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[1].textContent);

    element.move('up');

    expect(element.suggestionsIndex).toBe(0);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[0].textContent);

    element.move('up');

    expect(element.suggestionsIndex).toBe(2);
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[2].textContent);

    rendered.refs.list.children[1].children[0].dispatchEvent(new MouseEvent('click', {
      bubbles: true
    }));
    expect(selected).toHaveBeenCalledWith(suggestions[1]);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvZWxlbWVudC1saXN0LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7K0JBRXdCLHNCQUFzQjs7Ozt1QkFDYixXQUFXOztBQUU1QyxRQUFRLENBQUMseUJBQXlCLEVBQUUsWUFBVztBQUM3QyxJQUFFLENBQUMsa0NBQWtDLEVBQUUsWUFBVztBQUNoRCxRQUFNLE9BQU8sR0FBRyxrQ0FBaUIsQ0FBQTtBQUNqQyxRQUFNLFdBQVcsR0FBRyxDQUNsQiwrQkFBaUIsY0FBYyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsdUJBQXVCLENBQUMsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLEVBQ3JHLCtCQUFpQixjQUFjLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEVBQzVFLCtCQUFpQixjQUFjLEVBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUM3RixDQUFBOztBQUVELFFBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUN6RCxRQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFdEQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEQsVUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdkUsVUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FB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Q0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUE7O0FBRTVHLFdBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRWxCLFVBQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDeEMsVUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFNUcsWUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxVQUFVLENBQUMsT0FBTyxFQUFFO0FBQy9FLGFBQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQyxDQUFDLENBQUE7QUFDSCxVQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDdEQsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvZWxlbWVudC1saXN0LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgTGlzdEVsZW1lbnQgZnJvbSAnLi4vbGliL2VsZW1lbnRzL2xpc3QnXG5pbXBvcnQgeyBjcmVhdGVTdWdnZXN0aW9uIH0gZnJvbSAnLi9oZWxwZXJzJ1xuXG5kZXNjcmliZSgnSW50ZW50aW9ucyBsaXN0IGVsZW1lbnQnLCBmdW5jdGlvbigpIHtcbiAgaXQoJ2hhcyBhIGNvbXBsZXRlIHdvcmtpbmcgbGlmZWN5Y2xlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IG5ldyBMaXN0RWxlbWVudCgpXG4gICAgY29uc3Qgc3VnZ2VzdGlvbnMgPSBbXG4gICAgICBjcmVhdGVTdWdnZXN0aW9uKCdTdWdnZXN0aW9uIDEnLCBqYXNtaW5lLmNyZWF0ZVNweSgnc3VnZ2VzdGlvbi5zZWxlY3RlZC4wJyksICdzb21lQ2xhc3MnLCAnc29tZUljb24nKSxcbiAgICAgIGNyZWF0ZVN1Z2dlc3Rpb24oJ1N1Z2dlc3Rpb24gMicsIGphc21pbmUuY3JlYXRlU3B5KCdzdWdnZXN0aW9uLnNlbGVjdGVkLjEnKSksXG4gICAgICBjcmVhdGVTdWdnZXN0aW9uKCdTdWdnZXN0aW9uIDMnLCBqYXNtaW5lLmNyZWF0ZVNweSgnc3VnZ2VzdGlvbi5zZWxlY3RlZC4yJyksICdhbm90aGVyQ2xhc3MnKSxcbiAgICBdXG5cbiAgICBjb25zdCBzZWxlY3RlZCA9IGphc21pbmUuY3JlYXRlU3B5KCdzdWdnZXN0aW9uLnNlbGVjdGVkJylcbiAgICBjb25zdCByZW5kZXJlZCA9IGVsZW1lbnQucmVuZGVyKHN1Z2dlc3Rpb25zLCBzZWxlY3RlZClcblxuICAgIGV4cGVjdChyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW4ubGVuZ3RoKS50b0JlKDMpXG4gICAgZXhwZWN0KHJlbmRlcmVkLnJlZnMubGlzdC5jaGlsZHJlblswXS50ZXh0Q29udGVudCkudG9CZSgnU3VnZ2VzdGlvbiAxJylcbiAgICBleHBlY3QocmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuWzFdLnRleHRDb250ZW50KS50b0JlKCdTdWdnZXN0aW9uIDInKVxuICAgIGV4cGVjdChyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMl0udGV4dENvbnRlbnQpLnRvQmUoJ1N1Z2dlc3Rpb24gMycpXG4gICAgZXhwZWN0KHJlbmRlcmVkLnJlZnMubGlzdC5jaGlsZHJlblswXS5jaGlsZHJlblswXS5jbGFzc05hbWUpLnRvQmUoJ3NvbWVDbGFzcyBpY29uIGljb24tc29tZUljb24nKVxuICAgIGV4cGVjdChyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMl0uY2hpbGRyZW5bMF0uY2xhc3NOYW1lKS50b0JlKCdhbm90aGVyQ2xhc3MnKVxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXgpLnRvQmUoLTEpXG5cbiAgICBlbGVtZW50Lm1vdmUoJ2Rvd24nKVxuXG4gICAgZXhwZWN0KGVsZW1lbnQuc3VnZ2VzdGlvbnNJbmRleCkudG9CZSgwKVxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zW2VsZW1lbnQuc3VnZ2VzdGlvbnNJbmRleF0udGl0bGUpLnRvQmUocmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuWzBdLnRleHRDb250ZW50KVxuXG4gICAgZWxlbWVudC5tb3ZlKCdkb3duJylcblxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXgpLnRvQmUoMSlcbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc1tlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXhdLnRpdGxlKS50b0JlKHJlbmRlcmVkLnJlZnMubGlzdC5jaGlsZHJlblsxXS50ZXh0Q29udGVudClcblxuICAgIGVsZW1lbnQubW92ZSgnZG93bicpXG5cbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4KS50b0JlKDIpXG4gICAgZXhwZWN0KGVsZW1lbnQuc3VnZ2VzdGlvbnNbZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4XS50aXRsZSkudG9CZShyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMl0udGV4dENvbnRlbnQpXG5cbiAgICBlbGVtZW50Lm1vdmUoJ3VwJylcblxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXgpLnRvQmUoMSlcbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc1tlbGVtZW50LnN1Z2dlc3Rpb25zSW5kZXhdLnRpdGxlKS50b0JlKHJlbmRlcmVkLnJlZnMubGlzdC5jaGlsZHJlblsxXS50ZXh0Q29udGVudClcblxuICAgIGVsZW1lbnQubW92ZSgndXAnKVxuXG4gICAgZXhwZWN0KGVsZW1lbnQuc3VnZ2VzdGlvbnNJbmRleCkudG9CZSgwKVxuICAgIGV4cGVjdChlbGVtZW50LnN1Z2dlc3Rpb25zW2VsZW1lbnQuc3VnZ2VzdGlvbnNJbmRleF0udGl0bGUpLnRvQmUocmVuZGVyZWQucmVmcy5saXN0LmNoaWxkcmVuWzBdLnRleHRDb250ZW50KVxuXG4gICAgZWxlbWVudC5tb3ZlKCd1cCcpXG5cbiAgICBleHBlY3QoZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4KS50b0JlKDIpXG4gICAgZXhwZWN0KGVsZW1lbnQuc3VnZ2VzdGlvbnNbZWxlbWVudC5zdWdnZXN0aW9uc0luZGV4XS50aXRsZSkudG9CZShyZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMl0udGV4dENvbnRlbnQpXG5cbiAgICByZW5kZXJlZC5yZWZzLmxpc3QuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF0uZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnY2xpY2snLCB7XG4gICAgICBidWJibGVzOiB0cnVlLFxuICAgIH0pKVxuICAgIGV4cGVjdChzZWxlY3RlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoc3VnZ2VzdGlvbnNbMV0pXG4gIH0pXG59KVxuIl19