Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createSuggestion = createSuggestion;
exports.getKeyboardEvent = getKeyboardEvent;

var _libHelpers = require('../lib/helpers');

'use babel';

function createSuggestion(text, selected) {
  var className = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  var icon = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];
  var process = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

  var suggestion = {
    icon: icon,
    title: text,
    'class': className,
    priority: 100,
    selected: selected
  };
  if (process) {
    return (0, _libHelpers.processListItems)([suggestion])[0];
  }
  return suggestion;
}

function getKeyboardEvent() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? 'keydown' : arguments[0];
  var code = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  var event = new KeyboardEvent(name);
  Object.defineProperty(event, 'keyCode', {
    value: code
  });
  return event;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7MEJBRWlDLGdCQUFnQjs7QUFGakQsV0FBVyxDQUFBOztBQUlKLFNBQVMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBNkM7TUFBM0MsU0FBUyx5REFBRyxFQUFFO01BQUUsSUFBSSx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxJQUFJOztBQUN4RixNQUFNLFVBQVUsR0FBRztBQUNqQixRQUFJLEVBQUosSUFBSTtBQUNKLFNBQUssRUFBRSxJQUFJO0FBQ1gsYUFBTyxTQUFTO0FBQ2hCLFlBQVEsRUFBRSxHQUFHO0FBQ2IsWUFBUSxFQUFSLFFBQVE7R0FDVCxDQUFBO0FBQ0QsTUFBSSxPQUFPLEVBQUU7QUFDWCxXQUFPLGtDQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDekM7QUFDRCxTQUFPLFVBQVUsQ0FBQTtDQUNsQjs7QUFFTSxTQUFTLGdCQUFnQixHQUE0QztNQUEzQyxJQUFJLHlEQUFHLFNBQVM7TUFBRSxJQUFJLHlEQUFHLENBQUM7O0FBQ3pELE1BQU0sS0FBSyxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3JDLFFBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtBQUN0QyxTQUFLLEVBQUUsSUFBSTtHQUNaLENBQUMsQ0FBQTtBQUNGLFNBQU8sS0FBSyxDQUFBO0NBQ2IiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvc3BlYy9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHsgcHJvY2Vzc0xpc3RJdGVtcyB9IGZyb20gJy4uL2xpYi9oZWxwZXJzJ1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3VnZ2VzdGlvbih0ZXh0LCBzZWxlY3RlZCwgY2xhc3NOYW1lID0gJycsIGljb24gPSAnJywgcHJvY2VzcyA9IHRydWUpIHtcbiAgY29uc3Qgc3VnZ2VzdGlvbiA9IHtcbiAgICBpY29uLFxuICAgIHRpdGxlOiB0ZXh0LFxuICAgIGNsYXNzOiBjbGFzc05hbWUsXG4gICAgcHJpb3JpdHk6IDEwMCxcbiAgICBzZWxlY3RlZCxcbiAgfVxuICBpZiAocHJvY2Vzcykge1xuICAgIHJldHVybiBwcm9jZXNzTGlzdEl0ZW1zKFtzdWdnZXN0aW9uXSlbMF1cbiAgfVxuICByZXR1cm4gc3VnZ2VzdGlvblxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0S2V5Ym9hcmRFdmVudChuYW1lID0gJ2tleWRvd24nLCBjb2RlID0gMCk6IEtleWJvYXJkRXZlbnQge1xuICBjb25zdCBldmVudCA9IG5ldyBLZXlib2FyZEV2ZW50KG5hbWUpXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShldmVudCwgJ2tleUNvZGUnLCB7XG4gICAgdmFsdWU6IGNvZGUsXG4gIH0pXG4gIHJldHVybiBldmVudFxufVxuIl19