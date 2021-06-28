/** @babel */
"use strict";

/**
 * @access private
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasLayer = (function () {
  function CanvasLayer() {
    _classCallCheck(this, CanvasLayer);

    /**
     * The onscreen canvas.
     * @type {HTMLCanvasElement}
     */
    this.canvas = document.createElement("canvas");

    var desynchronized = false; // TODO Electron 9 has color issues #786

    /**
     * The onscreen canvas context.
     * @type {CanvasRenderingContext2D}
     */
    this.context = this.canvas.getContext("2d", { desynchronized: desynchronized });
    this.canvas.webkitImageSmoothingEnabled = false;
    this.context.imageSmoothingEnabled = false;

    /**
     * The offscreen canvas.
     * @type {HTMLCanvasElement}
     * @access private
     */
    this.offscreenCanvas = document.createElement("canvas");
    /**
     * The offscreen canvas context.
     * @type {CanvasRenderingContext2D}
     * @access private
     */
    this.offscreenContext = this.offscreenCanvas.getContext("2d", { desynchronized: desynchronized });
    this.offscreenCanvas.webkitImageSmoothingEnabled = false;
    this.offscreenContext.imageSmoothingEnabled = false;
  }

  _createClass(CanvasLayer, [{
    key: "attach",
    value: function attach(parent) {
      if (this.canvas.parentNode) {
        return;
      }

      parent.appendChild(this.canvas);
    }
  }, {
    key: "setSize",
    value: function setSize() {
      var width = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var height = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      this.canvas.width = width;
      this.canvas.height = height;
      this.context.imageSmoothingEnabled = false;
      this.resetOffscreenSize();
    }
  }, {
    key: "getSize",
    value: function getSize() {
      return {
        width: this.canvas.width,
        height: this.canvas.height
      };
    }
  }, {
    key: "resetOffscreenSize",
    value: function resetOffscreenSize() {
      this.offscreenCanvas.width = this.canvas.width;
      this.offscreenCanvas.height = this.canvas.height;
      this.offscreenContext.imageSmoothingEnabled = false;
    }
  }, {
    key: "copyToOffscreen",
    value: function copyToOffscreen() {
      if (this.canvas.width > 0 && this.canvas.height > 0) {
        this.offscreenContext.drawImage(this.canvas, 0, 0);
      }
    }
  }, {
    key: "copyFromOffscreen",
    value: function copyFromOffscreen() {
      if (this.offscreenCanvas.width > 0 && this.offscreenCanvas.height > 0) {
        this.context.drawImage(this.offscreenCanvas, 0, 0);
      }
    }
  }, {
    key: "copyPartFromOffscreen",
    value: function copyPartFromOffscreen(srcY, destY, height) {
      if (this.offscreenCanvas.width > 0 && this.offscreenCanvas.height > 0) {
        this.context.drawImage(this.offscreenCanvas, 0, srcY, this.offscreenCanvas.width, height, 0, destY, this.offscreenCanvas.width, height);
      }
    }
  }, {
    key: "clearCanvas",
    value: function clearCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }]);

  return CanvasLayer;
})();

