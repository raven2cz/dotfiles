'use babel';
Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PackageDepsView = (function () {
  function PackageDepsView(packageName, packageNames) {
    _classCallCheck(this, PackageDepsView);

    this.packageName = packageName;
    this.packageNames = packageNames;

    this.progress = document.createElement('progress');
    this.progress.max = packageNames.length;
    this.progress.value = 0;
    this.progress.classList.add('display-inline');
    this.progress.style.width = '100%';
  }

  _createClass(PackageDepsView, [{
    key: 'createNotification',
    value: function createNotification() {
      var _this = this;

      return new Promise(function (resolve) {
        setTimeout(function () {
          _this.notification = atom.notifications.addInfo('Installing ' + _this.packageName + ' dependencies', {
            detail: 'Installing ' + _this.packageNames.join(', '),
            dismissable: true
          });
          _this.notificationEl = atom.views.getView(_this.notification);
          _this.notificationContentEl = _this.notificationEl.querySelector('.detail-content');
          if (_this.notificationContentEl) {
            // Future-proof
            _this.notificationContentEl.appendChild(_this.progress);
          }
          resolve();
        }, 20);
      });
    }
  }, {
    key: 'markFinished',
    value: function markFinished() {
      this.progress.value++;
      if (this.progress.value === this.progress.max) {
        var titleEl = this.notificationEl.querySelector('.message p');
        if (titleEl) {
          titleEl.textContent = 'Installed ' + this.packageName + ' dependencies';
        }
        this.notificationContentEl.textContent = 'Installed ' + this.packageNames.join(', ');
        this.notificationEl.classList.remove('info');
        this.notificationEl.classList.remove('icon-info');
        this.notificationEl.classList.add('success');
        this.notificationEl.classList.add('icon-check');
      }
    }
  }]);

  return PackageDepsView;
})();

