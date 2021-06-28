Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

exports['default'] = {
  activate: function activate() {
    this.intentions = new _main2['default']();
    this.intentions.activate();
  },
  deactivate: function deactivate() {
    this.intentions.dispose();
  },
  consumeListIntentions: function consumeListIntentions(provider) {
    var _this = this;

    var providers = [].concat(provider);
    providers.forEach(function (entry) {
      _this.intentions.consumeListProvider(entry);
    });
    return new _atom.Disposable(function () {
      providers.forEach(function (entry) {
        _this.intentions.deleteListProvider(entry);
      });
    });
  },
  consumeHighlightIntentions: function consumeHighlightIntentions(provider) {
    var _this2 = this;

    var providers = [].concat(provider);
    providers.forEach(function (entry) {
      _this2.intentions.consumeHighlightProvider(entry);
    });
    return new _atom.Disposable(function () {
      providers.forEach(function (entry) {
        _this2.intentions.deleteHighlightProvider(entry);
      });
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRTJCLE1BQU07O29CQUNWLFFBQVE7Ozs7cUJBR2hCO0FBQ2IsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsUUFBSSxDQUFDLFVBQVUsR0FBRyx1QkFBZ0IsQ0FBQTtBQUNsQyxRQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFBO0dBQzNCO0FBQ0QsWUFBVSxFQUFBLHNCQUFHO0FBQ1gsUUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUMxQjtBQUNELHVCQUFxQixFQUFBLCtCQUFDLFFBQTRDLEVBQUU7OztBQUNsRSxRQUFNLFNBQVMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLGFBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDM0IsWUFBSyxVQUFVLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDM0MsQ0FBQyxDQUFBO0FBQ0YsV0FBTyxxQkFBZSxZQUFNO0FBQzFCLGVBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDM0IsY0FBSyxVQUFVLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDMUMsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0g7QUFDRCw0QkFBMEIsRUFBQSxvQ0FBQyxRQUFzRCxFQUFFOzs7QUFDakYsUUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxhQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzNCLGFBQUssVUFBVSxDQUFDLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ2hELENBQUMsQ0FBQTtBQUNGLFdBQU8scUJBQWUsWUFBTTtBQUMxQixlQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzNCLGVBQUssVUFBVSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFBO09BQy9DLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTtHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgSW50ZW50aW9ucyBmcm9tICcuL21haW4nXG5pbXBvcnQgdHlwZSB7IExpc3RQcm92aWRlciwgSGlnaGxpZ2h0UHJvdmlkZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuaW50ZW50aW9ucyA9IG5ldyBJbnRlbnRpb25zKClcbiAgICB0aGlzLmludGVudGlvbnMuYWN0aXZhdGUoKVxuICB9LFxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuaW50ZW50aW9ucy5kaXNwb3NlKClcbiAgfSxcbiAgY29uc3VtZUxpc3RJbnRlbnRpb25zKHByb3ZpZGVyOiBMaXN0UHJvdmlkZXIgfCBBcnJheTxMaXN0UHJvdmlkZXI+KSB7XG4gICAgY29uc3QgcHJvdmlkZXJzID0gW10uY29uY2F0KHByb3ZpZGVyKVxuICAgIHByb3ZpZGVycy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgdGhpcy5pbnRlbnRpb25zLmNvbnN1bWVMaXN0UHJvdmlkZXIoZW50cnkpXG4gICAgfSlcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgcHJvdmlkZXJzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIHRoaXMuaW50ZW50aW9ucy5kZWxldGVMaXN0UHJvdmlkZXIoZW50cnkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG4gIGNvbnN1bWVIaWdobGlnaHRJbnRlbnRpb25zKHByb3ZpZGVyOiBIaWdobGlnaHRQcm92aWRlciB8IEFycmF5PEhpZ2hsaWdodFByb3ZpZGVyPikge1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IFtdLmNvbmNhdChwcm92aWRlcilcbiAgICBwcm92aWRlcnMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIHRoaXMuaW50ZW50aW9ucy5jb25zdW1lSGlnaGxpZ2h0UHJvdmlkZXIoZW50cnkpXG4gICAgfSlcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgcHJvdmlkZXJzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgIHRoaXMuaW50ZW50aW9ucy5kZWxldGVIaWdobGlnaHRQcm92aWRlcihlbnRyeSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSxcbn1cbiJdfQ==