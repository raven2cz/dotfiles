Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MESSAGE_IDLE = "Idle";

function elementWithText(text) {
  var tag = arguments.length <= 1 || arguments[1] === undefined ? "div" : arguments[1];

  var el = document.createElement(tag);
  el.textContent = text;
  return el;
}

var SignalElement = (function (_HTMLElement) {
  _inherits(SignalElement, _HTMLElement);

  function SignalElement() {
    _classCallCheck(this, SignalElement);

    _get(Object.getPrototypeOf(SignalElement.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(SignalElement, [{
    key: "createdCallback",
    value: function createdCallback() {
      this.update([], []);
      this.classList.add("inline-block");
    }
  }, {
    key: "update",
    value: function update(titles, history) {
      this.setBusy(!!titles.length);

      var el = document.createElement("div");
      el.style.textAlign = "left";

      if (history.length) {
        el.append.apply(el, [elementWithText("History:", "strong")].concat(_toConsumableArray(history.map(function (item) {
          return elementWithText(item.title + " (" + item.duration + ")");
        }))));
      }
      if (titles.length) {
        el.append.apply(el, [elementWithText("Current:", "strong")].concat(_toConsumableArray(titles.map(function (item) {
          var e = elementWithText(item.title);
          if (item.options) {
            e.onclick = item.options.onDidClick;
          }
          return e;
        }))));
      }

      if (!el.childElementCount) {
        el.textContent = MESSAGE_IDLE;
      }

      this.setTooltip(el);
    }
  }, {
    key: "setBusy",
    value: function setBusy(busy) {
      var _this = this;

      if (busy) {
        this.classList.add("busy");
        this.classList.remove("idle");
        this.activatedLast = Date.now();
        if (this.deactivateTimer) {
          clearTimeout(this.deactivateTimer);
        }
      } else {
        // The logic below makes sure that busy signal is shown for at least 1 second
        var timeNow = Date.now();
        var timeThen = this.activatedLast || 0;
        var timeDifference = timeNow - timeThen;
        if (timeDifference < 1000) {
          this.deactivateTimer = setTimeout(function () {
            return _this.setBusy(false);
          }, timeDifference + 100);
        } else {
          this.classList.add("idle");
          this.classList.remove("busy");
        }
      }
    }
  }, {
    key: "setTooltip",
    value: function setTooltip(item) {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      this.tooltip = atom.tooltips.add(this, { item: item });
    }
  }, {
    key: "dispose",
    value: function dispose() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
    }
  }]);

  return SignalElement;
})(HTMLElement);

exports.SignalElement = SignalElement;

var element = document.registerElement("busy-signal", {
  prototype: SignalElement.prototype
});

exports["default"] = element;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUlBLElBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQzs7QUFFNUIsU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFlO01BQWIsR0FBRyx5REFBRyxLQUFLOztBQUN4QyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZDLElBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFNBQU8sRUFBRSxDQUFDO0NBQ1g7O0lBRVksYUFBYTtZQUFiLGFBQWE7O1dBQWIsYUFBYTswQkFBYixhQUFhOzsrQkFBYixhQUFhOzs7ZUFBYixhQUFhOztXQUtULDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3BCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ3BDOzs7V0FDSyxnQkFDSixNQUE2QixFQUM3QixPQUFtRCxFQUNuRDtBQUNBLFVBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFOUIsVUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN6QyxRQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7O0FBRTVCLFVBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixVQUFFLENBQUMsTUFBTSxNQUFBLENBQVQsRUFBRSxHQUNBLGVBQWUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLDRCQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtpQkFDakIsZUFBZSxDQUFJLElBQUksQ0FBQyxLQUFLLFVBQUssSUFBSSxDQUFDLFFBQVEsT0FBSTtTQUFBLENBQ3BELEdBQ0YsQ0FBQztPQUNIO0FBQ0QsVUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQ2pCLFVBQUUsQ0FBQyxNQUFNLE1BQUEsQ0FBVCxFQUFFLEdBQ0EsZUFBZSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsNEJBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDcEIsY0FBTSxDQUFDLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QyxjQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsYUFBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztXQUNyQztBQUNELGlCQUFPLENBQUMsQ0FBQztTQUNWLENBQUMsR0FDSCxDQUFDO09BQ0g7O0FBRUQsVUFBSSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRTtBQUN6QixVQUFFLENBQUMsV0FBVyxHQUFHLFlBQVksQ0FBQztPQUMvQjs7QUFFRCxVQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3JCOzs7V0FDTSxpQkFBQyxJQUFhLEVBQUU7OztBQUNyQixVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLFlBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLFlBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtBQUN4QixzQkFBWSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUNwQztPQUNGLE1BQU07O0FBRUwsWUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzNCLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFlBQU0sY0FBYyxHQUFHLE9BQU8sR0FBRyxRQUFRLENBQUM7QUFDMUMsWUFBSSxjQUFjLEdBQUcsSUFBSSxFQUFFO0FBQ3pCLGNBQUksQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUMvQjttQkFBTSxNQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUM7V0FBQSxFQUN6QixjQUFjLEdBQUcsR0FBRyxDQUNyQixDQUFDO1NBQ0gsTUFBTTtBQUNMLGNBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLGNBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO09BQ0Y7S0FDRjs7O1dBQ1Msb0JBQUMsSUFBaUIsRUFBRTtBQUM1QixVQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN4QjtBQUNELFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxDQUFDLENBQUM7S0FDbEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDeEI7S0FDRjs7O1NBL0VVLGFBQWE7R0FBUyxXQUFXOzs7O0FBa0Y5QyxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRTtBQUN0RCxXQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7Q0FDbkMsQ0FBQyxDQUFDOztxQkFFWSxPQUFPIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvZWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB0eXBlIHsgU2lnbmFsSW50ZXJuYWwgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5jb25zdCBNRVNTQUdFX0lETEUgPSBcIklkbGVcIjtcblxuZnVuY3Rpb24gZWxlbWVudFdpdGhUZXh0KHRleHQsIHRhZyA9IFwiZGl2XCIpIHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGVsLnRleHRDb250ZW50ID0gdGV4dDtcbiAgcmV0dXJuIGVsO1xufVxuXG5leHBvcnQgY2xhc3MgU2lnbmFsRWxlbWVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgdG9vbHRpcDogP0lEaXNwb3NhYmxlO1xuICBhY3RpdmF0ZWRMYXN0OiA/bnVtYmVyO1xuICBkZWFjdGl2YXRlVGltZXI6ID9UaW1lb3V0SUQ7XG5cbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMudXBkYXRlKFtdLCBbXSk7XG4gICAgdGhpcy5jbGFzc0xpc3QuYWRkKFwiaW5saW5lLWJsb2NrXCIpO1xuICB9XG4gIHVwZGF0ZShcbiAgICB0aXRsZXM6IEFycmF5PFNpZ25hbEludGVybmFsPixcbiAgICBoaXN0b3J5OiBBcnJheTx7IHRpdGxlOiBzdHJpbmcsIGR1cmF0aW9uOiBzdHJpbmcgfT5cbiAgKSB7XG4gICAgdGhpcy5zZXRCdXN5KCEhdGl0bGVzLmxlbmd0aCk7XG5cbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZWwuc3R5bGUudGV4dEFsaWduID0gXCJsZWZ0XCI7XG5cbiAgICBpZiAoaGlzdG9yeS5sZW5ndGgpIHtcbiAgICAgIGVsLmFwcGVuZChcbiAgICAgICAgZWxlbWVudFdpdGhUZXh0KFwiSGlzdG9yeTpcIiwgXCJzdHJvbmdcIiksXG4gICAgICAgIC4uLmhpc3RvcnkubWFwKGl0ZW0gPT5cbiAgICAgICAgICBlbGVtZW50V2l0aFRleHQoYCR7aXRlbS50aXRsZX0gKCR7aXRlbS5kdXJhdGlvbn0pYClcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKHRpdGxlcy5sZW5ndGgpIHtcbiAgICAgIGVsLmFwcGVuZChcbiAgICAgICAgZWxlbWVudFdpdGhUZXh0KFwiQ3VycmVudDpcIiwgXCJzdHJvbmdcIiksXG4gICAgICAgIC4uLnRpdGxlcy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgY29uc3QgZSA9IGVsZW1lbnRXaXRoVGV4dChpdGVtLnRpdGxlKTtcbiAgICAgICAgICBpZiAoaXRlbS5vcHRpb25zKSB7XG4gICAgICAgICAgICBlLm9uY2xpY2sgPSBpdGVtLm9wdGlvbnMub25EaWRDbGljaztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGU7XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghZWwuY2hpbGRFbGVtZW50Q291bnQpIHtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gTUVTU0FHRV9JRExFO1xuICAgIH1cblxuICAgIHRoaXMuc2V0VG9vbHRpcChlbCk7XG4gIH1cbiAgc2V0QnVzeShidXN5OiBib29sZWFuKSB7XG4gICAgaWYgKGJ1c3kpIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZChcImJ1c3lcIik7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJpZGxlXCIpO1xuICAgICAgdGhpcy5hY3RpdmF0ZWRMYXN0ID0gRGF0ZS5ub3coKTtcbiAgICAgIGlmICh0aGlzLmRlYWN0aXZhdGVUaW1lcikge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5kZWFjdGl2YXRlVGltZXIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgbG9naWMgYmVsb3cgbWFrZXMgc3VyZSB0aGF0IGJ1c3kgc2lnbmFsIGlzIHNob3duIGZvciBhdCBsZWFzdCAxIHNlY29uZFxuICAgICAgY29uc3QgdGltZU5vdyA9IERhdGUubm93KCk7XG4gICAgICBjb25zdCB0aW1lVGhlbiA9IHRoaXMuYWN0aXZhdGVkTGFzdCB8fCAwO1xuICAgICAgY29uc3QgdGltZURpZmZlcmVuY2UgPSB0aW1lTm93IC0gdGltZVRoZW47XG4gICAgICBpZiAodGltZURpZmZlcmVuY2UgPCAxMDAwKSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZVRpbWVyID0gc2V0VGltZW91dChcbiAgICAgICAgICAoKSA9PiB0aGlzLnNldEJ1c3koZmFsc2UpLFxuICAgICAgICAgIHRpbWVEaWZmZXJlbmNlICsgMTAwXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoXCJpZGxlXCIpO1xuICAgICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoXCJidXN5XCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBzZXRUb29sdGlwKGl0ZW06IEhUTUxFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKTtcbiAgICB9XG4gICAgdGhpcy50b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGhpcywgeyBpdGVtIH0pO1xuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImJ1c3ktc2lnbmFsXCIsIHtcbiAgcHJvdG90eXBlOiBTaWduYWxFbGVtZW50LnByb3RvdHlwZVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGVsZW1lbnQ7XG4iXX0=