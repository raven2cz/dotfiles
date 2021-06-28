(function() {
  module.exports = function() {
    return {
      Parent: null,
      SmartColor: (require('./modules/SmartColor'))(),
      SmartVariable: (require('./modules/SmartVariable'))(),
      Emitter: (require('./modules/Emitter'))(),
      extensions: {},
      getExtension: function(extensionName) {
        return this.extensions[extensionName];
      },
      isFirstOpen: true,
      canOpen: true,
      element: null,
      selection: null,
      listeners: [],
      activate: function() {
        var _workspace, _workspaceView, onMouseDown, onMouseMove, onMouseUp, onMouseWheel, onResize;
        _workspace = atom.workspace;
        _workspaceView = atom.views.getView(_workspace);
        this.element = {
          el: (function() {
            var _el;
            _el = document.createElement('div');
            _el.classList.add('ColorPicker');
            return _el;
          })(),
          remove: function() {
            return this.el.parentNode.removeChild(this.el);
          },
          addClass: function(className) {
            this.el.classList.add(className);
            return this;
          },
          removeClass: function(className) {
            this.el.classList.remove(className);
            return this;
          },
          hasClass: function(className) {
            return this.el.classList.contains(className);
          },
          width: function() {
            return this.el.offsetWidth;
          },
          height: function() {
            return this.el.offsetHeight;
          },
          setHeight: function(height) {
            return this.el.style.height = height + "px";
          },
          hasChild: function(child) {
            var _parent;
            if (child && (_parent = child.parentNode)) {
              if (child === this.el) {
                return true;
              } else {
                return this.hasChild(_parent);
              }
            }
            return false;
          },
          isOpen: function() {
            return this.hasClass('is--open');
          },
          open: function() {
            return this.addClass('is--open');
          },
          close: function() {
            return this.removeClass('is--open');
          },
          isFlipped: function() {
            return this.hasClass('is--flipped');
          },
          flip: function() {
            return this.addClass('is--flipped');
          },
          unflip: function() {
            return this.removeClass('is--flipped');
          },
          setPosition: function(x, y) {
            this.el.style.left = x + "px";
            this.el.style.top = y + "px";
            return this;
          },
          add: function(element) {
            this.el.appendChild(element);
            return this;
          }
        };
        this.loadExtensions();
        this.listeners.push([
          'mousedown', onMouseDown = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              _this.emitMouseDown(e, _isPickerEvent);
              if (!_isPickerEvent) {
                return _this.close();
              }
            };
          })(this)
        ]);
        window.addEventListener('mousedown', onMouseDown, true);
        this.listeners.push([
          'mousemove', onMouseMove = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseMove(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousemove', onMouseMove, true);
        this.listeners.push([
          'mouseup', onMouseUp = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseUp(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mouseup', onMouseUp, true);
        this.listeners.push([
          'mousewheel', onMouseWheel = (function(_this) {
            return function(e) {
              var _isPickerEvent;
              if (!_this.element.isOpen()) {
                return;
              }
              _isPickerEvent = _this.element.hasChild(e.target);
              return _this.emitMouseWheel(e, _isPickerEvent);
            };
          })(this)
        ]);
        window.addEventListener('mousewheel', onMouseWheel);
        _workspaceView.addEventListener('keydown', (function(_this) {
          return function(e) {
            var _isPickerEvent;
            if (!_this.element.isOpen()) {
              return;
            }
            _isPickerEvent = _this.element.hasChild(e.target);
            _this.emitKeyDown(e, _isPickerEvent);
            return _this.close();
          };
        })(this));
        atom.workspace.observeTextEditors((function(_this) {
          return function(editor) {
            var _editorView, _subscriptionLeft, _subscriptionTop;
            _editorView = atom.views.getView(editor);
            _subscriptionTop = _editorView.onDidChangeScrollTop(function() {
              return _this.close();
            });
            _subscriptionLeft = _editorView.onDidChangeScrollLeft(function() {
              return _this.close();
            });
            editor.onDidDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
            _this.onBeforeDestroy(function() {
              _subscriptionTop.dispose();
              return _subscriptionLeft.dispose();
            });
          };
        })(this));
        this.listeners.push([
          'resize', onResize = (function(_this) {
            return function() {
              return _this.close();
            };
          })(this)
        ]);
        window.addEventListener('resize', onResize);
        _workspace.getActivePane().onDidChangeActiveItem((function(_this) {
          return function() {
            return _this.close();
          };
        })(this));
        this.close();
        this.canOpen = true;
        (this.Parent = (atom.views.getView(atom.workspace)).querySelector('.vertical')).appendChild(this.element.el);
        return this;
      },
      destroy: function() {
        var _event, _listener, i, len, ref, ref1;
        this.emitBeforeDestroy();
        ref = this.listeners;
        for (i = 0, len = ref.length; i < len; i++) {
          ref1 = ref[i], _event = ref1[0], _listener = ref1[1];
          window.removeEventListener(_event, _listener);
        }
        this.element.remove();
        return this.canOpen = false;
      },
      loadExtensions: function() {
        var _extension, _requiredExtension, i, len, ref;
        ref = ['Arrow', 'Color', 'Body', 'Saturation', 'Alpha', 'Hue', 'Definition', 'Return', 'Format'];
        for (i = 0, len = ref.length; i < len; i++) {
          _extension = ref[i];
          _requiredExtension = (require("./extensions/" + _extension))(this);
          this.extensions[_extension] = _requiredExtension;
          if (typeof _requiredExtension.activate === "function") {
            _requiredExtension.activate();
          }
        }
      },
      emitMouseDown: function(e, isOnPicker) {
        return this.Emitter.emit('mouseDown', e, isOnPicker);
      },
      onMouseDown: function(callback) {
        return this.Emitter.on('mouseDown', callback);
      },
      emitMouseMove: function(e, isOnPicker) {
        return this.Emitter.emit('mouseMove', e, isOnPicker);
      },
      onMouseMove: function(callback) {
        return this.Emitter.on('mouseMove', callback);
      },
      emitMouseUp: function(e, isOnPicker) {
        return this.Emitter.emit('mouseUp', e, isOnPicker);
      },
      onMouseUp: function(callback) {
        return this.Emitter.on('mouseUp', callback);
      },
      emitMouseWheel: function(e, isOnPicker) {
        return this.Emitter.emit('mouseWheel', e, isOnPicker);
      },
      onMouseWheel: function(callback) {
        return this.Emitter.on('mouseWheel', callback);
      },
      emitKeyDown: function(e, isOnPicker) {
        return this.Emitter.emit('keyDown', e, isOnPicker);
      },
      onKeyDown: function(callback) {
        return this.Emitter.on('keyDown', callback);
      },
      emitPositionChange: function(position, colorPickerPosition) {
        return this.Emitter.emit('positionChange', position, colorPickerPosition);
      },
      onPositionChange: function(callback) {
        return this.Emitter.on('positionChange', callback);
      },
      emitOpen: function() {
        return this.Emitter.emit('open');
      },
      onOpen: function(callback) {
        return this.Emitter.on('open', callback);
      },
      emitBeforeOpen: function() {
        return this.Emitter.emit('beforeOpen');
      },
      onBeforeOpen: function(callback) {
        return this.Emitter.on('beforeOpen', callback);
      },
      emitClose: function() {
        return this.Emitter.emit('close');
      },
      onClose: function(callback) {
        return this.Emitter.on('close', callback);
      },
      emitBeforeDestroy: function() {
        return this.Emitter.emit('beforeDestroy');
      },
      onBeforeDestroy: function(callback) {
        return this.Emitter.on('beforeDestroy', callback);
      },
      emitInputColor: function(smartColor, wasFound) {
        if (wasFound == null) {
          wasFound = true;
        }
        return this.Emitter.emit('inputColor', smartColor, wasFound);
      },
      onInputColor: function(callback) {
        return this.Emitter.on('inputColor', callback);
      },
      emitInputVariable: function(match) {
        return this.Emitter.emit('inputVariable', match);
      },
      onInputVariable: function(callback) {
        return this.Emitter.on('inputVariable', callback);
      },
      emitInputVariableColor: function(smartColor, pointer) {
        return this.Emitter.emit('inputVariableColor', smartColor, pointer);
      },
      onInputVariableColor: function(callback) {
        return this.Emitter.on('inputVariableColor', callback);
      },
      open: function(Editor, Cursor) {
        var EditorElement, EditorView, PaneView, _colorMatches, _colorPickerPosition, _convertedColor, _cursorBufferRow, _cursorColumn, _cursorPosition, _cursorScreenRow, _editorOffsetLeft, _editorOffsetTop, _editorScrollTop, _lineContent, _lineHeight, _lineOffsetLeft, _match, _matches, _paneOffsetLeft, _paneOffsetTop, _position, _preferredFormat, _randomColor, _rect, _redColor, _right, _selection, _totalOffsetLeft, _totalOffsetTop, _variableMatches, _visibleRowRange;
        if (Editor == null) {
          Editor = null;
        }
        if (Cursor == null) {
          Cursor = null;
        }
        if (!this.canOpen) {
          return;
        }
        this.emitBeforeOpen();
        if (!Editor) {
          Editor = atom.workspace.getActiveTextEditor();
        }
        EditorView = atom.views.getView(Editor);
        EditorElement = Editor.getElement();
        if (!EditorView) {
          return;
        }
        this.selection = null;
        if (!Cursor) {
          Cursor = Editor.getLastCursor();
        }
        _visibleRowRange = EditorView.getVisibleRowRange();
        _cursorScreenRow = Cursor.getScreenRow();
        _cursorBufferRow = Cursor.getBufferRow();
        if ((_cursorScreenRow < _visibleRowRange[0]) || (_cursorScreenRow > _visibleRowRange[1])) {
          return;
        }
        _lineContent = Cursor.getCurrentBufferLine();
        _colorMatches = this.SmartColor.find(_lineContent);
        _variableMatches = this.SmartVariable.find(_lineContent, Editor.getPath());
        _matches = _colorMatches.concat(_variableMatches);
        _cursorPosition = EditorElement.pixelPositionForScreenPosition(Cursor.getScreenPosition());
        _cursorColumn = Cursor.getBufferColumn();
        _match = (function() {
          var i, len;
          for (i = 0, len = _matches.length; i < len; i++) {
            _match = _matches[i];
            if (_match.start <= _cursorColumn && _match.end >= _cursorColumn) {
              return _match;
            }
          }
        })();
        if (_match) {
          Editor.clearSelections();
          _selection = Editor.addSelectionForBufferRange([[_cursorBufferRow, _match.start], [_cursorBufferRow, _match.end]]);
          this.selection = {
            match: _match,
            row: _cursorBufferRow
          };
        } else {
          this.selection = {
            column: _cursorColumn,
            row: _cursorBufferRow
          };
        }
        if (_match) {
          if (_match.isVariable != null) {
            _match.getDefinition().then((function(_this) {
              return function(definition) {
                var _smartColor;
                _smartColor = (_this.SmartColor.find(definition.value))[0].getSmartColor();
                return _this.emitInputVariableColor(_smartColor, definition.pointer);
              };
            })(this))["catch"]((function(_this) {
              return function(error) {
                return _this.emitInputVariableColor(false);
              };
            })(this));
            this.emitInputVariable(_match);
          } else {
            this.emitInputColor(_match.getSmartColor());
          }
        } else if (atom.config.get('color-picker.randomColor')) {
          _randomColor = this.SmartColor.RGBArray([((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0, ((Math.random() * 255) + .5) << 0]);
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          _convertedColor = _randomColor["to" + _preferredFormat]();
          _randomColor = this.SmartColor[_preferredFormat](_convertedColor);
          this.emitInputColor(_randomColor, false);
        } else if (this.isFirstOpen) {
          _redColor = this.SmartColor.HEX('#f00');
          _preferredFormat = atom.config.get('color-picker.preferredFormat');
          if (_redColor.format !== _preferredFormat) {
            _convertedColor = _redColor["to" + _preferredFormat]();
            _redColor = this.SmartColor[_preferredFormat](_convertedColor);
          }
          this.isFirstOpen = false;
          this.emitInputColor(_redColor, false);
        }
        PaneView = atom.views.getView(atom.workspace.getActivePane());
        _paneOffsetTop = PaneView.offsetTop;
        _paneOffsetLeft = PaneView.offsetLeft;
        _editorOffsetTop = EditorView.parentNode.offsetTop;
        _editorOffsetLeft = EditorView.querySelector('.scroll-view').offsetLeft;
        _editorScrollTop = EditorView.getScrollTop();
        _lineHeight = Editor.getLineHeightInPixels();
        _lineOffsetLeft = EditorView.querySelector('.line').offsetLeft;
        if (_match) {
          _rect = EditorElement.pixelRectForScreenRange(_selection.getScreenRange());
          _right = _rect.left + _rect.width;
          _cursorPosition.left = _right - (_rect.width / 2);
        }
        _totalOffsetTop = _paneOffsetTop + _lineHeight - _editorScrollTop + _editorOffsetTop;
        _totalOffsetLeft = _paneOffsetLeft + _editorOffsetLeft + _lineOffsetLeft;
        _position = {
          x: _cursorPosition.left + _totalOffsetLeft,
          y: _cursorPosition.top + _totalOffsetTop
        };
        _colorPickerPosition = {
          x: (function(_this) {
            return function() {
              var _colorPickerWidth, _halfColorPickerWidth, _x;
              _colorPickerWidth = _this.element.width();
              _halfColorPickerWidth = (_colorPickerWidth / 2) << 0;
              _x = Math.max(10, _position.x - _halfColorPickerWidth);
              _x = Math.min(_this.Parent.offsetWidth - _colorPickerWidth - 10, _x);
              return _x;
            };
          })(this)(),
          y: (function(_this) {
            return function() {
              _this.element.unflip();
              if (_this.element.height() + _position.y > _this.Parent.offsetHeight - 32) {
                _this.element.flip();
                return _position.y - _lineHeight - _this.element.height();
              } else {
                return _position.y;
              }
            };
          })(this)()
        };
        this.element.setPosition(_colorPickerPosition.x, _colorPickerPosition.y);
        this.emitPositionChange(_position, _colorPickerPosition);
        requestAnimationFrame((function(_this) {
          return function() {
            _this.element.open();
            return _this.emitOpen();
          };
        })(this));
        return true;
      },
      canReplace: true,
      replace: function(color) {
        var Editor, _cursorEnd, _cursorStart;
        if (!this.canReplace) {
          return;
        }
        this.canReplace = false;
        Editor = atom.workspace.getActiveTextEditor();
        Editor.clearSelections();
        if (this.selection.match) {
          _cursorStart = this.selection.match.start;
          _cursorEnd = this.selection.match.end;
        } else {
          _cursorStart = _cursorEnd = this.selection.column;
        }
        Editor.addSelectionForBufferRange([[this.selection.row, _cursorStart], [this.selection.row, _cursorEnd]]);
        Editor.replaceSelectedText(null, (function(_this) {
          return function() {
            return color;
          };
        })(this));
        setTimeout((function(_this) {
          return function() {
            var ref;
            Editor.setCursorBufferPosition([_this.selection.row, _cursorStart]);
            Editor.clearSelections();
            if ((ref = _this.selection.match) != null) {
              ref.end = _cursorStart + color.length;
            }
            Editor.addSelectionForBufferRange([[_this.selection.row, _cursorStart], [_this.selection.row, _cursorStart + color.length]]);
            return setTimeout((function() {
              return _this.canReplace = true;
            }), 100);
          };
        })(this));
      },
      close: function() {
        this.element.close();
        return this.emitClose();
      }
    };
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2NvbG9yLXBpY2tlci9saWIvQ29sb3JQaWNrZXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUk7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO1dBQ2I7TUFBQSxNQUFBLEVBQVEsSUFBUjtNQUVBLFVBQUEsRUFBWSxDQUFDLE9BQUEsQ0FBUSxzQkFBUixDQUFELENBQUEsQ0FBQSxDQUZaO01BR0EsYUFBQSxFQUFlLENBQUMsT0FBQSxDQUFRLHlCQUFSLENBQUQsQ0FBQSxDQUFBLENBSGY7TUFJQSxPQUFBLEVBQVMsQ0FBQyxPQUFBLENBQVEsbUJBQVIsQ0FBRCxDQUFBLENBQUEsQ0FKVDtNQU1BLFVBQUEsRUFBWSxFQU5aO01BT0EsWUFBQSxFQUFjLFNBQUMsYUFBRDtlQUFtQixJQUFDLENBQUEsVUFBVyxDQUFBLGFBQUE7TUFBL0IsQ0FQZDtNQVNBLFdBQUEsRUFBYSxJQVRiO01BVUEsT0FBQSxFQUFTLElBVlQ7TUFXQSxPQUFBLEVBQVMsSUFYVDtNQVlBLFNBQUEsRUFBVyxJQVpYO01BY0EsU0FBQSxFQUFXLEVBZFg7TUFtQkEsUUFBQSxFQUFVLFNBQUE7QUFDTixZQUFBO1FBQUEsVUFBQSxHQUFhLElBQUksQ0FBQztRQUNsQixjQUFBLEdBQWlCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixVQUFuQjtRQUlqQixJQUFDLENBQUEsT0FBRCxHQUNJO1VBQUEsRUFBQSxFQUFPLENBQUEsU0FBQTtBQUNILGdCQUFBO1lBQUEsR0FBQSxHQUFNLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO1lBQ04sR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFkLENBQWtCLGFBQWxCO0FBRUEsbUJBQU87VUFKSixDQUFBLENBQUgsQ0FBQSxDQUFKO1VBTUEsTUFBQSxFQUFRLFNBQUE7bUJBQUcsSUFBQyxDQUFBLEVBQUUsQ0FBQyxVQUFV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QixVQUFqQixDQUY4QixDQUFsQztRQUdBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixJQUEzQixFQUFpQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpDO1FBR0EsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7QUFDUCxnQkFBQTtZQUFBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUMzQixLQUFDLENBQUEsU0FBUyxDQUFDLEdBRGdCLEVBQ1gsWUFEVyxDQUEvQjtZQUVBLE1BQU0sQ0FBQyxlQUFQLENBQUE7O2lCQUdnQixDQUFFLEdBQWxCLEdBQXdCLFlBQUEsR0FBZSxLQUFLLENBQUM7O1lBRTdDLE1BQU0sQ0FBQywwQkFBUCxDQUFrQyxDQUM5QixDQUFDLEtBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWixFQUFpQixZQUFqQixDQUQ4QixFQUU5QixDQUFDLEtBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWixFQUFpQixZQUFBLEdBQWUsS0FBSyxDQUFDLE1BQXRDLENBRjhCLENBQWxDO0FBR0EsbUJBQU8sVUFBQSxDQUFXLENBQUUsU0FBQTtxQkFBRyxLQUFDLENBQUEsVUFBRCxHQUFjO1lBQWpCLENBQUYsQ0FBWCxFQUFvQyxHQUFwQztVQVhBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYO01BbkJLLENBM1pUO01BK2JBLEtBQUEsRUFBTyxTQUFBO1FBQ0gsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFULENBQUE7ZUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO01BRkcsQ0EvYlA7O0VBRGE7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgIENvbG9yIFBpY2tlcjogdmlld1xuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IC0+XG4gICAgICAgIFBhcmVudDogbnVsbFxuXG4gICAgICAgIFNtYXJ0Q29sb3I6IChyZXF1aXJlICcuL21vZHVsZXMvU21hcnRDb2xvcicpKClcbiAgICAgICAgU21hcnRWYXJpYWJsZTogKHJlcXVpcmUgJy4vbW9kdWxlcy9TbWFydFZhcmlhYmxlJykoKVxuICAgICAgICBFbWl0dGVyOiAocmVxdWlyZSAnLi9tb2R1bGVzL0VtaXR0ZXInKSgpXG5cbiAgICAgICAgZXh0ZW5zaW9uczoge31cbiAgICAgICAgZ2V0RXh0ZW5zaW9uOiAoZXh0ZW5zaW9uTmFtZSkgLT4gQGV4dGVuc2lvbnNbZXh0ZW5zaW9uTmFtZV1cblxuICAgICAgICBpc0ZpcnN0T3BlbjogeWVzXG4gICAgICAgIGNhbk9wZW46IHllc1xuICAgICAgICBlbGVtZW50OiBudWxsXG4gICAgICAgIHNlbGVjdGlvbjogbnVsbFxuXG4gICAgICAgIGxpc3RlbmVyczogW11cblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIENyZWF0ZSBhbmQgYWN0aXZhdGUgQ29sb3IgUGlja2VyIHZpZXdcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgYWN0aXZhdGU6IC0+XG4gICAgICAgICAgICBfd29ya3NwYWNlID0gYXRvbS53b3Jrc3BhY2VcbiAgICAgICAgICAgIF93b3Jrc3BhY2VWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3IF93b3Jrc3BhY2VcblxuICAgICAgICAjICBDcmVhdGUgZWxlbWVudFxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgQGVsZW1lbnQgPVxuICAgICAgICAgICAgICAgIGVsOiBkbyAtPlxuICAgICAgICAgICAgICAgICAgICBfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50ICdkaXYnXG4gICAgICAgICAgICAgICAgICAgIF9lbC5jbGFzc0xpc3QuYWRkICdDb2xvclBpY2tlcidcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX2VsXG4gICAgICAgICAgICAgICAgIyBVdGlsaXR5IGZ1bmN0aW9uc1xuICAgICAgICAgICAgICAgIHJlbW92ZTogLT4gQGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQgQGVsXG5cbiAgICAgICAgICAgICAgICBhZGRDbGFzczogKGNsYXNzTmFtZSkgLT4gQGVsLmNsYXNzTGlzdC5hZGQgY2xhc3NOYW1lOyByZXR1cm4gdGhpc1xuICAgICAgICAgICAgICAgIHJlbW92ZUNsYXNzOiAoY2xhc3NOYW1lKSAtPiBAZWwuY2xhc3NMaXN0LnJlbW92ZSBjbGFzc05hbWU7IHJldHVybiB0aGlzXG4gICAgICAgICAgICAgICAgaGFzQ2xhc3M6IChjbGFzc05hbWUpIC0+IEBlbC5jbGFzc0xpc3QuY29udGFpbnMgY2xhc3NOYW1lXG5cbiAgICAgICAgICAgICAgICB3aWR0aDogLT4gQGVsLm9mZnNldFdpZHRoXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAtPiBAZWwub2Zmc2V0SGVpZ2h0XG5cbiAgICAgICAgICAgICAgICBzZXRIZWlnaHQ6IChoZWlnaHQpIC0+IEBlbC5zdHlsZS5oZWlnaHQgPSBcIiN7IGhlaWdodCB9cHhcIlxuXG4gICAgICAgICAgICAgICAgaGFzQ2hpbGQ6IChjaGlsZCkgLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgY2hpbGQgYW5kIF9wYXJlbnQgPSBjaGlsZC5wYXJlbnROb2RlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBjaGlsZCBpcyBAZWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gQGhhc0NoaWxkIF9wYXJlbnRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgICAgICAgICAjIE9wZW4gJiBDbG9zZSB0aGUgQ29sb3IgUGlja2VyXG4gICAgICAgICAgICAgICAgaXNPcGVuOiAtPiBAaGFzQ2xhc3MgJ2lzLS1vcGVuJ1xuICAgICAgICAgICAgICAgIG9wZW46IC0+IEBhZGRDbGFzcyAnaXMtLW9wZW4nXG4gICAgICAgICAgICAgICAgY2xvc2U6IC0+IEByZW1vdmVDbGFzcyAnaXMtLW9wZW4nXG5cbiAgICAgICAgICAgICAgICAjIEZsaXAgJiBVbmZsaXAgdGhlIENvbG9yIFBpY2tlclxuICAgICAgICAgICAgICAgIGlzRmxpcHBlZDogLT4gQGhhc0NsYXNzICdpcy0tZmxpcHBlZCdcbiAgICAgICAgICAgICAgICBmbGlwOiAtPiBAYWRkQ2xhc3MgJ2lzLS1mbGlwcGVkJ1xuICAgICAgICAgICAgICAgIHVuZmxpcDogLT4gQHJlbW92ZUNsYXNzICdpcy0tZmxpcHBlZCdcblxuICAgICAgICAgICAgICAgICMgU2V0IENvbG9yIFBpY2tlciBwb3NpdGlvblxuICAgICAgICAgICAgICAgICMgLSB4IHtOdW1iZXJ9XG4gICAgICAgICAgICAgICAgIyAtIHkge051bWJlcn1cbiAgICAgICAgICAgICAgICBzZXRQb3NpdGlvbjogKHgsIHkpIC0+XG4gICAgICAgICAgICAgICAgICAgIEBlbC5zdHlsZS5sZWZ0ID0gXCIjeyB4IH1weFwiXG4gICAgICAgICAgICAgICAgICAgIEBlbC5zdHlsZS50b3AgPSBcIiN7IHkgfXB4XCJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNcblxuICAgICAgICAgICAgICAgICMgQWRkIGEgY2hpbGQgb24gdGhlIENvbG9yUGlja2VyIGVsZW1lbnRcbiAgICAgICAgICAgICAgICBhZGQ6IChlbGVtZW50KSAtPlxuICAgICAgICAgICAgICAgICAgICBAZWwuYXBwZW5kQ2hpbGQgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpc1xuICAgICAgICAgICAgQGxvYWRFeHRlbnNpb25zKClcblxuICAgICAgICAjICBDbG9zZSB0aGUgQ29sb3IgUGlja2VyIG9uIGFueSBhY3Rpdml0eSB1bnJlbGF0ZWQgdG8gaXRcbiAgICAgICAgIyAgYnV0IGFsc28gZW1pdCBldmVudHMgb24gdGhlIENvbG9yIFBpY2tlclxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgQGxpc3RlbmVycy5wdXNoIFsnbW91c2Vkb3duJywgb25Nb3VzZURvd24gPSAoZSkgPT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIEBlbGVtZW50LmlzT3BlbigpXG5cbiAgICAgICAgICAgICAgICBfaXNQaWNrZXJFdmVudCA9IEBlbGVtZW50Lmhhc0NoaWxkIGUudGFyZ2V0XG4gICAgICAgICAgICAgICAgQGVtaXRNb3VzZURvd24gZSwgX2lzUGlja2VyRXZlbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gQGNsb3NlKCkgdW5sZXNzIF9pc1BpY2tlckV2ZW50XVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlZG93bicsIG9uTW91c2VEb3duLCB0cnVlXG5cbiAgICAgICAgICAgIEBsaXN0ZW5lcnMucHVzaCBbJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlID0gKGUpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAZWxlbWVudC5pc09wZW4oKVxuXG4gICAgICAgICAgICAgICAgX2lzUGlja2VyRXZlbnQgPSBAZWxlbWVudC5oYXNDaGlsZCBlLnRhcmdldFxuICAgICAgICAgICAgICAgIEBlbWl0TW91c2VNb3ZlIGUsIF9pc1BpY2tlckV2ZW50XVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsIG9uTW91c2VNb3ZlLCB0cnVlXG5cbiAgICAgICAgICAgIEBsaXN0ZW5lcnMucHVzaCBbJ21vdXNldXAnLCBvbk1vdXNlVXAgPSAoZSkgPT5cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5sZXNzIEBlbGVtZW50LmlzT3BlbigpXG5cbiAgICAgICAgICAgICAgICBfaXNQaWNrZXJFdmVudCA9IEBlbGVtZW50Lmhhc0NoaWxkIGUudGFyZ2V0XG4gICAgICAgICAgICAgICAgQGVtaXRNb3VzZVVwIGUsIF9pc1BpY2tlckV2ZW50XVxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNldXAnLCBvbk1vdXNlVXAsIHRydWVcblxuICAgICAgICAgICAgQGxpc3RlbmVycy5wdXNoIFsnbW91c2V3aGVlbCcsIG9uTW91c2VXaGVlbCA9IChlKSA9PlxuICAgICAgICAgICAgICAgIHJldHVybiB1bmxlc3MgQGVsZW1lbnQuaXNPcGVuKClcblxuICAgICAgICAgICAgICAgIF9pc1BpY2tlckV2ZW50ID0gQGVsZW1lbnQuaGFzQ2hpbGQgZS50YXJnZXRcbiAgICAgICAgICAgICAgICBAZW1pdE1vdXNlV2hlZWwgZSwgX2lzUGlja2VyRXZlbnRdXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2V3aGVlbCcsIG9uTW91c2VXaGVlbFxuXG4gICAgICAgICAgICBfd29ya3NwYWNlVmlldy5hZGRFdmVudExpc3RlbmVyICdrZXlkb3duJywgKGUpID0+XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAZWxlbWVudC5pc09wZW4oKVxuXG4gICAgICAgICAgICAgICAgX2lzUGlja2VyRXZlbnQgPSBAZWxlbWVudC5oYXNDaGlsZCBlLnRhcmdldFxuICAgICAgICAgICAgICAgIEBlbWl0S2V5RG93biBlLCBfaXNQaWNrZXJFdmVudFxuICAgICAgICAgICAgICAgIHJldHVybiBAY2xvc2UoKVxuXG4gICAgICAgICAgICAjIENsb3NlIGl0IG9uIHNjcm9sbCBhbHNvXG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgICAgICAgICAgICBfZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyBlZGl0b3JcbiAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uVG9wID0gX2VkaXRvclZpZXcub25EaWRDaGFuZ2VTY3JvbGxUb3AgPT4gQGNsb3NlKClcbiAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uTGVmdCA9IF9lZGl0b3JWaWV3Lm9uRGlkQ2hhbmdlU2Nyb2xsTGVmdCA9PiBAY2xvc2UoKVxuXG4gICAgICAgICAgICAgICAgZWRpdG9yLm9uRGlkRGVzdHJveSAtPlxuICAgICAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uVG9wLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgICAgICBfc3Vic2NyaXB0aW9uTGVmdC5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICBAb25CZWZvcmVEZXN0cm95IC0+XG4gICAgICAgICAgICAgICAgICAgIF9zdWJzY3JpcHRpb25Ub3AuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgICAgIF9zdWJzY3JpcHRpb25MZWZ0LmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAjIENsb3NlIGl0IHdoZW4gdGhlIHdpbmRvdyByZXNpemVzXG4gICAgICAgICAgICBAbGlzdGVuZXJzLnB1c2ggWydyZXNpemUnLCBvblJlc2l6ZSA9ID0+XG4gICAgICAgICAgICAgICAgQGNsb3NlKCldXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciAncmVzaXplJywgb25SZXNpemVcblxuICAgICAgICAgICAgIyBDbG9zZSBpdCB3aGVuIHRoZSBhY3RpdmUgaXRlbSBpcyBjaGFuZ2VkXG4gICAgICAgICAgICBfd29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5vbkRpZENoYW5nZUFjdGl2ZUl0ZW0gPT4gQGNsb3NlKClcblxuICAgICAgICAjICBQbGFjZSB0aGUgQ29sb3IgUGlja2VyIGVsZW1lbnRcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIEBjbG9zZSgpXG4gICAgICAgICAgICBAY2FuT3BlbiA9IHllc1xuXG4gICAgICAgICAgICAjIFRPRE86IElzIHRoaXMgcmVhbGx5IHRoZSBiZXN0IHdheSB0byBkbyB0aGlzPyBIaW50OiBQcm9iYWJseSBub3RcbiAgICAgICAgICAgIChAUGFyZW50ID0gKGF0b20udmlld3MuZ2V0VmlldyBhdG9tLndvcmtzcGFjZSkucXVlcnlTZWxlY3RvciAnLnZlcnRpY2FsJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kQ2hpbGQgQGVsZW1lbnQuZWxcbiAgICAgICAgICAgIHJldHVybiB0aGlzXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBEZXN0cm95IHRoZSB2aWV3IGFuZCB1bmJpbmQgZXZlbnRzXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGRlc3Ryb3k6IC0+XG4gICAgICAgICAgICBAZW1pdEJlZm9yZURlc3Ryb3koKVxuXG4gICAgICAgICAgICBmb3IgW19ldmVudCwgX2xpc3RlbmVyXSBpbiBAbGlzdGVuZXJzXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIgX2V2ZW50LCBfbGlzdGVuZXJcblxuICAgICAgICAgICAgQGVsZW1lbnQucmVtb3ZlKClcbiAgICAgICAgICAgIEBjYW5PcGVuID0gbm9cblxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICMgIExvYWQgQ29sb3IgUGlja2VyIGV4dGVuc2lvbnMgLy8gbW9yZSBsaWtlIGRlcGVuZGVuY2llc1xuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBsb2FkRXh0ZW5zaW9uczogLT5cbiAgICAgICAgICAgICMgVE9ETzogVGhpcyBpcyByZWFsbHkgc3R1cGlkLiBTaG91bGQgdGhpcyBiZSBkb25lIHdpdGggYGZzYCBvciBzb21ldGhpbmc/XG4gICAgICAgICAgICAjIFRPRE86IEV4dGVuc2lvbiBmaWxlcyBoYXZlIHByZXR0eSBtdWNoIHRoZSBzYW1lIGJhc2UuIFNpbXBsaWZ5P1xuICAgICAgICAgICAgZm9yIF9leHRlbnNpb24gaW4gWydBcnJvdycsICdDb2xvcicsICdCb2R5JywgJ1NhdHVyYXRpb24nLCAnQWxwaGEnLCAnSHVlJywgJ0RlZmluaXRpb24nLCAnUmV0dXJuJywgJ0Zvcm1hdCddXG4gICAgICAgICAgICAgICAgX3JlcXVpcmVkRXh0ZW5zaW9uID0gKHJlcXVpcmUgXCIuL2V4dGVuc2lvbnMvI3sgX2V4dGVuc2lvbiB9XCIpKHRoaXMpXG4gICAgICAgICAgICAgICAgQGV4dGVuc2lvbnNbX2V4dGVuc2lvbl0gPSBfcmVxdWlyZWRFeHRlbnNpb25cbiAgICAgICAgICAgICAgICBfcmVxdWlyZWRFeHRlbnNpb24uYWN0aXZhdGU/KClcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgU2V0IHVwIGV2ZW50cyBhbmQgaGFuZGxpbmdcbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgIyBNb3VzZSBldmVudHNcbiAgICAgICAgZW1pdE1vdXNlRG93bjogKGUsIGlzT25QaWNrZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdtb3VzZURvd24nLCBlLCBpc09uUGlja2VyXG4gICAgICAgIG9uTW91c2VEb3duOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnbW91c2VEb3duJywgY2FsbGJhY2tcblxuICAgICAgICBlbWl0TW91c2VNb3ZlOiAoZSwgaXNPblBpY2tlcikgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ21vdXNlTW92ZScsIGUsIGlzT25QaWNrZXJcbiAgICAgICAgb25Nb3VzZU1vdmU6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdtb3VzZU1vdmUnLCBjYWxsYmFja1xuXG4gICAgICAgIGVtaXRNb3VzZVVwOiAoZSwgaXNPblBpY2tlcikgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ21vdXNlVXAnLCBlLCBpc09uUGlja2VyXG4gICAgICAgIG9uTW91c2VVcDogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ21vdXNlVXAnLCBjYWxsYmFja1xuXG4gICAgICAgIGVtaXRNb3VzZVdoZWVsOiAoZSwgaXNPblBpY2tlcikgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ21vdXNlV2hlZWwnLCBlLCBpc09uUGlja2VyXG4gICAgICAgIG9uTW91c2VXaGVlbDogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ21vdXNlV2hlZWwnLCBjYWxsYmFja1xuXG4gICAgICAgICMgS2V5IGV2ZW50c1xuICAgICAgICBlbWl0S2V5RG93bjogKGUsIGlzT25QaWNrZXIpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdrZXlEb3duJywgZSwgaXNPblBpY2tlclxuICAgICAgICBvbktleURvd246IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdrZXlEb3duJywgY2FsbGJhY2tcblxuICAgICAgICAjIFBvc2l0aW9uIENoYW5nZVxuICAgICAgICBlbWl0UG9zaXRpb25DaGFuZ2U6IChwb3NpdGlvbiwgY29sb3JQaWNrZXJQb3NpdGlvbikgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ3Bvc2l0aW9uQ2hhbmdlJywgcG9zaXRpb24sIGNvbG9yUGlja2VyUG9zaXRpb25cbiAgICAgICAgb25Qb3NpdGlvbkNoYW5nZTogKGNhbGxiYWNrKSAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIub24gJ3Bvc2l0aW9uQ2hhbmdlJywgY2FsbGJhY2tcblxuICAgICAgICAjIE9wZW5pbmdcbiAgICAgICAgZW1pdE9wZW46IC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdvcGVuJ1xuICAgICAgICBvbk9wZW46IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdvcGVuJywgY2FsbGJhY2tcblxuICAgICAgICAjIEJlZm9yZSBvcGVuaW5nXG4gICAgICAgIGVtaXRCZWZvcmVPcGVuOiAtPlxuICAgICAgICAgICAgQEVtaXR0ZXIuZW1pdCAnYmVmb3JlT3BlbidcbiAgICAgICAgb25CZWZvcmVPcGVuOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnYmVmb3JlT3BlbicsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBDbG9zaW5nXG4gICAgICAgIGVtaXRDbG9zZTogLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ2Nsb3NlJ1xuICAgICAgICBvbkNsb3NlOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnY2xvc2UnLCBjYWxsYmFja1xuXG4gICAgICAgICMgQmVmb3JlIGRlc3Ryb3lpbmdcbiAgICAgICAgZW1pdEJlZm9yZURlc3Ryb3k6IC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdiZWZvcmVEZXN0cm95J1xuICAgICAgICBvbkJlZm9yZURlc3Ryb3k6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdiZWZvcmVEZXN0cm95JywgY2FsbGJhY2tcblxuICAgICAgICAjIElucHV0IENvbG9yXG4gICAgICAgIGVtaXRJbnB1dENvbG9yOiAoc21hcnRDb2xvciwgd2FzRm91bmQ9dHJ1ZSkgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ2lucHV0Q29sb3InLCBzbWFydENvbG9yLCB3YXNGb3VuZFxuICAgICAgICBvbklucHV0Q29sb3I6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdpbnB1dENvbG9yJywgY2FsbGJhY2tcblxuICAgICAgICAjIElucHV0IFZhcmlhYmxlXG4gICAgICAgIGVtaXRJbnB1dFZhcmlhYmxlOiAobWF0Y2gpIC0+XG4gICAgICAgICAgICBARW1pdHRlci5lbWl0ICdpbnB1dFZhcmlhYmxlJywgbWF0Y2hcbiAgICAgICAgb25JbnB1dFZhcmlhYmxlOiAoY2FsbGJhY2spIC0+XG4gICAgICAgICAgICBARW1pdHRlci5vbiAnaW5wdXRWYXJpYWJsZScsIGNhbGxiYWNrXG5cbiAgICAgICAgIyBJbnB1dCBWYXJpYWJsZSBDb2xvclxuICAgICAgICBlbWl0SW5wdXRWYXJpYWJsZUNvbG9yOiAoc21hcnRDb2xvciwgcG9pbnRlcikgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLmVtaXQgJ2lucHV0VmFyaWFibGVDb2xvcicsIHNtYXJ0Q29sb3IsIHBvaW50ZXJcbiAgICAgICAgb25JbnB1dFZhcmlhYmxlQ29sb3I6IChjYWxsYmFjaykgLT5cbiAgICAgICAgICAgIEBFbWl0dGVyLm9uICdpbnB1dFZhcmlhYmxlQ29sb3InLCBjYWxsYmFja1xuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgT3BlbiB0aGUgQ29sb3IgUGlja2VyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIG9wZW46IChFZGl0b3I9bnVsbCwgQ3Vyc29yPW51bGwpIC0+XG4gICAgICAgICAgICByZXR1cm4gdW5sZXNzIEBjYW5PcGVuXG4gICAgICAgICAgICBAZW1pdEJlZm9yZU9wZW4oKVxuXG4gICAgICAgICAgICBFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkgdW5sZXNzIEVkaXRvclxuICAgICAgICAgICAgRWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyBFZGl0b3JcbiAgICAgICAgICAgIEVkaXRvckVsZW1lbnQgPSBFZGl0b3IuZ2V0RWxlbWVudCgpXG5cbiAgICAgICAgICAgIHJldHVybiB1bmxlc3MgRWRpdG9yVmlld1xuXG4gICAgICAgICAgICAjIFJlc2V0IHNlbGVjdGlvblxuICAgICAgICAgICAgQHNlbGVjdGlvbiA9IG51bGxcblxuICAgICAgICAjICBGaW5kIHRoZSBjdXJyZW50IGN1cnNvclxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgQ3Vyc29yID0gRWRpdG9yLmdldExhc3RDdXJzb3IoKSB1bmxlc3MgQ3Vyc29yXG5cbiAgICAgICAgICAgICMgRmFpbCBpZiB0aGUgY3Vyc29yIGlzbid0IHZpc2libGVcbiAgICAgICAgICAgIF92aXNpYmxlUm93UmFuZ2UgPSBFZGl0b3JWaWV3LmdldFZpc2libGVSb3dSYW5nZSgpXG4gICAgICAgICAgICBfY3Vyc29yU2NyZWVuUm93ID0gQ3Vyc29yLmdldFNjcmVlblJvdygpXG4gICAgICAgICAgICBfY3Vyc29yQnVmZmVyUm93ID0gQ3Vyc29yLmdldEJ1ZmZlclJvdygpXG5cbiAgICAgICAgICAgIHJldHVybiBpZiAoX2N1cnNvclNjcmVlblJvdyA8IF92aXNpYmxlUm93UmFuZ2VbMF0pIG9yIChfY3Vyc29yU2NyZWVuUm93ID4gX3Zpc2libGVSb3dSYW5nZVsxXSlcblxuICAgICAgICAgICAgIyBUcnkgbWF0Y2hpbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBjdXJyZW50IGxpbmUgdG8gY29sb3IgcmVnZXhlc1xuICAgICAgICAgICAgX2xpbmVDb250ZW50ID0gQ3Vyc29yLmdldEN1cnJlbnRCdWZmZXJMaW5lKClcblxuICAgICAgICAgICAgX2NvbG9yTWF0Y2hlcyA9IEBTbWFydENvbG9yLmZpbmQgX2xpbmVDb250ZW50XG4gICAgICAgICAgICBfdmFyaWFibGVNYXRjaGVzID0gQFNtYXJ0VmFyaWFibGUuZmluZCBfbGluZUNvbnRlbnQsIEVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICAgIF9tYXRjaGVzID0gX2NvbG9yTWF0Y2hlcy5jb25jYXQgX3ZhcmlhYmxlTWF0Y2hlc1xuXG4gICAgICAgICAgICAjIEZpZ3VyZSBvdXQgd2hpY2ggb2YgdGhlIG1hdGNoZXMgaXMgdGhlIG9uZSB0aGUgdXNlciB3YW50c1xuICAgICAgICAgICAgX2N1cnNvclBvc2l0aW9uID0gRWRpdG9yRWxlbWVudC5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24gQ3Vyc29yLmdldFNjcmVlblBvc2l0aW9uKClcbiAgICAgICAgICAgIF9jdXJzb3JDb2x1bW4gPSBDdXJzb3IuZ2V0QnVmZmVyQ29sdW1uKClcblxuICAgICAgICAgICAgX21hdGNoID0gZG8gLT4gZm9yIF9tYXRjaCBpbiBfbWF0Y2hlc1xuICAgICAgICAgICAgICAgIHJldHVybiBfbWF0Y2ggaWYgX21hdGNoLnN0YXJ0IDw9IF9jdXJzb3JDb2x1bW4gYW5kIF9tYXRjaC5lbmQgPj0gX2N1cnNvckNvbHVtblxuXG4gICAgICAgICAgICAjIElmIHdlJ3ZlIGdvdCBhIG1hdGNoLCB3ZSBzaG91bGQgc2VsZWN0IGl0XG4gICAgICAgICAgICBpZiBfbWF0Y2hcbiAgICAgICAgICAgICAgICBFZGl0b3IuY2xlYXJTZWxlY3Rpb25zKClcblxuICAgICAgICAgICAgICAgIF9zZWxlY3Rpb24gPSBFZGl0b3IuYWRkU2VsZWN0aW9uRm9yQnVmZmVyUmFuZ2UgW1xuICAgICAgICAgICAgICAgICAgICBbX2N1cnNvckJ1ZmZlclJvdywgX21hdGNoLnN0YXJ0XVxuICAgICAgICAgICAgICAgICAgICBbX2N1cnNvckJ1ZmZlclJvdywgX21hdGNoLmVuZF1dXG4gICAgICAgICAgICAgICAgQHNlbGVjdGlvbiA9IG1hdGNoOiBfbWF0Y2gsIHJvdzogX2N1cnNvckJ1ZmZlclJvd1xuICAgICAgICAgICAgIyBCdXQgaWYgd2UgZG9uJ3QgaGF2ZSBhIG1hdGNoLCBjZW50ZXIgdGhlIENvbG9yIFBpY2tlciBvbiBsYXN0IGN1cnNvclxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIEBzZWxlY3Rpb24gPSBjb2x1bW46IF9jdXJzb3JDb2x1bW4sIHJvdzogX2N1cnNvckJ1ZmZlclJvd1xuXG4gICAgICAgICMgIEVtaXRcbiAgICAgICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGlmIF9tYXRjaFxuICAgICAgICAgICAgICAgICMgVGhlIG1hdGNoIGlzIGEgdmFyaWFibGUuIExvb2sgdXAgdGhlIGRlZmluaXRpb25cbiAgICAgICAgICAgICAgICBpZiBfbWF0Y2guaXNWYXJpYWJsZT9cbiAgICAgICAgICAgICAgICAgICAgX21hdGNoLmdldERlZmluaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4gKGRlZmluaXRpb24pID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NtYXJ0Q29sb3IgPSAoQFNtYXJ0Q29sb3IuZmluZCBkZWZpbml0aW9uLnZhbHVlKVswXS5nZXRTbWFydENvbG9yKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBAZW1pdElucHV0VmFyaWFibGVDb2xvciBfc21hcnRDb2xvciwgZGVmaW5pdGlvbi5wb2ludGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2ggKGVycm9yKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEBlbWl0SW5wdXRWYXJpYWJsZUNvbG9yIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIEBlbWl0SW5wdXRWYXJpYWJsZSBfbWF0Y2hcbiAgICAgICAgICAgICAgICAjIFRoZSBtYXRjaCBpcyBhIGNvbG9yXG4gICAgICAgICAgICAgICAgZWxzZSBAZW1pdElucHV0Q29sb3IgX21hdGNoLmdldFNtYXJ0Q29sb3IoKVxuICAgICAgICAgICAgIyBObyBtYXRjaCwgYnV0IGByYW5kb21Db2xvcmAgb3B0aW9uIGlzIHNldFxuICAgICAgICAgICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQgJ2NvbG9yLXBpY2tlci5yYW5kb21Db2xvcidcbiAgICAgICAgICAgICAgICBfcmFuZG9tQ29sb3IgPSBAU21hcnRDb2xvci5SR0JBcnJheSBbXG4gICAgICAgICAgICAgICAgICAgICgoTWF0aC5yYW5kb20oKSAqIDI1NSkgKyAuNSkgPDwgMFxuICAgICAgICAgICAgICAgICAgICAoKE1hdGgucmFuZG9tKCkgKiAyNTUpICsgLjUpIDw8IDBcbiAgICAgICAgICAgICAgICAgICAgKChNYXRoLnJhbmRvbSgpICogMjU1KSArIC41KSA8PCAwXVxuXG4gICAgICAgICAgICAgICAgIyBDb252ZXJ0IHRvIGBwcmVmZXJyZWRDb2xvcmAsIGFuZCB0aGVuIGVtaXQgaXRcbiAgICAgICAgICAgICAgICBfcHJlZmVycmVkRm9ybWF0ID0gYXRvbS5jb25maWcuZ2V0ICdjb2xvci1waWNrZXIucHJlZmVycmVkRm9ybWF0J1xuICAgICAgICAgICAgICAgIF9jb252ZXJ0ZWRDb2xvciA9IF9yYW5kb21Db2xvcltcInRvI3sgX3ByZWZlcnJlZEZvcm1hdCB9XCJdKClcbiAgICAgICAgICAgICAgICBfcmFuZG9tQ29sb3IgPSBAU21hcnRDb2xvcltfcHJlZmVycmVkRm9ybWF0XShfY29udmVydGVkQ29sb3IpXG5cbiAgICAgICAgICAgICAgICBAZW1pdElucHV0Q29sb3IgX3JhbmRvbUNvbG9yLCBmYWxzZVxuICAgICAgICAgICAgIyBObyBtYXRjaCwgYW5kIGl0J3MgdGhlIGZpcnN0IG9wZW5cbiAgICAgICAgICAgIGVsc2UgaWYgQGlzRmlyc3RPcGVuXG4gICAgICAgICAgICAgICAgX3JlZENvbG9yID0gQFNtYXJ0Q29sb3IuSEVYICcjZjAwJ1xuXG4gICAgICAgICAgICAgICAgIyBDb252ZXJ0IHRvIGBwcmVmZXJyZWRDb2xvcmAsIGFuZCB0aGVuIGVtaXQgaXRcbiAgICAgICAgICAgICAgICBfcHJlZmVycmVkRm9ybWF0ID0gYXRvbS5jb25maWcuZ2V0ICdjb2xvci1waWNrZXIucHJlZmVycmVkRm9ybWF0J1xuXG4gICAgICAgICAgICAgICAgaWYgX3JlZENvbG9yLmZvcm1hdCBpc250IF9wcmVmZXJyZWRGb3JtYXRcbiAgICAgICAgICAgICAgICAgICAgX2NvbnZlcnRlZENvbG9yID0gX3JlZENvbG9yW1widG8jeyBfcHJlZmVycmVkRm9ybWF0IH1cIl0oKVxuICAgICAgICAgICAgICAgICAgICBfcmVkQ29sb3IgPSBAU21hcnRDb2xvcltfcHJlZmVycmVkRm9ybWF0XShfY29udmVydGVkQ29sb3IpXG4gICAgICAgICAgICAgICAgQGlzRmlyc3RPcGVuID0gbm9cblxuICAgICAgICAgICAgICAgIEBlbWl0SW5wdXRDb2xvciBfcmVkQ29sb3IsIGZhbHNlXG5cbiAgICAgICAgIyAgQWZ0ZXIgKCYgaWYpIGhhdmluZyBzZWxlY3RlZCB0ZXh0IChhcyB0aGlzIG1pZ2h0IGNoYW5nZSB0aGUgc2Nyb2xsXG4gICAgICAgICMgIHBvc2l0aW9uKSBnYXRoZXIgaW5mb3JtYXRpb24gYWJvdXQgdGhlIEVkaXRvclxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgUGFuZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgICAgICBfcGFuZU9mZnNldFRvcCA9IFBhbmVWaWV3Lm9mZnNldFRvcFxuICAgICAgICAgICAgX3BhbmVPZmZzZXRMZWZ0ID0gUGFuZVZpZXcub2Zmc2V0TGVmdFxuXG4gICAgICAgICAgICBfZWRpdG9yT2Zmc2V0VG9wID0gRWRpdG9yVmlldy5wYXJlbnROb2RlLm9mZnNldFRvcFxuICAgICAgICAgICAgX2VkaXRvck9mZnNldExlZnQgPSBFZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpLm9mZnNldExlZnRcbiAgICAgICAgICAgIF9lZGl0b3JTY3JvbGxUb3AgPSBFZGl0b3JWaWV3LmdldFNjcm9sbFRvcCgpXG5cbiAgICAgICAgICAgIF9saW5lSGVpZ2h0ID0gRWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpXG4gICAgICAgICAgICBfbGluZU9mZnNldExlZnQgPSBFZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5saW5lJykub2Zmc2V0TGVmdFxuXG4gICAgICAgICAgICAjIENlbnRlciBpdCBvbiB0aGUgbWlkZGxlIG9mIHRoZSBzZWxlY3Rpb24gcmFuZ2VcbiAgICAgICAgICAgICMgVE9ETzogVGhlcmUgY2FuIGJlIGxpbmVzIG92ZXIgbW9yZSB0aGFuIG9uZSByb3dcbiAgICAgICAgICAgIGlmIF9tYXRjaFxuICAgICAgICAgICAgICAgIF9yZWN0ID0gRWRpdG9yRWxlbWVudC5waXhlbFJlY3RGb3JTY3JlZW5SYW5nZShfc2VsZWN0aW9uLmdldFNjcmVlblJhbmdlKCkpXG4gICAgICAgICAgICAgICAgX3JpZ2h0ID0gX3JlY3QubGVmdCArIF9yZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgX2N1cnNvclBvc2l0aW9uLmxlZnQgPSBfcmlnaHQgLSAoX3JlY3Qud2lkdGggLyAyKVxuXG4gICAgICAgICMgIEZpZ3VyZSBvdXQgd2hlcmUgdG8gcGxhY2UgdGhlIENvbG9yIFBpY2tlclxuICAgICAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgX3RvdGFsT2Zmc2V0VG9wID0gX3BhbmVPZmZzZXRUb3AgKyBfbGluZUhlaWdodCAtIF9lZGl0b3JTY3JvbGxUb3AgKyBfZWRpdG9yT2Zmc2V0VG9wXG4gICAgICAgICAgICBfdG90YWxPZmZzZXRMZWZ0ID0gX3BhbmVPZmZzZXRMZWZ0ICsgX2VkaXRvck9mZnNldExlZnQgKyBfbGluZU9mZnNldExlZnRcblxuICAgICAgICAgICAgX3Bvc2l0aW9uID1cbiAgICAgICAgICAgICAgICB4OiBfY3Vyc29yUG9zaXRpb24ubGVmdCArIF90b3RhbE9mZnNldExlZnRcbiAgICAgICAgICAgICAgICB5OiBfY3Vyc29yUG9zaXRpb24udG9wICsgX3RvdGFsT2Zmc2V0VG9wXG5cbiAgICAgICAgIyAgRmlndXJlIG91dCB3aGVyZSB0byBhY3R1YWxseSBwbGFjZSB0aGUgQ29sb3IgUGlja2VyIGJ5XG4gICAgICAgICMgIHNldHRpbmcgdXAgYm91bmRhcmllcyBhbmQgZmxpcHBpbmcgaXQgaWYgbmVjZXNzYXJ5XG4gICAgICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBfY29sb3JQaWNrZXJQb3NpdGlvbiA9XG4gICAgICAgICAgICAgICAgeDogZG8gPT5cbiAgICAgICAgICAgICAgICAgICAgX2NvbG9yUGlja2VyV2lkdGggPSBAZWxlbWVudC53aWR0aCgpXG4gICAgICAgICAgICAgICAgICAgIF9oYWxmQ29sb3JQaWNrZXJXaWR0aCA9IChfY29sb3JQaWNrZXJXaWR0aCAvIDIpIDw8IDBcblxuICAgICAgICAgICAgICAgICAgICAjIE1ha2Ugc3VyZSB0aGUgQ29sb3IgUGlja2VyIGlzbid0IHRvbyBmYXIgdG8gdGhlIGxlZnRcbiAgICAgICAgICAgICAgICAgICAgX3ggPSBNYXRoLm1heCAxMCwgX3Bvc2l0aW9uLnggLSBfaGFsZkNvbG9yUGlja2VyV2lkdGhcbiAgICAgICAgICAgICAgICAgICAgIyBNYWtlIHN1cmUgdGhlIENvbG9yIFBpY2tlciBpc24ndCB0b28gZmFyIHRvIHRoZSByaWdodFxuICAgICAgICAgICAgICAgICAgICBfeCA9IE1hdGgubWluIChAUGFyZW50Lm9mZnNldFdpZHRoIC0gX2NvbG9yUGlja2VyV2lkdGggLSAxMCksIF94XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF94XG4gICAgICAgICAgICAgICAgeTogZG8gPT5cbiAgICAgICAgICAgICAgICAgICAgQGVsZW1lbnQudW5mbGlwKClcblxuICAgICAgICAgICAgICAgICAgICAjIFRPRE86IEl0J3Mgbm90IHJlYWxseSB3b3JraW5nIG91dCBncmVhdFxuXG4gICAgICAgICAgICAgICAgICAgICMgSWYgdGhlIGNvbG9yIHBpY2tlciBpcyB0b28gZmFyIGRvd24sIGZsaXAgaXRcbiAgICAgICAgICAgICAgICAgICAgaWYgQGVsZW1lbnQuaGVpZ2h0KCkgKyBfcG9zaXRpb24ueSA+IEBQYXJlbnQub2Zmc2V0SGVpZ2h0IC0gMzJcbiAgICAgICAgICAgICAgICAgICAgICAgIEBlbGVtZW50LmZsaXAoKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9wb3NpdGlvbi55IC0gX2xpbmVIZWlnaHQgLSBAZWxlbWVudC5oZWlnaHQoKVxuICAgICAgICAgICAgICAgICAgICAjIEJ1dCBpZiBpdCdzIGZpbmUsIGtlZXAgdGhlIFkgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgZWxzZSByZXR1cm4gX3Bvc2l0aW9uLnlcblxuICAgICAgICAgICAgIyBTZXQgQ29sb3IgUGlja2VyIHBvc2l0aW9uIGFuZCBlbWl0IGV2ZW50c1xuICAgICAgICAgICAgQGVsZW1lbnQuc2V0UG9zaXRpb24gX2NvbG9yUGlja2VyUG9zaXRpb24ueCwgX2NvbG9yUGlja2VyUG9zaXRpb24ueVxuICAgICAgICAgICAgQGVtaXRQb3NpdGlvbkNoYW5nZSBfcG9zaXRpb24sIF9jb2xvclBpY2tlclBvc2l0aW9uXG5cbiAgICAgICAgICAgICMgT3BlbiB0aGUgQ29sb3IgUGlja2VyXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT4gIyB3YWl0IGZvciBjbGFzcyBkZWxheVxuICAgICAgICAgICAgICAgIEBlbGVtZW50Lm9wZW4oKVxuICAgICAgICAgICAgICAgIEBlbWl0T3BlbigpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgIyAgUmVwbGFjZSBzZWxlY3RlZCBjb2xvclxuICAgICMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICBjYW5SZXBsYWNlOiB5ZXNcbiAgICAgICAgcmVwbGFjZTogKGNvbG9yKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBAY2FuUmVwbGFjZVxuICAgICAgICAgICAgQGNhblJlcGxhY2UgPSBub1xuXG4gICAgICAgICAgICBFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICAgIEVkaXRvci5jbGVhclNlbGVjdGlvbnMoKVxuXG4gICAgICAgICAgICBpZiBAc2VsZWN0aW9uLm1hdGNoXG4gICAgICAgICAgICAgICAgX2N1cnNvclN0YXJ0ID0gQHNlbGVjdGlvbi5tYXRjaC5zdGFydFxuICAgICAgICAgICAgICAgIF9jdXJzb3JFbmQgPSBAc2VsZWN0aW9uLm1hdGNoLmVuZFxuICAgICAgICAgICAgZWxzZSBfY3Vyc29yU3RhcnQgPSBfY3Vyc29yRW5kID0gQHNlbGVjdGlvbi5jb2x1bW5cblxuICAgICAgICAgICAgIyBTZWxlY3QgdGhlIGNvbG9yIHdlJ3JlIGdvaW5nIHRvIHJlcGxhY2VcbiAgICAgICAgICAgIEVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZSBbXG4gICAgICAgICAgICAgICAgW0BzZWxlY3Rpb24ucm93LCBfY3Vyc29yU3RhcnRdXG4gICAgICAgICAgICAgICAgW0BzZWxlY3Rpb24ucm93LCBfY3Vyc29yRW5kXV1cbiAgICAgICAgICAgIEVkaXRvci5yZXBsYWNlU2VsZWN0ZWRUZXh0IG51bGwsID0+IGNvbG9yXG5cbiAgICAgICAgICAgICMgU2VsZWN0IHRoZSBuZXdseSBpbnNlcnRlZCBjb2xvciBhbmQgbW92ZSB0aGUgY3Vyc29yIHRvIGl0XG4gICAgICAgICAgICBzZXRUaW1lb3V0ID0+XG4gICAgICAgICAgICAgICAgRWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFtcbiAgICAgICAgICAgICAgICAgICAgQHNlbGVjdGlvbi5yb3csIF9jdXJzb3JTdGFydF1cbiAgICAgICAgICAgICAgICBFZGl0b3IuY2xlYXJTZWxlY3Rpb25zKClcblxuICAgICAgICAgICAgICAgICMgVXBkYXRlIHNlbGVjdGlvbiBsZW5ndGhcbiAgICAgICAgICAgICAgICBAc2VsZWN0aW9uLm1hdGNoPy5lbmQgPSBfY3Vyc29yU3RhcnQgKyBjb2xvci5sZW5ndGhcblxuICAgICAgICAgICAgICAgIEVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZSBbXG4gICAgICAgICAgICAgICAgICAgIFtAc2VsZWN0aW9uLnJvdywgX2N1cnNvclN0YXJ0XVxuICAgICAgICAgICAgICAgICAgICBbQHNlbGVjdGlvbi5yb3csIF9jdXJzb3JTdGFydCArIGNvbG9yLmxlbmd0aF1dXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQgKCA9PiBAY2FuUmVwbGFjZSA9IHllcyksIDEwMFxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAjIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAjICBDbG9zZSB0aGUgQ29sb3IgUGlja2VyXG4gICAgIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIGNsb3NlOiAtPlxuICAgICAgICAgICAgQGVsZW1lbnQuY2xvc2UoKVxuICAgICAgICAgICAgQGVtaXRDbG9zZSgpXG4iXX0=
