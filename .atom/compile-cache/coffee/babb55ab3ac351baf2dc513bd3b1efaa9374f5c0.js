(function() {
  atom.packages.activatePackage('tree-view').then(function(tree) {
    var IS_ANCHORED_CLASSNAME, projectRoots, treeView, updateTreeViewHeaderPosition;
    IS_ANCHORED_CLASSNAME = 'is--anchored';
    treeView = tree.mainModule.treeView;
    projectRoots = treeView.roots;
    updateTreeViewHeaderPosition = function() {
      var i, len, position, project, projectClassList, projectHeaderHeight, projectHeight, projectOffsetY, ref, results, yScrollPosition;
      if (treeView.scroller) {
        position = (ref = treeView.scroller[0]) != null ? ref : treeView.scroller;
      } else {
        position = 0;
      }
      yScrollPosition = position.scrollTop;
      results = [];
      for (i = 0, len = projectRoots.length; i < len; i++) {
        project = projectRoots[i];
        projectHeaderHeight = project.header.offsetHeight;
        projectClassList = project.classList;
        projectOffsetY = project.offsetTop;
        projectHeight = project.offsetHeight;
        if (yScrollPosition > projectOffsetY) {
          if (yScrollPosition > projectOffsetY + projectHeight - projectHeaderHeight) {
            project.header.style.top = 'auto';
            results.push(projectClassList.add(IS_ANCHORED_CLASSNAME));
          } else {
            project.header.style.top = (yScrollPosition - projectOffsetY) + 'px';
            results.push(projectClassList.remove(IS_ANCHORED_CLASSNAME));
          }
        } else {
          project.header.style.top = '0';
          results.push(projectClassList.remove(IS_ANCHORED_CLASSNAME));
        }
      }
      return results;
    };
    atom.project.onDidChangePaths(function() {
      projectRoots = treeView.roots;
      return updateTreeViewHeaderPosition();
    });
    atom.config.onDidChange('seti-ui', function() {
      return setTimeout(function() {
        return updateTreeViewHeaderPosition();
      });
    });
    if (typeof treeView.scroller.on === 'function') {
      treeView.scroller.on('scroll', updateTreeViewHeaderPosition);
    } else {
      treeView.scroller.addEventListener('scroll', function() {
        return updateTreeViewHeaderPosition();
      });
    }
    return setTimeout(function() {
      return updateTreeViewHeaderPosition();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL3NldGktdWkvbGliL2hlYWRlcnMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFdBQTlCLENBQTBDLENBQUMsSUFBM0MsQ0FBZ0QsU0FBQyxJQUFEO0FBQzlDLFFBQUE7SUFBQSxxQkFBQSxHQUF3QjtJQUV4QixRQUFBLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQztJQUMzQixZQUFBLEdBQWUsUUFBUSxDQUFDO0lBRXhCLDRCQUFBLEdBQStCLFNBQUE7QUFFN0IsVUFBQTtNQUFBLElBQUcsUUFBUSxDQUFDLFFBQVo7UUFDRSxRQUFBLGdEQUFrQyxRQUFRLENBQUMsU0FEN0M7T0FBQSxNQUFBO1FBR0UsUUFBQSxHQUFXLEVBSGI7O01BS0EsZUFBQSxHQUFtQixRQUFTLENBQUM7QUFFN0I7V0FBQSw4Q0FBQTs7UUFDRSxtQkFBQSxHQUFzQixPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3JDLGdCQUFBLEdBQW1CLE9BQU8sQ0FBQztRQUMzQixjQUFBLEdBQWlCLE9BQU8sQ0FBQztRQUN6QixhQUFBLEdBQWdCLE9BQU8sQ0FBQztRQUV4QixJQUFHLGVBQUEsR0FBa0IsY0FBckI7VUFDRSxJQUFHLGVBQUEsR0FBa0IsY0FBQSxHQUFpQixhQUFqQixHQUFpQyxtQkFBdEQ7WUFDRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFyQixHQUEyQjt5QkFDM0IsZ0JBQWdCLENBQUMsR0FBakIsQ0FBcUIscUJBQXJCLEdBRkY7V0FBQSxNQUFBO1lBSUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBckIsR0FBMkIsQ0FBQyxlQUFBLEdBQWtCLGNBQW5CLENBQUEsR0FBcUM7eUJBQ2hFLGdCQUFnQixDQUFDLE1BQWpCLENBQXdCLHFCQUF4QixHQUxGO1dBREY7U0FBQSxNQUFBO1VBUUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBckIsR0FBMkI7dUJBQzNCLGdCQUFnQixDQUFDLE1BQWpCLENBQXdCLHFCQUF4QixHQVRGOztBQU5GOztJQVQ2QjtJQTBCL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBYixDQUE4QixTQUFBO01BQzVCLFlBQUEsR0FBZSxRQUFRLENBQUM7YUFDeEIsNEJBQUEsQ0FBQTtJQUY0QixDQUE5QjtJQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3QixTQUF4QixFQUFtQyxTQUFBO2FBR2pDLFVBQUEsQ0FBVyxTQUFBO2VBQUcsNEJBQUEsQ0FBQTtNQUFILENBQVg7SUFIaUMsQ0FBbkM7SUFJQSxJQUFHLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUF6QixLQUErQixVQUFsQztNQUNFLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBbEIsQ0FBcUIsUUFBckIsRUFBK0IsNEJBQS9CLEVBREY7S0FBQSxNQUFBO01BR0UsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBbEIsQ0FBbUMsUUFBbkMsRUFBNkMsU0FBQTtlQUMzQyw0QkFBQSxDQUFBO01BRDJDLENBQTdDLEVBSEY7O1dBTUEsVUFBQSxDQUFXLFNBQUE7YUFDVCw0QkFBQSxDQUFBO0lBRFMsQ0FBWDtFQTlDOEMsQ0FBaEQ7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCd0cmVlLXZpZXcnKS50aGVuICh0cmVlKSAtPlxuICBJU19BTkNIT1JFRF9DTEFTU05BTUUgPSAnaXMtLWFuY2hvcmVkJ1xuXG4gIHRyZWVWaWV3ID0gdHJlZS5tYWluTW9kdWxlLnRyZWVWaWV3XG4gIHByb2plY3RSb290cyA9IHRyZWVWaWV3LnJvb3RzXG5cbiAgdXBkYXRlVHJlZVZpZXdIZWFkZXJQb3NpdGlvbiA9IC0+XG5cbiAgICBpZiB0cmVlVmlldy5zY3JvbGxlclxuICAgICAgcG9zaXRpb24gPSB0cmVlVmlldy5zY3JvbGxlclswXSA/IHRyZWVWaWV3LnNjcm9sbGVyXG4gICAgZWxzZVxuICAgICAgcG9zaXRpb24gPSAwXG5cbiAgICB5U2Nyb2xsUG9zaXRpb24gPSAocG9zaXRpb24pLnNjcm9sbFRvcFxuXG4gICAgZm9yIHByb2plY3QgaW4gcHJvamVjdFJvb3RzXG4gICAgICBwcm9qZWN0SGVhZGVySGVpZ2h0ID0gcHJvamVjdC5oZWFkZXIub2Zmc2V0SGVpZ2h0XG4gICAgICBwcm9qZWN0Q2xhc3NMaXN0ID0gcHJvamVjdC5jbGFzc0xpc3RcbiAgICAgIHByb2plY3RPZmZzZXRZID0gcHJvamVjdC5vZmZzZXRUb3BcbiAgICAgIHByb2plY3RIZWlnaHQgPSBwcm9qZWN0Lm9mZnNldEhlaWdodFxuXG4gICAgICBpZiB5U2Nyb2xsUG9zaXRpb24gPiBwcm9qZWN0T2Zmc2V0WVxuICAgICAgICBpZiB5U2Nyb2xsUG9zaXRpb24gPiBwcm9qZWN0T2Zmc2V0WSArIHByb2plY3RIZWlnaHQgLSBwcm9qZWN0SGVhZGVySGVpZ2h0XG4gICAgICAgICAgcHJvamVjdC5oZWFkZXIuc3R5bGUudG9wID0gJ2F1dG8nXG4gICAgICAgICAgcHJvamVjdENsYXNzTGlzdC5hZGQgSVNfQU5DSE9SRURfQ0xBU1NOQU1FXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwcm9qZWN0LmhlYWRlci5zdHlsZS50b3AgPSAoeVNjcm9sbFBvc2l0aW9uIC0gcHJvamVjdE9mZnNldFkpICsgJ3B4J1xuICAgICAgICAgIHByb2plY3RDbGFzc0xpc3QucmVtb3ZlIElTX0FOQ0hPUkVEX0NMQVNTTkFNRVxuICAgICAgZWxzZVxuICAgICAgICBwcm9qZWN0LmhlYWRlci5zdHlsZS50b3AgPSAnMCdcbiAgICAgICAgcHJvamVjdENsYXNzTGlzdC5yZW1vdmUgSVNfQU5DSE9SRURfQ0xBU1NOQU1FXG5cbiAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMgLT5cbiAgICBwcm9qZWN0Um9vdHMgPSB0cmVlVmlldy5yb290c1xuICAgIHVwZGF0ZVRyZWVWaWV3SGVhZGVyUG9zaXRpb24oKVxuXG4gIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdzZXRpLXVpJywgLT5cbiAgICAjIFRPRE8gc29tZXRoaW5nIG90aGVyIHRoYW4gc2V0VGltZW91dD8gaXQncyBhIGhhY2sgdG8gdHJpZ2dlciB0aGUgdXBkYXRlXG4gICAgIyBhZnRlciB0aGUgQ1NTIGNoYW5nZXMgaGF2ZSBvY2N1cnJlZC4gYSBnYW1ibGUsIHByb2JhYmx5IGluYWNjdXJhdGVcbiAgICBzZXRUaW1lb3V0IC0+IHVwZGF0ZVRyZWVWaWV3SGVhZGVyUG9zaXRpb24oKVxuICBpZiB0eXBlb2YgdHJlZVZpZXcuc2Nyb2xsZXIub24gaXMgJ2Z1bmN0aW9uJ1xuICAgIHRyZWVWaWV3LnNjcm9sbGVyLm9uICdzY3JvbGwnLCB1cGRhdGVUcmVlVmlld0hlYWRlclBvc2l0aW9uXG4gIGVsc2VcbiAgICB0cmVlVmlldy5zY3JvbGxlci5hZGRFdmVudExpc3RlbmVyICdzY3JvbGwnLCAtPlxuICAgICAgdXBkYXRlVHJlZVZpZXdIZWFkZXJQb3NpdGlvbigpXG5cbiAgc2V0VGltZW91dCAtPiAjIFRPRE8gc29tZXRoaW5nIG90aGVyIHRoYW4gc2V0VGltZW91dD9cbiAgICB1cGRhdGVUcmVlVmlld0hlYWRlclBvc2l0aW9uKClcbiJdfQ==