exports["default"] = CanvasLayer;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9jYW52YXMtbGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLFlBQVksQ0FBQTs7Ozs7Ozs7Ozs7OztJQUtTLFdBQVc7QUFDbkIsV0FEUSxXQUFXLEdBQ2hCOzBCQURLLFdBQVc7Ozs7OztBQU01QixRQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRTlDLFFBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQTs7Ozs7O0FBTTVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsY0FBYyxFQUFkLGNBQWMsRUFBRSxDQUFDLENBQUE7QUFDL0QsUUFBSSxDQUFDLE1BQU0sQ0FBQywyQkFBMkIsR0FBRyxLQUFLLENBQUE7QUFDL0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7Ozs7Ozs7QUFPMUMsUUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFBOzs7Ozs7QUFNdkQsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxFQUFFLGNBQWMsRUFBZCxjQUFjLEVBQUUsQ0FBQyxDQUFBO0FBQ2pGLFFBQUksQ0FBQyxlQUFlLENBQUMsMkJBQTJCLEdBQUcsS0FBSyxDQUFBO0FBQ3hELFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7R0FDcEQ7O2VBaENrQixXQUFXOztXQWtDeEIsZ0JBQUMsTUFBTSxFQUFFO0FBQ2IsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUMxQixlQUFNO09BQ1A7O0FBRUQsWUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDaEM7OztXQUVNLG1CQUF3QjtVQUF2QixLQUFLLHlEQUFHLENBQUM7VUFBRSxNQUFNLHlEQUFHLENBQUM7O0FBQzNCLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUN6QixVQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDM0IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUE7QUFDMUMsVUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUE7S0FDMUI7OztXQUVNLG1CQUFHO0FBQ1IsYUFBTztBQUNMLGFBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7QUFDeEIsY0FBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTtPQUMzQixDQUFBO0tBQ0Y7OztXQUVpQiw4QkFBRztBQUNuQixVQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtBQUM5QyxVQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQTtBQUNoRCxVQUFJLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFBO0tBQ3BEOzs7V0FFYywyQkFBRztBQUNoQixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDbkQsWUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtPQUNuRDtLQUNGOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3JFLFlBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO09BQ25EO0tBQ0Y7OztXQUVvQiwrQkFBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUN6QyxVQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDckUsWUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQ3BCLElBQUksQ0FBQyxlQUFlLEVBQ3BCLENBQUMsRUFDRCxJQUFJLEVBQ0osSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQzFCLE1BQU0sRUFDTixDQUFDLEVBQ0QsS0FBSyxFQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUMxQixNQUFNLENBQ1AsQ0FBQTtPQUNGO0tBQ0Y7OztXQUVVLHVCQUFHO0FBQ1osVUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3BFOzs7U0E1RmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9taW5pbWFwL2xpYi9jYW52YXMtbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cInVzZSBzdHJpY3RcIlxuXG4vKipcbiAqIEBhY2Nlc3MgcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNMYXllciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIFRoZSBvbnNjcmVlbiBjYW52YXMuXG4gICAgICogQHR5cGUge0hUTUxDYW52YXNFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKVxuXG4gICAgY29uc3QgZGVzeW5jaHJvbml6ZWQgPSBmYWxzZSAvLyBUT0RPIEVsZWN0cm9uIDkgaGFzIGNvbG9yIGlzc3VlcyAjNzg2XG5cbiAgICAvKipcbiAgICAgKiBUaGUgb25zY3JlZW4gY2FudmFzIGNvbnRleHQuXG4gICAgICogQHR5cGUge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIiwgeyBkZXN5bmNocm9uaXplZCB9KVxuICAgIHRoaXMuY2FudmFzLndlYmtpdEltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG4gICAgdGhpcy5jb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG5cbiAgICAvKipcbiAgICAgKiBUaGUgb2Zmc2NyZWVuIGNhbnZhcy5cbiAgICAgKiBAdHlwZSB7SFRNTENhbnZhc0VsZW1lbnR9XG4gICAgICogQGFjY2VzcyBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5vZmZzY3JlZW5DYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpXG4gICAgLyoqXG4gICAgICogVGhlIG9mZnNjcmVlbiBjYW52YXMgY29udGV4dC5cbiAgICAgKiBAdHlwZSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfVxuICAgICAqIEBhY2Nlc3MgcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMub2Zmc2NyZWVuQ29udGV4dCA9IHRoaXMub2Zmc2NyZWVuQ2FudmFzLmdldENvbnRleHQoXCIyZFwiLCB7IGRlc3luY2hyb25pemVkIH0pXG4gICAgdGhpcy5vZmZzY3JlZW5DYW52YXMud2Via2l0SW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcbiAgICB0aGlzLm9mZnNjcmVlbkNvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcbiAgfVxuXG4gIGF0dGFjaChwYXJlbnQpIHtcbiAgICBpZiAodGhpcy5jYW52YXMucGFyZW50Tm9kZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuY2FudmFzKVxuICB9XG5cbiAgc2V0U2l6ZSh3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpZHRoXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gaGVpZ2h0XG4gICAgdGhpcy5jb250ZXh0LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGZhbHNlXG4gICAgdGhpcy5yZXNldE9mZnNjcmVlblNpemUoKVxuICB9XG5cbiAgZ2V0U2l6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgd2lkdGg6IHRoaXMuY2FudmFzLndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmNhbnZhcy5oZWlnaHQsXG4gICAgfVxuICB9XG5cbiAgcmVzZXRPZmZzY3JlZW5TaXplKCkge1xuICAgIHRoaXMub2Zmc2NyZWVuQ2FudmFzLndpZHRoID0gdGhpcy5jYW52YXMud2lkdGhcbiAgICB0aGlzLm9mZnNjcmVlbkNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5oZWlnaHRcbiAgICB0aGlzLm9mZnNjcmVlbkNvbnRleHQuaW1hZ2VTbW9vdGhpbmdFbmFibGVkID0gZmFsc2VcbiAgfVxuXG4gIGNvcHlUb09mZnNjcmVlbigpIHtcbiAgICBpZiAodGhpcy5jYW52YXMud2lkdGggPiAwICYmIHRoaXMuY2FudmFzLmhlaWdodCA+IDApIHtcbiAgICAgIHRoaXMub2Zmc2NyZWVuQ29udGV4dC5kcmF3SW1hZ2UodGhpcy5jYW52YXMsIDAsIDApXG4gICAgfVxuICB9XG5cbiAgY29weUZyb21PZmZzY3JlZW4oKSB7XG4gICAgaWYgKHRoaXMub2Zmc2NyZWVuQ2FudmFzLndpZHRoID4gMCAmJiB0aGlzLm9mZnNjcmVlbkNhbnZhcy5oZWlnaHQgPiAwKSB7XG4gICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMub2Zmc2NyZWVuQ2FudmFzLCAwLCAwKVxuICAgIH1cbiAgfVxuXG4gIGNvcHlQYXJ0RnJvbU9mZnNjcmVlbihzcmNZLCBkZXN0WSwgaGVpZ2h0KSB7XG4gICAgaWYgKHRoaXMub2Zmc2NyZWVuQ2FudmFzLndpZHRoID4gMCAmJiB0aGlzLm9mZnNjcmVlbkNhbnZhcy5oZWlnaHQgPiAwKSB7XG4gICAgICB0aGlzLmNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICB0aGlzLm9mZnNjcmVlbkNhbnZhcyxcbiAgICAgICAgMCxcbiAgICAgICAgc3JjWSxcbiAgICAgICAgdGhpcy5vZmZzY3JlZW5DYW52YXMud2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgICAgMCxcbiAgICAgICAgZGVzdFksXG4gICAgICAgIHRoaXMub2Zmc2NyZWVuQ2FudmFzLndpZHRoLFxuICAgICAgICBoZWlnaHRcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBjbGVhckNhbnZhcygpIHtcbiAgICB0aGlzLmNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzLndpZHRoLCB0aGlzLmNhbnZhcy5oZWlnaHQpXG4gIH1cbn1cbiJdfQ==