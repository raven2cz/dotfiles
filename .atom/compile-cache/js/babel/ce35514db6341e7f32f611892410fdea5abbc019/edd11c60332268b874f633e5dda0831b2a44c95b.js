'use babel';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = toggleClassName;

function toggleClassName(className, mustAddClass) {
    var root = document.documentElement;

    if (mustAddClass) {
        root.classList.add(className);
    } else {
        root.classList.remove(className);
    }
}

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9hdG9tLW1hdGVyaWFsLXVpL2xpYi9oZWxwZXIvdG9nZ2xlLWNsYXNzLW5hbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFWSxlQUFlOztBQUF4QixTQUFTLGVBQWUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFO0FBQzdELFFBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7O0FBRXRDLFFBQUksWUFBWSxFQUFFO0FBQ2QsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDakMsTUFBTTtBQUNILFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3BDO0NBQ0oiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2F0b20tbWF0ZXJpYWwtdWkvbGliL2hlbHBlci90b2dnbGUtY2xhc3MtbmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b2dnbGVDbGFzc05hbWUoY2xhc3NOYW1lLCBtdXN0QWRkQ2xhc3MpIHtcbiAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgaWYgKG11c3RBZGRDbGFzcykge1xuICAgICAgICByb290LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9XG59XG4iXX0=