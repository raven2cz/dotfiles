Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getMessage = getMessage;
exports.getLinter = getLinter;
exports.dispatchCommand = dispatchCommand;

function getMessage(type, filePath, range) {
  if (type === undefined) type = 'Error';

  var message = {
    version: 2,
    severity: type.toLowerCase(),
    excerpt: String(Math.random()),
    location: { file: filePath, position: range }
  };

  return message;
}

function getLinter() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? 'some' : arguments[0];

  return {
    name: name,
    grammarScopes: [],
    lint: function lint() {
      /* no operation */
    }
  };
}

function dispatchCommand(target, commandName) {
  atom.commands.dispatch(atom.views.getView(target), commandName);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9zcGVjL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVPLFNBQVMsVUFBVSxDQUFDLElBQWEsRUFBWSxRQUFpQixFQUFFLEtBQWMsRUFBVTtNQUFwRSxJQUFhLGdCQUFiLElBQWEsR0FBRyxPQUFPOztBQUNoRCxNQUFNLE9BQWUsR0FBRztBQUN0QixXQUFPLEVBQUUsQ0FBQztBQUNWLFlBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQzVCLFdBQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQzlCLFlBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTtHQUM5QyxDQUFBOztBQUVELFNBQU8sT0FBTyxDQUFBO0NBQ2Y7O0FBRU0sU0FBUyxTQUFTLEdBQWlDO01BQWhDLElBQWEseURBQUcsTUFBTTs7QUFDOUMsU0FBTztBQUNMLFFBQUksRUFBSixJQUFJO0FBQ0osaUJBQWEsRUFBRSxFQUFFO0FBQ2pCLFFBQUksRUFBQSxnQkFBRzs7S0FFTjtHQUNGLENBQUE7Q0FDRjs7QUFFTSxTQUFTLGVBQWUsQ0FBQyxNQUFjLEVBQUUsV0FBbUIsRUFBRTtBQUNuRSxNQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQTtDQUNoRSIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvc3BlYy9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1lc3NhZ2UodHlwZTogP3N0cmluZyA9ICdFcnJvcicsIGZpbGVQYXRoOiA/c3RyaW5nLCByYW5nZTogP09iamVjdCk6IE9iamVjdCB7XG4gIGNvbnN0IG1lc3NhZ2U6IE9iamVjdCA9IHtcbiAgICB2ZXJzaW9uOiAyLFxuICAgIHNldmVyaXR5OiB0eXBlLnRvTG93ZXJDYXNlKCksXG4gICAgZXhjZXJwdDogU3RyaW5nKE1hdGgucmFuZG9tKCkpLFxuICAgIGxvY2F0aW9uOiB7IGZpbGU6IGZpbGVQYXRoLCBwb3NpdGlvbjogcmFuZ2UgfSxcbiAgfVxuXG4gIHJldHVybiBtZXNzYWdlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaW50ZXIobmFtZTogP3N0cmluZyA9ICdzb21lJyk6IE9iamVjdCB7XG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBncmFtbWFyU2NvcGVzOiBbXSxcbiAgICBsaW50KCkge1xuICAgICAgLyogbm8gb3BlcmF0aW9uICovXG4gICAgfSxcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hDb21tYW5kKHRhcmdldDogT2JqZWN0LCBjb21tYW5kTmFtZTogc3RyaW5nKSB7XG4gIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KHRhcmdldCksIGNvbW1hbmROYW1lKVxufVxuIl19