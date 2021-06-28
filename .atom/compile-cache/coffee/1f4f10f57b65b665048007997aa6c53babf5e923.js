(function() {
  var CompositeDisposable, Gruvbox, fs, path;

  fs = require('fs');

  path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  Gruvbox = (function() {
    function Gruvbox() {}

    Gruvbox.prototype.config = require('./gruvbox-settings').config;

    Gruvbox.prototype.activate = function() {
      this.disposables = new CompositeDisposable;
      this.packageName = require('../package.json').name;
      this.disposables.add(atom.config.observe(this.packageName + ".brightness", (function(_this) {
        return function() {
          return _this.enableConfigTheme();
        };
      })(this)));
      this.disposables.add(atom.config.observe(this.packageName + ".contrast", (function(_this) {
        return function() {
          return _this.enableConfigTheme();
        };
      })(this)));
      return this.disposables.add(atom.config.observe(this.packageName + ".variant", (function(_this) {
        return function() {
          return _this.enableConfigTheme();
        };
      })(this)));
    };

    Gruvbox.prototype.deactivate = function() {
      return this.disposables.dispose();
    };

    Gruvbox.prototype.enableConfigTheme = function() {
      var brightness, contrast, variant;
      brightness = atom.config.get(this.packageName + ".brightness");
      contrast = atom.config.get(this.packageName + ".contrast");
      variant = atom.config.get(this.packageName + ".variant");
      return this.enableTheme(brightness, contrast, variant);
    };

    Gruvbox.prototype.enableTheme = function(brightness, contrast, variant) {
      var activePackage, activePackages, i, len;
      if (!this.isPreviewConfirmed) {
        if (this.isActiveTheme(brightness, contrast, variant)) {
          return;
        }
      }
      try {
        fs.writeFileSync(this.getSyntaxVariablesPath(), this.getSyntaxVariablesContent(brightness, contrast, variant));
        activePackages = atom.packages.getActivePackages();
        if (activePackages.length === 0 || this.isPreview) {
          atom.packages.getLoadedPackage("" + this.packageName).reloadStylesheets();
        } else {
          for (i = 0, len = activePackages.length; i < len; i++) {
            activePackage = activePackages[i];
            activePackage.reloadStylesheets();
          }
        }
        this.activeBrightness = brightness;
        this.activeContrast = contrast;
        return this.activeVariant = variant;
      } catch (error) {
        return this.enableDefaultTheme();
      }
    };

    Gruvbox.prototype.isActiveTheme = function(brightness, contrast, variant) {
      return brightness === this.activeBrightness && contrast === this.activeContrast && variant === this.activeVariant;
    };

    Gruvbox.prototype.getSyntaxVariablesPath = function() {
      return path.join(__dirname, "..", "styles", "syntax-variables.less");
    };

    Gruvbox.prototype.getSyntaxVariablesContent = function(brightness, contrast, variant) {
      return "@import 'schemes/" + (brightness.toLowerCase()) + "-" + (contrast.toLowerCase()) + "';\n@import 'schemes/" + (brightness.toLowerCase()) + "';\n@import 'colors';\n@import 'variants/" + (this.getNormalizedName(variant)) + "';";
    };

    Gruvbox.prototype.getNormalizedName = function(name) {
      return ("" + name).replace(/\ /g, '-').toLowerCase();
    };

    Gruvbox.prototype.enableDefaultTheme = function() {
      var brightness, contrast, variant;
      brightness = atom.config.get(this.packageName + ".brightness");
      contrast = atom.config.get(this.packageName + ".contrast");
      variant = atom.config.get(this.packageName + ".variant");
      return this.setThemeConfig(brightness, contrast, variant);
    };

    Gruvbox.prototype.setThemeConfig = function(brightness, contrast, variant) {
      atom.config.set(this.packageName + ".brightness", brightness);
      atom.config.set(this.packageName + ".contrast", contrast);
      return atom.config.set(this.packageName + ".variant", variant);
    };

    Gruvbox.prototype.isConfigTheme = function(brightness, contrast, variant) {
      var configBrightness, configContrast, configVariant;
      configBrightness = atom.config.get(this.packageName + ".brightness");
      configContrast = atom.config.get(this.packageName + ".contrast");
      configVariant = atom.config.get(this.packageName + ".variant");
      return brightness === configBrightness && contrast === configContrast && variant === configVariant;
    };

    return Gruvbox;

  })();

  module.exports = new Gruvbox;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2dydXZib3gtcGx1cy1zeW50YXgvbGliL2dydXZib3guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFbEI7OztzQkFFSixNQUFBLEdBQVEsT0FBQSxDQUFRLG9CQUFSLENBQTZCLENBQUM7O3NCQUV0QyxRQUFBLEdBQVUsU0FBQTtNQUVSLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsV0FBRCxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUEwQixDQUFDO01BQzFDLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBdUIsSUFBQyxDQUFBLFdBQUYsR0FBYyxhQUFwQyxFQUFrRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGlCQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEQsQ0FBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQXVCLElBQUMsQ0FBQSxXQUFGLEdBQWMsV0FBcEMsRUFBZ0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUFHLEtBQUMsQ0FBQSxpQkFBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhELENBQWpCO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUF1QixJQUFDLENBQUEsV0FBRixHQUFjLFVBQXBDLEVBQStDLENBQUEsU0FBQSxL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LElBQW1DLFFBQUEsS0FBWSxjQUEvQyxJQUFrRSxPQUFBLEtBQVc7SUFKaEU7Ozs7OztFQU1qQixNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFJO0FBakZyQiIsInNvdXJjZXNDb250ZW50IjpbIiMjIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vQWxjaGlhZHVzL2Jhc2UxNi1zeW50YXhcblxuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuY2xhc3MgR3J1dmJveFxuXG4gIGNvbmZpZzogcmVxdWlyZSgnLi9ncnV2Ym94LXNldHRpbmdzJykuY29uZmlnXG5cbiAgYWN0aXZhdGU6IC0+XG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBwYWNrYWdlTmFtZSA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLm5hbWVcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgXCIje0BwYWNrYWdlTmFtZX0uYnJpZ2h0bmVzc1wiLCA9PiBAZW5hYmxlQ29uZmlnVGhlbWUoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBcIiN7QHBhY2thZ2VOYW1lfS5jb250cmFzdFwiLCA9PiBAZW5hYmxlQ29uZmlnVGhlbWUoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBcIiN7QHBhY2thZ2VOYW1lfS52YXJpYW50XCIsID0+IEBlbmFibGVDb25maWdUaGVtZSgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgZW5hYmxlQ29uZmlnVGhlbWU6IC0+XG4gICAgYnJpZ2h0bmVzcyA9IGF0b20uY29uZmlnLmdldCBcIiN7QHBhY2thZ2VOYW1lfS5icmlnaHRuZXNzXCJcbiAgICBjb250cmFzdCA9IGF0b20uY29uZmlnLmdldCBcIiN7QHBhY2thZ2VOYW1lfS5jb250cmFzdFwiXG4gICAgdmFyaWFudCA9IGF0b20uY29uZmlnLmdldCBcIiN7QHBhY2thZ2VOYW1lfS52YXJpYW50XCJcbiAgICBAZW5hYmxlVGhlbWUgYnJpZ2h0bmVzcywgY29udHJhc3QsIHZhcmlhbnRcblxuICBlbmFibGVUaGVtZTogKGJyaWdodG5lc3MsIGNvbnRyYXN0LCB2YXJpYW50KSAtPlxuICAgICMgTm8gbmVlZCB0byBlbmFibGUgdGhlIHRoZW1lIGlmIGl0IGlzIGFscmVhZHkgYWN0aXZlLlxuICAgIHJldHVybiBpZiBAaXNBY3RpdmVUaGVtZSBicmlnaHRuZXNzLCBjb250cmFzdCwgdmFyaWFudCB1bmxlc3MgQGlzUHJldmlld0NvbmZpcm1lZFxuICAgIHRyeVxuICAgICAgIyBXcml0ZSB0aGUgcmVxdWVzdGVkIHRoZW1lIHRvIHRoZSBgc3ludGF4LXZhcmlhYmxlc2AgZmlsZS5cbiAgICAgIGZzLndyaXRlRmlsZVN5bmMgQGdldFN5bnRheFZhcmlhYmxlc1BhdGgoKSwgQGdldFN5bnRheFZhcmlhYmxlc0NvbnRlbnQoYnJpZ2h0bmVzcywgY29udHJhc3QsIHZhcmlhbnQpXG4gICAgICBhY3RpdmVQYWNrYWdlcyA9IGF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZXMoKVxuICAgICAgaWYgYWN0aXZlUGFja2FnZXMubGVuZ3RoIGlzIDAgb3IgQGlzUHJldmlld1xuICAgICAgICAjIFJlbG9hZCBvd24gc3R5bGVzaGVldHMgdG8gYXBwbHkgdGhlIHJlcXVlc3RlZCB0aGVtZS5cbiAgICAgICAgYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKFwiI3tAcGFja2FnZU5hbWV9XCIpLnJlbG9hZFN0eWxlc2hlZXRzKClcbiAgICAgIGVsc2VcbiAgICAgICAgIyBSZWxvYWQgdGhlIHN0eWxlc2hlZXRzIG9mIGFsbCBwYWNrYWdlcyB0byBhcHBseSB0aGUgcmVxdWVzdGVkIHRoZW1lLlxuICAgICAgICBhY3RpdmVQYWNrYWdlLnJlbG9hZFN0eWxlc2hlZXRzKCkgZm9yIGFjdGl2ZVBhY2thZ2UgaW4gYWN0aXZlUGFja2FnZXNcbiAgICAgIEBhY3RpdmVCcmlnaHRuZXNzID0gYnJpZ2h0bmVzc1xuICAgICAgQGFjdGl2ZUNvbnRyYXN0ID0gY29udHJhc3RcbiAgICAgIEBhY3RpdmVWYXJpYW50ID0gdmFyaWFudFxuICAgIGNhdGNoXG4gICAgICAjIElmIHVuc3VjY2Vzc2Z1bGwgZW5hYmxlIHRoZSBkZWZhdWx0IHRoZW1lLlxuICAgICAgQGVuYWJsZURlZmF1bHRUaGVtZSgpXG5cbiAgaXNBY3RpdmVUaGVtZTogKGJyaWdodG5lc3MsIGNvbnRyYXN0LCB2YXJpYW50KSAtPlxuICAgIGJyaWdodG5lc3MgaXMgQGFjdGl2ZUJyaWdodG5lc3MgYW5kIGNvbnRyYXN0IGlzIEBhY3RpdmVDb250cmFzdCBhbmQgdmFyaWFudCBpcyBAYWN0aXZlVmFyaWFudFxuXG4gIGdldFN5bnRheFZhcmlhYmxlc1BhdGg6IC0+XG4gICAgcGF0aC5qb2luIF9fZGlybmFtZSwgXCIuLlwiLCBcInN0eWxlc1wiLCBcInN5bnRheC12YXJpYWJsZXMubGVzc1wiXG5cbiAgZ2V0U3ludGF4VmFyaWFibGVzQ29udGVudDogKGJyaWdodG5lc3MsIGNvbnRyYXN0LCB2YXJpYW50KSAtPlxuICAgIFwiXCJcIlxuICAgIEBpbXBvcnQgJ3NjaGVtZXMvI3ticmlnaHRuZXNzLnRvTG93ZXJDYXNlKCl9LSN7Y29udHJhc3QudG9Mb3dlckNhc2UoKX0nO1xuICAgIEBpbXBvcnQgJ3NjaGVtZXMvI3ticmlnaHRuZXNzLnRvTG93ZXJDYXNlKCl9JztcbiAgICBAaW1wb3J0ICdjb2xvcnMnO1xuICAgIEBpbXBvcnQgJ3ZhcmlhbnRzLyN7QGdldE5vcm1hbGl6ZWROYW1lKHZhcmlhbnQpfSc7XG4gICAgXCJcIlwiXG5cbiAgZ2V0Tm9ybWFsaXplZE5hbWU6IChuYW1lKSAtPlxuICAgIFwiI3tuYW1lfVwiXG4gICAgICAucmVwbGFjZSAvXFwgL2csICctJ1xuICAgICAgLnRvTG93ZXJDYXNlKClcblxuICBlbmFibGVEZWZhdWx0VGhlbWU6IC0+XG4gICAgYnJpZ2h0bmVzcyA9IGF0b20uY29uZmlnLmdldCBcIiN7QHBhY2thZ2VOYW1lfS5icmlnaHRuZXNzXCJcbiAgICBjb250cmFzdCA9IGF0b20uY29uZmlnLmdldCBcIiN7QHBhY2thZ2VOYW1lfS5jb250cmFzdFwiXG4gICAgdmFyaWFudCA9IGF0b20uY29uZmlnLmdldCBcIiN7QHBhY2thZ2VOYW1lfS52YXJpYW50XCJcbiAgICBAc2V0VGhlbWVDb25maWcgYnJpZ2h0bmVzcywgY29udHJhc3QsIHZhcmlhbnRcblxuICBzZXRUaGVtZUNvbmZpZzogKGJyaWdodG5lc3MsIGNvbnRyYXN0LCB2YXJpYW50KSAtPlxuICAgIGF0b20uY29uZmlnLnNldCBcIiN7QHBhY2thZ2VOYW1lfS5icmlnaHRuZXNzXCIsIGJyaWdodG5lc3NcbiAgICBhdG9tLmNvbmZpZy5zZXQgXCIje0BwYWNrYWdlTmFtZX0uY29udHJhc3RcIiwgY29udHJhc3RcbiAgICBhdG9tLmNvbmZpZy5zZXQgXCIje0BwYWNrYWdlTmFtZX0udmFyaWFudFwiLCB2YXJpYW50XG5cbiAgaXNDb25maWdUaGVtZTogKGJyaWdodG5lc3MsIGNvbnRyYXN0LCB2YXJpYW50KSAtPlxuICAgIGNvbmZpZ0JyaWdodG5lc3MgPSBhdG9tLmNvbmZpZy5nZXQgXCIje0BwYWNrYWdlTmFtZX0uYnJpZ2h0bmVzc1wiXG4gICAgY29uZmlnQ29udHJhc3QgPSBhdG9tLmNvbmZpZy5nZXQgXCIje0BwYWNrYWdlTmFtZX0uY29udHJhc3RcIlxuICAgIGNvbmZpZ1ZhcmlhbnQgPSBhdG9tLmNvbmZpZy5nZXQgXCIje0BwYWNrYWdlTmFtZX0udmFyaWFudFwiXG4gICAgYnJpZ2h0bmVzcyBpcyBjb25maWdCcmlnaHRuZXNzIGFuZCBjb250cmFzdCBpcyBjb25maWdDb250cmFzdCBhbmQgdmFyaWFudCBpcyBjb25maWdWYXJpYW50XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEdydXZib3hcbiJdfQ==