exports['default'] = PackageDepsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItbHVhLWZpbmRnbG9iYWxzL25vZGVfbW9kdWxlcy9hdG9tLXBhY2thZ2UtZGVwcy9saWIvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7OztJQUNVLGVBQWU7QUFDdkIsV0FEUSxlQUFlLENBQ3RCLFdBQVcsRUFBRSxZQUFZLEVBQUM7MEJBRG5CLGVBQWU7O0FBRWhDLFFBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFBOztBQUVoQyxRQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDbEQsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQTtBQUN2QyxRQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUE7QUFDdkIsUUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDN0MsUUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQTtHQUVuQzs7ZUFYa0IsZUFBZTs7V0FZaEIsOEJBQUc7OztBQUNuQixhQUFPLElBQUksT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQzVCLGtCQUFVLENBQUMsWUFBTTtBQUNmLGdCQUFLLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8saUJBQWUsTUFBSyxXQUFXLG9CQUFpQjtBQUM1RixrQkFBTSxFQUFFLGFBQWEsR0FBRyxNQUFLLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ3BELHVCQUFXLEVBQUUsSUFBSTtXQUNsQixDQUFDLENBQUE7QUFDRixnQkFBSyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBSyxZQUFZLENBQUMsQ0FBQTtBQUMzRCxnQkFBSyxxQkFBcUIsR0FBRyxNQUFLLGNBQWMsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUNqRixjQUFJLE1BQUsscUJBQXFCLEVBQUU7O0FBQzlCLGtCQUFLLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxNQUFLLFFBQVEsQ0FBQyxDQUFBO1dBQ3REO0FBQ0QsaUJBQU8sRUFBRSxDQUFBO1NBQ1YsRUFBRSxFQUFFLENBQUMsQ0FBQTtPQUNQLENBQUMsQ0FBQTtLQUNIOzs7V0FDVyx3QkFBRztBQUNiLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDckIsVUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtBQUM3QyxZQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUMvRCxZQUFJLE9BQU8sRUFBRTtBQUNYLGlCQUFPLENBQUMsV0FBVyxrQkFBZ0IsSUFBSSxDQUFDLFdBQVcsa0JBQWUsQ0FBQTtTQUNuRTtBQUNELFlBQUksQ0FBQyxxQkFBcUIsQ0FBQyxXQUFXLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3BGLFlBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QyxZQUFJLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDakQsWUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQzVDLFlBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtPQUNoRDtLQUNGOzs7U0F6Q2tCLGVBQWU7OztxQkFBZixlQUFlIiwiZmlsZSI6Ii9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9saW50ZXItbHVhLWZpbmRnbG9iYWxzL25vZGVfbW9kdWxlcy9hdG9tLXBhY2thZ2UtZGVwcy9saWIvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrYWdlRGVwc1ZpZXcge1xuICBjb25zdHJ1Y3RvcihwYWNrYWdlTmFtZSwgcGFja2FnZU5hbWVzKXtcbiAgICB0aGlzLnBhY2thZ2VOYW1lID0gcGFja2FnZU5hbWVcbiAgICB0aGlzLnBhY2thZ2VOYW1lcyA9IHBhY2thZ2VOYW1lc1xuXG4gICAgdGhpcy5wcm9ncmVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3Byb2dyZXNzJylcbiAgICB0aGlzLnByb2dyZXNzLm1heCA9IHBhY2thZ2VOYW1lcy5sZW5ndGhcbiAgICB0aGlzLnByb2dyZXNzLnZhbHVlID0gMFxuICAgIHRoaXMucHJvZ3Jlc3MuY2xhc3NMaXN0LmFkZCgnZGlzcGxheS1pbmxpbmUnKVxuICAgIHRoaXMucHJvZ3Jlc3Muc3R5bGUud2lkdGggPSAnMTAwJSdcblxuICB9XG4gIGNyZWF0ZU5vdGlmaWNhdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb24gPSBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhgSW5zdGFsbGluZyAke3RoaXMucGFja2FnZU5hbWV9IGRlcGVuZGVuY2llc2AsIHtcbiAgICAgICAgICBkZXRhaWw6ICdJbnN0YWxsaW5nICcgKyB0aGlzLnBhY2thZ2VOYW1lcy5qb2luKCcsICcpLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uRWwgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5ub3RpZmljYXRpb24pXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uQ29udGVudEVsID0gdGhpcy5ub3RpZmljYXRpb25FbC5xdWVyeVNlbGVjdG9yKCcuZGV0YWlsLWNvbnRlbnQnKVxuICAgICAgICBpZiAodGhpcy5ub3RpZmljYXRpb25Db250ZW50RWwpIHsgLy8gRnV0dXJlLXByb29mXG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25Db250ZW50RWwuYXBwZW5kQ2hpbGQodGhpcy5wcm9ncmVzcylcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0sIDIwKVxuICAgIH0pXG4gIH1cbiAgbWFya0ZpbmlzaGVkKCkge1xuICAgIHRoaXMucHJvZ3Jlc3MudmFsdWUrK1xuICAgIGlmICh0aGlzLnByb2dyZXNzLnZhbHVlID09PSB0aGlzLnByb2dyZXNzLm1heCkge1xuICAgICAgY29uc3QgdGl0bGVFbCA9IHRoaXMubm90aWZpY2F0aW9uRWwucXVlcnlTZWxlY3RvcignLm1lc3NhZ2UgcCcpXG4gICAgICBpZiAodGl0bGVFbCkge1xuICAgICAgICB0aXRsZUVsLnRleHRDb250ZW50ID0gYEluc3RhbGxlZCAke3RoaXMucGFja2FnZU5hbWV9IGRlcGVuZGVuY2llc2BcbiAgICAgIH1cbiAgICAgIHRoaXMubm90aWZpY2F0aW9uQ29udGVudEVsLnRleHRDb250ZW50ID0gJ0luc3RhbGxlZCAnICsgdGhpcy5wYWNrYWdlTmFtZXMuam9pbignLCAnKVxuICAgICAgdGhpcy5ub3RpZmljYXRpb25FbC5jbGFzc0xpc3QucmVtb3ZlKCdpbmZvJylcbiAgICAgIHRoaXMubm90aWZpY2F0aW9uRWwuY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi1pbmZvJylcbiAgICAgIHRoaXMubm90aWZpY2F0aW9uRWwuY2xhc3NMaXN0LmFkZCgnc3VjY2VzcycpXG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbkVsLmNsYXNzTGlzdC5hZGQoJ2ljb24tY2hlY2snKVxuICAgIH1cbiAgfVxufVxuIl19