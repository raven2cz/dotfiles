(function() {
  var Cursor, Delegator, DisplayBuffer, Editor, LanguageMode, Model, Point, Range, Selection, Serializable, TextMateScopeSelector, _, deprecate, path, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('underscore-plus');

  path = require('path');

  Serializable = require('serializable');

  Delegator = require('delegato');

  deprecate = require('grim').deprecate;

  Model = require('theorist').Model;

  ref = require('text-buffer'), Point = ref.Point, Range = ref.Range;

  LanguageMode = require('./language-mode');

  DisplayBuffer = require('./display-buffer');

  Cursor = require('./cursor');

  Selection = require('./selection');

  TextMateScopeSelector = require('first-mate').ScopeSelector;

  module.exports = Editor = (function(superClass) {
    extend(Editor, superClass);

    Serializable.includeInto(Editor);

    atom.deserializers.add(Editor);

    Delegator.includeInto(Editor);

    Editor.prototype.deserializing = false;

    Editor.prototype.callDisplayBufferCreatedHook = false;

    Editor.prototype.registerEditor = false;

    Editor.prototype.buffer = null;

    Editor.prototype.languageMode = null;

    Editor.prototype.cursors = null;

    Editor.prototype.selections = null;

    Editor.prototype.suppressSelectionMerging = false;

    Editor.delegatesMethods('suggestedIndentForBufferRow', 'autoIndentBufferRow', 'autoIndentBufferRows', 'autoDecreaseIndentForBufferRow', 'toggleLineCommentForBufferRow', 'toggleLineCommentsForBufferRows', {
      toProperty: 'languageMode'
    });

    Editor.delegatesProperties('$lineHeight', '$defaultCharWidth', '$height', '$width', '$scrollTop', '$scrollLeft', 'manageScrollPosition', {
      toProperty: 'displayBuffer'
    });

    function Editor(arg) {
      var buffer, initialColumn, initialLine, j, len, marker, ref1, ref2, ref3, ref4, ref5, registerEditor, softWrap, suppressCursorCreation, tabLength;
      this.softTabs = arg.softTabs, initialLine = arg.initialLine, initialColumn = arg.initialColumn, tabLength = arg.tabLength, softWrap = arg.softWrap, this.displayBuffer = arg.displayBuffer, buffer = arg.buffer, registerEditor = arg.registerEditor, suppressCursorCreation = arg.suppressCursorCreation;
      this.handleMarkerCreated = bind(this.handleMarkerCreated, this);
      Editor.__super__.constructor.apply(this, arguments);
      this.cursors = [];
      this.selections = [];
      if (this.displayBuffer == null) {
        this.displayBuffer = new DisplayBuffer({
          buffer: buffer,
          tabLength: tabLength,
          softWrap: softWrap
        });
      }
      this.buffer = this.displayBuffer.buffer;
      this.softTabs = (ref1 = (ref2 = (ref3 = this.buffer.usesSoftTabs()) != null ? ref3 : this.softTabs) != null ? ref2 : atom.config.get('editor.softTabs')) != null ? ref1 : true;
      ref4 = this.findMarkers(this.getSelectionMarkerAttributes());
      for (j = 0, len = ref4.length; j < len; j++) {
        marker = ref4[j];
        marker.setAttributes({
          preserveFolds: true
        });
        this.addSelection(marker);
      }
      this.subscribeToBuffer();
      this.subscribeToDisplayBuffer();
      if (this.getCursors().length === 0 && !suppressCursorCreation) {
        initialLine = Math.max(parseInt(initialLine) || 0, 0);
        initialColumn = Math.max(parseInt(initialColumn) || 0, 0);
        this.addCursorAtBufferPosition([initialLine, initialColumn]);
      }
      this.languageMode = new LanguageMode(this);
      this.subscribe(this.$scrollTop, (function(_this) {
        return function(scrollTop) {
          return _this.emit('scroll-top-changed', scrollTop);
        };
      })(this));
      this.subscribe(this.$scrollLeft, (function(_this) {
        return function(scrollLeft) {
          return _this.emit('scroll-left-changed', scrollLeft);
        };
      })(this));
      if (registerEditor) {
        if ((ref5 = atom.workspace) != null) {
          ref5.editorAdded(this);
        }
      }
    }

    Editor.prototype.serializeParams = function() {
      return {
        id: this.id,
        softTabs: this.softTabs,
        scrollTop: this.scrollTop,
        scrollLeft: this.scrollLeft,
        displayBuffer: this.displayBuffer.serialize()
      };
    };

    Editor.prototype.deserializeParams = function(params) {
      params.displayBuffer = DisplayBuffer.deserialize(params.displayBuffer);
      params.registerEditor = true;
      return params;
    };

    Editor.prototype.subscribeToBuffer = function() {
      this.buffer.retain();
      this.subscribe(this.buffer, "path-changed", (function(_this) {
        return function() {
          if (atom.project.getPath() == null) {
            atom.project.setPath(path.dirname(_this.getPath()));
          }
          _this.emit("title-changed");
          return _this.emit("path-changed");
        };
      })(this));
      this.subscribe(this.buffer, "contents-modified", (function(_this) {
        return function() {
          return _this.emit("contents-modified");
        };
      })(this));
      this.subscribe(this.buffer, "contents-conflicted", (function(_this) {
        return function() {
          return _this.emit("contents-conflicted");
        };
      })(this));
      this.subscribe(this.buffer, "modified-status-changed", (function(_this) {
        return function() {
          return _this.emit("modified-status-changed");
        };
      })(this));
      this.subscribe(this.buffer, "destroyed", (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
      return this.preserveCursorPositionOnBufferReload();
    };

    Editor.prototype.subscribeToDisplayBuffer = function() {
      this.subscribe(this.displayBuffer, 'marker-created', this.handleMarkerCreated);
      this.subscribe(this.displayBuffer, "changed", (function(_this) {
        return function(e) {
          return _this.emit('screen-lines-changed', e);
        };
      })(this));
      this.subscribe(this.displayBuffer, "markers-updated", (function(_this) {
        return function() {
          return _this.mergeIntersectingSelections();
        };
      })(this));
      this.subscribe(this.displayBuffer, 'grammar-changed', (function(_this) {
        return function() {
          return _this.handleGrammarChange();
        };
      })(this));
      return this.subscribe(this.displayBuffer, 'soft-wrap-changed', (function(_this) {
        return function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return _this.emit.apply(_this, ['soft-wrap-changed'].concat(slice.call(args)));
        };
      })(this));
    };

    Editor.prototype.getViewClass = function() {
      if (atom.config.get('core.useReactEditor')) {
        return require('./react-editor-view');
      } else {
        return require('./editor-view');
      }
    };

    Editor.prototype.destroyed = function() {
      var j, len, ref1, selection;
      this.unsubscribe();
      ref1 = this.getSelections();
      for (j = 0, len = ref1.length; j < len; j++) {
        selection = ref1[j];
        selection.destroy();
      }
      this.buffer.release();
      this.displayBuffer.destroy();
      return this.languageMode.destroy();
    };

    Editor.prototype.copy = function() {
      var displayBuffer, j, len, marker, newEditor, ref1, softTabs, tabLength;
      tabLength = this.getTabLength();
      displayBuffer = this.displayBuffer.copy();
      softTabs = this.getSoftTabs();
      newEditor = new Editor({
        buffer: this.buffer,
        displayBuffer: displayBuffer,
        tabLength: tabLength,
        softTabs: softTabs,
        suppressCursorCreation: true,
        registerEditor: true
      });
      ref1 = this.findMarkers({
        editorId: this.id
      });
      for (j = 0, len = ref1.length; j < len; j++) {
        marker = ref1[j];
        marker.copy({
          editorId: newEditor.id,
          preserveFolds: true
        });
      }
      return newEditor;
    };

    Editor.prototype.getTitle = function() {
      var sessionPath;
      if (sessionPath = this.getPath()) {
        return path.basename(sessionPath);
      } else {
        return 'untitled';
      }
    };

    Editor.prototype.getLongTitle = function() {
      var directory, fileName, sessionPath;
      if (sessionPath = this.getPath()) {
        fileName = path.basename(sessionPath);
        directory = path.basename(path.dirname(sessionPath));
        return fileName + " - " + directory;
      } else {
        return 'untitled';
      }
    };

    Editor.prototype.setVisible = function(visible) {
      return this.displayBuffer.setVisible(visible);
    };

    Editor.prototype.setEditorWidthInChars = function(editorWidthInChars) {
      return this.displayBuffer.setEditorWidthInChars(editorWidthInChars);
    };

    Editor.prototype.getSoftWrapColumn = function() {
      return this.displayBuffer.getSoftWrapColumn();
    };

    Editor.prototype.getSoftTabs = function() {
      return this.softTabs;
    };

    Editor.prototype.setSoftTabs = function(softTabs1) {
      this.softTabs = softTabs1;
      return this.softTabs;
    };

    Editor.prototype.toggleSoftTabs = function() {
      return this.setSoftTabs(!this.getSoftTabs());
    };

    Editor.prototype.getSoftWrap = function() {
      return this.displayBuffer.getSoftWrap();
    };

    Editor.prototype.setSoftWrap = function(softWrap) {
      return this.displayBuffer.setSoftWrap(softWrap);
    };

    Editor.prototype.toggleSoftWrap = function() {
      return this.setSoftWrap(!this.getSoftWrap());
    };

    Editor.prototype.getTabText = function() {
      return this.buildIndentString(1);
    };

    Editor.prototype.getTabLength = function() {
      return this.displayBuffer.getTabLength();
    };

    Editor.prototype.setTabLength = function(tabLength) {
      return this.displayBuffer.setTabLength(tabLength);
    };

    Editor.prototype.clipBufferPosition = function(bufferPosition) {
      return this.buffer.clipPosition(bufferPosition);
    };

    Editor.prototype.clipBufferRange = function(range) {
      return this.buffer.clipRange(range);
    };

    Editor.prototype.indentationForBufferRow = function(bufferRow) {
      return this.indentLevelForLine(this.lineForBufferRow(bufferRow));
    };

    Editor.prototype.setIndentationForBufferRow = function(bufferRow, newLevel, arg) {
      var endColumn, newIndentString, preserveLeadingWhitespace;
      preserveLeadingWhitespace = (arg != null ? arg : {}).preserveLeadingWhitespace;
      if (preserveLeadingWhitespace) {
        endColumn = 0;
      } else {
        endColumn = this.lineForBufferRow(bufferRow).match(/^\s*/)[0].length;
      }
      newIndentString = this.buildIndentString(newLevel);
      return this.buffer.setTextInRange([[bufferRow, 0], [bufferRow, endColumn]], newIndentString);
    };

    Editor.prototype.indentLevelForLine = function(line) {
      return this.displayBuffer.indentLevelForLine(line);
    };

    Editor.prototype.buildIndentString = function(number) {
      if (this.getSoftTabs()) {
        return _.multiplyString(" ", Math.floor(number * this.getTabLength()));
      } else {
        return _.multiplyString("\t", Math.floor(number));
      }
    };

    Editor.prototype.save = function() {
      return this.buffer.save();
    };

    Editor.prototype.saveAs = function(filePath) {
      return this.buffer.saveAs(filePath);
    };

    Editor.prototype.checkoutHead = function() {
      var filePath, ref1;
      if (filePath = this.getPath()) {
        return (ref1 = atom.project.getRepo()) != null ? ref1.checkoutHead(filePath) : void 0;
      }
    };

    Editor.prototype.copyPathToClipboard = function() {
      var filePath;
      if (filePath = this.getPath()) {
        return atom.clipboard.write(filePath);
      }
    };

    Editor.prototype.getPath = function() {
      return this.buffer.getPath();
    };

    Editor.prototype.getText = function() {
      return this.buffer.getText();
    };

    Editor.prototype.setText = function(text) {
      return this.buffer.setText(text);
    };

    Editor.prototype.getTextInRange = function(range) {
      return this.buffer.getTextInRange(range);
    };

    Editor.prototype.getLineCount = function() {
      return this.buffer.getLineCount();
    };

    Editor.prototype.getBuffer = function() {
      return this.buffer;
    };

    Editor.prototype.getUri = function() {
      return this.buffer.getUri();
    };

    Editor.prototype.isBufferRowBlank = function(bufferRow) {
      return this.buffer.isRowBlank(bufferRow);
    };

    Editor.prototype.isBufferRowCommented = function(bufferRow) {
      var match, scopes;
      if (match = this.lineForBufferRow(bufferRow).match(/\S/)) {
        scopes = this.tokenForBufferPosition([bufferRow, match.index]).scopes;
        return new TextMateScopeSelector('comment.*').matches(scopes);
      }
    };

    Editor.prototype.nextNonBlankBufferRow = function(bufferRow) {
      return this.buffer.nextNonBlankRow(bufferRow);
    };

    Editor.prototype.getEofBufferPosition = function() {
      return this.buffer.getEndPosition();
    };

    Editor.prototype.getLastBufferRow = function() {
      return this.buffer.getLastRow();
    };

    Editor.prototype.bufferRangeForBufferRow = function(row, arg) {
      var includeNewline;
      includeNewline = (arg != null ? arg : {}).includeNewline;
      return this.buffer.rangeForRow(row, includeNewline);
    };

    Editor.prototype.lineForBufferRow = function(row) {
      return this.buffer.lineForRow(row);
    };

    Editor.prototype.lineLengthForBufferRow = function(row) {
      return this.buffer.lineLengthForRow(row);
    };

    Editor.prototype.scan = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.buffer).scan.apply(ref1, args);
    };

    Editor.prototype.scanInBufferRange = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.buffer).scanInRange.apply(ref1, args);
    };

    Editor.prototype.backwardsScanInBufferRange = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.buffer).backwardsScanInRange.apply(ref1, args);
    };

    Editor.prototype.isModified = function() {
      return this.buffer.isModified();
    };

    Editor.prototype.shouldPromptToSave = function() {
      return this.isModified() && !this.buffer.hasMultipleEditors();
    };

    Editor.prototype.screenPositionForBufferPosition = function(bufferPosition, options) {
      return this.displayBuffer.screenPositionForBufferPosition(bufferPosition, options);
    };

    Editor.prototype.bufferPositionForScreenPosition = function(screenPosition, options) {
      return this.displayBuffer.bufferPositionForScreenPosition(screenPosition, options);
    };

    Editor.prototype.screenRangeForBufferRange = function(bufferRange) {
      return this.displayBuffer.screenRangeForBufferRange(bufferRange);
    };

    Editor.prototype.bufferRangeForScreenRange = function(screenRange) {
      return this.displayBuffer.bufferRangeForScreenRange(screenRange);
    };

    Editor.prototype.clipScreenPosition = function(screenPosition, options) {
      return this.displayBuffer.clipScreenPosition(screenPosition, options);
    };

    Editor.prototype.lineForScreenRow = function(row) {
      return this.displayBuffer.lineForRow(row);
    };

    Editor.prototype.linesForScreenRows = function(start, end) {
      return this.displayBuffer.linesForRows(start, end);
    };

    Editor.prototype.getScreenLineCount = function() {
      return this.displayBuffer.getLineCount();
    };

    Editor.prototype.getMaxScreenLineLength = function() {
      return this.displayBuffer.getMaxLineLength();
    };

    Editor.prototype.getLastScreenRow = function() {
      return this.displayBuffer.getLastRow();
    };

    Editor.prototype.bufferRowsForScreenRows = function(startRow, endRow) {
      return this.displayBuffer.bufferRowsForScreenRows(startRow, endRow);
    };

    Editor.prototype.bufferRowForScreenRow = function(row) {
      return this.displayBuffer.bufferRowForScreenRow(row);
    };

    Editor.prototype.scopesForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.scopesForBufferPosition(bufferPosition);
    };

    Editor.prototype.bufferRangeForScopeAtCursor = function(selector) {
      return this.displayBuffer.bufferRangeForScopeAtPosition(selector, this.getCursorBufferPosition());
    };

    Editor.prototype.tokenForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.tokenForBufferPosition(bufferPosition);
    };

    Editor.prototype.getCursorScopes = function() {
      return this.getCursor().getScopes();
    };

    Editor.prototype.logCursorScope = function() {
      return console.log(this.getCursorScopes());
    };

    Editor.prototype.insertText = function(text, options) {
      if (options == null) {
        options = {};
      }
      if (options.autoIndentNewline == null) {
        options.autoIndentNewline = this.shouldAutoIndent();
      }
      if (options.autoDecreaseIndent == null) {
        options.autoDecreaseIndent = this.shouldAutoIndent();
      }
      return this.mutateSelectedText(function(selection) {
        return selection.insertText(text, options);
      });
    };

    Editor.prototype.insertNewline = function() {
      return this.insertText('\n');
    };

    Editor.prototype.insertNewlineBelow = function() {
      return this.transact((function(_this) {
        return function() {
          _this.moveCursorToEndOfLine();
          return _this.insertNewline();
        };
      })(this));
    };

    Editor.prototype.insertNewlineAbove = function() {
      return this.transact((function(_this) {
        return function() {
          var bufferRow, indentLevel, onFirstLine;
          bufferRow = _this.getCursorBufferPosition().row;
          indentLevel = _this.indentationForBufferRow(bufferRow);
          onFirstLine = bufferRow === 0;
          _this.moveCursorToBeginningOfLine();
          _this.moveCursorLeft();
          _this.insertNewline();
          if (_this.shouldAutoIndent() && _this.indentationForBufferRow(bufferRow) < indentLevel) {
            _this.setIndentationForBufferRow(bufferRow, indentLevel);
          }
          if (onFirstLine) {
            _this.moveCursorUp();
            return _this.moveCursorToEndOfLine();
          }
        };
      })(this));
    };

    Editor.prototype.indent = function(options) {
      if (options == null) {
        options = {};
      }
      if (options.autoIndent == null) {
        options.autoIndent = this.shouldAutoIndent();
      }
      return this.mutateSelectedText(function(selection) {
        return selection.indent(options);
      });
    };

    Editor.prototype.backspace = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspace();
      });
    };

    Editor.prototype.backspaceToBeginningOfWord = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspaceToBeginningOfWord();
      });
    };

    Editor.prototype.backspaceToBeginningOfLine = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.backspaceToBeginningOfLine();
      });
    };

    Editor.prototype["delete"] = function() {
      return this.mutateSelectedText(function(selection) {
        return selection["delete"]();
      });
    };

    Editor.prototype.deleteToEndOfWord = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.deleteToEndOfWord();
      });
    };

    Editor.prototype.deleteLine = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.deleteLine();
      });
    };

    Editor.prototype.indentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.indentSelectedRows();
      });
    };

    Editor.prototype.outdentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.outdentSelectedRows();
      });
    };

    Editor.prototype.toggleLineCommentsInSelection = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.toggleLineComments();
      });
    };

    Editor.prototype.autoIndentSelectedRows = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.autoIndentSelectedRows();
      });
    };

    Editor.prototype.normalizeTabsInBufferRange = function(bufferRange) {
      if (!this.getSoftTabs()) {
        return;
      }
      return this.scanInBufferRange(/\t/g, bufferRange, (function(_this) {
        return function(arg) {
          var replace;
          replace = arg.replace;
          return replace(_this.getTabText());
        };
      })(this));
    };

    Editor.prototype.cutToEndOfLine = function() {
      var maintainClipboard;
      maintainClipboard = false;
      return this.mutateSelectedText(function(selection) {
        selection.cutToEndOfLine(maintainClipboard);
        return maintainClipboard = true;
      });
    };

    Editor.prototype.cutSelectedText = function() {
      var maintainClipboard;
      maintainClipboard = false;
      return this.mutateSelectedText(function(selection) {
        selection.cut(maintainClipboard);
        return maintainClipboard = true;
      });
    };

    Editor.prototype.copySelectedText = function() {
      var j, len, maintainClipboard, ref1, results, selection;
      maintainClipboard = false;
      ref1 = this.getSelections();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        selection = ref1[j];
        selection.copy(maintainClipboard);
        results.push(maintainClipboard = true);
      }
      return results;
    };

    Editor.prototype.pasteText = function(options) {
      var containsNewlines, metadata, ref1, text;
      if (options == null) {
        options = {};
      }
      ref1 = atom.clipboard.readWithMetadata(), text = ref1.text, metadata = ref1.metadata;
      containsNewlines = text.indexOf('\n') !== -1;
      if (((metadata != null ? metadata.selections : void 0) != null) && metadata.selections.length === this.getSelections().length) {
        this.mutateSelectedText((function(_this) {
          return function(selection, index) {
            text = metadata.selections[index];
            return selection.insertText(text, options);
          };
        })(this));
        return;
      } else if (atom.config.get("editor.normalizeIndentOnPaste") && ((metadata != null ? metadata.indentBasis : void 0) != null)) {
        if (!this.getCursor().hasPrecedingCharactersOnLine() || containsNewlines) {
          if (options.indentBasis == null) {
            options.indentBasis = metadata.indentBasis;
          }
        }
      }
      return this.insertText(text, options);
    };

    Editor.prototype.undo = function() {
      this.getCursor().needsAutoscroll = true;
      return this.buffer.undo(this);
    };

    Editor.prototype.redo = function() {
      this.getCursor().needsAutoscroll = true;
      return this.buffer.redo(this);
    };

    Editor.prototype.foldCurrentRow = function() {
      var bufferRow;
      bufferRow = this.bufferPositionForScreenPosition(this.getCursorScreenPosition()).row;
      return this.foldBufferRow(bufferRow);
    };

    Editor.prototype.unfoldCurrentRow = function() {
      var bufferRow;
      bufferRow = this.bufferPositionForScreenPosition(this.getCursorScreenPosition()).row;
      return this.unfoldBufferRow(bufferRow);
    };

    Editor.prototype.foldSelectedLines = function() {
      var j, len, ref1, results, selection;
      ref1 = this.getSelections();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        selection = ref1[j];
        results.push(selection.fold());
      }
      return results;
    };

    Editor.prototype.foldAll = function() {
      return this.languageMode.foldAll();
    };

    Editor.prototype.unfoldAll = function() {
      return this.languageMode.unfoldAll();
    };

    Editor.prototype.foldAllAtIndentLevel = function(level) {
      return this.languageMode.foldAllAtIndentLevel(level);
    };

    Editor.prototype.foldBufferRow = function(bufferRow) {
      return this.languageMode.foldBufferRow(bufferRow);
    };

    Editor.prototype.unfoldBufferRow = function(bufferRow) {
      return this.displayBuffer.unfoldBufferRow(bufferRow);
    };

    Editor.prototype.isFoldableAtBufferRow = function(bufferRow) {
      return this.languageMode.isFoldableAtBufferRow(bufferRow);
    };

    Editor.prototype.createFold = function(startRow, endRow) {
      return this.displayBuffer.createFold(startRow, endRow);
    };

    Editor.prototype.destroyFoldWithId = function(id) {
      return this.displayBuffer.destroyFoldWithId(id);
    };

    Editor.prototype.destroyFoldsIntersectingBufferRange = function(bufferRange) {
      var j, ref1, ref2, results, row;
      results = [];
      for (row = j = ref1 = bufferRange.start.row, ref2 = bufferRange.end.row; ref1 <= ref2 ? j <= ref2 : j >= ref2; row = ref1 <= ref2 ? ++j : --j) {
        results.push(this.unfoldBufferRow(row));
      }
      return results;
    };

    Editor.prototype.toggleFoldAtBufferRow = function(bufferRow) {
      if (this.isFoldedAtBufferRow(bufferRow)) {
        return this.unfoldBufferRow(bufferRow);
      } else {
        return this.foldBufferRow(bufferRow);
      }
    };

    Editor.prototype.isFoldedAtCursorRow = function() {
      return this.isFoldedAtScreenRow(this.getCursorScreenRow());
    };

    Editor.prototype.isFoldedAtBufferRow = function(bufferRow) {
      return this.displayBuffer.isFoldedAtBufferRow(bufferRow);
    };

    Editor.prototype.isFoldedAtScreenRow = function(screenRow) {
      return this.displayBuffer.isFoldedAtScreenRow(screenRow);
    };

    Editor.prototype.largestFoldContainingBufferRow = function(bufferRow) {
      return this.displayBuffer.largestFoldContainingBufferRow(bufferRow);
    };

    Editor.prototype.largestFoldStartingAtScreenRow = function(screenRow) {
      return this.displayBuffer.largestFoldStartingAtScreenRow(screenRow);
    };

    Editor.prototype.outermostFoldsInBufferRowRange = function(startRow, endRow) {
      return this.displayBuffer.outermostFoldsInBufferRowRange(startRow, endRow);
    };

    Editor.prototype.moveLineUp = function() {
      var lastRow, selection;
      selection = this.getSelectedBufferRange();
      if (selection.start.row === 0) {
        return;
      }
      lastRow = this.buffer.getLastRow();
      if (selection.isEmpty() && selection.start.row === lastRow && this.buffer.getLastLine() === '') {
        return;
      }
      return this.transact((function(_this) {
        return function() {
          var bufferRange, endPosition, endRow, fold, foldedRow, foldedRows, insertDelta, insertPosition, j, k, l, len, len1, lines, precedingBufferRow, precedingScreenRow, ref1, ref2, results, row, rows, startRow;
          foldedRows = [];
          rows = (function() {
            results = [];
            for (var j = ref1 = selection.start.row, ref2 = selection.end.row; ref1 <= ref2 ? j <= ref2 : j >= ref2; ref1 <= ref2 ? j++ : j--){ results.push(j); }
            return results;
          }).apply(this);
          if (selection.start.row !== selection.end.row && selection.end.column === 0) {
            if (!_this.isFoldedAtBufferRow(selection.end.row)) {
              rows.pop();
            }
          }
          precedingScreenRow = _this.screenPositionForBufferPosition([selection.start.row]).translate([-1]);
          precedingBufferRow = _this.bufferPositionForScreenPosition(precedingScreenRow).row;
          if (fold = _this.largestFoldContainingBufferRow(precedingBufferRow)) {
            insertDelta = fold.getBufferRange().getRowCount();
          } else {
            insertDelta = 1;
          }
          for (k = 0, len = rows.length; k < len; k++) {
            row = rows[k];
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(row)) {
              bufferRange = fold.getBufferRange();
              startRow = bufferRange.start.row;
              endRow = bufferRange.end.row;
              foldedRows.push(startRow - insertDelta);
            } else {
              startRow = row;
              endRow = row;
            }
            insertPosition = Point.fromObject([startRow - insertDelta]);
            endPosition = Point.min([endRow + 1], _this.buffer.getEndPosition());
            lines = _this.buffer.getTextInRange([[startRow], endPosition]);
            if (endPosition.row === lastRow && endPosition.column > 0 && !_this.buffer.lineEndingForRow(endPosition.row)) {
              lines = lines + "\n";
            }
            _this.buffer.deleteRows(startRow, endRow);
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(insertPosition.row)) {
              _this.unfoldBufferRow(insertPosition.row);
              foldedRows.push(insertPosition.row + endRow - startRow + fold.getBufferRange().getRowCount());
            }
            _this.buffer.insert(insertPosition, lines);
          }
          for (l = 0, len1 = foldedRows.length; l < len1; l++) {
            foldedRow = foldedRows[l];
            if ((0 <= foldedRow && foldedRow <= _this.getLastBufferRow())) {
              _this.foldBufferRow(foldedRow);
            }
          }
          return _this.setSelectedBufferRange(selection.translate([-insertDelta]), {
            preserveFolds: true,
            autoscroll: true
          });
        };
      })(this));
    };

    Editor.prototype.moveLineDown = function() {
      var lastRow, selection;
      selection = this.getSelectedBufferRange();
      lastRow = this.buffer.getLastRow();
      if (selection.end.row === lastRow) {
        return;
      }
      if (selection.end.row === lastRow - 1 && this.buffer.getLastLine() === '') {
        return;
      }
      return this.transact((function(_this) {
        return function() {
          var bufferRange, endPosition, endRow, fold, foldedRow, foldedRows, followingBufferRow, followingScreenRow, insertDelta, insertPosition, j, k, l, len, len1, lines, ref1, ref2, results, row, rows, startRow;
          foldedRows = [];
          rows = (function() {
            results = [];
            for (var j = ref1 = selection.end.row, ref2 = selection.start.row; ref1 <= ref2 ? j <= ref2 : j >= ref2; ref1 <= ref2 ? j++ : j--){ results.push(j); }
            return results;
          }).apply(this);
          if (selection.start.row !== selection.end.row && selection.end.column === 0) {
            if (!_this.isFoldedAtBufferRow(selection.end.row)) {
              rows.shift();
            }
          }
          followingScreenRow = _this.screenPositionForBufferPosition([selection.end.row]).translate([1]);
          followingBufferRow = _this.bufferPositionForScreenPosition(followingScreenRow).row;
          if (fold = _this.largestFoldContainingBufferRow(followingBufferRow)) {
            insertDelta = fold.getBufferRange().getRowCount();
          } else {
            insertDelta = 1;
          }
          for (k = 0, len = rows.length; k < len; k++) {
            row = rows[k];
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(row)) {
              bufferRange = fold.getBufferRange();
              startRow = bufferRange.start.row;
              endRow = bufferRange.end.row;
              foldedRows.push(endRow + insertDelta);
            } else {
              startRow = row;
              endRow = row;
            }
            if (endRow + 1 === lastRow) {
              endPosition = [endRow, _this.buffer.lineLengthForRow(endRow)];
            } else {
              endPosition = [endRow + 1];
            }
            lines = _this.buffer.getTextInRange([[startRow], endPosition]);
            _this.buffer.deleteRows(startRow, endRow);
            insertPosition = Point.min([startRow + insertDelta], _this.buffer.getEndPosition());
            if (insertPosition.row === _this.buffer.getLastRow() && insertPosition.column > 0) {
              lines = "\n" + lines;
            }
            if (fold = _this.displayBuffer.largestFoldStartingAtBufferRow(insertPosition.row)) {
              _this.unfoldBufferRow(insertPosition.row);
              foldedRows.push(insertPosition.row + fold.getBufferRange().getRowCount());
            }
            _this.buffer.insert(insertPosition, lines);
          }
          for (l = 0, len1 = foldedRows.length; l < len1; l++) {
            foldedRow = foldedRows[l];
            if ((0 <= foldedRow && foldedRow <= _this.getLastBufferRow())) {
              _this.foldBufferRow(foldedRow);
            }
          }
          return _this.setSelectedBufferRange(selection.translate([insertDelta]), {
            preserveFolds: true,
            autoscroll: true
          });
        };
      })(this));
    };

    Editor.prototype.duplicateLines = function() {
      return this.transact((function(_this) {
        return function() {
          var delta, endRow, foldEndRow, foldStartRow, foldedRowRanges, j, len, rangeToDuplicate, ref1, ref2, results, selectedBufferRange, selection, start, startRow, textToDuplicate;
          ref1 = _this.getSelectionsOrderedByBufferPosition().reverse();
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            selection = ref1[j];
            selectedBufferRange = selection.getBufferRange();
            if (selection.isEmpty()) {
              start = selection.getScreenRange().start;
              selection.selectToScreenPosition([start.row + 1, 0]);
            }
            ref2 = selection.getBufferRowRange(), startRow = ref2[0], endRow = ref2[1];
            endRow++;
            foldedRowRanges = _this.outermostFoldsInBufferRowRange(startRow, endRow).map(function(fold) {
              return fold.getBufferRowRange();
            });
            rangeToDuplicate = [[startRow, 0], [endRow, 0]];
            textToDuplicate = _this.getTextInBufferRange(rangeToDuplicate);
            if (endRow > _this.getLastBufferRow()) {
              textToDuplicate = '\n' + textToDuplicate;
            }
            _this.buffer.insert([endRow, 0], textToDuplicate);
            delta = endRow - startRow;
            selection.setBufferRange(selectedBufferRange.translate([delta, 0]));
            results.push((function() {
              var k, len1, ref3, results1;
              results1 = [];
              for (k = 0, len1 = foldedRowRanges.length; k < len1; k++) {
                ref3 = foldedRowRanges[k], foldStartRow = ref3[0], foldEndRow = ref3[1];
                results1.push(this.createFold(foldStartRow + delta, foldEndRow + delta));
              }
              return results1;
            }).call(_this));
          }
          return results;
        };
      })(this));
    };

    Editor.prototype.duplicateLine = function() {
      deprecate("Use Editor::duplicateLines() instead");
      return this.duplicateLines();
    };

    Editor.prototype.mutateSelectedText = function(fn) {
      return this.transact((function(_this) {
        return function() {
          var index, j, len, ref1, results, selection;
          ref1 = _this.getSelections();
          results = [];
          for (index = j = 0, len = ref1.length; j < len; index = ++j) {
            selection = ref1[index];
            results.push(fn(selection, index));
          }
          return results;
        };
      })(this));
    };

    Editor.prototype.replaceSelectedText = function(options, fn) {
      var selectWordIfEmpty;
      if (options == null) {
        options = {};
      }
      selectWordIfEmpty = options.selectWordIfEmpty;
      return this.mutateSelectedText(function(selection) {
        var range, text;
        range = selection.getBufferRange();
        if (selectWordIfEmpty && selection.isEmpty()) {
          selection.selectWord();
        }
        text = selection.getText();
        selection.deleteSelectedText();
        selection.insertText(fn(text));
        return selection.setBufferRange(range);
      });
    };

    Editor.prototype.getMarker = function(id) {
      return this.displayBuffer.getMarker(id);
    };

    Editor.prototype.getMarkers = function() {
      return this.displayBuffer.getMarkers();
    };

    Editor.prototype.findMarkers = function(properties) {
      return this.displayBuffer.findMarkers(properties);
    };

    Editor.prototype.markScreenRange = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.displayBuffer).markScreenRange.apply(ref1, args);
    };

    Editor.prototype.markBufferRange = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.displayBuffer).markBufferRange.apply(ref1, args);
    };

    Editor.prototype.markScreenPosition = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.displayBuffer).markScreenPosition.apply(ref1, args);
    };

    Editor.prototype.markBufferPosition = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.displayBuffer).markBufferPosition.apply(ref1, args);
    };

    Editor.prototype.destroyMarker = function() {
      var args, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return (ref1 = this.displayBuffer).destroyMarker.apply(ref1, args);
    };

    Editor.prototype.getMarkerCount = function() {
      return this.buffer.getMarkerCount();
    };

    Editor.prototype.hasMultipleCursors = function() {
      return this.getCursors().length > 1;
    };

    Editor.prototype.getCursors = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Array, this.cursors, function(){});
    };

    Editor.prototype.getCursor = function() {
      return _.last(this.cursors);
    };

    Editor.prototype.addCursorAtScreenPosition = function(screenPosition) {
      this.markScreenPosition(screenPosition, this.getSelectionMarkerAttributes());
      return this.getLastSelection().cursor;
    };

    Editor.prototype.addCursorAtBufferPosition = function(bufferPosition) {
      this.markBufferPosition(bufferPosition, this.getSelectionMarkerAttributes());
      return this.getLastSelection().cursor;
    };

    Editor.prototype.addCursor = function(marker) {
      var cursor;
      cursor = new Cursor({
        editor: this,
        marker: marker
      });
      this.cursors.push(cursor);
      this.emit('cursor-added', cursor);
      return cursor;
    };

    Editor.prototype.removeCursor = function(cursor) {
      return _.remove(this.cursors, cursor);
    };

    Editor.prototype.addSelection = function(marker, options) {
      var cursor, j, len, ref1, selection, selectionBufferRange;
      if (options == null) {
        options = {};
      }
      if (!marker.getAttributes().preserveFolds) {
        this.destroyFoldsIntersectingBufferRange(marker.getBufferRange());
      }
      cursor = this.addCursor(marker);
      selection = new Selection(_.extend({
        editor: this,
        marker: marker,
        cursor: cursor
      }, options));
      this.selections.push(selection);
      selectionBufferRange = selection.getBufferRange();
      this.mergeIntersectingSelections();
      if (selection.destroyed) {
        ref1 = this.getSelections();
        for (j = 0, len = ref1.length; j < len; j++) {
          selection = ref1[j];
          if (selection.intersectsBufferRange(selectionBufferRange)) {
            return selection;
          }
        }
      } else {
        this.emit('selection-added', selection);
        return selection;
      }
    };

    Editor.prototype.addSelectionForBufferRange = function(bufferRange, options) {
      if (options == null) {
        options = {};
      }
      this.markBufferRange(bufferRange, _.defaults(this.getSelectionMarkerAttributes(), options));
      return this.getLastSelection();
    };

    Editor.prototype.setSelectedBufferRange = function(bufferRange, options) {
      return this.setSelectedBufferRanges([bufferRange], options);
    };

    Editor.prototype.setSelectedScreenRange = function(screenRange, options) {
      return this.setSelectedBufferRange(this.bufferRangeForScreenRange(screenRange, options), options);
    };

    Editor.prototype.setSelectedBufferRanges = function(bufferRanges, options) {
      var j, len, ref1, selection, selections;
      if (options == null) {
        options = {};
      }
      if (!bufferRanges.length) {
        throw new Error("Passed an empty array to setSelectedBufferRanges");
      }
      selections = this.getSelections();
      ref1 = selections.slice(bufferRanges.length);
      for (j = 0, len = ref1.length; j < len; j++) {
        selection = ref1[j];
        selection.destroy();
      }
      return this.mergeIntersectingSelections(options, (function(_this) {
        return function() {
          var bufferRange, i, k, len1, results;
          results = [];
          for (i = k = 0, len1 = bufferRanges.length; k < len1; i = ++k) {
            bufferRange = bufferRanges[i];
            bufferRange = Range.fromObject(bufferRange);
            if (selections[i]) {
              results.push(selections[i].setBufferRange(bufferRange, options));
            } else {
              results.push(_this.addSelectionForBufferRange(bufferRange, options));
            }
          }
          return results;
        };
      })(this));
    };

    Editor.prototype.removeSelection = function(selection) {
      _.remove(this.selections, selection);
      return this.emit('selection-removed', selection);
    };

    Editor.prototype.clearSelections = function() {
      this.consolidateSelections();
      return this.getSelection().clear();
    };

    Editor.prototype.consolidateSelections = function() {
      var j, len, ref1, selection, selections;
      selections = this.getSelections();
      if (selections.length > 1) {
        ref1 = selections.slice(0, -1);
        for (j = 0, len = ref1.length; j < len; j++) {
          selection = ref1[j];
          selection.destroy();
        }
        return true;
      } else {
        return false;
      }
    };

    Editor.prototype.selectionScreenRangeChanged = function(selection) {
      return this.emit('selection-screen-range-changed', selection);
    };

    Editor.prototype.getSelections = function() {
      return (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(Array, this.selections, function(){});
    };

    Editor.prototype.getSelection = function(index) {
      if (index == null) {
        index = this.selections.length - 1;
      }
      return this.selections[index];
    };

    Editor.prototype.getLastSelection = function() {
      return _.last(this.selections);
    };

    Editor.prototype.getSelectionsOrderedByBufferPosition = function() {
      return this.getSelections().sort(function(a, b) {
        return a.compare(b);
      });
    };

    Editor.prototype.getLastSelectionInBuffer = function() {
      return _.last(this.getSelectionsOrderedByBufferPosition());
    };

    Editor.prototype.selectionIntersectsBufferRange = function(bufferRange) {
      return _.any(this.getSelections(), function(selection) {
        return selection.intersectsBufferRange(bufferRange);
      });
    };

    Editor.prototype.setCursorScreenPosition = function(position, options) {
      return this.moveCursors(function(cursor) {
        return cursor.setScreenPosition(position, options);
      });
    };

    Editor.prototype.getCursorScreenPosition = function() {
      return this.getCursor().getScreenPosition();
    };

    Editor.prototype.getCursorScreenRow = function() {
      return this.getCursor().getScreenRow();
    };

    Editor.prototype.setCursorBufferPosition = function(position, options) {
      return this.moveCursors(function(cursor) {
        return cursor.setBufferPosition(position, options);
      });
    };

    Editor.prototype.getCursorBufferPosition = function() {
      return this.getCursor().getBufferPosition();
    };

    Editor.prototype.getSelectedScreenRange = function() {
      return this.getLastSelection().getScreenRange();
    };

    Editor.prototype.getSelectedBufferRange = function() {
      return this.getLastSelection().getBufferRange();
    };

    Editor.prototype.getSelectedBufferRanges = function() {
      var j, len, ref1, results, selection;
      ref1 = this.getSelectionsOrderedByBufferPosition();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        selection = ref1[j];
        results.push(selection.getBufferRange());
      }
      return results;
    };

    Editor.prototype.getSelectedScreenRanges = function() {
      var j, len, ref1, results, selection;
      ref1 = this.getSelectionsOrderedByBufferPosition();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        selection = ref1[j];
        results.push(selection.getScreenRange());
      }
      return results;
    };

    Editor.prototype.getSelectedText = function() {
      return this.getLastSelection().getText();
    };

    Editor.prototype.getTextInBufferRange = function(range) {
      return this.buffer.getTextInRange(range);
    };

    Editor.prototype.setTextInBufferRange = function(range, text) {
      return this.getBuffer().setTextInRange(range, text);
    };

    Editor.prototype.getCurrentParagraphBufferRange = function() {
      return this.getCursor().getCurrentParagraphBufferRange();
    };

    Editor.prototype.getWordUnderCursor = function(options) {
      return this.getTextInBufferRange(this.getCursor().getCurrentWordBufferRange(options));
    };

    Editor.prototype.moveCursorUp = function(lineCount) {
      return this.moveCursors(function(cursor) {
        return cursor.moveUp(lineCount, {
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorDown = function(lineCount) {
      return this.moveCursors(function(cursor) {
        return cursor.moveDown(lineCount, {
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorLeft = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveLeft({
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorRight = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveRight({
          moveToEndOfSelection: true
        });
      });
    };

    Editor.prototype.moveCursorToTop = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToTop();
      });
    };

    Editor.prototype.moveCursorToBottom = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBottom();
      });
    };

    Editor.prototype.moveCursorToBeginningOfScreenLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfScreenLine();
      });
    };

    Editor.prototype.moveCursorToBeginningOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfLine();
      });
    };

    Editor.prototype.moveCursorToFirstCharacterOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToFirstCharacterOfLine();
      });
    };

    Editor.prototype.moveCursorToEndOfScreenLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfScreenLine();
      });
    };

    Editor.prototype.moveCursorToEndOfLine = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfLine();
      });
    };

    Editor.prototype.moveCursorToBeginningOfWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfWord();
      });
    };

    Editor.prototype.moveCursorToEndOfWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToEndOfWord();
      });
    };

    Editor.prototype.moveCursorToBeginningOfNextWord = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToBeginningOfNextWord();
      });
    };

    Editor.prototype.moveCursorToPreviousWordBoundary = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToPreviousWordBoundary();
      });
    };

    Editor.prototype.moveCursorToNextWordBoundary = function() {
      return this.moveCursors(function(cursor) {
        return cursor.moveToNextWordBoundary();
      });
    };

    Editor.prototype.scrollToCursorPosition = function() {
      return this.getCursor().autoscroll();
    };

    Editor.prototype.pageUp = function() {
      return this.setScrollTop(this.getScrollTop() - this.getHeight());
    };

    Editor.prototype.pageDown = function() {
      return this.setScrollTop(this.getScrollTop() + this.getHeight());
    };

    Editor.prototype.moveCursors = function(fn) {
      this.movingCursors = true;
      return this.batchUpdates((function(_this) {
        return function() {
          var cursor, j, len, ref1;
          ref1 = _this.getCursors();
          for (j = 0, len = ref1.length; j < len; j++) {
            cursor = ref1[j];
            fn(cursor);
          }
          _this.mergeCursors();
          _this.movingCursors = false;
          return _this.emit('cursors-moved');
        };
      })(this));
    };

    Editor.prototype.cursorMoved = function(event) {
      this.emit('cursor-moved', event);
      if (!this.movingCursors) {
        return this.emit('cursors-moved');
      }
    };

    Editor.prototype.selectToScreenPosition = function(position) {
      var lastSelection;
      lastSelection = this.getLastSelection();
      lastSelection.selectToScreenPosition(position);
      return this.mergeIntersectingSelections({
        reversed: lastSelection.isReversed()
      });
    };

    Editor.prototype.selectRight = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectRight();
        };
      })(this));
    };

    Editor.prototype.selectLeft = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectLeft();
        };
      })(this));
    };

    Editor.prototype.selectUp = function(rowCount) {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectUp(rowCount);
        };
      })(this));
    };

    Editor.prototype.selectDown = function(rowCount) {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectDown(rowCount);
        };
      })(this));
    };

    Editor.prototype.selectToTop = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToTop();
        };
      })(this));
    };

    Editor.prototype.selectAll = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectAll();
        };
      })(this));
    };

    Editor.prototype.selectToBottom = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToBottom();
        };
      })(this));
    };

    Editor.prototype.selectToBeginningOfLine = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToFirstCharacterOfLine = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToFirstCharacterOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToEndOfLine = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToEndOfLine();
        };
      })(this));
    };

    Editor.prototype.selectToPreviousWordBoundary = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToPreviousWordBoundary();
        };
      })(this));
    };

    Editor.prototype.selectToNextWordBoundary = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToNextWordBoundary();
        };
      })(this));
    };

    Editor.prototype.selectLine = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectLine();
        };
      })(this));
    };

    Editor.prototype.addSelectionBelow = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.addSelectionBelow();
        };
      })(this));
    };

    Editor.prototype.addSelectionAbove = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.addSelectionAbove();
        };
      })(this));
    };

    Editor.prototype.splitSelectionsIntoLines = function() {
      var end, j, len, range, ref1, results, row, selection, start;
      ref1 = this.getSelections();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        selection = ref1[j];
        range = selection.getBufferRange();
        if (range.isSingleLine()) {
          continue;
        }
        selection.destroy();
        start = range.start, end = range.end;
        this.addSelectionForBufferRange([start, [start.row, 2e308]]);
        row = start.row;
        while (++row < end.row) {
          this.addSelectionForBufferRange([[row, 0], [row, 2e308]]);
        }
        results.push(this.addSelectionForBufferRange([[end.row, 0], [end.row, end.column]]));
      }
      return results;
    };

    Editor.prototype.transpose = function() {
      return this.mutateSelectedText((function(_this) {
        return function(selection) {
          var text;
          if (selection.isEmpty()) {
            selection.selectRight();
            text = selection.getText();
            selection["delete"]();
            selection.cursor.moveLeft();
            return selection.insertText(text);
          } else {
            return selection.insertText(selection.getText().split('').reverse().join(''));
          }
        };
      })(this));
    };

    Editor.prototype.upperCase = function() {
      return this.replaceSelectedText({
        selectWordIfEmpty: true
      }, (function(_this) {
        return function(text) {
          return text.toUpperCase();
        };
      })(this));
    };

    Editor.prototype.lowerCase = function() {
      return this.replaceSelectedText({
        selectWordIfEmpty: true
      }, (function(_this) {
        return function(text) {
          return text.toLowerCase();
        };
      })(this));
    };

    Editor.prototype.joinLines = function() {
      return this.mutateSelectedText(function(selection) {
        return selection.joinLines();
      });
    };

    Editor.prototype.selectToBeginningOfWord = function() {
      return this.expandSelectionsBackward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfWord();
        };
      })(this));
    };

    Editor.prototype.selectToEndOfWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToEndOfWord();
        };
      })(this));
    };

    Editor.prototype.selectToBeginningOfNextWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectToBeginningOfNextWord();
        };
      })(this));
    };

    Editor.prototype.selectWord = function() {
      return this.expandSelectionsForward((function(_this) {
        return function(selection) {
          return selection.selectWord();
        };
      })(this));
    };

    Editor.prototype.selectMarker = function(marker) {
      var range;
      if (marker.isValid()) {
        range = marker.getBufferRange();
        this.setSelectedBufferRange(range);
        return range;
      }
    };

    Editor.prototype.mergeCursors = function() {
      var cursor, j, len, position, positions, ref1, results;
      positions = [];
      ref1 = this.getCursors();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        cursor = ref1[j];
        position = cursor.getBufferPosition().toString();
        if (indexOf.call(positions, position) >= 0) {
          results.push(cursor.destroy());
        } else {
          results.push(positions.push(position));
        }
      }
      return results;
    };

    Editor.prototype.expandSelectionsForward = function(fn) {
      return this.mergeIntersectingSelections((function(_this) {
        return function() {
          var j, len, ref1, results, selection;
          ref1 = _this.getSelections();
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            selection = ref1[j];
            results.push(fn(selection));
          }
          return results;
        };
      })(this));
    };

    Editor.prototype.expandSelectionsBackward = function(fn) {
      return this.mergeIntersectingSelections({
        reversed: true
      }, (function(_this) {
        return function() {
          var j, len, ref1, results, selection;
          ref1 = _this.getSelections();
          results = [];
          for (j = 0, len = ref1.length; j < len; j++) {
            selection = ref1[j];
            results.push(fn(selection));
          }
          return results;
        };
      })(this));
    };

    Editor.prototype.finalizeSelections = function() {
      var j, len, ref1, results, selection;
      ref1 = this.getSelections();
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        selection = ref1[j];
        results.push(selection.finalize());
      }
      return results;
    };

    Editor.prototype.mergeIntersectingSelections = function() {
      var args, fn, options, reducer, ref1, result;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (_.isFunction(_.last(args))) {
        fn = args.pop();
      }
      options = (ref1 = args.pop()) != null ? ref1 : {};
      if (this.suppressSelectionMerging) {
        return typeof fn === "function" ? fn() : void 0;
      }
      if (fn != null) {
        this.suppressSelectionMerging = true;
        result = fn();
        this.suppressSelectionMerging = false;
      }
      reducer = function(disjointSelections, selection) {
        var intersectingSelection;
        intersectingSelection = _.find(disjointSelections, function(s) {
          return s.intersectsWith(selection);
        });
        if (intersectingSelection != null) {
          intersectingSelection.merge(selection, options);
          return disjointSelections;
        } else {
          return disjointSelections.concat([selection]);
        }
      };
      return _.reduce(this.getSelections(), reducer, []);
    };

    Editor.prototype.preserveCursorPositionOnBufferReload = function() {
      var cursorPosition;
      cursorPosition = null;
      this.subscribe(this.buffer, "will-reload", (function(_this) {
        return function() {
          return cursorPosition = _this.getCursorBufferPosition();
        };
      })(this));
      return this.subscribe(this.buffer, "reloaded", (function(_this) {
        return function() {
          if (cursorPosition) {
            _this.setCursorBufferPosition(cursorPosition);
          }
          return cursorPosition = null;
        };
      })(this));
    };

    Editor.prototype.getGrammar = function() {
      return this.displayBuffer.getGrammar();
    };

    Editor.prototype.setGrammar = function(grammar) {
      return this.displayBuffer.setGrammar(grammar);
    };

    Editor.prototype.reloadGrammar = function() {
      return this.displayBuffer.reloadGrammar();
    };

    Editor.prototype.shouldAutoIndent = function() {
      return atom.config.get("editor.autoIndent");
    };

    Editor.prototype.transact = function(fn) {
      return this.batchUpdates((function(_this) {
        return function() {
          return _this.buffer.transact(fn);
        };
      })(this));
    };

    Editor.prototype.beginTransaction = function() {
      return this.buffer.beginTransaction();
    };

    Editor.prototype.commitTransaction = function() {
      return this.buffer.commitTransaction();
    };

    Editor.prototype.abortTransaction = function() {
      return this.buffer.abortTransaction();
    };

    Editor.prototype.batchUpdates = function(fn) {
      var result;
      this.emit('batched-updates-started');
      result = fn();
      this.emit('batched-updates-ended');
      return result;
    };

    Editor.prototype.inspect = function() {
      return "<Editor " + this.id + ">";
    };

    Editor.prototype.logScreenLines = function(start, end) {
      return this.displayBuffer.logLines(start, end);
    };

    Editor.prototype.handleGrammarChange = function() {
      this.unfoldAll();
      return this.emit('grammar-changed');
    };

    Editor.prototype.handleMarkerCreated = function(marker) {
      if (marker.matchesAttributes(this.getSelectionMarkerAttributes())) {
        return this.addSelection(marker);
      }
    };

    Editor.prototype.getSelectionMarkerAttributes = function() {
      return {
        type: 'selection',
        editorId: this.id,
        invalidate: 'never'
      };
    };

    Editor.prototype.getVerticalScrollMargin = function() {
      return this.displayBuffer.getVerticalScrollMargin();
    };

    Editor.prototype.setVerticalScrollMargin = function(verticalScrollMargin) {
      return this.displayBuffer.setVerticalScrollMargin(verticalScrollMargin);
    };

    Editor.prototype.getHorizontalScrollMargin = function() {
      return this.displayBuffer.getHorizontalScrollMargin();
    };

    Editor.prototype.setHorizontalScrollMargin = function(horizontalScrollMargin) {
      return this.displayBuffer.setHorizontalScrollMargin(horizontalScrollMargin);
    };

    Editor.prototype.getLineHeight = function() {
      return this.displayBuffer.getLineHeight();
    };

    Editor.prototype.setLineHeight = function(lineHeight) {
      return this.displayBuffer.setLineHeight(lineHeight);
    };

    Editor.prototype.getScopedCharWidth = function(scopeNames, char) {
      return this.displayBuffer.getScopedCharWidth(scopeNames, char);
    };

    Editor.prototype.setScopedCharWidth = function(scopeNames, char, width) {
      return this.displayBuffer.setScopedCharWidth(scopeNames, char, width);
    };

    Editor.prototype.getScopedCharWidths = function(scopeNames) {
      return this.displayBuffer.getScopedCharWidths(scopeNames);
    };

    Editor.prototype.clearScopedCharWidths = function() {
      return this.displayBuffer.clearScopedCharWidths();
    };

    Editor.prototype.getDefaultCharWidth = function() {
      return this.displayBuffer.getDefaultCharWidth();
    };

    Editor.prototype.setDefaultCharWidth = function(defaultCharWidth) {
      return this.displayBuffer.setDefaultCharWidth(defaultCharWidth);
    };

    Editor.prototype.setHeight = function(height) {
      return this.displayBuffer.setHeight(height);
    };

    Editor.prototype.getHeight = function() {
      return this.displayBuffer.getHeight();
    };

    Editor.prototype.setWidth = function(width) {
      return this.displayBuffer.setWidth(width);
    };

    Editor.prototype.getWidth = function() {
      return this.displayBuffer.getWidth();
    };

    Editor.prototype.getScrollTop = function() {
      return this.displayBuffer.getScrollTop();
    };

    Editor.prototype.setScrollTop = function(scrollTop) {
      return this.displayBuffer.setScrollTop(scrollTop);
    };

    Editor.prototype.getScrollBottom = function() {
      return this.displayBuffer.getScrollBottom();
    };

    Editor.prototype.setScrollBottom = function(scrollBottom) {
      return this.displayBuffer.setScrollBottom(scrollBottom);
    };

    Editor.prototype.getScrollLeft = function() {
      return this.displayBuffer.getScrollLeft();
    };

    Editor.prototype.setScrollLeft = function(scrollLeft) {
      return this.displayBuffer.setScrollLeft(scrollLeft);
    };

    Editor.prototype.getScrollRight = function() {
      return this.displayBuffer.getScrollRight();
    };

    Editor.prototype.setScrollRight = function(scrollRight) {
      return this.displayBuffer.setScrollRight(scrollRight);
    };

    Editor.prototype.getScrollHeight = function() {
      return this.displayBuffer.getScrollHeight();
    };

    Editor.prototype.getScrollWidth = function(scrollWidth) {
      return this.displayBuffer.getScrollWidth(scrollWidth);
    };

    Editor.prototype.getVisibleRowRange = function() {
      return this.displayBuffer.getVisibleRowRange();
    };

    Editor.prototype.intersectsVisibleRowRange = function(startRow, endRow) {
      return this.displayBuffer.intersectsVisibleRowRange(startRow, endRow);
    };

    Editor.prototype.selectionIntersectsVisibleRowRange = function(selection) {
      return this.displayBuffer.selectionIntersectsVisibleRowRange(selection);
    };

    Editor.prototype.pixelPositionForScreenPosition = function(screenPosition) {
      return this.displayBuffer.pixelPositionForScreenPosition(screenPosition);
    };

    Editor.prototype.pixelPositionForBufferPosition = function(bufferPosition) {
      return this.displayBuffer.pixelPositionForBufferPosition(bufferPosition);
    };

    Editor.prototype.screenPositionForPixelPosition = function(pixelPosition) {
      return this.displayBuffer.screenPositionForPixelPosition(pixelPosition);
    };

    Editor.prototype.pixelRectForScreenRange = function(screenRange) {
      return this.displayBuffer.pixelRectForScreenRange(screenRange);
    };

    Editor.prototype.scrollToScreenRange = function(screenRange) {
      return this.displayBuffer.scrollToScreenRange(screenRange);
    };

    Editor.prototype.scrollToScreenPosition = function(screenPosition) {
      return this.displayBuffer.scrollToScreenPosition(screenPosition);
    };

    Editor.prototype.scrollToBufferPosition = function(bufferPosition) {
      return this.displayBuffer.scrollToBufferPosition(bufferPosition);
    };

    Editor.prototype.joinLine = function() {
      deprecate("Use Editor::joinLines() instead");
      return this.joinLines();
    };

    return Editor;

  })(Model);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL21pbmltYXAvc3BlYy9maXh0dXJlcy9sYXJnZS1maWxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb0pBQUE7SUFBQTs7Ozs7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsWUFBQSxHQUFlLE9BQUEsQ0FBUSxjQUFSOztFQUNmLFNBQUEsR0FBWSxPQUFBLENBQVEsVUFBUjs7RUFDWCxZQUFhLE9BQUEsQ0FBUSxNQUFSOztFQUNiLFFBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1YsTUFBaUIsT0FBQSxDQUFRLGFBQVIsQ0FBakIsRUFBQyxpQkFBRCxFQUFROztFQUNSLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVI7O0VBQ2YsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVI7O0VBQ2hCLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7RUFFVCxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVI7O0VBQ1oscUJBQUEsR0FBd0IsT0FBQSxDQUFRLFlBQVIsQ0FBcUIsQ0FBQzs7RUF5SDlDLE1BQU0sQ0FBQyxPQUFQLEdBQ007OztJQUNKLFlBQVksQ0FBQyxXQUFiLENBQXlCLE1BQXpCOztJQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsTUFBdkI7O0lBQ0EsU0FBUyxDQUFDLFdBQVYsQ0FBc0IsTUFBdEI7O3FCQUVBLGFBQUEsR0FBZTs7cUJBQ2YsNEJBQUEsR0FBOEI7O3FCQUM5QixjQUFBLEdBQWdCOztxQkFDaEIsTUFBQSxHQUFROztxQkFDUixZQUFBLEdBQWM7O3FCQUNkLE9BQUEsR0FBUzs7cUJBQ1QsVUFBQSxHQUFZOztxQkFDWix3QkFBQSxHQUEwQjs7SUFFMUIsTUFBQyxDQUFBLGdCQUFELENBQWtCLDZCQUFsQixFQUFpRCxxQkFBakQs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LFdBQW5DO0lBQWpCOztxQkFFckIsc0JBQUEsR0FBd0IsU0FBQyxjQUFEO2FBQW9CLElBQUMsQ0FBQSxhQUFhLENBQUMsc0JBQWYsQ0FBc0MsY0FBdEM7SUFBcEI7O3FCQUV4QixzQkFBQSxHQUF3QixTQUFDLGNBQUQ7YUFBb0IsSUFBQyxDQUFBLGFBQWEsQ0FBQyxzQkFBZixDQUFzQyxjQUF0QztJQUFwQjs7cUJBR3hCLFFBQUEsR0FBVSxTQUFBO01BQ1IsU0FBQSxDQUFVLGlDQUFWO2FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUZROzs7O0tBN3REUztBQXRJckIiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5TZXJpYWxpemFibGUgPSByZXF1aXJlICdzZXJpYWxpemFibGUnXG5EZWxlZ2F0b3IgPSByZXF1aXJlICdkZWxlZ2F0bydcbntkZXByZWNhdGV9ID0gcmVxdWlyZSAnZ3JpbSdcbntNb2RlbH0gPSByZXF1aXJlICd0aGVvcmlzdCdcbntQb2ludCwgUmFuZ2V9ID0gcmVxdWlyZSAndGV4dC1idWZmZXInXG5MYW5ndWFnZU1vZGUgPSByZXF1aXJlICcuL2xhbmd1YWdlLW1vZGUnXG5EaXNwbGF5QnVmZmVyID0gcmVxdWlyZSAnLi9kaXNwbGF5LWJ1ZmZlcidcbkN1cnNvciA9IHJlcXVpcmUgJy4vY3Vyc29yJ1xuXG5TZWxlY3Rpb24gPSByZXF1aXJlICcuL3NlbGVjdGlvbidcblRleHRNYXRlU2NvcGVTZWxlY3RvciA9IHJlcXVpcmUoJ2ZpcnN0LW1hdGUnKS5TY29wZVNlbGVjdG9yXG5cbiMgUHVibGljOiBUaGlzIGNsYXNzIHJlcHJlc2VudHMgYWxsIGVzc2VudGlhbCBlZGl0aW5nIHN0YXRlIGZvciBhIHNpbmdsZVxuIyB7VGV4dEJ1ZmZlcn0sIGluY2x1ZGluZyBjdXJzb3IgYW5kIHNlbGVjdGlvbiBwb3NpdGlvbnMsIGZvbGRzLCBhbmQgc29mdCB3cmFwcy5cbiMgSWYgeW91J3JlIG1hbmlwdWxhdGluZyB0aGUgc3RhdGUgb2YgYW4gZWRpdG9yLCB1c2UgdGhpcyBjbGFzcy4gSWYgeW91J3JlXG4jIGludGVyZXN0ZWQgaW4gdGhlIHZpc3VhbCBhcHBlYXJhbmNlIG9mIGVkaXRvcnMsIHVzZSB7RWRpdG9yVmlld30gaW5zdGVhZC5cbiNcbiMgQSBzaW5nbGUge1RleHRCdWZmZXJ9IGNhbiBiZWxvbmcgdG8gbXVsdGlwbGUgZWRpdG9ycy4gRm9yIGV4YW1wbGUsIGlmIHRoZVxuIyBzYW1lIGZpbGUgaXMgb3BlbiBpbiB0d28gZGlmZmVyZW50IHBhbmVzLCBBdG9tIGNyZWF0ZXMgYSBzZXBhcmF0ZSBlZGl0b3IgZm9yXG4jIGVhY2ggcGFuZS4gSWYgdGhlIGJ1ZmZlciBpcyBtYW5pcHVsYXRlZCB0aGUgY2hhbmdlcyBhcmUgcmVmbGVjdGVkIGluIGJvdGhcbiMgZWRpdG9ycywgYnV0IGVhY2ggbWFpbnRhaW5zIGl0cyBvd24gY3Vyc29yIHBvc2l0aW9uLCBmb2xkZWQgbGluZXMsIGV0Yy5cbiNcbiMgIyMgQWNjZXNzaW5nIEVkaXRvciBJbnN0YW5jZXNcbiNcbiMgVGhlIGVhc2llc3Qgd2F5IHRvIGdldCBob2xkIG9mIGBFZGl0b3JgIG9iamVjdHMgaXMgYnkgcmVnaXN0ZXJpbmcgYSBjYWxsYmFja1xuIyB3aXRoIGA6OmVhY2hFZGl0b3JgIG9uIHRoZSBgYXRvbS53b3Jrc3BhY2VgIGdsb2JhbC4gWW91ciBjYWxsYmFjayB3aWxsIHRoZW5cbiMgYmUgY2FsbGVkIHdpdGggYWxsIGN1cnJlbnQgZWRpdG9yIGluc3RhbmNlcyBhbmQgYWxzbyB3aGVuIGFueSBlZGl0b3IgaXNcbiMgY3JlYXRlZCBpbiB0aGUgZnV0dXJlLlxuI1xuIyBgYGBjb2ZmZWVzY3JpcHRcbiMgICBhdG9tLndvcmtzcGFjZS5lYWNoRWRpdG9yIChlZGl0b3IpIC0+XG4jICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnSGVsbG8gV29ybGQnKVxuIyBgYGBcbiNcbiMgIyMgQnVmZmVyIHZzLiBTY3JlZW4gQ29vcmRpbmF0ZXNcbiNcbiMgQmVjYXVzZSBlZGl0b3JzIHN1cHBvcnQgZm9sZHMgYW5kIHNvZnQtd3JhcHBpbmcsIHRoZSBsaW5lcyBvbiBzY3JlZW4gZG9uJ3RcbiMgYWx3YXlzIG1hdGNoIHRoZSBsaW5lcyBpbiB0aGUgYnVmZmVyLiBGb3IgZXhhbXBsZSwgYSBsb25nIGxpbmUgdGhhdCBzb2Z0IHdyYXBzXG4jIHR3aWNlIHJlbmRlcnMgYXMgdGhyZWUgbGluZXMgb24gc2NyZWVuLCBidXQgb25seSByZXByZXNlbnRzIG9uZSBsaW5lIGluIHRoZVxuIyBidWZmZXIuIFNpbWlsYXJseSwgaWYgcm93cyA1LTEwIGFyZSBmb2xkZWQsIHRoZW4gcm93IDYgb24gc2NyZWVuIGNvcnJlc3BvbmRzXG4jIHRvIHJvdyAxMSBpbiB0aGUgYnVmZmVyLlxuI1xuIyBZb3VyIGNob2ljZSBvZiBjb29yZGluYXRlcyBzeXN0ZW1zIHdpbGwgZGVwZW5kIG9uIHdoYXQgeW91J3JlIHRyeWluZyB0b1xuIyBhY2hpZXZlLiBGb3IgZXhhbXBsZSwgaWYgeW91J3JlIHdyaXRpbmcgYSBjb21tYW5kIHRoYXQganVtcHMgdGhlIGN1cnNvciB1cCBvclxuIyBkb3duIGJ5IDEwIGxpbmVzLCB5b3UnbGwgd2FudCB0byB1c2Ugc2NyZWVuIGNvb3JkaW5hdGVzIGJlY2F1c2UgdGhlIHVzZXJcbiMgcHJvYmFibHkgd2FudHMgdG8gc2tpcCBsaW5lcyAqb24gc2NyZWVuKi4gSG93ZXZlciwgaWYgeW91J3JlIHdyaXRpbmcgYSBwYWNrYWdlXG4jIHRoYXQganVtcHMgYmV0d2VlbiBtZXRob2QgZGVmaW5pdGlvbnMsIHlvdSdsbCB3YW50IHRvIHdvcmsgaW4gYnVmZmVyXG4jIGNvb3JkaW5hdGVzLlxuI1xuIyAqKldoZW4gaW4gZG91YnQsIGp1c3QgZGVmYXVsdCB0byBidWZmZXIgY29vcmRpbmF0ZXMqKiwgdGhlbiBleHBlcmltZW50IHdpdGhcbiMgc29mdCB3cmFwcyBhbmQgZm9sZHMgdG8gZW5zdXJlIHlvdXIgY29kZSBpbnRlcmFjdHMgd2l0aCB0aGVtIGNvcnJlY3RseS5cbiNcbiMgIyMgQ29tbW9uIFRhc2tzXG4jXG4jIFRoaXMgaXMgYSBzdWJzZXQgb2YgbWV0aG9kcyBvbiB0aGlzIGNsYXNzLiBSZWZlciB0byB0aGUgY29tcGxldGUgc3VtbWFyeSBmb3JcbiMgaXRzIGZ1bGwgY2FwYWJpbGl0aWVzLlxuI1xuIyAjIyMgQ3Vyc29yc1xuIyAtIHs6OnNldEN1cnNvckJ1ZmZlclBvc2l0aW9ufVxuIyAtIHs6OnNldEN1cnNvclNjcmVlblBvc2l0aW9ufVxuIyAtIHs6Om1vdmVDdXJzb3JVcH1cbiMgLSB7Ojptb3ZlQ3Vyc29yRG93bn1cbiMgLSB7Ojptb3ZlQ3Vyc29yTGVmdH1cbiMgLSB7Ojptb3ZlQ3Vyc29yUmlnaHR9XG4jIC0gezo6bW92ZUN1cnNvclRvQmVnaW5uaW5nT2ZXb3JkfVxuIyAtIHs6Om1vdmVDdXJzb3JUb0VuZE9mV29yZH1cbiMgLSB7Ojptb3ZlQ3Vyc29yVG9QcmV2aW91c1dvcmRCb3VuZGFyeX1cbiMgLSB7Ojptb3ZlQ3Vyc29yVG9OZXh0V29yZEJvdW5kYXJ5fVxuIyAtIHs6Om1vdmVDdXJzb3JUb0JlZ2lubmluZ09mTmV4dFdvcmR9XG4jIC0gezo6bW92ZUN1cnNvclRvQmVnaW5uaW5nT2ZMaW5lfVxuIyAtIHs6Om1vdmVDdXJzb3JUb0VuZE9mTGluZX1cbiMgLSB7Ojptb3ZlQ3Vyc29yVG9GaXJzdENoYXJhY3Rlck9mTGluZX1cbiMgLSB7Ojptb3ZlQ3Vyc29yVG9Ub3B9XG4jIC0gezo6bW92ZUN1cnNvclRvQm90dG9tfVxuI1xuIyAjIyMgU2VsZWN0aW9uc1xuIyAtIHs6OmdldFNlbGVjdGVkQnVmZmVyUmFuZ2V9XG4jIC0gezo6Z2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXN9XG4jIC0gezo6c2V0U2VsZWN0ZWRCdWZmZXJSYW5nZX1cbiMgLSB7OjpzZXRTZWxlY3RlZEJ1ZmZlclJhbmdlc31cbiMgLSB7OjpzZWxlY3RVcH1cbiMgLSB7OjpzZWxlY3REb3dufVxuIyAtIHs6OnNlbGVjdExlZnR9XG4jIC0gezo6c2VsZWN0UmlnaHR9XG4jIC0gezo6c2VsZWN0VG9CZWdpbm5pbmdPZldvcmR9XG4jIC0gezo6c2VsZWN0VG9FbmRPZldvcmR9XG4jIC0gezo6c2VsZWN0VG9QcmV2aW91c1dvcmRCb3VuZGFyeX1cbiMgLSB7OjpzZWxlY3RUb05leHRXb3JkQm91bmRhcnl9XG4jIC0gezo6c2VsZWN0V29yZH1cbiMgLSB7OjpzZWxlY3RUb0JlZ2lubmluZ09mTGluZX1cbiMgLSB7OjpzZWxlY3RUb0VuZE9mTGluZX1cbiMgLSB7OjpzZWxlY3RUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lfVxuIyAtIHs6OnNlbGVjdFRvVG9wfVxuIyAtIHs6OnNlbGVjdFRvQm90dG9tfVxuIyAtIHs6OnNlbGVjdEFsbH1cbiMgLSB7OjphZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZX1cbiMgLSB7OjphZGRTZWxlY3Rpb25BYm92ZX1cbiMgLSB7OjphZGRTZWxlY3Rpb25CZWxvd31cbiMgLSB7OjpzcGxpdFNlbGVjdGlvbnNJbnRvTGluZXN9XG4jXG4jICMjIyBNYW5pcHVsYXRpbmcgVGV4dFxuIyAtIHs6OmdldFRleHR9XG4jIC0gezo6Z2V0U2VsZWN0ZWRUZXh0fVxuIyAtIHs6OnNldFRleHR9XG4jIC0gezo6c2V0VGV4dEluQnVmZmVyUmFuZ2V9XG4jIC0gezo6aW5zZXJ0VGV4dH1cbiMgLSB7OjppbnNlcnROZXdsaW5lfVxuIyAtIHs6Omluc2VydE5ld2xpbmVBYm92ZX1cbiMgLSB7OjppbnNlcnROZXdsaW5lQmVsb3d9XG4jIC0gezo6YmFja3NwYWNlfVxuIyAtIHs6OmJhY2tzcGFjZVRvQmVnaW5uaW5nT2ZXb3JkfVxuIyAtIHs6OmJhY2tzcGFjZVRvQmVnaW5uaW5nT2ZMaW5lfVxuIyAtIHs6OmRlbGV0ZX1cbiMgLSB7OjpkZWxldGVUb0VuZE9mV29yZH1cbiMgLSB7OjpkZWxldGVMaW5lfVxuIyAtIHs6OmN1dFNlbGVjdGVkVGV4dH1cbiMgLSB7OjpjdXRUb0VuZE9mTGluZX1cbiMgLSB7Ojpjb3B5U2VsZWN0ZWRUZXh0fVxuIyAtIHs6OnBhc3RlVGV4dH1cbiNcbiMgIyMjIFVuZG8sIFJlZG8sIGFuZCBUcmFuc2FjdGlvbnNcbiMgLSB7Ojp1bmRvfVxuIyAtIHs6OnJlZG99XG4jIC0gezo6dHJhbnNhY3R9XG4jIC0gezo6YWJvcnRUcmFuc2FjdGlvbn1cbiNcbiMgIyMjIE1hcmtlcnNcbiMgLSB7OjptYXJrQnVmZmVyUmFuZ2V9XG4jIC0gezo6bWFya1NjcmVlblJhbmdlfVxuIyAtIHs6OmdldE1hcmtlcn1cbiMgLSB7OjpmaW5kTWFya2Vyc31cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEVkaXRvciBleHRlbmRzIE1vZGVsXG4gIFNlcmlhbGl6YWJsZS5pbmNsdWRlSW50byh0aGlzKVxuICBhdG9tLmRlc2VyaWFsaXplcnMuYWRkKHRoaXMpXG4gIERlbGVnYXRvci5pbmNsdWRlSW50byh0aGlzKVxuXG4gIGRlc2VyaWFsaXppbmc6IGZhbHNlXG4gIGNhbGxEaXNwbGF5QnVmZmVyQ3JlYXRlZEhvb2s6IGZhbHNlXG4gIHJlZ2lzdGVyRWRpdG9yOiBmYWxzZVxuICBidWZmZXI6IG51bGxcbiAgbGFuZ3VhZ2VNb2RlOiBudWxsXG4gIGN1cnNvcnM6IG51bGxcbiAgc2VsZWN0aW9uczogbnVsbFxuICBzdXBwcmVzc1NlbGVjdGlvbk1lcmdpbmc6IGZhbHNlXG5cbiAgQGRlbGVnYXRlc01ldGhvZHMgJ3N1Z2dlc3RlZEluZGVudEZvckJ1ZmZlclJvdycsICdhdXRvSW5kZW50QnVmZmVyUm93JywgJ2F1dG9JbmRlbnRCdWZmZXJSb3dzJyxcbiAgICAnYXV0b0RlY3JlYXNlSW5kZW50Rm9yQnVmZmVyUm93JywgJ3RvZ2dsZUxpbmVDb21tZW50Rm9yQnVmZmVyUm93JywgJ3RvZ2dsZUxpbmVDb21tZW50c0ZvckJ1ZmZlclJvd3MnLFxuICAgIHRvUHJvcGVydHk6ICdsYW5ndWFnZU1vZGUnXG5cbiAgQGRlbGVnYXRlc1Byb3BlcnRpZXMgJyRsaW5lSGVpZ2h0JywgJyRkZWZhdWx0Q2hhcldpZHRoJywgJyRoZWlnaHQnLCAnJHdpZHRoJyxcbiAgICAnJHNjcm9sbFRvcCcsICckc2Nyb2xsTGVmdCcsICdtYW5hZ2VTY3JvbGxQb3NpdGlvbicsIHRvUHJvcGVydHk6ICdkaXNwbGF5QnVmZmVyJ1xuXG4gIGNvbnN0cnVjdG9yOiAoe0Bzb2Z0VGFicywgaW5pdGlhbExpbmUsIGluaXRpYWxDb2x1bW4sIHRhYkxlbmd0aCwgc29mdFdyYXAsIEBkaXNwbGF5QnVmZmVyLCBidWZmZXIsIHJlZ2lzdGVyRWRpdG9yLCBzdXBwcmVzc0N1cnNvckNyZWF0aW9ufSkgLT5cbiAgICBzdXBlclxuXG4gICAgQGN1cnNvcnMgPSBbXVxuICAgIEBzZWxlY3Rpb25zID0gW11cblxuICAgIEBkaXNwbGF5QnVmZmVyID89IG5ldyBEaXNwbGF5QnVmZmVyKHtidWZmZXIsIHRhYkxlbmd0aCwgc29mdFdyYXB9KVxuICAgIEBidWZmZXIgPSBAZGlzcGxheUJ1ZmZlci5idWZmZXJcbiAgICBAc29mdFRhYnMgPSBAYnVmZmVyLnVzZXNTb2Z0VGFicygpID8gQHNvZnRUYWJzID8gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Iuc29mdFRhYnMnKSA/IHRydWVcblxuICAgIGZvciBtYXJrZXIgaW4gQGZpbmRNYXJrZXJzKEBnZXRTZWxlY3Rpb25NYXJrZXJBdHRyaWJ1dGVzKCkpXG4gICAgICBtYXJrZXIuc2V0QXR0cmlidXRlcyhwcmVzZXJ2ZUZvbGRzOiB0cnVlKVxuICAgICAgQGFkZFNlbGVjdGlvbihtYXJrZXIpXG5cbiAgICBAc3Vic2NyaWJlVG9CdWZmZXIoKVxuICAgIEBzdWJzY3JpYmVUb0Rpc3BsYXlCdWZmZXIoKVxuXG4gICAgaWYgQGdldEN1cnNvcnMoKS5sZW5ndGggaXMgMCBhbmQgbm90IHN1cHByZXNzQ3Vyc29yQ3JlYXRpb25cbiAgICAgIGluaXRpYWxMaW5lID0gTWF0aC5tYXgocGFyc2VJbnQoaW5pdGlhbExpbmUpIG9yIDAsIDApXG4gICAgICBpbml0aWFsQ29sdW1uID0gTWF0aC5tYXgocGFyc2VJbnQoaW5pdGlhbENvbHVtbikgb3IgMCwgMClcbiAgICAgIEBhZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uKFtpbml0aWFsTGluZSwgaW5pdGlhbENvbHVtbl0pXG5cbiAgICBAbGFuZ3VhZ2VNb2RlID0gbmV3IExhbmd1YWdlTW9kZSh0aGlzKVxuXG4gICAgQHN1YnNjcmliZSBAJHNjcm9sbFRvcCwgKHNjcm9sbFRvcCkgPT4gQGVtaXQgJ3Njcm9sbC10b3AtY2hhbmdlZCcsIHNjcm9sbFRvcFxuICAgIEBzdWJzY3JpYmUgQCRzY3JvbGxMZWZ0LCAoc2Nyb2xsTGVmdCkgPT4gQGVtaXQgJ3Njcm9sbC1sZWZ0LWNoYW5nZWQnLCBzY3JvbGxMZWZ0XG5cbiAgICBhdG9tLndvcmtzcGFjZT8uZWRpdG9yQWRkZWQodGhpcykgaWYgcmVnaXN0ZXJFZGl0b3JcblxuICBzZXJpYWxpemVQYXJhbXM6IC0+XG4gICAgaWQ6IEBpZFxuICAgIHNvZnRUYWJzOiBAc29mdFRhYnNcbiAgICBzY3JvbGxUb3A6IEBzY3JvbGxUb3BcbiAgICBzY3JvbGxMZWZ0OiBAc2Nyb2xsTGVmdFxuICAgIGRpc3BsYXlCdWZmZXI6IEBkaXNwbGF5QnVmZmVyLnNlcmlhbGl6ZSgpXG5cbiAgZGVzZXJpYWxpemVQYXJhbXM6IChwYXJhbXMpIC0+XG4gICAgcGFyYW1zLmRpc3BsYXlCdWZmZXIgPSBEaXNwbGF5QnVmZmVyLmRlc2VyaWFsaXplKHBhcmFtcy5kaXNwbGF5QnVmZmVyKVxuICAgIHBhcmFtcy5yZWdpc3RlckVkaXRvciA9IHRydWVcbiAgICBwYXJhbXNcblxuICBzdWJzY3JpYmVUb0J1ZmZlcjogLT5cbiAgICBAYnVmZmVyLnJldGFpbigpXG4gICAgQHN1YnNjcmliZSBAYnVmZmVyLCBcInBhdGgtY2hhbmdlZFwiLCA9PlxuICAgICAgdW5sZXNzIGF0b20ucHJvamVjdC5nZXRQYXRoKCk/XG4gICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRoKHBhdGguZGlybmFtZShAZ2V0UGF0aCgpKSlcbiAgICAgIEBlbWl0IFwidGl0bGUtY2hhbmdlZFwiXG4gICAgICBAZW1pdCBcInBhdGgtY2hhbmdlZFwiXG4gICAgQHN1YnNjcmliZSBAYnVmZmVyLCBcImNvbnRlbnRzLW1vZGlmaWVkXCIsID0+IEBlbWl0IFwiY29udGVudHMtbW9kaWZpZWRcIlxuICAgIEBzdWJzY3JpYmUgQGJ1ZmZlciwgXCJjb250ZW50cy1jb25mbGljdGVkXCIsID0+IEBlbWl0IFwiY29udGVudHMtY29uZmxpY3RlZFwiXG4gICAgQHN1YnNjcmliZSBAYnVmZmVyLCBcIm1vZGlmaWVkLXN0YXR1cy1jaGFuZ2VkXCIsID0+IEBlbWl0IFwibW9kaWZpZWQtc3RhdHVzLWNoYW5nZWRcIlxuICAgIEBzdWJzY3JpYmUgQGJ1ZmZlciwgXCJkZXN0cm95ZWRcIiwgPT4gQGRlc3Ryb3koKVxuICAgIEBwcmVzZXJ2ZUN1cnNvclBvc2l0aW9uT25CdWZmZXJSZWxvYWQoKVxuXG4gIHN1YnNjcmliZVRvRGlzcGxheUJ1ZmZlcjogLT5cbiAgICBAc3Vic2NyaWJlIEBkaXNwbGF5QnVmZmVyLCAnbWFya2VyLWNyZWF0ZWQnLCBAaGFuZGxlTWFya2VyQ3JlYXRlZFxuICAgIEBzdWJzY3JpYmUgQGRpc3BsYXlCdWZmZXIsIFwiY2hhbmdlZFwiLCAoZSkgPT4gQGVtaXQgJ3NjcmVlbi1saW5lcy1jaGFuZ2VkJywgZVxuICAgIEBzdWJzY3JpYmUgQGRpc3BsYXlCdWZmZXIsIFwibWFya2Vycy11cGRhdGVkXCIsID0+IEBtZXJnZUludGVyc2VjdGluZ1NlbGVjdGlvbnMoKVxuICAgIEBzdWJzY3JpYmUgQGRpc3BsYXlCdWZmZXIsICdncmFtbWFyLWNoYW5nZWQnLCA9PiBAaGFuZGxlR3JhbW1hckNoYW5nZSgpXG4gICAgQHN1YnNjcmliZSBAZGlzcGxheUJ1ZmZlciwgJ3NvZnQtd3JhcC1jaGFuZ2VkJywgKGFyZ3MuLi4pID0+IEBlbWl0ICdzb2Z0LXdyYXAtY2hhbmdlZCcsIGFyZ3MuLi5cblxuICBnZXRWaWV3Q2xhc3M6IC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdjb3JlLnVzZVJlYWN0RWRpdG9yJylcbiAgICAgIHJlcXVpcmUgJy4vcmVhY3QtZWRpdG9yLXZpZXcnXG4gICAgZWxzZVxuICAgICAgcmVxdWlyZSAnLi9lZGl0b3ItdmlldydcblxuICBkZXN0cm95ZWQ6IC0+XG4gICAgQHVuc3Vic2NyaWJlKClcbiAgICBzZWxlY3Rpb24uZGVzdHJveSgpIGZvciBzZWxlY3Rpb24gaW4gQGdldFNlbGVjdGlvbnMoKVxuICAgIEBidWZmZXIucmVsZWFzZSgpXG4gICAgQGRpc3BsYXlCdWZmZXIuZGVzdHJveSgpXG4gICAgQGxhbmd1YWdlTW9kZS5kZXN0cm95KClcblxuICAjIENyZWF0ZSBhbiB7RWRpdG9yfSB3aXRoIGl0cyBpbml0aWFsIHN0YXRlIGJhc2VkIG9uIHRoaXMgb2JqZWN0XG4gIGNvcHk6IC0+XG4gICAgdGFiTGVuZ3RoID0gQGdldFRhYkxlbmd0aCgpXG4gICAgZGlzcGxheUJ1ZmZlciA9IEBkaXNwbGF5QnVmZmVyLmNvcHkoKVxuICAgIHNvZnRUYWJzID0gQGdldFNvZnRUYWJzKClcbiAgICBuZXdFZGl0b3IgPSBuZXcgRWRpdG9yKHtAYnVmZmVyLCBkaXNwbGF5QnVmZmVyLCB0YWJMZW5ndGgsIHNvZnRUYWJzLCBzdXBwcmVzc0N1cnNvckNyZWF0aW9uOiB0cnVlLCByZWdpc3RlckVkaXRvcjogdHJ1ZX0pXG4gICAgZm9yIG1hcmtlciBpbiBAZmluZE1hcmtlcnMoZWRpdG9ySWQ6IEBpZClcbiAgICAgIG1hcmtlci5jb3B5KGVkaXRvcklkOiBuZXdFZGl0b3IuaWQsIHByZXNlcnZlRm9sZHM6IHRydWUpXG4gICAgbmV3RWRpdG9yXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgdGl0bGUgdGhlIGVkaXRvcidzIHRpdGxlIGZvciBkaXNwbGF5IGluIG90aGVyIHBhcnRzIG9mIHRoZVxuICAjIFVJIHN1Y2ggYXMgdGhlIHRhYnMuXG4gICNcbiAgIyBJZiB0aGUgZWRpdG9yJ3MgYnVmZmVyIGlzIHNhdmVkLCBpdHMgdGl0bGUgaXMgdGhlIGZpbGUgbmFtZS4gSWYgaXQgaXNcbiAgIyB1bnNhdmVkLCBpdHMgdGl0bGUgaXMgXCJ1bnRpdGxlZFwiLlxuICAjXG4gICMgUmV0dXJucyBhIHtTdHJpbmd9LlxuICBnZXRUaXRsZTogLT5cbiAgICBpZiBzZXNzaW9uUGF0aCA9IEBnZXRQYXRoKClcbiAgICAgIHBhdGguYmFzZW5hbWUoc2Vzc2lvblBhdGgpXG4gICAgZWxzZVxuICAgICAgJ3VudGl0bGVkJ1xuXG4gICMgUHVibGljOiBHZXQgdGhlIGVkaXRvcidzIGxvbmcgdGl0bGUgZm9yIGRpc3BsYXkgaW4gb3RoZXIgcGFydHMgb2YgdGhlIFVJXG4gICMgc3VjaCBhcyB0aGUgd2luZG93IHRpdGxlLlxuICAjXG4gICMgSWYgdGhlIGVkaXRvcidzIGJ1ZmZlciBpcyBzYXZlZCwgaXRzIGxvbmcgdGl0bGUgaXMgZm9ybWF0dGVkIGFzXG4gICMgXCI8ZmlsZW5hbWU+IC0gPGRpcmVjdG9yeT5cIi4gSWYgaXQgaXMgdW5zYXZlZCwgaXRzIHRpdGxlIGlzIFwidW50aXRsZWRcIlxuICAjXG4gICMgUmV0dXJucyBhIHtTdHJpbmd9LlxuICBnZXRMb25nVGl0bGU6IC0+XG4gICAgaWYgc2Vzc2lvblBhdGggPSBAZ2V0UGF0aCgpXG4gICAgICBmaWxlTmFtZSA9IHBhdGguYmFzZW5hbWUoc2Vzc2lvblBhdGgpXG4gICAgICBkaXJlY3RvcnkgPSBwYXRoLmJhc2VuYW1lKHBhdGguZGlybmFtZShzZXNzaW9uUGF0aCkpXG4gICAgICBcIiN7ZmlsZU5hbWV9IC0gI3tkaXJlY3Rvcnl9XCJcbiAgICBlbHNlXG4gICAgICAndW50aXRsZWQnXG5cbiAgIyBDb250cm9scyB2aXNpYmxpdHkgYmFzZWQgb24gdGhlIGdpdmVuIHtCb29sZWFufS5cbiAgc2V0VmlzaWJsZTogKHZpc2libGUpIC0+IEBkaXNwbGF5QnVmZmVyLnNldFZpc2libGUodmlzaWJsZSlcblxuICAjIFNldCB0aGUgbnVtYmVyIG9mIGNoYXJhY3RlcnMgdGhhdCBjYW4gYmUgZGlzcGxheWVkIGhvcml6b250YWxseSBpbiB0aGVcbiAgIyBlZGl0b3IuXG4gICNcbiAgIyBlZGl0b3JXaWR0aEluQ2hhcnMgLSBBIHtOdW1iZXJ9IHJlcHJlc2VudGluZyB0aGUgd2lkdGggb2YgdGhlIHtFZGl0b3JWaWV3fVxuICAjIGluIGNoYXJhY3RlcnMuXG4gIHNldEVkaXRvcldpZHRoSW5DaGFyczogKGVkaXRvcldpZHRoSW5DaGFycykgLT5cbiAgICBAZGlzcGxheUJ1ZmZlci5zZXRFZGl0b3JXaWR0aEluQ2hhcnMoZWRpdG9yV2lkdGhJbkNoYXJzKVxuXG4gICMgUHVibGljOiBTZXRzIHRoZSBjb2x1bW4gYXQgd2hpY2ggY29sdW1zbiB3aWxsIHNvZnQgd3JhcFxuICBnZXRTb2Z0V3JhcENvbHVtbjogLT4gQGRpc3BsYXlCdWZmZXIuZ2V0U29mdFdyYXBDb2x1bW4oKVxuXG4gICMgUHVibGljOiBSZXR1cm5zIGEge0Jvb2xlYW59IGluZGljYXRpbmcgd2hldGhlciBzb2Z0VGFicyBhcmUgZW5hYmxlZCBmb3IgdGhpc1xuICAjIGVkaXRvci5cbiAgZ2V0U29mdFRhYnM6IC0+IEBzb2Z0VGFic1xuXG4gICMgUHVibGljOiBFbmFibGUgb3IgZGlzYWJsZSBzb2Z0IHRhYnMgZm9yIHRoaXMgZWRpdG9yLlxuICAjXG4gICMgc29mdFRhYnMgLSBBIHtCb29sZWFufVxuICBzZXRTb2Z0VGFiczogKEBzb2Z0VGFicykgLT4gQHNvZnRUYWJzXG5cbiAgIyBQdWJsaWM6IFRvZ2dsZSBzb2Z0IHRhYnMgZm9yIHRoaXMgZWRpdG9yXG4gIHRvZ2dsZVNvZnRUYWJzOiAtPiBAc2V0U29mdFRhYnMobm90IEBnZXRTb2Z0VGFicygpKVxuXG4gICMgUHVibGljOiBHZXQgd2hldGhlciBzb2Z0IHdyYXAgaXMgZW5hYmxlZCBmb3IgdGhpcyBlZGl0b3IuXG4gIGdldFNvZnRXcmFwOiAtPiBAZGlzcGxheUJ1ZmZlci5nZXRTb2Z0V3JhcCgpXG5cbiAgIyBQdWJsaWM6IEVuYWJsZSBvciBkaXNhYmxlIHNvZnQgd3JhcCBmb3IgdGhpcyBlZGl0b3IuXG4gICNcbiAgIyBzb2Z0V3JhcCAtIEEge0Jvb2xlYW59XG4gIHNldFNvZnRXcmFwOiAoc29mdFdyYXApIC0+IEBkaXNwbGF5QnVmZmVyLnNldFNvZnRXcmFwKHNvZnRXcmFwKVxuXG4gICMgUHVibGljOiBUb2dnbGUgc29mdCB3cmFwIGZvciB0aGlzIGVkaXRvclxuICB0b2dnbGVTb2Z0V3JhcDogLT4gQHNldFNvZnRXcmFwKG5vdCBAZ2V0U29mdFdyYXAoKSlcblxuICAjIFB1YmxpYzogR2V0IHRoZSB0ZXh0IHJlcHJlc2VudGluZyBhIHNpbmdsZSBsZXZlbCBvZiBpbmRlbnQuXG4gICNcbiAgIyBJZiBzb2Z0IHRhYnMgYXJlIGVuYWJsZWQsIHRoZSB0ZXh0IGlzIGNvbXBvc2VkIG9mIE4gc3BhY2VzLCB3aGVyZSBOIGlzIHRoZVxuICAjIHRhYiBsZW5ndGguIE90aGVyd2lzZSB0aGUgdGV4dCBpcyBhIHRhYiBjaGFyYWN0ZXIgKGBcXHRgKS5cbiAgI1xuICAjIFJldHVybnMgYSB7U3RyaW5nfS5cbiAgZ2V0VGFiVGV4dDogLT4gQGJ1aWxkSW5kZW50U3RyaW5nKDEpXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgb24tc2NyZWVuIGxlbmd0aCBvZiB0YWIgY2hhcmFjdGVycy5cbiAgI1xuICAjIFJldHVybnMgYSB7TnVtYmVyfS5cbiAgZ2V0VGFiTGVuZ3RoOiAtPiBAZGlzcGxheUJ1ZmZlci5nZXRUYWJMZW5ndGgoKVxuXG4gICMgUHVibGljOiBTZXQgdGhlIG9uLXNjcmVlbiBsZW5ndGggb2YgdGFiIGNoYXJhY3RlcnMuXG4gIHNldFRhYkxlbmd0aDogKHRhYkxlbmd0aCkgLT4gQGRpc3BsYXlCdWZmZXIuc2V0VGFiTGVuZ3RoKHRhYkxlbmd0aClcblxuICAjIFB1YmxpYzogQ2xpcCB0aGUgZ2l2ZW4ge1BvaW50fSB0byBhIHZhbGlkIHBvc2l0aW9uIGluIHRoZSBidWZmZXIuXG4gICNcbiAgIyBJZiB0aGUgZ2l2ZW4ge1BvaW50fSBkZXNjcmliZXMgYSBwb3NpdGlvbiB0aGF0IGlzIGFjdHVhbGx5IHJlYWNoYWJsZSBieSB0aGVcbiAgIyBjdXJzb3IgYmFzZWQgb24gdGhlIGN1cnJlbnQgY29udGVudHMgb2YgdGhlIGJ1ZmZlciwgaXQgaXMgcmV0dXJuZWRcbiAgIyB1bmNoYW5nZWQuIElmIHRoZSB7UG9pbnR9IGRvZXMgbm90IGRlc2NyaWJlIGEgdmFsaWQgcG9zaXRpb24sIHRoZSBjbG9zZXN0XG4gICMgdmFsaWQgcG9zaXRpb24gaXMgcmV0dXJuZWQgaW5zdGVhZC5cbiAgI1xuICAjIEZvciBleGFtcGxlOlxuICAjICAgKiBgWy0xLCAtMV1gIGlzIGNvbnZlcnRlZCB0byBgWzAsIDBdYC5cbiAgIyAgICogSWYgdGhlIGxpbmUgYXQgcm93IDIgaXMgMTAgbG9uZywgYFsyLCBJbmZpbml0eV1gIGlzIGNvbnZlcnRlZCB0b1xuICAjICAgICBgWzIsIDEwXWAuXG4gICNcbiAgIyBidWZmZXJQb3NpdGlvbiAtIFRoZSB7UG9pbnR9IHJlcHJlc2VudGluZyB0aGUgcG9zaXRpb24gdG8gY2xpcC5cbiAgI1xuICAjIFJldHVybnMgYSB7UG9pbnR9LlxuICBjbGlwQnVmZmVyUG9zaXRpb246IChidWZmZXJQb3NpdGlvbikgLT4gQGJ1ZmZlci5jbGlwUG9zaXRpb24oYnVmZmVyUG9zaXRpb24pXG5cbiAgIyBQdWJsaWM6IENsaXAgdGhlIHN0YXJ0IGFuZCBlbmQgb2YgdGhlIGdpdmVuIHJhbmdlIHRvIHZhbGlkIHBvc2l0aW9ucyBpbiB0aGVcbiAgIyBidWZmZXIuIFNlZSB7OjpjbGlwQnVmZmVyUG9zaXRpb259IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAjXG4gICMgcmFuZ2UgLSBUaGUge1JhbmdlfSB0byBjbGlwLlxuICAjXG4gICMgUmV0dXJucyBhIHtSYW5nZX0uXG4gIGNsaXBCdWZmZXJSYW5nZTogKHJhbmdlKSAtPiBAYnVmZmVyLmNsaXBSYW5nZShyYW5nZSlcblxuICAjIFB1YmxpYzogR2V0IHRoZSBpbmRlbnRhdGlvbiBsZXZlbCBvZiB0aGUgZ2l2ZW4gYSBidWZmZXIgcm93LlxuICAjXG4gICMgUmV0dXJucyBob3cgZGVlcGx5IHRoZSBnaXZlbiByb3cgaXMgaW5kZW50ZWQgYmFzZWQgb24gdGhlIHNvZnQgdGFicyBhbmRcbiAgIyB0YWIgbGVuZ3RoIHNldHRpbmdzIG9mIHRoaXMgZWRpdG9yLiBOb3RlIHRoYXQgaWYgc29mdCB0YWJzIGFyZSBlbmFibGVkIGFuZFxuICAjIHRoZSB0YWIgbGVuZ3RoIGlzIDIsIGEgcm93IHdpdGggNCBsZWFkaW5nIHNwYWNlcyB3b3VsZCBoYXZlIGFuIGluZGVudGF0aW9uXG4gICMgbGV2ZWwgb2YgMi5cbiAgI1xuICAjIGJ1ZmZlclJvdyAtIEEge051bWJlcn0gaW5kaWNhdGluZyB0aGUgYnVmZmVyIHJvdy5cbiAgI1xuICAjIFJldHVybnMgYSB7TnVtYmVyfS5cbiAgaW5kZW50YXRpb25Gb3JCdWZmZXJSb3c6IChidWZmZXJSb3cpIC0+XG4gICAgQGluZGVudExldmVsRm9yTGluZShAbGluZUZvckJ1ZmZlclJvdyhidWZmZXJSb3cpKVxuXG4gICMgUHVibGljOiBTZXQgdGhlIGluZGVudGF0aW9uIGxldmVsIGZvciB0aGUgZ2l2ZW4gYnVmZmVyIHJvdy5cbiAgI1xuICAjIEluc2VydHMgb3IgcmVtb3ZlcyBoYXJkIHRhYnMgb3Igc3BhY2VzIGJhc2VkIG9uIHRoZSBzb2Z0IHRhYnMgYW5kIHRhYiBsZW5ndGhcbiAgIyBzZXR0aW5ncyBvZiB0aGlzIGVkaXRvciBpbiBvcmRlciB0byBicmluZyBpdCB0byB0aGUgZ2l2ZW4gaW5kZW50YXRpb24gbGV2ZWwuXG4gICMgTm90ZSB0aGF0IGlmIHNvZnQgdGFicyBhcmUgZW5hYmxlZCBhbmQgdGhlIHRhYiBsZW5ndGggaXMgMiwgYSByb3cgd2l0aCA0XG4gICMgbGVhZGluZyBzcGFjZXMgd291bGQgaGF2ZSBhbiBpbmRlbnRhdGlvbiBsZXZlbCBvZiAyLlxuICAjXG4gICMgYnVmZmVyUm93IC0gQSB7TnVtYmVyfSBpbmRpY2F0aW5nIHRoZSBidWZmZXIgcm93LlxuICAjIG5ld0xldmVsIC0gQSB7TnVtYmVyfSBpbmRpY2F0aW5nIHRoZSBuZXcgaW5kZW50YXRpb24gbGV2ZWwuXG4gICMgb3B0aW9ucyAtIEFuIHtPYmplY3R9IHdpdGggdGhlIGZvbGxvd2luZyBrZXlzOlxuICAjICAgOnByZXNlcnZlTGVhZGluZ1doaXRlc3BhY2UgLSB0cnVlIHRvIHByZXNlcnZlIGFueSB3aGl0ZXNwYWNlIGFscmVhZHkgYXRcbiAgIyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGJlZ2lubmluZyBvZiB0aGUgbGluZSAoZGVmYXVsdDogZmFsc2UpLlxuICBzZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdzogKGJ1ZmZlclJvdywgbmV3TGV2ZWwsIHtwcmVzZXJ2ZUxlYWRpbmdXaGl0ZXNwYWNlfT17fSkgLT5cbiAgICBpZiBwcmVzZXJ2ZUxlYWRpbmdXaGl0ZXNwYWNlXG4gICAgICBlbmRDb2x1bW4gPSAwXG4gICAgZWxzZVxuICAgICAgZW5kQ29sdW1uID0gQGxpbmVGb3JCdWZmZXJSb3coYnVmZmVyUm93KS5tYXRjaCgvXlxccyovKVswXS5sZW5ndGhcbiAgICBuZXdJbmRlbnRTdHJpbmcgPSBAYnVpbGRJbmRlbnRTdHJpbmcobmV3TGV2ZWwpXG4gICAgQGJ1ZmZlci5zZXRUZXh0SW5SYW5nZShbW2J1ZmZlclJvdywgMF0sIFtidWZmZXJSb3csIGVuZENvbHVtbl1dLCBuZXdJbmRlbnRTdHJpbmcpXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgaW5kZW50YXRpb24gbGV2ZWwgb2YgdGhlIGdpdmVuIGxpbmUgb2YgdGV4dC5cbiAgI1xuICAjIFJldHVybnMgaG93IGRlZXBseSB0aGUgZ2l2ZW4gbGluZSBpcyBpbmRlbnRlZCBiYXNlZCBvbiB0aGUgc29mdCB0YWJzIGFuZFxuICAjIHRhYiBsZW5ndGggc2V0dGluZ3Mgb2YgdGhpcyBlZGl0b3IuIE5vdGUgdGhhdCBpZiBzb2Z0IHRhYnMgYXJlIGVuYWJsZWQgYW5kXG4gICMgdGhlIHRhYiBsZW5ndGggaXMgMiwgYSByb3cgd2l0aCA0IGxlYWRpbmcgc3BhY2VzIHdvdWxkIGhhdmUgYW4gaW5kZW50YXRpb25cbiAgIyBsZXZlbCBvZiAyLlxuICAjXG4gICMgbGluZSAtIEEge1N0cmluZ30gcmVwcmVzZW50aW5nIGEgbGluZSBvZiB0ZXh0LlxuICAjXG4gICMgUmV0dXJucyBhIHtOdW1iZXJ9LlxuICBpbmRlbnRMZXZlbEZvckxpbmU6IChsaW5lKSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLmluZGVudExldmVsRm9yTGluZShsaW5lKVxuXG4gICMgQ29uc3RydWN0cyB0aGUgc3RyaW5nIHVzZWQgZm9yIHRhYnMuXG4gIGJ1aWxkSW5kZW50U3RyaW5nOiAobnVtYmVyKSAtPlxuICAgIGlmIEBnZXRTb2Z0VGFicygpXG4gICAgICBfLm11bHRpcGx5U3RyaW5nKFwiIFwiLCBNYXRoLmZsb29yKG51bWJlciAqIEBnZXRUYWJMZW5ndGgoKSkpXG4gICAgZWxzZVxuICAgICAgXy5tdWx0aXBseVN0cmluZyhcIlxcdFwiLCBNYXRoLmZsb29yKG51bWJlcikpXG5cbiAgIyBQdWJsaWM6IFNhdmVzIHRoZSBlZGl0b3IncyB0ZXh0IGJ1ZmZlci5cbiAgI1xuICAjIFNlZSB7VGV4dEJ1ZmZlcjo6c2F2ZX0gZm9yIG1vcmUgZGV0YWlscy5cbiAgc2F2ZTogLT4gQGJ1ZmZlci5zYXZlKClcblxuICAjIFB1YmxpYzogU2F2ZXMgdGhlIGVkaXRvcidzIHRleHQgYnVmZmVyIGFzIHRoZSBnaXZlbiBwYXRoLlxuICAjXG4gICMgU2VlIHtUZXh0QnVmZmVyOjpzYXZlQXN9IGZvciBtb3JlIGRldGFpbHMuXG4gICNcbiAgIyBmaWxlUGF0aCAtIEEge1N0cmluZ30gcGF0aC5cbiAgc2F2ZUFzOiAoZmlsZVBhdGgpIC0+IEBidWZmZXIuc2F2ZUFzKGZpbGVQYXRoKVxuXG4gIGNoZWNrb3V0SGVhZDogLT5cbiAgICBpZiBmaWxlUGF0aCA9IEBnZXRQYXRoKClcbiAgICAgIGF0b20ucHJvamVjdC5nZXRSZXBvKCk/LmNoZWNrb3V0SGVhZChmaWxlUGF0aClcblxuICAjIENvcGllcyB0aGUgY3VycmVudCBmaWxlIHBhdGggdG8gdGhlIG5hdGl2ZSBjbGlwYm9hcmQuXG4gIGNvcHlQYXRoVG9DbGlwYm9hcmQ6IC0+XG4gICAgaWYgZmlsZVBhdGggPSBAZ2V0UGF0aCgpXG4gICAgICBhdG9tLmNsaXBib2FyZC53cml0ZShmaWxlUGF0aClcblxuICAjIFB1YmxpYzogUmV0dXJucyB0aGUge1N0cmluZ30gcGF0aCBvZiB0aGlzIGVkaXRvcidzIHRleHQgYnVmZmVyLlxuICBnZXRQYXRoOiAtPiBAYnVmZmVyLmdldFBhdGgoKVxuXG4gICMgUHVibGljOiBSZXR1cm5zIGEge1N0cmluZ30gcmVwcmVzZW50aW5nIHRoZSBlbnRpcmUgY29udGVudHMgb2YgdGhlIGVkaXRvci5cbiAgZ2V0VGV4dDogLT4gQGJ1ZmZlci5nZXRUZXh0KClcblxuICAjIFB1YmxpYzogUmVwbGFjZXMgdGhlIGVudGlyZSBjb250ZW50cyBvZiB0aGUgYnVmZmVyIHdpdGggdGhlIGdpdmVuIHtTdHJpbmd9LlxuICBzZXRUZXh0OiAodGV4dCkgLT4gQGJ1ZmZlci5zZXRUZXh0KHRleHQpXG5cbiAgIyBHZXQgdGhlIHRleHQgaW4gdGhlIGdpdmVuIHtSYW5nZX0uXG4gICNcbiAgIyBSZXR1cm5zIGEge1N0cmluZ30uXG4gIGdldFRleHRJblJhbmdlOiAocmFuZ2UpIC0+IEBidWZmZXIuZ2V0VGV4dEluUmFuZ2UocmFuZ2UpXG5cbiAgIyBQdWJsaWM6IFJldHVybnMgYSB7TnVtYmVyfSByZXByZXNlbnRpbmcgdGhlIG51bWJlciBvZiBsaW5lcyBpbiB0aGUgZWRpdG9yLlxuICBnZXRMaW5lQ291bnQ6IC0+IEBidWZmZXIuZ2V0TGluZUNvdW50KClcblxuICAjIFJldHJpZXZlcyB0aGUgY3VycmVudCB7VGV4dEJ1ZmZlcn0uXG4gIGdldEJ1ZmZlcjogLT4gQGJ1ZmZlclxuXG4gICMgUHVibGljOiBSZXRyaWV2ZXMgdGhlIGN1cnJlbnQgYnVmZmVyJ3MgVVJJLlxuICBnZXRVcmk6IC0+IEBidWZmZXIuZ2V0VXJpKClcblxuICAjIHtEZWxlZ2F0ZXMgdG86IFRleHRCdWZmZXIuaXNSb3dCbGFua31cbiAgaXNCdWZmZXJSb3dCbGFuazogKGJ1ZmZlclJvdykgLT4gQGJ1ZmZlci5pc1Jvd0JsYW5rKGJ1ZmZlclJvdylcblxuICAjIFB1YmxpYzogRGV0ZXJtaW5lIGlmIHRoZSBnaXZlbiByb3cgaXMgZW50aXJlbHkgYSBjb21tZW50XG4gIGlzQnVmZmVyUm93Q29tbWVudGVkOiAoYnVmZmVyUm93KSAtPlxuICAgIGlmIG1hdGNoID0gQGxpbmVGb3JCdWZmZXJSb3coYnVmZmVyUm93KS5tYXRjaCgvXFxTLylcbiAgICAgIHNjb3BlcyA9IEB0b2tlbkZvckJ1ZmZlclBvc2l0aW9uKFtidWZmZXJSb3csIG1hdGNoLmluZGV4XSkuc2NvcGVzXG4gICAgICBuZXcgVGV4dE1hdGVTY29wZVNlbGVjdG9yKCdjb21tZW50LionKS5tYXRjaGVzKHNjb3BlcylcblxuICAjIHtEZWxlZ2F0ZXMgdG86IFRleHRCdWZmZXIubmV4dE5vbkJsYW5rUm93fVxuICBuZXh0Tm9uQmxhbmtCdWZmZXJSb3c6IChidWZmZXJSb3cpIC0+IEBidWZmZXIubmV4dE5vbkJsYW5rUm93KGJ1ZmZlclJvdylcblxuICAjIHtEZWxlZ2F0ZXMgdG86IFRleHRCdWZmZXIuZ2V0RW5kUG9zaXRpb259XG4gIGdldEVvZkJ1ZmZlclBvc2l0aW9uOiAtPiBAYnVmZmVyLmdldEVuZFBvc2l0aW9uKClcblxuICAjIFB1YmxpYzogUmV0dXJucyBhIHtOdW1iZXJ9IHJlcHJlc2VudGluZyB0aGUgbGFzdCB6ZXJvLWluZGV4ZWQgYnVmZmVyIHJvd1xuICAjIG51bWJlciBvZiB0aGUgZWRpdG9yLlxuICBnZXRMYXN0QnVmZmVyUm93OiAtPiBAYnVmZmVyLmdldExhc3RSb3coKVxuXG4gICMgUmV0dXJucyB0aGUgcmFuZ2UgZm9yIHRoZSBnaXZlbiBidWZmZXIgcm93LlxuICAjXG4gICMgcm93IC0gQSByb3cge051bWJlcn0uXG4gICMgb3B0aW9ucyAtIEFuIG9wdGlvbnMgaGFzaCB3aXRoIGFuIGBpbmNsdWRlTmV3bGluZWAga2V5LlxuICAjXG4gICMgUmV0dXJucyBhIHtSYW5nZX0uXG4gIGJ1ZmZlclJhbmdlRm9yQnVmZmVyUm93OiAocm93LCB7aW5jbHVkZU5ld2xpbmV9PXt9KSAtPiBAYnVmZmVyLnJhbmdlRm9yUm93KHJvdywgaW5jbHVkZU5ld2xpbmUpXG5cbiAgIyBQdWJsaWM6IFJldHVybnMgYSB7U3RyaW5nfSByZXByZXNlbnRpbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBsaW5lIGF0IHRoZVxuICAjIGdpdmVuIGJ1ZmZlciByb3cuXG4gICNcbiAgIyByb3cgLSBBIHtOdW1iZXJ9IHJlcHJlc2VudGluZyBhIHplcm8taW5kZXhlZCBidWZmZXIgcm93LlxuICBsaW5lRm9yQnVmZmVyUm93OiAocm93KSAtPiBAYnVmZmVyLmxpbmVGb3JSb3cocm93KVxuXG4gICMgUHVibGljOiBSZXR1cm5zIGEge051bWJlcn0gcmVwcmVzZW50aW5nIHRoZSBsaW5lIGxlbmd0aCBmb3IgdGhlIGdpdmVuXG4gICMgYnVmZmVyIHJvdywgZXhjbHVzaXZlIG9mIGl0cyBsaW5lLWVuZGluZyBjaGFyYWN0ZXIocykuXG4gICNcbiAgIyByb3cgLSBBIHtOdW1iZXJ9IGluZGljYXRpbmcgdGhlIGJ1ZmZlciByb3cuXG4gIGxpbmVMZW5ndGhGb3JCdWZmZXJSb3c6IChyb3cpIC0+IEBidWZmZXIubGluZUxlbmd0aEZvclJvdyhyb3cpXG5cbiAgIyB7RGVsZWdhdGVzIHRvOiBUZXh0QnVmZmVyLnNjYW59XG4gIHNjYW46IChhcmdzLi4uKSAtPiBAYnVmZmVyLnNjYW4oYXJncy4uLilcblxuICAjIHtEZWxlZ2F0ZXMgdG86IFRleHRCdWZmZXIuc2NhbkluUmFuZ2V9XG4gIHNjYW5JbkJ1ZmZlclJhbmdlOiAoYXJncy4uLikgLT4gQGJ1ZmZlci5zY2FuSW5SYW5nZShhcmdzLi4uKVxuXG4gICMge0RlbGVnYXRlcyB0bzogVGV4dEJ1ZmZlci5iYWNrd2FyZHNTY2FuSW5SYW5nZX1cbiAgYmFja3dhcmRzU2NhbkluQnVmZmVyUmFuZ2U6IChhcmdzLi4uKSAtPiBAYnVmZmVyLmJhY2t3YXJkc1NjYW5JblJhbmdlKGFyZ3MuLi4pXG5cbiAgIyB7RGVsZWdhdGVzIHRvOiBUZXh0QnVmZmVyLmlzTW9kaWZpZWR9XG4gIGlzTW9kaWZpZWQ6IC0+IEBidWZmZXIuaXNNb2RpZmllZCgpXG5cbiAgIyBQdWJsaWM6IERldGVybWluZSB3aGV0aGVyIHRoZSB1c2VyIHNob3VsZCBiZSBwcm9tcHRlZCB0byBzYXZlIGJlZm9yZSBjbG9zaW5nXG4gICMgdGhpcyBlZGl0b3IuXG4gIHNob3VsZFByb21wdFRvU2F2ZTogLT4gQGlzTW9kaWZpZWQoKSBhbmQgbm90IEBidWZmZXIuaGFzTXVsdGlwbGVFZGl0b3JzKClcblxuICAjIFB1YmxpYzogQ29udmVydCBhIHBvc2l0aW9uIGluIGJ1ZmZlci1jb29yZGluYXRlcyB0byBzY3JlZW4tY29vcmRpbmF0ZXMuXG4gICNcbiAgIyBUaGUgcG9zaXRpb24gaXMgY2xpcHBlZCB2aWEgezo6Y2xpcEJ1ZmZlclBvc2l0aW9ufSBwcmlvciB0byB0aGUgY29udmVyc2lvbi5cbiAgIyBUaGUgcG9zaXRpb24gaXMgYWxzbyBjbGlwcGVkIHZpYSB7OjpjbGlwU2NyZWVuUG9zaXRpb259IGZvbGxvd2luZyB0aGVcbiAgIyBjb252ZXJzaW9uLCB3aGljaCBvbmx5IG1ha2VzIGEgZGlmZmVyZW5jZSB3aGVuIGBvcHRpb25zYCBhcmUgc3VwcGxpZWQuXG4gICNcbiAgIyBidWZmZXJQb3NpdGlvbiAtIEEge1BvaW50fSBvciB7QXJyYXl9IG9mIFtyb3csIGNvbHVtbl0uXG4gICMgb3B0aW9ucyAtIEFuIG9wdGlvbnMgaGFzaCBmb3Igezo6Y2xpcFNjcmVlblBvc2l0aW9ufS5cbiAgI1xuICAjIFJldHVybnMgYSB7UG9pbnR9LlxuICBzY3JlZW5Qb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uOiAoYnVmZmVyUG9zaXRpb24sIG9wdGlvbnMpIC0+IEBkaXNwbGF5QnVmZmVyLnNjcmVlblBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24sIG9wdGlvbnMpXG5cbiAgIyBQdWJsaWM6IENvbnZlcnQgYSBwb3NpdGlvbiBpbiBzY3JlZW4tY29vcmRpbmF0ZXMgdG8gYnVmZmVyLWNvb3JkaW5hdGVzLlxuICAjXG4gICMgVGhlIHBvc2l0aW9uIGlzIGNsaXBwZWQgdmlhIHs6OmNsaXBTY3JlZW5Qb3NpdGlvbn0gcHJpb3IgdG8gdGhlIGNvbnZlcnNpb24uXG4gICNcbiAgIyBidWZmZXJQb3NpdGlvbiAtIEEge1BvaW50fSBvciB7QXJyYXl9IG9mIFtyb3csIGNvbHVtbl0uXG4gICMgb3B0aW9ucyAtIEFuIG9wdGlvbnMgaGFzaCBmb3Igezo6Y2xpcFNjcmVlblBvc2l0aW9ufS5cbiAgI1xuICAjIFJldHVybnMgYSB7UG9pbnR9LlxuICBidWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uOiAoc2NyZWVuUG9zaXRpb24sIG9wdGlvbnMpIC0+IEBkaXNwbGF5QnVmZmVyLmJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24sIG9wdGlvbnMpXG5cbiAgIyBQdWJsaWM6IENvbnZlcnQgYSByYW5nZSBpbiBidWZmZXItY29vcmRpbmF0ZXMgdG8gc2NyZWVuLWNvb3JkaW5hdGVzLlxuICAjXG4gICMgUmV0dXJucyBhIHtSYW5nZX0uXG4gIHNjcmVlblJhbmdlRm9yQnVmZmVyUmFuZ2U6IChidWZmZXJSYW5nZSkgLT4gQGRpc3BsYXlCdWZmZXIuc2NyZWVuUmFuZ2VGb3JCdWZmZXJSYW5nZShidWZmZXJSYW5nZSlcblxuICAjIFB1YmxpYzogQ29udmVydCBhIHJhbmdlIGluIHNjcmVlbi1jb29yZGluYXRlcyB0byBidWZmZXItY29vcmRpbmF0ZXMuXG4gICNcbiAgIyBSZXR1cm5zIGEge1JhbmdlfS5cbiAgYnVmZmVyUmFuZ2VGb3JTY3JlZW5SYW5nZTogKHNjcmVlblJhbmdlKSAtPiBAZGlzcGxheUJ1ZmZlci5idWZmZXJSYW5nZUZvclNjcmVlblJhbmdlKHNjcmVlblJhbmdlKVxuXG4gICMgUHVibGljOiBDbGlwIHRoZSBnaXZlbiB7UG9pbnR9IHRvIGEgdmFsaWQgcG9zaXRpb24gb24gc2NyZWVuLlxuICAjXG4gICMgSWYgdGhlIGdpdmVuIHtQb2ludH0gZGVzY3JpYmVzIGEgcG9zaXRpb24gdGhhdCBpcyBhY3R1YWxseSByZWFjaGFibGUgYnkgdGhlXG4gICMgY3Vyc29yIGJhc2VkIG9uIHRoZSBjdXJyZW50IGNvbnRlbnRzIG9mIHRoZSBzY3JlZW4sIGl0IGlzIHJldHVybmVkXG4gICMgdW5jaGFuZ2VkLiBJZiB0aGUge1BvaW50fSBkb2VzIG5vdCBkZXNjcmliZSBhIHZhbGlkIHBvc2l0aW9uLCB0aGUgY2xvc2VzdFxuICAjIHZhbGlkIHBvc2l0aW9uIGlzIHJldHVybmVkIGluc3RlYWQuXG4gICNcbiAgIyBGb3IgZXhhbXBsZTpcbiAgIyAgICogYFstMSwgLTFdYCBpcyBjb252ZXJ0ZWQgdG8gYFswLCAwXWAuXG4gICMgICAqIElmIHRoZSBsaW5lIGF0IHNjcmVlbiByb3cgMiBpcyAxMCBsb25nLCBgWzIsIEluZmluaXR5XWAgaXMgY29udmVydGVkIHRvXG4gICMgICAgIGBbMiwgMTBdYC5cbiAgI1xuICAjIGJ1ZmZlclBvc2l0aW9uIC0gVGhlIHtQb2ludH0gcmVwcmVzZW50aW5nIHRoZSBwb3NpdGlvbiB0byBjbGlwLlxuICAjXG4gICMgUmV0dXJucyBhIHtQb2ludH0uXG4gIGNsaXBTY3JlZW5Qb3NpdGlvbjogKHNjcmVlblBvc2l0aW9uLCBvcHRpb25zKSAtPiBAZGlzcGxheUJ1ZmZlci5jbGlwU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24sIG9wdGlvbnMpXG5cbiAgIyB7RGVsZWdhdGVzIHRvOiBEaXNwbGF5QnVmZmVyLmxpbmVGb3JSb3d9XG4gIGxpbmVGb3JTY3JlZW5Sb3c6IChyb3cpIC0+IEBkaXNwbGF5QnVmZmVyLmxpbmVGb3JSb3cocm93KVxuXG4gICMge0RlbGVnYXRlcyB0bzogRGlzcGxheUJ1ZmZlci5saW5lc0ZvclJvd3N9XG4gIGxpbmVzRm9yU2NyZWVuUm93czogKHN0YXJ0LCBlbmQpIC0+IEBkaXNwbGF5QnVmZmVyLmxpbmVzRm9yUm93cyhzdGFydCwgZW5kKVxuXG4gICMge0RlbGVnYXRlcyB0bzogRGlzcGxheUJ1ZmZlci5nZXRMaW5lQ291bnR9XG4gIGdldFNjcmVlbkxpbmVDb3VudDogLT4gQGRpc3BsYXlCdWZmZXIuZ2V0TGluZUNvdW50KClcblxuICAjIHtEZWxlZ2F0ZXMgdG86IERpc3BsYXlCdWZmZXIuZ2V0TWF4TGluZUxlbmd0aH1cbiAgZ2V0TWF4U2NyZWVuTGluZUxlbmd0aDogLT4gQGRpc3BsYXlCdWZmZXIuZ2V0TWF4TGluZUxlbmd0aCgpXG5cbiAgIyB7RGVsZWdhdGVzIHRvOiBEaXNwbGF5QnVmZmVyLmdldExhc3RSb3d9XG4gIGdldExhc3RTY3JlZW5Sb3c6IC0+IEBkaXNwbGF5QnVmZmVyLmdldExhc3RSb3coKVxuXG4gICMge0RlbGVnYXRlcyB0bzogRGlzcGxheUJ1ZmZlci5idWZmZXJSb3dzRm9yU2NyZWVuUm93c31cbiAgYnVmZmVyUm93c0ZvclNjcmVlblJvd3M6IChzdGFydFJvdywgZW5kUm93KSAtPiBAZGlzcGxheUJ1ZmZlci5idWZmZXJSb3dzRm9yU2NyZWVuUm93cyhzdGFydFJvdywgZW5kUm93KVxuXG4gIGJ1ZmZlclJvd0ZvclNjcmVlblJvdzogKHJvdykgLT4gQGRpc3BsYXlCdWZmZXIuYnVmZmVyUm93Rm9yU2NyZWVuUm93KHJvdylcblxuICAjIFB1YmxpYzogR2V0IHRoZSBzeW50YWN0aWMgc2NvcGVzIGZvciB0aGUgbW9zdCB0aGUgZ2l2ZW4gcG9zaXRpb24gaW4gYnVmZmVyXG4gICMgY29vcmRpdGFuYXRlcy5cbiAgI1xuICAjIEZvciBleGFtcGxlLCBpZiBjYWxsZWQgd2l0aCBhIHBvc2l0aW9uIGluc2lkZSB0aGUgcGFyYW1ldGVyIGxpc3Qgb2YgYW5cbiAgIyBhbm9ueW1vdXMgQ29mZmVlU2NyaXB0IGZ1bmN0aW9uLCB0aGUgbWV0aG9kIHJldHVybnMgdGhlIGZvbGxvd2luZyBhcnJheTpcbiAgIyBgW1wic291cmNlLmNvZmZlZVwiLCBcIm1ldGEuaW5saW5lLmZ1bmN0aW9uLmNvZmZlZVwiLCBcInZhcmlhYmxlLnBhcmFtZXRlci5mdW5jdGlvbi5jb2ZmZWVcIl1gXG4gICNcbiAgIyBidWZmZXJQb3NpdGlvbiAtIEEge1BvaW50fSBvciB7QXJyYXl9IG9mIFtyb3csIGNvbHVtbl0uXG4gICNcbiAgIyBSZXR1cm5zIGFuIHtBcnJheX0gb2Yge1N0cmluZ31zLlxuICBzY29wZXNGb3JCdWZmZXJQb3NpdGlvbjogKGJ1ZmZlclBvc2l0aW9uKSAtPiBAZGlzcGxheUJ1ZmZlci5zY29wZXNGb3JCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcblxuICAjIFB1YmxpYzogR2V0IHRoZSByYW5nZSBpbiBidWZmZXIgY29vcmRpbmF0ZXMgb2YgYWxsIHRva2VucyBzdXJyb3VuZGluZyB0aGVcbiAgIyBjdXJzb3IgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gc2NvcGUgc2VsZWN0b3IuXG4gICNcbiAgIyBGb3IgZXhhbXBsZSwgaWYgeW91IHdhbnRlZCB0byBmaW5kIHRoZSBzdHJpbmcgc3Vycm91bmRpbmcgdGhlIGN1cnNvciwgeW91XG4gICMgY291bGQgY2FsbCBgZWRpdG9yLmJ1ZmZlclJhbmdlRm9yU2NvcGVBdEN1cnNvcihcIi5zdHJpbmcucXVvdGVkXCIpYC5cbiAgI1xuICAjIFJldHVybnMgYSB7UmFuZ2V9LlxuICBidWZmZXJSYW5nZUZvclNjb3BlQXRDdXJzb3I6IChzZWxlY3RvcikgLT5cbiAgICBAZGlzcGxheUJ1ZmZlci5idWZmZXJSYW5nZUZvclNjb3BlQXRQb3NpdGlvbihzZWxlY3RvciwgQGdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpXG5cbiAgIyB7RGVsZWdhdGVzIHRvOiBEaXNwbGF5QnVmZmVyLnRva2VuRm9yQnVmZmVyUG9zaXRpb259XG4gIHRva2VuRm9yQnVmZmVyUG9zaXRpb246IChidWZmZXJQb3NpdGlvbikgLT4gQGRpc3BsYXlCdWZmZXIudG9rZW5Gb3JCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcblxuICAjIFB1YmxpYzogR2V0IHRoZSBzeW50YWN0aWMgc2NvcGVzIGZvciB0aGUgbW9zdCByZWNlbnRseSBhZGRlZCBjdXJzb3Inc1xuICAjIHBvc2l0aW9uLiBTZWUgezo6c2NvcGVzRm9yQnVmZmVyUG9zaXRpb259IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAjXG4gICMgUmV0dXJucyBhbiB7QXJyYXl9IG9mIHtTdHJpbmd9cy5cbiAgZ2V0Q3Vyc29yU2NvcGVzOiAtPiBAZ2V0Q3Vyc29yKCkuZ2V0U2NvcGVzKClcblxuICBsb2dDdXJzb3JTY29wZTogLT5cbiAgICBjb25zb2xlLmxvZyBAZ2V0Q3Vyc29yU2NvcGVzKClcblxuICAjIFB1YmxpYzogRm9yIGVhY2ggc2VsZWN0aW9uLCByZXBsYWNlIHRoZSBzZWxlY3RlZCB0ZXh0IHdpdGggdGhlIGdpdmVuIHRleHQuXG4gICNcbiAgIyB0ZXh0IC0gQSB7U3RyaW5nfSByZXByZXNlbnRpbmcgdGhlIHRleHQgdG8gaW5zZXJ0LlxuICAjIG9wdGlvbnMgLSBTZWUge1NlbGVjdGlvbjo6aW5zZXJ0VGV4dH0uXG4gIGluc2VydFRleHQ6ICh0ZXh0LCBvcHRpb25zPXt9KSAtPlxuICAgIG9wdGlvbnMuYXV0b0luZGVudE5ld2xpbmUgPz0gQHNob3VsZEF1dG9JbmRlbnQoKVxuICAgIG9wdGlvbnMuYXV0b0RlY3JlYXNlSW5kZW50ID89IEBzaG91bGRBdXRvSW5kZW50KClcbiAgICBAbXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24pIC0+IHNlbGVjdGlvbi5pbnNlcnRUZXh0KHRleHQsIG9wdGlvbnMpXG5cbiAgIyBQdWJsaWM6IEZvciBlYWNoIHNlbGVjdGlvbiwgcmVwbGFjZSB0aGUgc2VsZWN0ZWQgdGV4dCB3aXRoIGEgbmV3bGluZS5cbiAgaW5zZXJ0TmV3bGluZTogLT5cbiAgICBAaW5zZXJ0VGV4dCgnXFxuJylcblxuICAjIFB1YmxpYzogRm9yIGVhY2ggY3Vyc29yLCBpbnNlcnQgYSBuZXdsaW5lIGF0IGJlZ2lubmluZyB0aGUgZm9sbG93aW5nIGxpbmUuXG4gIGluc2VydE5ld2xpbmVCZWxvdzogLT5cbiAgICBAdHJhbnNhY3QgPT5cbiAgICAgIEBtb3ZlQ3Vyc29yVG9FbmRPZkxpbmUoKVxuICAgICAgQGluc2VydE5ld2xpbmUoKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBjdXJzb3IsIGluc2VydCBhIG5ld2xpbmUgYXQgdGhlIGVuZCBvZiB0aGUgcHJlY2VkaW5nIGxpbmUuXG4gIGluc2VydE5ld2xpbmVBYm92ZTogLT5cbiAgICBAdHJhbnNhY3QgPT5cbiAgICAgIGJ1ZmZlclJvdyA9IEBnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLnJvd1xuICAgICAgaW5kZW50TGV2ZWwgPSBAaW5kZW50YXRpb25Gb3JCdWZmZXJSb3coYnVmZmVyUm93KVxuICAgICAgb25GaXJzdExpbmUgPSBidWZmZXJSb3cgaXMgMFxuXG4gICAgICBAbW92ZUN1cnNvclRvQmVnaW5uaW5nT2ZMaW5lKClcbiAgICAgIEBtb3ZlQ3Vyc29yTGVmdCgpXG4gICAgICBAaW5zZXJ0TmV3bGluZSgpXG5cbiAgICAgIGlmIEBzaG91bGRBdXRvSW5kZW50KCkgYW5kIEBpbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhidWZmZXJSb3cpIDwgaW5kZW50TGV2ZWxcbiAgICAgICAgQHNldEluZGVudGF0aW9uRm9yQnVmZmVyUm93KGJ1ZmZlclJvdywgaW5kZW50TGV2ZWwpXG5cbiAgICAgIGlmIG9uRmlyc3RMaW5lXG4gICAgICAgIEBtb3ZlQ3Vyc29yVXAoKVxuICAgICAgICBAbW92ZUN1cnNvclRvRW5kT2ZMaW5lKClcblxuICAjIEluZGVudCBhbGwgbGluZXMgaW50ZXJzZWN0aW5nIHNlbGVjdGlvbnMuIFNlZSB7U2VsZWN0aW9uOjppbmRlbnR9IGZvciBtb3JlXG4gICMgaW5mb3JtYXRpb24uXG4gIGluZGVudDogKG9wdGlvbnM9e30pLT5cbiAgICBvcHRpb25zLmF1dG9JbmRlbnQgPz0gQHNob3VsZEF1dG9JbmRlbnQoKVxuICAgIEBtdXRhdGVTZWxlY3RlZFRleHQgKHNlbGVjdGlvbikgLT4gc2VsZWN0aW9uLmluZGVudChvcHRpb25zKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksIGRlbGV0ZSB0aGUgY2hhcmFjdGVyXG4gICMgcHJlY2VkaW5nIHRoZSBjdXJzb3IuIE90aGVyd2lzZSBkZWxldGUgdGhlIHNlbGVjdGVkIHRleHQuXG4gIGJhY2tzcGFjZTogLT5cbiAgICBAbXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24pIC0+IHNlbGVjdGlvbi5iYWNrc3BhY2UoKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksIGRlbGV0ZSBhbGwgY2hhcmFjdGVyc1xuICAjIG9mIHRoZSBjb250YWluaW5nIHdvcmQgdGhhdCBwcmVjZWRlIHRoZSBjdXJzb3IuIE90aGVyd2lzZSBkZWxldGUgdGhlXG4gICMgc2VsZWN0ZWQgdGV4dC5cbiAgYmFja3NwYWNlVG9CZWdpbm5pbmdPZldvcmQ6IC0+XG4gICAgQG11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uKSAtPiBzZWxlY3Rpb24uYmFja3NwYWNlVG9CZWdpbm5pbmdPZldvcmQoKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksIGRlbGV0ZSBhbGwgY2hhcmFjdGVyc1xuICAjIG9mIHRoZSBjb250YWluaW5nIGxpbmUgdGhhdCBwcmVjZWRlIHRoZSBjdXJzb3IuIE90aGVyd2lzZSBkZWxldGUgdGhlXG4gICMgc2VsZWN0ZWQgdGV4dC5cbiAgYmFja3NwYWNlVG9CZWdpbm5pbmdPZkxpbmU6IC0+XG4gICAgQG11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uKSAtPiBzZWxlY3Rpb24uYmFja3NwYWNlVG9CZWdpbm5pbmdPZkxpbmUoKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksIGRlbGV0ZSB0aGUgY2hhcmFjdGVyXG4gICMgcHJlY2VkaW5nIHRoZSBjdXJzb3IuIE90aGVyd2lzZSBkZWxldGUgdGhlIHNlbGVjdGVkIHRleHQuXG4gIGRlbGV0ZTogLT5cbiAgICBAbXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24pIC0+IHNlbGVjdGlvbi5kZWxldGUoKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIGlmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksIGRlbGV0ZSBhbGwgY2hhcmFjdGVyc1xuICAjIG9mIHRoZSBjb250YWluaW5nIHdvcmQgZm9sbG93aW5nIHRoZSBjdXJzb3IuIE90aGVyd2lzZSBkZWxldGUgdGhlIHNlbGVjdGVkXG4gICMgdGV4dC5cbiAgZGVsZXRlVG9FbmRPZldvcmQ6IC0+XG4gICAgQG11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uKSAtPiBzZWxlY3Rpb24uZGVsZXRlVG9FbmRPZldvcmQoKVxuXG4gICMgUHVibGljOiBEZWxldGUgYWxsIGxpbmVzIGludGVyc2VjdGluZyBzZWxlY3Rpb25zLlxuICBkZWxldGVMaW5lOiAtPlxuICAgIEBtdXRhdGVTZWxlY3RlZFRleHQgKHNlbGVjdGlvbikgLT4gc2VsZWN0aW9uLmRlbGV0ZUxpbmUoKVxuXG4gICMgUHVibGljOiBJbmRlbnQgcm93cyBpbnRlcnNlY3Rpbmcgc2VsZWN0aW9ucyBieSBvbmUgbGV2ZWwuXG4gIGluZGVudFNlbGVjdGVkUm93czogLT5cbiAgICBAbXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24pIC0+IHNlbGVjdGlvbi5pbmRlbnRTZWxlY3RlZFJvd3MoKVxuXG4gICMgUHVibGljOiBPdXRkZW50IHJvd3MgaW50ZXJzZWN0aW5nIHNlbGVjdGlvbnMgYnkgb25lIGxldmVsLlxuICBvdXRkZW50U2VsZWN0ZWRSb3dzOiAtPlxuICAgIEBtdXRhdGVTZWxlY3RlZFRleHQgKHNlbGVjdGlvbikgLT4gc2VsZWN0aW9uLm91dGRlbnRTZWxlY3RlZFJvd3MoKVxuXG4gICMgUHVibGljOiBUb2dnbGUgbGluZSBjb21tZW50cyBmb3Igcm93cyBpbnRlcnNlY3Rpbmcgc2VsZWN0aW9ucy5cbiAgI1xuICAjIElmIHRoZSBjdXJyZW50IGdyYW1tYXIgZG9lc24ndCBzdXBwb3J0IGNvbW1lbnRzLCBkb2VzIG5vdGhpbmcuXG4gICNcbiAgIyBSZXR1cm5zIGFuIHtBcnJheX0gb2YgdGhlIGNvbW1lbnRlZCB7UmFuZ2V9cy5cbiAgdG9nZ2xlTGluZUNvbW1lbnRzSW5TZWxlY3Rpb246IC0+XG4gICAgQG11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uKSAtPiBzZWxlY3Rpb24udG9nZ2xlTGluZUNvbW1lbnRzKClcblxuICAjIFB1YmxpYzogSW5kZW50IHJvd3MgaW50ZXJzZWN0aW5nIHNlbGVjdGlvbnMgYmFzZWQgb24gdGhlIGdyYW1tYXIncyBzdWdnZXN0ZWRcbiAgIyBpbmRlbnQgbGV2ZWwuXG4gIGF1dG9JbmRlbnRTZWxlY3RlZFJvd3M6IC0+XG4gICAgQG11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uKSAtPiBzZWxlY3Rpb24uYXV0b0luZGVudFNlbGVjdGVkUm93cygpXG5cbiAgIyBJZiBzb2Z0IHRhYnMgYXJlIGVuYWJsZWQsIGNvbnZlcnQgYWxsIGhhcmQgdGFicyB0byBzb2Z0IHRhYnMgaW4gdGhlIGdpdmVuXG4gICMge1JhbmdlfS5cbiAgbm9ybWFsaXplVGFic0luQnVmZmVyUmFuZ2U6IChidWZmZXJSYW5nZSkgLT5cbiAgICByZXR1cm4gdW5sZXNzIEBnZXRTb2Z0VGFicygpXG4gICAgQHNjYW5JbkJ1ZmZlclJhbmdlIC9cXHQvZywgYnVmZmVyUmFuZ2UsICh7cmVwbGFjZX0pID0+IHJlcGxhY2UoQGdldFRhYlRleHQoKSlcblxuICAjIFB1YmxpYzogRm9yIGVhY2ggc2VsZWN0aW9uLCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LCBjdXQgYWxsIGNoYXJhY3RlcnNcbiAgIyBvZiB0aGUgY29udGFpbmluZyBsaW5lIGZvbGxvd2luZyB0aGUgY3Vyc29yLiBPdGhlcndpc2UgY3V0IHRoZSBzZWxlY3RlZFxuICAjIHRleHQuXG4gIGN1dFRvRW5kT2ZMaW5lOiAtPlxuICAgIG1haW50YWluQ2xpcGJvYXJkID0gZmFsc2VcbiAgICBAbXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24pIC0+XG4gICAgICBzZWxlY3Rpb24uY3V0VG9FbmRPZkxpbmUobWFpbnRhaW5DbGlwYm9hcmQpXG4gICAgICBtYWludGFpbkNsaXBib2FyZCA9IHRydWVcblxuICAjIFB1YmxpYzogRm9yIGVhY2ggc2VsZWN0aW9uLCBjdXQgdGhlIHNlbGVjdGVkIHRleHQuXG4gIGN1dFNlbGVjdGVkVGV4dDogLT5cbiAgICBtYWludGFpbkNsaXBib2FyZCA9IGZhbHNlXG4gICAgQG11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uKSAtPlxuICAgICAgc2VsZWN0aW9uLmN1dChtYWludGFpbkNsaXBib2FyZClcbiAgICAgIG1haW50YWluQ2xpcGJvYXJkID0gdHJ1ZVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIGNvcHkgdGhlIHNlbGVjdGVkIHRleHQuXG4gIGNvcHlTZWxlY3RlZFRleHQ6IC0+XG4gICAgbWFpbnRhaW5DbGlwYm9hcmQgPSBmYWxzZVxuICAgIGZvciBzZWxlY3Rpb24gaW4gQGdldFNlbGVjdGlvbnMoKVxuICAgICAgc2VsZWN0aW9uLmNvcHkobWFpbnRhaW5DbGlwYm9hcmQpXG4gICAgICBtYWludGFpbkNsaXBib2FyZCA9IHRydWVcblxuICAjIFB1YmxpYzogRm9yIGVhY2ggc2VsZWN0aW9uLCByZXBsYWNlIHRoZSBzZWxlY3RlZCB0ZXh0IHdpdGggdGhlIGNvbnRlbnRzIG9mXG4gICMgdGhlIGNsaXBib2FyZC5cbiAgI1xuICAjIElmIHRoZSBjbGlwYm9hcmQgY29udGFpbnMgdGhlIHNhbWUgbnVtYmVyIG9mIHNlbGVjdGlvbnMgYXMgdGhlIGN1cnJlbnRcbiAgIyBlZGl0b3IsIGVhY2ggc2VsZWN0aW9uIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCB0aGUgY29udGVudCBvZiB0aGVcbiAgIyBjb3JyZXNwb25kaW5nIGNsaXBib2FyZCBzZWxlY3Rpb24gdGV4dC5cbiAgI1xuICAjIG9wdGlvbnMgLSBTZWUge1NlbGVjdGlvbjo6aW5zZXJ0VGV4dH0uXG4gIHBhc3RlVGV4dDogKG9wdGlvbnM9e30pIC0+XG4gICAge3RleHQsIG1ldGFkYXRhfSA9IGF0b20uY2xpcGJvYXJkLnJlYWRXaXRoTWV0YWRhdGEoKVxuXG4gICAgY29udGFpbnNOZXdsaW5lcyA9IHRleHQuaW5kZXhPZignXFxuJykgaXNudCAtMVxuXG4gICAgaWYgbWV0YWRhdGE/LnNlbGVjdGlvbnM/IGFuZCBtZXRhZGF0YS5zZWxlY3Rpb25zLmxlbmd0aCBpcyBAZ2V0U2VsZWN0aW9ucygpLmxlbmd0aFxuICAgICAgQG11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uLCBpbmRleCkgPT5cbiAgICAgICAgdGV4dCA9IG1ldGFkYXRhLnNlbGVjdGlvbnNbaW5kZXhdXG4gICAgICAgIHNlbGVjdGlvbi5pbnNlcnRUZXh0KHRleHQsIG9wdGlvbnMpXG5cbiAgICAgIHJldHVyblxuXG4gICAgZWxzZSBpZiBhdG9tLmNvbmZpZy5nZXQoXCJlZGl0b3Iubm9ybWFsaXplSW5kZW50T25QYXN0ZVwiKSBhbmQgbWV0YWRhdGE/LmluZGVudEJhc2lzP1xuICAgICAgaWYgIUBnZXRDdXJzb3IoKS5oYXNQcmVjZWRpbmdDaGFyYWN0ZXJzT25MaW5lKCkgb3IgY29udGFpbnNOZXdsaW5lc1xuICAgICAgICBvcHRpb25zLmluZGVudEJhc2lzID89IG1ldGFkYXRhLmluZGVudEJhc2lzXG5cbiAgICBAaW5zZXJ0VGV4dCh0ZXh0LCBvcHRpb25zKVxuXG4gICMgUHVibGljOiBVbmRvIHRoZSBsYXN0IGNoYW5nZS5cbiAgdW5kbzogLT5cbiAgICBAZ2V0Q3Vyc29yKCkubmVlZHNBdXRvc2Nyb2xsID0gdHJ1ZVxuICAgIEBidWZmZXIudW5kbyh0aGlzKVxuXG4gICMgUHVibGljOiBSZWRvIHRoZSBsYXN0IGNoYW5nZS5cbiAgcmVkbzogLT5cbiAgICBAZ2V0Q3Vyc29yKCkubmVlZHNBdXRvc2Nyb2xsID0gdHJ1ZVxuICAgIEBidWZmZXIucmVkbyh0aGlzKVxuXG4gICMgUHVibGljOiBGb2xkIHRoZSBtb3N0IHJlY2VudCBjdXJzb3IncyByb3cgYmFzZWQgb24gaXRzIGluZGVudGF0aW9uIGxldmVsLlxuICAjXG4gICMgVGhlIGZvbGQgd2lsbCBleHRlbmQgZnJvbSB0aGUgbmVhcmVzdCBwcmVjZWRpbmcgbGluZSB3aXRoIGEgbG93ZXJcbiAgIyBpbmRlbnRhdGlvbiBsZXZlbCB1cCB0byB0aGUgbmVhcmVzdCBmb2xsb3dpbmcgcm93IHdpdGggYSBsb3dlciBpbmRlbnRhdGlvblxuICAjIGxldmVsLlxuICBmb2xkQ3VycmVudFJvdzogLT5cbiAgICBidWZmZXJSb3cgPSBAYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihAZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKSkucm93XG4gICAgQGZvbGRCdWZmZXJSb3coYnVmZmVyUm93KVxuXG4gICMgUHVibGljOiBVbmZvbGQgdGhlIG1vc3QgcmVjZW50IGN1cnNvcidzIHJvdyBieSBvbmUgbGV2ZWwuXG4gIHVuZm9sZEN1cnJlbnRSb3c6IC0+XG4gICAgYnVmZmVyUm93ID0gQGJ1ZmZlclBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oQGdldEN1cnNvclNjcmVlblBvc2l0aW9uKCkpLnJvd1xuICAgIEB1bmZvbGRCdWZmZXJSb3coYnVmZmVyUm93KVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIGZvbGQgdGhlIHJvd3MgaXQgaW50ZXJzZWN0cy5cbiAgZm9sZFNlbGVjdGVkTGluZXM6IC0+XG4gICAgc2VsZWN0aW9uLmZvbGQoKSBmb3Igc2VsZWN0aW9uIGluIEBnZXRTZWxlY3Rpb25zKClcblxuICAjIFB1YmxpYzogRm9sZCBhbGwgZm9sZGFibGUgbGluZXMuXG4gIGZvbGRBbGw6IC0+XG4gICAgQGxhbmd1YWdlTW9kZS5mb2xkQWxsKClcblxuICAjIFB1YmxpYzogVW5mb2xkIGFsbCBleGlzdGluZyBmb2xkcy5cbiAgdW5mb2xkQWxsOiAtPlxuICAgIEBsYW5ndWFnZU1vZGUudW5mb2xkQWxsKClcblxuICAjIFB1YmxpYzogRm9sZCBhbGwgZm9sZGFibGUgbGluZXMgYXQgdGhlIGdpdmVuIGluZGVudCBsZXZlbC5cbiAgI1xuICAjIGxldmVsIC0gQSB7TnVtYmVyfS5cbiAgZm9sZEFsbEF0SW5kZW50TGV2ZWw6IChsZXZlbCkgLT5cbiAgICBAbGFuZ3VhZ2VNb2RlLmZvbGRBbGxBdEluZGVudExldmVsKGxldmVsKVxuXG4gICMgUHVibGljOiBGb2xkIHRoZSBnaXZlbiByb3cgaW4gYnVmZmVyIGNvb3JkaW5hdGVzIGJhc2VkIG9uIGl0cyBpbmRlbnRhdGlvblxuICAjIGxldmVsLlxuICAjXG4gICMgSWYgdGhlIGdpdmVuIHJvdyBpcyBmb2xkYWJsZSwgdGhlIGZvbGQgd2lsbCBiZWdpbiB0aGVyZS4gT3RoZXJ3aXNlLCBpdCB3aWxsXG4gICMgYmVnaW4gYXQgdGhlIGZpcnN0IGZvbGRhYmxlIHJvdyBwcmVjZWRpbmcgdGhlIGdpdmVuIHJvdy5cbiAgI1xuICAjIGJ1ZmZlclJvdyAtIEEge051bWJlcn0uXG4gIGZvbGRCdWZmZXJSb3c6IChidWZmZXJSb3cpIC0+XG4gICAgQGxhbmd1YWdlTW9kZS5mb2xkQnVmZmVyUm93KGJ1ZmZlclJvdylcblxuICAjIFB1YmxpYzogVW5mb2xkIGFsbCBmb2xkcyBjb250YWluaW5nIHRoZSBnaXZlbiByb3cgaW4gYnVmZmVyIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgYnVmZmVyUm93IC0gQSB7TnVtYmVyfVxuICB1bmZvbGRCdWZmZXJSb3c6IChidWZmZXJSb3cpIC0+XG4gICAgQGRpc3BsYXlCdWZmZXIudW5mb2xkQnVmZmVyUm93KGJ1ZmZlclJvdylcblxuICAjIFB1YmxpYzogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIHJvdyBpbiBidWZmZXIgY29vcmRpbmF0ZXMgaXMgZm9sZGFibGUuXG4gICNcbiAgIyBBICpmb2xkYWJsZSogcm93IGlzIGEgcm93IHRoYXQgKnN0YXJ0cyogYSByb3cgcmFuZ2UgdGhhdCBjYW4gYmUgZm9sZGVkLlxuICAjXG4gICMgYnVmZmVyUm93IC0gQSB7TnVtYmVyfVxuICAjXG4gICMgUmV0dXJucyBhIHtCb29sZWFufS5cbiAgaXNGb2xkYWJsZUF0QnVmZmVyUm93OiAoYnVmZmVyUm93KSAtPlxuICAgIEBsYW5ndWFnZU1vZGUuaXNGb2xkYWJsZUF0QnVmZmVyUm93KGJ1ZmZlclJvdylcblxuICAjIFRPRE86IFJlbmFtZSB0byBmb2xkUm93UmFuZ2U/XG4gIGNyZWF0ZUZvbGQ6IChzdGFydFJvdywgZW5kUm93KSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLmNyZWF0ZUZvbGQoc3RhcnRSb3csIGVuZFJvdylcblxuICAjIHtEZWxlZ2F0ZXMgdG86IERpc3BsYXlCdWZmZXIuZGVzdHJveUZvbGRXaXRoSWR9XG4gIGRlc3Ryb3lGb2xkV2l0aElkOiAoaWQpIC0+XG4gICAgQGRpc3BsYXlCdWZmZXIuZGVzdHJveUZvbGRXaXRoSWQoaWQpXG5cbiAgIyBSZW1vdmUgYW55IHtGb2xkfXMgZm91bmQgdGhhdCBpbnRlcnNlY3QgdGhlIGdpdmVuIGJ1ZmZlciByb3cuXG4gIGRlc3Ryb3lGb2xkc0ludGVyc2VjdGluZ0J1ZmZlclJhbmdlOiAoYnVmZmVyUmFuZ2UpIC0+XG4gICAgZm9yIHJvdyBpbiBbYnVmZmVyUmFuZ2Uuc3RhcnQucm93Li5idWZmZXJSYW5nZS5lbmQucm93XVxuICAgICAgQHVuZm9sZEJ1ZmZlclJvdyhyb3cpXG5cbiAgIyBQdWJsaWM6IEZvbGQgdGhlIGdpdmVuIGJ1ZmZlciByb3cgaWYgaXQgaXNuJ3QgY3VycmVudGx5IGZvbGRlZCwgYW5kIHVuZm9sZFxuICAjIGl0IG90aGVyd2lzZS5cbiAgdG9nZ2xlRm9sZEF0QnVmZmVyUm93OiAoYnVmZmVyUm93KSAtPlxuICAgIGlmIEBpc0ZvbGRlZEF0QnVmZmVyUm93KGJ1ZmZlclJvdylcbiAgICAgIEB1bmZvbGRCdWZmZXJSb3coYnVmZmVyUm93KVxuICAgIGVsc2VcbiAgICAgIEBmb2xkQnVmZmVyUm93KGJ1ZmZlclJvdylcblxuICAjIFB1YmxpYzogRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIG1vc3QgcmVjZW50bHkgYWRkZWQgY3Vyc29yJ3Mgcm93IGlzIGZvbGRlZC5cbiAgI1xuICAjIFJldHVybnMgYSB7Qm9vbGVhbn0uXG4gIGlzRm9sZGVkQXRDdXJzb3JSb3c6IC0+XG4gICAgQGlzRm9sZGVkQXRTY3JlZW5Sb3coQGdldEN1cnNvclNjcmVlblJvdygpKVxuXG4gICMgUHVibGljOiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcm93IGluIGJ1ZmZlciBjb29yZGluYXRlcyBpcyBmb2xkZWQuXG4gICNcbiAgIyBidWZmZXJSb3cgLSBBIHtOdW1iZXJ9XG4gICNcbiAgIyBSZXR1cm5zIGEge0Jvb2xlYW59LlxuICBpc0ZvbGRlZEF0QnVmZmVyUm93OiAoYnVmZmVyUm93KSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLmlzRm9sZGVkQXRCdWZmZXJSb3coYnVmZmVyUm93KVxuXG4gICMgUHVibGljOiBEZXRlcm1pbmUgd2hldGhlciB0aGUgZ2l2ZW4gcm93IGluIHNjcmVlbiBjb29yZGluYXRlcyBpcyBmb2xkZWQuXG4gICNcbiAgIyBzY3JlZW5Sb3cgLSBBIHtOdW1iZXJ9XG4gICNcbiAgIyBSZXR1cm5zIGEge0Jvb2xlYW59LlxuICBpc0ZvbGRlZEF0U2NyZWVuUm93OiAoc2NyZWVuUm93KSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLmlzRm9sZGVkQXRTY3JlZW5Sb3coc2NyZWVuUm93KVxuXG4gICMge0RlbGVnYXRlcyB0bzogRGlzcGxheUJ1ZmZlci5sYXJnZXN0Rm9sZENvbnRhaW5pbmdCdWZmZXJSb3d9XG4gIGxhcmdlc3RGb2xkQ29udGFpbmluZ0J1ZmZlclJvdzogKGJ1ZmZlclJvdykgLT5cbiAgICBAZGlzcGxheUJ1ZmZlci5sYXJnZXN0Rm9sZENvbnRhaW5pbmdCdWZmZXJSb3coYnVmZmVyUm93KVxuXG4gICMge0RlbGVnYXRlcyB0bzogRGlzcGxheUJ1ZmZlci5sYXJnZXN0Rm9sZFN0YXJ0aW5nQXRTY3JlZW5Sb3d9XG4gIGxhcmdlc3RGb2xkU3RhcnRpbmdBdFNjcmVlblJvdzogKHNjcmVlblJvdykgLT5cbiAgICBAZGlzcGxheUJ1ZmZlci5sYXJnZXN0Rm9sZFN0YXJ0aW5nQXRTY3JlZW5Sb3coc2NyZWVuUm93KVxuXG4gICMge0RlbGVnYXRlcyB0bzogRGlzcGxheUJ1ZmZlci5vdXRlcm1vc3RGb2xkc0ZvckJ1ZmZlclJvd1JhbmdlfVxuICBvdXRlcm1vc3RGb2xkc0luQnVmZmVyUm93UmFuZ2U6IChzdGFydFJvdywgZW5kUm93KSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLm91dGVybW9zdEZvbGRzSW5CdWZmZXJSb3dSYW5nZShzdGFydFJvdywgZW5kUm93KVxuXG4gICMgTW92ZSBsaW5lcyBpbnRlcnNlY3Rpb24gdGhlIG1vc3QgcmVjZW50IHNlbGVjdGlvbiB1cCBieSBvbmUgcm93IGluIHNjcmVlblxuICAjIGNvb3JkaW5hdGVzLlxuICBtb3ZlTGluZVVwOiAtPlxuICAgIHNlbGVjdGlvbiA9IEBnZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcbiAgICByZXR1cm4gaWYgc2VsZWN0aW9uLnN0YXJ0LnJvdyBpcyAwXG4gICAgbGFzdFJvdyA9IEBidWZmZXIuZ2V0TGFzdFJvdygpXG4gICAgcmV0dXJuIGlmIHNlbGVjdGlvbi5pc0VtcHR5KCkgYW5kIHNlbGVjdGlvbi5zdGFydC5yb3cgaXMgbGFzdFJvdyBhbmQgQGJ1ZmZlci5nZXRMYXN0TGluZSgpIGlzICcnXG5cbiAgICBAdHJhbnNhY3QgPT5cbiAgICAgIGZvbGRlZFJvd3MgPSBbXVxuICAgICAgcm93cyA9IFtzZWxlY3Rpb24uc3RhcnQucm93Li5zZWxlY3Rpb24uZW5kLnJvd11cbiAgICAgIGlmIHNlbGVjdGlvbi5zdGFydC5yb3cgaXNudCBzZWxlY3Rpb24uZW5kLnJvdyBhbmQgc2VsZWN0aW9uLmVuZC5jb2x1bW4gaXMgMFxuICAgICAgICByb3dzLnBvcCgpIHVubGVzcyBAaXNGb2xkZWRBdEJ1ZmZlclJvdyhzZWxlY3Rpb24uZW5kLnJvdylcblxuICAgICAgIyBNb3ZlIGxpbmUgYXJvdW5kIHRoZSBmb2xkIHRoYXQgaXMgZGlyZWN0bHkgYWJvdmUgdGhlIHNlbGVjdGlvblxuICAgICAgcHJlY2VkaW5nU2NyZWVuUm93ID0gQHNjcmVlblBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24oW3NlbGVjdGlvbi5zdGFydC5yb3ddKS50cmFuc2xhdGUoWy0xXSlcbiAgICAgIHByZWNlZGluZ0J1ZmZlclJvdyA9IEBidWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHByZWNlZGluZ1NjcmVlblJvdykucm93XG4gICAgICBpZiBmb2xkID0gQGxhcmdlc3RGb2xkQ29udGFpbmluZ0J1ZmZlclJvdyhwcmVjZWRpbmdCdWZmZXJSb3cpXG4gICAgICAgIGluc2VydERlbHRhID0gZm9sZC5nZXRCdWZmZXJSYW5nZSgpLmdldFJvd0NvdW50KClcbiAgICAgIGVsc2VcbiAgICAgICAgaW5zZXJ0RGVsdGEgPSAxXG5cbiAgICAgIGZvciByb3cgaW4gcm93c1xuICAgICAgICBpZiBmb2xkID0gQGRpc3BsYXlCdWZmZXIubGFyZ2VzdEZvbGRTdGFydGluZ0F0QnVmZmVyUm93KHJvdylcbiAgICAgICAgICBidWZmZXJSYW5nZSA9IGZvbGQuZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICAgIHN0YXJ0Um93ID0gYnVmZmVyUmFuZ2Uuc3RhcnQucm93XG4gICAgICAgICAgZW5kUm93ID0gYnVmZmVyUmFuZ2UuZW5kLnJvd1xuICAgICAgICAgIGZvbGRlZFJvd3MucHVzaChzdGFydFJvdyAtIGluc2VydERlbHRhKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgc3RhcnRSb3cgPSByb3dcbiAgICAgICAgICBlbmRSb3cgPSByb3dcblxuICAgICAgICBpbnNlcnRQb3NpdGlvbiA9IFBvaW50LmZyb21PYmplY3QoW3N0YXJ0Um93IC0gaW5zZXJ0RGVsdGFdKVxuICAgICAgICBlbmRQb3NpdGlvbiA9IFBvaW50Lm1pbihbZW5kUm93ICsgMV0sIEBidWZmZXIuZ2V0RW5kUG9zaXRpb24oKSlcbiAgICAgICAgbGluZXMgPSBAYnVmZmVyLmdldFRleHRJblJhbmdlKFtbc3RhcnRSb3ddLCBlbmRQb3NpdGlvbl0pXG4gICAgICAgIGlmIGVuZFBvc2l0aW9uLnJvdyBpcyBsYXN0Um93IGFuZCBlbmRQb3NpdGlvbi5jb2x1bW4gPiAwIGFuZCBub3QgQGJ1ZmZlci5saW5lRW5kaW5nRm9yUm93KGVuZFBvc2l0aW9uLnJvdylcbiAgICAgICAgICBsaW5lcyA9IFwiI3tsaW5lc31cXG5cIlxuXG4gICAgICAgIEBidWZmZXIuZGVsZXRlUm93cyhzdGFydFJvdywgZW5kUm93KVxuXG4gICAgICAgICMgTWFrZSBzdXJlIHRoZSBpbnNlcnRlZCB0ZXh0IGRvZXNuJ3QgZ28gaW50byBhbiBleGlzdGluZyBmb2xkXG4gICAgICAgIGlmIGZvbGQgPSBAZGlzcGxheUJ1ZmZlci5sYXJnZXN0Rm9sZFN0YXJ0aW5nQXRCdWZmZXJSb3coaW5zZXJ0UG9zaXRpb24ucm93KVxuICAgICAgICAgIEB1bmZvbGRCdWZmZXJSb3coaW5zZXJ0UG9zaXRpb24ucm93KVxuICAgICAgICAgIGZvbGRlZFJvd3MucHVzaChpbnNlcnRQb3NpdGlvbi5yb3cgKyBlbmRSb3cgLSBzdGFydFJvdyArIGZvbGQuZ2V0QnVmZmVyUmFuZ2UoKS5nZXRSb3dDb3VudCgpKVxuXG4gICAgICAgIEBidWZmZXIuaW5zZXJ0KGluc2VydFBvc2l0aW9uLCBsaW5lcylcblxuICAgICAgIyBSZXN0b3JlIGZvbGRzIHRoYXQgZXhpc3RlZCBiZWZvcmUgdGhlIGxpbmVzIHdlcmUgbW92ZWRcbiAgICAgIGZvciBmb2xkZWRSb3cgaW4gZm9sZGVkUm93cyB3aGVuIDAgPD0gZm9sZGVkUm93IDw9IEBnZXRMYXN0QnVmZmVyUm93KClcbiAgICAgICAgQGZvbGRCdWZmZXJSb3coZm9sZGVkUm93KVxuXG4gICAgICBAc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShzZWxlY3Rpb24udHJhbnNsYXRlKFstaW5zZXJ0RGVsdGFdKSwgcHJlc2VydmVGb2xkczogdHJ1ZSwgYXV0b3Njcm9sbDogdHJ1ZSlcblxuICAjIE1vdmUgbGluZXMgaW50ZXJzZWN0aW5nIHRoZSBtb3N0IHJlY2VudCBzZWxlY3Rpb24gZG93biBieSBvbmUgcm93IGluIHNjcmVlblxuICAjIGNvb3JkaW5hdGVzLlxuICBtb3ZlTGluZURvd246IC0+XG4gICAgc2VsZWN0aW9uID0gQGdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgIGxhc3RSb3cgPSBAYnVmZmVyLmdldExhc3RSb3coKVxuICAgIHJldHVybiBpZiBzZWxlY3Rpb24uZW5kLnJvdyBpcyBsYXN0Um93XG4gICAgcmV0dXJuIGlmIHNlbGVjdGlvbi5lbmQucm93IGlzIGxhc3RSb3cgLSAxIGFuZCBAYnVmZmVyLmdldExhc3RMaW5lKCkgaXMgJydcblxuICAgIEB0cmFuc2FjdCA9PlxuICAgICAgZm9sZGVkUm93cyA9IFtdXG4gICAgICByb3dzID0gW3NlbGVjdGlvbi5lbmQucm93Li5zZWxlY3Rpb24uc3RhcnQucm93XVxuICAgICAgaWYgc2VsZWN0aW9uLnN0YXJ0LnJvdyBpc250IHNlbGVjdGlvbi5lbmQucm93IGFuZCBzZWxlY3Rpb24uZW5kLmNvbHVtbiBpcyAwXG4gICAgICAgIHJvd3Muc2hpZnQoKSB1bmxlc3MgQGlzRm9sZGVkQXRCdWZmZXJSb3coc2VsZWN0aW9uLmVuZC5yb3cpXG5cbiAgICAgICMgTW92ZSBsaW5lIGFyb3VuZCB0aGUgZm9sZCB0aGF0IGlzIGRpcmVjdGx5IGJlbG93IHRoZSBzZWxlY3Rpb25cbiAgICAgIGZvbGxvd2luZ1NjcmVlblJvdyA9IEBzY3JlZW5Qb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uKFtzZWxlY3Rpb24uZW5kLnJvd10pLnRyYW5zbGF0ZShbMV0pXG4gICAgICBmb2xsb3dpbmdCdWZmZXJSb3cgPSBAYnVmZmVyUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbihmb2xsb3dpbmdTY3JlZW5Sb3cpLnJvd1xuICAgICAgaWYgZm9sZCA9IEBsYXJnZXN0Rm9sZENvbnRhaW5pbmdCdWZmZXJSb3coZm9sbG93aW5nQnVmZmVyUm93KVxuICAgICAgICBpbnNlcnREZWx0YSA9IGZvbGQuZ2V0QnVmZmVyUmFuZ2UoKS5nZXRSb3dDb3VudCgpXG4gICAgICBlbHNlXG4gICAgICAgIGluc2VydERlbHRhID0gMVxuXG4gICAgICBmb3Igcm93IGluIHJvd3NcbiAgICAgICAgaWYgZm9sZCA9IEBkaXNwbGF5QnVmZmVyLmxhcmdlc3RGb2xkU3RhcnRpbmdBdEJ1ZmZlclJvdyhyb3cpXG4gICAgICAgICAgYnVmZmVyUmFuZ2UgPSBmb2xkLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgICAgICBzdGFydFJvdyA9IGJ1ZmZlclJhbmdlLnN0YXJ0LnJvd1xuICAgICAgICAgIGVuZFJvdyA9IGJ1ZmZlclJhbmdlLmVuZC5yb3dcbiAgICAgICAgICBmb2xkZWRSb3dzLnB1c2goZW5kUm93ICsgaW5zZXJ0RGVsdGEpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBzdGFydFJvdyA9IHJvd1xuICAgICAgICAgIGVuZFJvdyA9IHJvd1xuXG4gICAgICAgIGlmIGVuZFJvdyArIDEgaXMgbGFzdFJvd1xuICAgICAgICAgIGVuZFBvc2l0aW9uID0gW2VuZFJvdywgQGJ1ZmZlci5saW5lTGVuZ3RoRm9yUm93KGVuZFJvdyldXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlbmRQb3NpdGlvbiA9IFtlbmRSb3cgKyAxXVxuICAgICAgICBsaW5lcyA9IEBidWZmZXIuZ2V0VGV4dEluUmFuZ2UoW1tzdGFydFJvd10sIGVuZFBvc2l0aW9uXSlcbiAgICAgICAgQGJ1ZmZlci5kZWxldGVSb3dzKHN0YXJ0Um93LCBlbmRSb3cpXG5cbiAgICAgICAgaW5zZXJ0UG9zaXRpb24gPSBQb2ludC5taW4oW3N0YXJ0Um93ICsgaW5zZXJ0RGVsdGFdLCBAYnVmZmVyLmdldEVuZFBvc2l0aW9uKCkpXG4gICAgICAgIGlmIGluc2VydFBvc2l0aW9uLnJvdyBpcyBAYnVmZmVyLmdldExhc3RSb3coKSBhbmQgaW5zZXJ0UG9zaXRpb24uY29sdW1uID4gMFxuICAgICAgICAgIGxpbmVzID0gXCJcXG4je2xpbmVzfVwiXG5cbiAgICAgICAgIyBNYWtlIHN1cmUgdGhlIGluc2VydGVkIHRleHQgZG9lc24ndCBnbyBpbnRvIGFuIGV4aXN0aW5nIGZvbGRcbiAgICAgICAgaWYgZm9sZCA9IEBkaXNwbGF5QnVmZmVyLmxhcmdlc3RGb2xkU3RhcnRpbmdBdEJ1ZmZlclJvdyhpbnNlcnRQb3NpdGlvbi5yb3cpXG4gICAgICAgICAgQHVuZm9sZEJ1ZmZlclJvdyhpbnNlcnRQb3NpdGlvbi5yb3cpXG4gICAgICAgICAgZm9sZGVkUm93cy5wdXNoKGluc2VydFBvc2l0aW9uLnJvdyArIGZvbGQuZ2V0QnVmZmVyUmFuZ2UoKS5nZXRSb3dDb3VudCgpKVxuXG4gICAgICAgIEBidWZmZXIuaW5zZXJ0KGluc2VydFBvc2l0aW9uLCBsaW5lcylcblxuICAgICAgIyBSZXN0b3JlIGZvbGRzIHRoYXQgZXhpc3RlZCBiZWZvcmUgdGhlIGxpbmVzIHdlcmUgbW92ZWRcbiAgICAgIGZvciBmb2xkZWRSb3cgaW4gZm9sZGVkUm93cyB3aGVuIDAgPD0gZm9sZGVkUm93IDw9IEBnZXRMYXN0QnVmZmVyUm93KClcbiAgICAgICAgQGZvbGRCdWZmZXJSb3coZm9sZGVkUm93KVxuXG4gICAgICBAc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShzZWxlY3Rpb24udHJhbnNsYXRlKFtpbnNlcnREZWx0YV0pLCBwcmVzZXJ2ZUZvbGRzOiB0cnVlLCBhdXRvc2Nyb2xsOiB0cnVlKVxuXG4gICMgRHVwbGljYXRlIHRoZSBtb3N0IHJlY2VudCBjdXJzb3IncyBjdXJyZW50IGxpbmUuXG4gIGR1cGxpY2F0ZUxpbmVzOiAtPlxuICAgIEB0cmFuc2FjdCA9PlxuICAgICAgZm9yIHNlbGVjdGlvbiBpbiBAZ2V0U2VsZWN0aW9uc09yZGVyZWRCeUJ1ZmZlclBvc2l0aW9uKCkucmV2ZXJzZSgpXG4gICAgICAgIHNlbGVjdGVkQnVmZmVyUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICBpZiBzZWxlY3Rpb24uaXNFbXB0eSgpXG4gICAgICAgICAge3N0YXJ0fSA9IHNlbGVjdGlvbi5nZXRTY3JlZW5SYW5nZSgpXG4gICAgICAgICAgc2VsZWN0aW9uLnNlbGVjdFRvU2NyZWVuUG9zaXRpb24oW3N0YXJ0LnJvdyArIDEsIDBdKVxuXG4gICAgICAgIFtzdGFydFJvdywgZW5kUm93XSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSb3dSYW5nZSgpXG4gICAgICAgIGVuZFJvdysrXG5cbiAgICAgICAgZm9sZGVkUm93UmFuZ2VzID1cbiAgICAgICAgICBAb3V0ZXJtb3N0Rm9sZHNJbkJ1ZmZlclJvd1JhbmdlKHN0YXJ0Um93LCBlbmRSb3cpXG4gICAgICAgICAgICAubWFwIChmb2xkKSAtPiBmb2xkLmdldEJ1ZmZlclJvd1JhbmdlKClcblxuICAgICAgICByYW5nZVRvRHVwbGljYXRlID0gW1tzdGFydFJvdywgMF0sIFtlbmRSb3csIDBdXVxuICAgICAgICB0ZXh0VG9EdXBsaWNhdGUgPSBAZ2V0VGV4dEluQnVmZmVyUmFuZ2UocmFuZ2VUb0R1cGxpY2F0ZSlcbiAgICAgICAgdGV4dFRvRHVwbGljYXRlID0gJ1xcbicgKyB0ZXh0VG9EdXBsaWNhdGUgaWYgZW5kUm93ID4gQGdldExhc3RCdWZmZXJSb3coKVxuICAgICAgICBAYnVmZmVyLmluc2VydChbZW5kUm93LCAwXSwgdGV4dFRvRHVwbGljYXRlKVxuXG4gICAgICAgIGRlbHRhID0gZW5kUm93IC0gc3RhcnRSb3dcbiAgICAgICAgc2VsZWN0aW9uLnNldEJ1ZmZlclJhbmdlKHNlbGVjdGVkQnVmZmVyUmFuZ2UudHJhbnNsYXRlKFtkZWx0YSwgMF0pKVxuICAgICAgICBmb3IgW2ZvbGRTdGFydFJvdywgZm9sZEVuZFJvd10gaW4gZm9sZGVkUm93UmFuZ2VzXG4gICAgICAgICAgQGNyZWF0ZUZvbGQoZm9sZFN0YXJ0Um93ICsgZGVsdGEsIGZvbGRFbmRSb3cgKyBkZWx0YSlcblxuICAjIERlcHJlY2F0ZWQ6IFVzZSB7OjpkdXBsaWNhdGVMaW5lc30gaW5zdGVhZC5cbiAgZHVwbGljYXRlTGluZTogLT5cbiAgICBkZXByZWNhdGUoXCJVc2UgRWRpdG9yOjpkdXBsaWNhdGVMaW5lcygpIGluc3RlYWRcIilcbiAgICBAZHVwbGljYXRlTGluZXMoKVxuXG4gICMgUHVibGljOiBNdXRhdGUgdGhlIHRleHQgb2YgYWxsIHRoZSBzZWxlY3Rpb25zIGluIGEgc2luZ2xlIHRyYW5zYWN0aW9uLlxuICAjXG4gICMgQWxsIHRoZSBjaGFuZ2VzIG1hZGUgaW5zaWRlIHRoZSBnaXZlbiB7RnVuY3Rpb259IGNhbiBiZSByZXZlcnRlZCB3aXRoIGFcbiAgIyBzaW5nbGUgY2FsbCB0byB7Ojp1bmRvfS5cbiAgI1xuICAjIGZuIC0gQSB7RnVuY3Rpb259IHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCBlYWNoIHtTZWxlY3Rpb259LlxuICBtdXRhdGVTZWxlY3RlZFRleHQ6IChmbikgLT5cbiAgICBAdHJhbnNhY3QgPT4gZm4oc2VsZWN0aW9uLGluZGV4KSBmb3Igc2VsZWN0aW9uLGluZGV4IGluIEBnZXRTZWxlY3Rpb25zKClcblxuICByZXBsYWNlU2VsZWN0ZWRUZXh0OiAob3B0aW9ucz17fSwgZm4pIC0+XG4gICAge3NlbGVjdFdvcmRJZkVtcHR5fSA9IG9wdGlvbnNcbiAgICBAbXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24pIC0+XG4gICAgICByYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBpZiBzZWxlY3RXb3JkSWZFbXB0eSBhbmQgc2VsZWN0aW9uLmlzRW1wdHkoKVxuICAgICAgICBzZWxlY3Rpb24uc2VsZWN0V29yZCgpXG4gICAgICB0ZXh0ID0gc2VsZWN0aW9uLmdldFRleHQoKVxuICAgICAgc2VsZWN0aW9uLmRlbGV0ZVNlbGVjdGVkVGV4dCgpXG4gICAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dChmbih0ZXh0KSlcbiAgICAgIHNlbGVjdGlvbi5zZXRCdWZmZXJSYW5nZShyYW5nZSlcblxuICAjIFB1YmxpYzogR2V0IHRoZSB7RGlzcGxheUJ1ZmZlck1hcmtlcn0gZm9yIHRoZSBnaXZlbiBtYXJrZXIgaWQuXG4gIGdldE1hcmtlcjogKGlkKSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLmdldE1hcmtlcihpZClcblxuICAjIFB1YmxpYzogR2V0IGFsbCB7RGlzcGxheUJ1ZmZlck1hcmtlcn1zLlxuICBnZXRNYXJrZXJzOiAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLmdldE1hcmtlcnMoKVxuXG4gICMgUHVibGljOiBGaW5kIGFsbCB7RGlzcGxheUJ1ZmZlck1hcmtlcn1zIHRoYXQgbWF0Y2ggdGhlIGdpdmVuIHByb3BlcnRpZXMuXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBmaW5kcyBtYXJrZXJzIGJhc2VkIG9uIHRoZSBnaXZlbiBwcm9wZXJ0aWVzLiBNYXJrZXJzIGNhbiBiZVxuICAjIGFzc29jaWF0ZWQgd2l0aCBjdXN0b20gcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgY29tcGFyZWQgd2l0aCBiYXNpYyBlcXVhbGl0eS5cbiAgIyBJbiBhZGRpdGlvbiwgdGhlcmUgYXJlIHNldmVyYWwgc3BlY2lhbCBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSBjb21wYXJlZFxuICAjIHdpdGggdGhlIHJhbmdlIG9mIHRoZSBtYXJrZXJzIHJhdGhlciB0aGFuIHRoZWlyIHByb3BlcnRpZXMuXG4gICNcbiAgIyBwcm9wZXJ0aWVzIC0gQW4ge09iamVjdH0gY29udGFpbmluZyBwcm9wZXJ0aWVzIHRoYXQgZWFjaCByZXR1cm5lZCBtYXJrZXJcbiAgIyAgIG11c3Qgc2F0aXNmeS4gTWFya2VycyBjYW4gYmUgYXNzb2NpYXRlZCB3aXRoIGN1c3RvbSBwcm9wZXJ0aWVzLCB3aGljaCBhcmVcbiAgIyAgIGNvbXBhcmVkIHdpdGggYmFzaWMgZXF1YWxpdHkuIEluIGFkZGl0aW9uLCBzZXZlcmFsIHJlc2VydmVkIHByb3BlcnRpZXNcbiAgIyAgIGNhbiBiZSB1c2VkIHRvIGZpbHRlciBtYXJrZXJzIGJhc2VkIG9uIHRoZWlyIGN1cnJlbnQgcmFuZ2U6XG4gICMgICAgIDpzdGFydEJ1ZmZlclJvdyAtIE9ubHkgaW5jbHVkZSBtYXJrZXJzIHN0YXJ0aW5nIGF0IHRoaXMgcm93IGluIGJ1ZmZlclxuICAjICAgICAgIGNvb3JkaW5hdGVzLlxuICAjICAgICA6ZW5kQnVmZmVyUm93IC0gT25seSBpbmNsdWRlIG1hcmtlcnMgZW5kaW5nIGF0IHRoaXMgcm93IGluIGJ1ZmZlclxuICAjICAgICAgIGNvb3JkaW5hdGVzLlxuICAjICAgICA6Y29udGFpbnNCdWZmZXJSYW5nZSAtIE9ubHkgaW5jbHVkZSBtYXJrZXJzIGNvbnRhaW5pbmcgdGhpcyB7UmFuZ2V9IG9yXG4gICMgICAgICAgaW4gcmFuZ2UtY29tcGF0aWJsZSB7QXJyYXl9IGluIGJ1ZmZlciBjb29yZGluYXRlcy5cbiAgIyAgICAgOmNvbnRhaW5zQnVmZmVyUG9zaXRpb24gLSBPbmx5IGluY2x1ZGUgbWFya2VycyBjb250YWluaW5nIHRoaXMge1BvaW50fVxuICAjICAgICAgIG9yIHtBcnJheX0gb2YgYFtyb3csIGNvbHVtbl1gIGluIGJ1ZmZlciBjb29yZGluYXRlcy5cbiAgZmluZE1hcmtlcnM6IChwcm9wZXJ0aWVzKSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLmZpbmRNYXJrZXJzKHByb3BlcnRpZXMpXG5cbiAgIyBQdWJsaWM6IE1hcmsgdGhlIGdpdmVuIHJhbmdlIGluIHNjcmVlbiBjb29yZGluYXRlcy5cbiAgI1xuICAjIHJhbmdlIC0gQSB7UmFuZ2V9IG9yIHJhbmdlLWNvbXBhdGlibGUge0FycmF5fS5cbiAgIyBvcHRpb25zIC0gU2VlIHtUZXh0QnVmZmVyOjptYXJrUmFuZ2V9LlxuICAjXG4gICMgUmV0dXJucyBhIHtEaXNwbGF5QnVmZmVyTWFya2VyfS5cbiAgbWFya1NjcmVlblJhbmdlOiAoYXJncy4uLikgLT5cbiAgICBAZGlzcGxheUJ1ZmZlci5tYXJrU2NyZWVuUmFuZ2UoYXJncy4uLilcblxuICAjIFB1YmxpYzogTWFyayB0aGUgZ2l2ZW4gcmFuZ2UgaW4gYnVmZmVyIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgcmFuZ2UgLSBBIHtSYW5nZX0gb3IgcmFuZ2UtY29tcGF0aWJsZSB7QXJyYXl9LlxuICAjIG9wdGlvbnMgLSBTZWUge1RleHRCdWZmZXI6Om1hcmtSYW5nZX0uXG4gICNcbiAgIyBSZXR1cm5zIGEge0Rpc3BsYXlCdWZmZXJNYXJrZXJ9LlxuICBtYXJrQnVmZmVyUmFuZ2U6IChhcmdzLi4uKSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLm1hcmtCdWZmZXJSYW5nZShhcmdzLi4uKVxuXG4gICMgUHVibGljOiBNYXJrIHRoZSBnaXZlbiBwb3NpdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gICNcbiAgIyBwb3NpdGlvbiAtIEEge1BvaW50fSBvciB7QXJyYXl9IG9mIGBbcm93LCBjb2x1bW5dYC5cbiAgIyBvcHRpb25zIC0gU2VlIHtUZXh0QnVmZmVyOjptYXJrUmFuZ2V9LlxuICAjXG4gICMgUmV0dXJucyBhIHtEaXNwbGF5QnVmZmVyTWFya2VyfS5cbiAgbWFya1NjcmVlblBvc2l0aW9uOiAoYXJncy4uLikgLT5cbiAgICBAZGlzcGxheUJ1ZmZlci5tYXJrU2NyZWVuUG9zaXRpb24oYXJncy4uLilcblxuICAjIFB1YmxpYzogTWFyayB0aGUgZ2l2ZW4gcG9zaXRpb24gaW4gYnVmZmVyIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgcG9zaXRpb24gLSBBIHtQb2ludH0gb3Ige0FycmF5fSBvZiBgW3JvdywgY29sdW1uXWAuXG4gICMgb3B0aW9ucyAtIFNlZSB7VGV4dEJ1ZmZlcjo6bWFya1JhbmdlfS5cbiAgI1xuICAjIFJldHVybnMgYSB7RGlzcGxheUJ1ZmZlck1hcmtlcn0uXG4gIG1hcmtCdWZmZXJQb3NpdGlvbjogKGFyZ3MuLi4pIC0+XG4gICAgQGRpc3BsYXlCdWZmZXIubWFya0J1ZmZlclBvc2l0aW9uKGFyZ3MuLi4pXG5cbiAgIyB7RGVsZWdhdGVzIHRvOiBEaXNwbGF5QnVmZmVyLmRlc3Ryb3lNYXJrZXJ9XG4gIGRlc3Ryb3lNYXJrZXI6IChhcmdzLi4uKSAtPlxuICAgIEBkaXNwbGF5QnVmZmVyLmRlc3Ryb3lNYXJrZXIoYXJncy4uLilcblxuICAjIFB1YmxpYzogR2V0IHRoZSBudW1iZXIgb2YgbWFya2VycyBpbiB0aGlzIGVkaXRvcidzIGJ1ZmZlci5cbiAgI1xuICAjIFJldHVybnMgYSB7TnVtYmVyfS5cbiAgZ2V0TWFya2VyQ291bnQ6IC0+XG4gICAgQGJ1ZmZlci5nZXRNYXJrZXJDb3VudCgpXG5cbiAgIyBQdWJsaWM6IERldGVybWluZSBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgY3Vyc29ycy5cbiAgaGFzTXVsdGlwbGVDdXJzb3JzOiAtPlxuICAgIEBnZXRDdXJzb3JzKCkubGVuZ3RoID4gMVxuXG4gICMgUHVibGljOiBHZXQgYW4gQXJyYXkgb2YgYWxsIHtDdXJzb3J9cy5cbiAgZ2V0Q3Vyc29yczogLT4gbmV3IEFycmF5KEBjdXJzb3JzLi4uKVxuXG4gICMgUHVibGljOiBHZXQgdGhlIG1vc3QgcmVjZW50bHkgYWRkZWQge0N1cnNvcn0uXG4gIGdldEN1cnNvcjogLT5cbiAgICBfLmxhc3QoQGN1cnNvcnMpXG5cbiAgIyBQdWJsaWM6IEFkZCBhIGN1cnNvciBhdCB0aGUgcG9zaXRpb24gaW4gc2NyZWVuIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgUmV0dXJucyBhIHtDdXJzb3J9LlxuICBhZGRDdXJzb3JBdFNjcmVlblBvc2l0aW9uOiAoc2NyZWVuUG9zaXRpb24pIC0+XG4gICAgQG1hcmtTY3JlZW5Qb3NpdGlvbihzY3JlZW5Qb3NpdGlvbiwgQGdldFNlbGVjdGlvbk1hcmtlckF0dHJpYnV0ZXMoKSlcbiAgICBAZ2V0TGFzdFNlbGVjdGlvbigpLmN1cnNvclxuXG4gICMgUHVibGljOiBBZGQgYSBjdXJzb3IgYXQgdGhlIGdpdmVuIHBvc2l0aW9uIGluIGJ1ZmZlciBjb29yZGluYXRlcy5cbiAgI1xuICAjIFJldHVybnMgYSB7Q3Vyc29yfS5cbiAgYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbjogKGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIEBtYXJrQnVmZmVyUG9zaXRpb24oYnVmZmVyUG9zaXRpb24sIEBnZXRTZWxlY3Rpb25NYXJrZXJBdHRyaWJ1dGVzKCkpXG4gICAgQGdldExhc3RTZWxlY3Rpb24oKS5jdXJzb3JcblxuICAjIEFkZCBhIGN1cnNvciBiYXNlZCBvbiB0aGUgZ2l2ZW4ge0Rpc3BsYXlCdWZmZXJNYXJrZXJ9LlxuICBhZGRDdXJzb3I6IChtYXJrZXIpIC0+XG4gICAgY3Vyc29yID0gbmV3IEN1cnNvcihlZGl0b3I6IHRoaXMsIG1hcmtlcjogbWFya2VyKVxuICAgIEBjdXJzb3JzLnB1c2goY3Vyc29yKVxuICAgIEBlbWl0ICdjdXJzb3ItYWRkZWQnLCBjdXJzb3JcbiAgICBjdXJzb3JcblxuICAjIFJlbW92ZSB0aGUgZ2l2ZW4gY3Vyc29yIGZyb20gdGhpcyBlZGl0b3IuXG4gIHJlbW92ZUN1cnNvcjogKGN1cnNvcikgLT5cbiAgICBfLnJlbW92ZShAY3Vyc29ycywgY3Vyc29yKVxuXG4gICMgQWRkIGEge1NlbGVjdGlvbn0gYmFzZWQgb24gdGhlIGdpdmVuIHtEaXNwbGF5QnVmZmVyTWFya2VyfS5cbiAgI1xuICAjIG1hcmtlciAgLSBUaGUge0Rpc3BsYXlCdWZmZXJNYXJrZXJ9IHRvIGhpZ2hsaWdodFxuICAjIG9wdGlvbnMgLSBBbiB7T2JqZWN0fSB0aGF0IHBlcnRhaW5zIHRvIHRoZSB7U2VsZWN0aW9ufSBjb25zdHJ1Y3Rvci5cbiAgI1xuICAjIFJldHVybnMgdGhlIG5ldyB7U2VsZWN0aW9ufS5cbiAgYWRkU2VsZWN0aW9uOiAobWFya2VyLCBvcHRpb25zPXt9KSAtPlxuICAgIHVubGVzcyBtYXJrZXIuZ2V0QXR0cmlidXRlcygpLnByZXNlcnZlRm9sZHNcbiAgICAgIEBkZXN0cm95Rm9sZHNJbnRlcnNlY3RpbmdCdWZmZXJSYW5nZShtYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKSlcbiAgICBjdXJzb3IgPSBAYWRkQ3Vyc29yKG1hcmtlcilcbiAgICBzZWxlY3Rpb24gPSBuZXcgU2VsZWN0aW9uKF8uZXh0ZW5kKHtlZGl0b3I6IHRoaXMsIG1hcmtlciwgY3Vyc29yfSwgb3B0aW9ucykpXG4gICAgQHNlbGVjdGlvbnMucHVzaChzZWxlY3Rpb24pXG4gICAgc2VsZWN0aW9uQnVmZmVyUmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgIEBtZXJnZUludGVyc2VjdGluZ1NlbGVjdGlvbnMoKVxuICAgIGlmIHNlbGVjdGlvbi5kZXN0cm95ZWRcbiAgICAgIGZvciBzZWxlY3Rpb24gaW4gQGdldFNlbGVjdGlvbnMoKVxuICAgICAgICBpZiBzZWxlY3Rpb24uaW50ZXJzZWN0c0J1ZmZlclJhbmdlKHNlbGVjdGlvbkJ1ZmZlclJhbmdlKVxuICAgICAgICAgIHJldHVybiBzZWxlY3Rpb25cbiAgICBlbHNlXG4gICAgICBAZW1pdCAnc2VsZWN0aW9uLWFkZGVkJywgc2VsZWN0aW9uXG4gICAgICBzZWxlY3Rpb25cblxuICAjIFB1YmxpYzogQWRkIGEgc2VsZWN0aW9uIGZvciB0aGUgZ2l2ZW4gcmFuZ2UgaW4gYnVmZmVyIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgYnVmZmVyUmFuZ2UgLSBBIHtSYW5nZX1cbiAgIyBvcHRpb25zIC0gQW4gb3B0aW9ucyB7T2JqZWN0fTpcbiAgIyAgIDpyZXZlcnNlZCAtIEEge0Jvb2xlYW59IGluZGljYXRpbmcgd2hldGhlciB0byBjcmVhdGUgdGhlIHNlbGVjdGlvbiBpbiBhXG4gICMgICAgIHJldmVyc2VkIG9yaWVudGF0aW9uLlxuICAjXG4gICMgUmV0dXJucyB0aGUgYWRkZWQge1NlbGVjdGlvbn0uXG4gIGFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlOiAoYnVmZmVyUmFuZ2UsIG9wdGlvbnM9e30pIC0+XG4gICAgQG1hcmtCdWZmZXJSYW5nZShidWZmZXJSYW5nZSwgXy5kZWZhdWx0cyhAZ2V0U2VsZWN0aW9uTWFya2VyQXR0cmlidXRlcygpLCBvcHRpb25zKSlcbiAgICBAZ2V0TGFzdFNlbGVjdGlvbigpXG5cbiAgIyBQdWJsaWM6IFNldCB0aGUgc2VsZWN0ZWQgcmFuZ2UgaW4gYnVmZmVyIGNvb3JkaW5hdGVzLiBJZiB0aGVyZSBhcmUgbXVsdGlwbGVcbiAgIyBzZWxlY3Rpb25zLCB0aGV5IGFyZSByZWR1Y2VkIHRvIGEgc2luZ2xlIHNlbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiByYW5nZS5cbiAgI1xuICAjIGJ1ZmZlclJhbmdlIC0gQSB7UmFuZ2V9IG9yIHJhbmdlLWNvbXBhdGlibGUge0FycmF5fS5cbiAgIyBvcHRpb25zIC0gQW4gb3B0aW9ucyB7T2JqZWN0fTpcbiAgIyAgIDpyZXZlcnNlZCAtIEEge0Jvb2xlYW59IGluZGljYXRpbmcgd2hldGhlciB0byBjcmVhdGUgdGhlIHNlbGVjdGlvbiBpbiBhXG4gICMgICAgIHJldmVyc2VkIG9yaWVudGF0aW9uLlxuICBzZXRTZWxlY3RlZEJ1ZmZlclJhbmdlOiAoYnVmZmVyUmFuZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKFtidWZmZXJSYW5nZV0sIG9wdGlvbnMpXG5cbiAgIyBQdWJsaWM6IFNldCB0aGUgc2VsZWN0ZWQgcmFuZ2UgaW4gc2NyZWVuIGNvb3JkaW5hdGVzLiBJZiB0aGVyZSBhcmUgbXVsdGlwbGVcbiAgIyBzZWxlY3Rpb25zLCB0aGV5IGFyZSByZWR1Y2VkIHRvIGEgc2luZ2xlIHNlbGVjdGlvbiB3aXRoIHRoZSBnaXZlbiByYW5nZS5cbiAgI1xuICAjIHNjcmVlblJhbmdlIC0gQSB7UmFuZ2V9IG9yIHJhbmdlLWNvbXBhdGlibGUge0FycmF5fS5cbiAgIyBvcHRpb25zIC0gQW4gb3B0aW9ucyB7T2JqZWN0fTpcbiAgIyAgIDpyZXZlcnNlZCAtIEEge0Jvb2xlYW59IGluZGljYXRpbmcgd2hldGhlciB0byBjcmVhdGUgdGhlIHNlbGVjdGlvbiBpbiBhXG4gICMgICAgIHJldmVyc2VkIG9yaWVudGF0aW9uLlxuICBzZXRTZWxlY3RlZFNjcmVlblJhbmdlOiAoc2NyZWVuUmFuZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoQGJ1ZmZlclJhbmdlRm9yU2NyZWVuUmFuZ2Uoc2NyZWVuUmFuZ2UsIG9wdGlvbnMpLCBvcHRpb25zKVxuXG4gICMgUHVibGljOiBTZXQgdGhlIHNlbGVjdGVkIHJhbmdlcyBpbiBidWZmZXIgY29vcmRpbmF0ZXMuIElmIHRoZXJlIGFyZSBtdWx0aXBsZVxuICAjIHNlbGVjdGlvbnMsIHRoZXkgYXJlIHJlcGxhY2VkIGJ5IG5ldyBzZWxlY3Rpb25zIHdpdGggdGhlIGdpdmVuIHJhbmdlcy5cbiAgI1xuICAjIGJ1ZmZlclJhbmdlcyAtIEFuIHtBcnJheX0gb2Yge1JhbmdlfXMgb3IgcmFuZ2UtY29tcGF0aWJsZSB7QXJyYXl9cy5cbiAgIyBvcHRpb25zIC0gQW4gb3B0aW9ucyB7T2JqZWN0fTpcbiAgIyAgIDpyZXZlcnNlZCAtIEEge0Jvb2xlYW59IGluZGljYXRpbmcgd2hldGhlciB0byBjcmVhdGUgdGhlIHNlbGVjdGlvbiBpbiBhXG4gICMgICAgIHJldmVyc2VkIG9yaWVudGF0aW9uLlxuICBzZXRTZWxlY3RlZEJ1ZmZlclJhbmdlczogKGJ1ZmZlclJhbmdlcywgb3B0aW9ucz17fSkgLT5cbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXNzZWQgYW4gZW1wdHkgYXJyYXkgdG8gc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXNcIikgdW5sZXNzIGJ1ZmZlclJhbmdlcy5sZW5ndGhcblxuICAgIHNlbGVjdGlvbnMgPSBAZ2V0U2VsZWN0aW9ucygpXG4gICAgc2VsZWN0aW9uLmRlc3Ryb3koKSBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNbYnVmZmVyUmFuZ2VzLmxlbmd0aC4uLl1cblxuICAgIEBtZXJnZUludGVyc2VjdGluZ1NlbGVjdGlvbnMgb3B0aW9ucywgPT5cbiAgICAgIGZvciBidWZmZXJSYW5nZSwgaSBpbiBidWZmZXJSYW5nZXNcbiAgICAgICAgYnVmZmVyUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KGJ1ZmZlclJhbmdlKVxuICAgICAgICBpZiBzZWxlY3Rpb25zW2ldXG4gICAgICAgICAgc2VsZWN0aW9uc1tpXS5zZXRCdWZmZXJSYW5nZShidWZmZXJSYW5nZSwgb3B0aW9ucylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEBhZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShidWZmZXJSYW5nZSwgb3B0aW9ucylcblxuICAjIFJlbW92ZSB0aGUgZ2l2ZW4gc2VsZWN0aW9uLlxuICByZW1vdmVTZWxlY3Rpb246IChzZWxlY3Rpb24pIC0+XG4gICAgXy5yZW1vdmUoQHNlbGVjdGlvbnMsIHNlbGVjdGlvbilcbiAgICBAZW1pdCAnc2VsZWN0aW9uLXJlbW92ZWQnLCBzZWxlY3Rpb25cblxuICAjIFJlZHVjZSBvbmUgb3IgbW9yZSBzZWxlY3Rpb25zIHRvIGEgc2luZ2xlIGVtcHR5IHNlbGVjdGlvbiBiYXNlZCBvbiB0aGUgbW9zdFxuICAjIHJlY2VudGx5IGFkZGVkIGN1cnNvci5cbiAgY2xlYXJTZWxlY3Rpb25zOiAtPlxuICAgIEBjb25zb2xpZGF0ZVNlbGVjdGlvbnMoKVxuICAgIEBnZXRTZWxlY3Rpb24oKS5jbGVhcigpXG5cbiAgIyBSZWR1Y2UgbXVsdGlwbGUgc2VsZWN0aW9ucyB0byB0aGUgbW9zdCByZWNlbnRseSBhZGRlZCBzZWxlY3Rpb24uXG4gIGNvbnNvbGlkYXRlU2VsZWN0aW9uczogLT5cbiAgICBzZWxlY3Rpb25zID0gQGdldFNlbGVjdGlvbnMoKVxuICAgIGlmIHNlbGVjdGlvbnMubGVuZ3RoID4gMVxuICAgICAgc2VsZWN0aW9uLmRlc3Ryb3koKSBmb3Igc2VsZWN0aW9uIGluIHNlbGVjdGlvbnNbMC4uLi0xXVxuICAgICAgdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbiAgc2VsZWN0aW9uU2NyZWVuUmFuZ2VDaGFuZ2VkOiAoc2VsZWN0aW9uKSAtPlxuICAgIEBlbWl0ICdzZWxlY3Rpb24tc2NyZWVuLXJhbmdlLWNoYW5nZWQnLCBzZWxlY3Rpb25cblxuICAjIFB1YmxpYzogR2V0IGN1cnJlbnQge1NlbGVjdGlvbn1zLlxuICAjXG4gICMgUmV0dXJuczogQW4ge0FycmF5fSBvZiB7U2VsZWN0aW9ufXMuXG4gIGdldFNlbGVjdGlvbnM6IC0+IG5ldyBBcnJheShAc2VsZWN0aW9ucy4uLilcblxuICAjIFB1YmxpYzogR2V0IHRoZSBtb3N0IHJlY2VudCB7U2VsZWN0aW9ufSBvciB0aGUgc2VsZWN0aW9uIGF0IHRoZSBnaXZlblxuICAjIGluZGV4LlxuICAjXG4gICMgaW5kZXggLSBPcHRpb25hbC4gVGhlIGluZGV4IG9mIHRoZSBzZWxlY3Rpb24gdG8gcmV0dXJuLCBiYXNlZCBvbiB0aGUgb3JkZXJcbiAgIyAgIGluIHdoaWNoIHRoZSBzZWxlY3Rpb25zIHdlcmUgYWRkZWQuXG4gICNcbiAgIyBSZXR1cm5zIGEge1NlbGVjdGlvbn0uXG4gICMgb3IgdGhlICBhdCB0aGUgc3BlY2lmaWVkIGluZGV4LlxuICBnZXRTZWxlY3Rpb246IChpbmRleCkgLT5cbiAgICBpbmRleCA/PSBAc2VsZWN0aW9ucy5sZW5ndGggLSAxXG4gICAgQHNlbGVjdGlvbnNbaW5kZXhdXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgbW9zdCByZWNlbnRseSBhZGRlZCB7U2VsZWN0aW9ufS5cbiAgI1xuICAjIFJldHVybnMgYSB7U2VsZWN0aW9ufS5cbiAgZ2V0TGFzdFNlbGVjdGlvbjogLT5cbiAgICBfLmxhc3QoQHNlbGVjdGlvbnMpXG5cbiAgIyBQdWJsaWM6IEdldCBhbGwge1NlbGVjdGlvbn1zLCBvcmRlcmVkIGJ5IHRoZWlyIHBvc2l0aW9uIGluIHRoZSBidWZmZXJcbiAgIyBpbnN0ZWFkIG9mIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IHdlcmUgYWRkZWQuXG4gICNcbiAgIyBSZXR1cm5zIGFuIHtBcnJheX0gb2Yge1NlbGVjdGlvbn1zLlxuICBnZXRTZWxlY3Rpb25zT3JkZXJlZEJ5QnVmZmVyUG9zaXRpb246IC0+XG4gICAgQGdldFNlbGVjdGlvbnMoKS5zb3J0IChhLCBiKSAtPiBhLmNvbXBhcmUoYilcblxuICAjIFB1YmxpYzogR2V0IHRoZSBsYXN0IHtTZWxlY3Rpb259IGJhc2VkIG9uIGl0cyBwb3NpdGlvbiBpbiB0aGUgYnVmZmVyLlxuICAjXG4gICMgUmV0dXJucyBhIHtTZWxlY3Rpb259LlxuICBnZXRMYXN0U2VsZWN0aW9uSW5CdWZmZXI6IC0+XG4gICAgXy5sYXN0KEBnZXRTZWxlY3Rpb25zT3JkZXJlZEJ5QnVmZmVyUG9zaXRpb24oKSlcblxuICAjIFB1YmxpYzogRGV0ZXJtaW5lIGlmIGEgZ2l2ZW4gcmFuZ2UgaW4gYnVmZmVyIGNvb3JkaW5hdGVzIGludGVyc2VjdHMgYVxuICAjIHNlbGVjdGlvbi5cbiAgI1xuICAjIGJ1ZmZlclJhbmdlIC0gQSB7UmFuZ2V9IG9yIHJhbmdlLWNvbXB0YXRpYmxlIHtBcnJheX0uXG4gICNcbiAgIyBSZXR1cm5zIGEge0Jvb2xlYW59LlxuICBzZWxlY3Rpb25JbnRlcnNlY3RzQnVmZmVyUmFuZ2U6IChidWZmZXJSYW5nZSkgLT5cbiAgICBfLmFueSBAZ2V0U2VsZWN0aW9ucygpLCAoc2VsZWN0aW9uKSAtPlxuICAgICAgc2VsZWN0aW9uLmludGVyc2VjdHNCdWZmZXJSYW5nZShidWZmZXJSYW5nZSlcblxuICAjIFB1YmxpYzogTW92ZSB0aGUgY3Vyc29yIHRvIHRoZSBnaXZlbiBwb3NpdGlvbiBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gICNcbiAgIyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgY3Vyc29ycywgdGhleSB3aWxsIGJlIGNvbnNvbGlkYXRlZCB0byBhIHNpbmdsZSBjdXJzb3IuXG4gICNcbiAgIyBwb3NpdGlvbiAtIEEge1BvaW50fSBvciB7QXJyYXl9IG9mIGBbcm93LCBjb2x1bW5dYFxuICAjIG9wdGlvbnMgIC0gQW4ge09iamVjdH0gY29tYmluaW5nIG9wdGlvbnMgZm9yIHs6OmNsaXBTY3JlZW5Qb3NpdGlvbn0gd2l0aDpcbiAgIyAgIDphdXRvc2Nyb2xsIC0gRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBlZGl0b3Igc2Nyb2xscyB0byB0aGUgbmV3IGN1cnNvcidzXG4gICMgICAgIHBvc2l0aW9uLiBEZWZhdWx0cyB0byB0cnVlLlxuICBzZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbjogKHBvc2l0aW9uLCBvcHRpb25zKSAtPlxuICAgIEBtb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPiBjdXJzb3Iuc2V0U2NyZWVuUG9zaXRpb24ocG9zaXRpb24sIG9wdGlvbnMpXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgcG9zaXRpb24gb2YgdGhlIG1vc3QgcmVjZW50bHkgYWRkZWQgY3Vyc29yIGluIHNjcmVlblxuICAjIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgUmV0dXJucyBhIHtQb2ludH0uXG4gIGdldEN1cnNvclNjcmVlblBvc2l0aW9uOiAtPlxuICAgIEBnZXRDdXJzb3IoKS5nZXRTY3JlZW5Qb3NpdGlvbigpXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgcm93IG9mIHRoZSBtb3N0IHJlY2VudGx5IGFkZGVkIGN1cnNvciBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gICNcbiAgIyBSZXR1cm5zIHRoZSBzY3JlZW4gcm93IHtOdW1iZXJ9LlxuICBnZXRDdXJzb3JTY3JlZW5Sb3c6IC0+XG4gICAgQGdldEN1cnNvcigpLmdldFNjcmVlblJvdygpXG5cbiAgIyBQdWJsaWM6IE1vdmUgdGhlIGN1cnNvciB0byB0aGUgZ2l2ZW4gcG9zaXRpb24gaW4gYnVmZmVyIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgSWYgdGhlcmUgYXJlIG11bHRpcGxlIGN1cnNvcnMsIHRoZXkgd2lsbCBiZSBjb25zb2xpZGF0ZWQgdG8gYSBzaW5nbGUgY3Vyc29yLlxuICAjXG4gICMgcG9zaXRpb24gLSBBIHtQb2ludH0gb3Ige0FycmF5fSBvZiBgW3JvdywgY29sdW1uXWBcbiAgIyBvcHRpb25zICAtIEFuIHtPYmplY3R9IGNvbWJpbmluZyBvcHRpb25zIGZvciB7OjpjbGlwU2NyZWVuUG9zaXRpb259IHdpdGg6XG4gICMgICA6YXV0b3Njcm9sbCAtIERldGVybWluZXMgd2hldGhlciB0aGUgZWRpdG9yIHNjcm9sbHMgdG8gdGhlIG5ldyBjdXJzb3Inc1xuICAjICAgICBwb3NpdGlvbi4gRGVmYXVsdHMgdG8gdHJ1ZS5cbiAgc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb246IChwb3NpdGlvbiwgb3B0aW9ucykgLT5cbiAgICBAbW92ZUN1cnNvcnMgKGN1cnNvcikgLT4gY3Vyc29yLnNldEJ1ZmZlclBvc2l0aW9uKHBvc2l0aW9uLCBvcHRpb25zKVxuXG4gICMgUHVibGljOiBHZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBtb3N0IHJlY2VudGx5IGFkZGVkIGN1cnNvciBpbiBidWZmZXJcbiAgIyBjb29yZGluYXRlcy5cbiAgI1xuICAjIFJldHVybnMgYSB7UG9pbnR9LlxuICBnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbjogLT5cbiAgICBAZ2V0Q3Vyc29yKCkuZ2V0QnVmZmVyUG9zaXRpb24oKVxuXG4gICMgUHVibGljOiBHZXQgdGhlIHtSYW5nZX0gb2YgdGhlIG1vc3QgcmVjZW50bHkgYWRkZWQgc2VsZWN0aW9uIGluIHNjcmVlblxuICAjIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgUmV0dXJucyBhIHtSYW5nZX0uXG4gIGdldFNlbGVjdGVkU2NyZWVuUmFuZ2U6IC0+XG4gICAgQGdldExhc3RTZWxlY3Rpb24oKS5nZXRTY3JlZW5SYW5nZSgpXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUge1JhbmdlfSBvZiB0aGUgbW9zdCByZWNlbnRseSBhZGRlZCBzZWxlY3Rpb24gaW4gYnVmZmVyXG4gICMgY29vcmRpbmF0ZXMuXG4gICNcbiAgIyBSZXR1cm5zIGEge1JhbmdlfS5cbiAgZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZTogLT5cbiAgICBAZ2V0TGFzdFNlbGVjdGlvbigpLmdldEJ1ZmZlclJhbmdlKClcblxuICAjIFB1YmxpYzogR2V0IHRoZSB7UmFuZ2V9cyBvZiBhbGwgc2VsZWN0aW9ucyBpbiBidWZmZXIgY29vcmRpbmF0ZXMuXG4gICNcbiAgIyBUaGUgcmFuZ2VzIGFyZSBzb3J0ZWQgYnkgdGhlaXIgcG9zaXRpb24gaW4gdGhlIGJ1ZmZlci5cbiAgI1xuICAjIFJldHVybnMgYW4ge0FycmF5fSBvZiB7UmFuZ2V9cy5cbiAgZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXM6IC0+XG4gICAgc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkgZm9yIHNlbGVjdGlvbiBpbiBAZ2V0U2VsZWN0aW9uc09yZGVyZWRCeUJ1ZmZlclBvc2l0aW9uKClcblxuICAjIFB1YmxpYzogR2V0IHRoZSB7UmFuZ2V9cyBvZiBhbGwgc2VsZWN0aW9ucyBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gICNcbiAgIyBUaGUgcmFuZ2VzIGFyZSBzb3J0ZWQgYnkgdGhlaXIgcG9zaXRpb24gaW4gdGhlIGJ1ZmZlci5cbiAgI1xuICAjIFJldHVybnMgYW4ge0FycmF5fSBvZiB7UmFuZ2V9cy5cbiAgZ2V0U2VsZWN0ZWRTY3JlZW5SYW5nZXM6IC0+XG4gICAgc2VsZWN0aW9uLmdldFNjcmVlblJhbmdlKCkgZm9yIHNlbGVjdGlvbiBpbiBAZ2V0U2VsZWN0aW9uc09yZGVyZWRCeUJ1ZmZlclBvc2l0aW9uKClcblxuICAjIFB1YmxpYzogR2V0IHRoZSBzZWxlY3RlZCB0ZXh0IG9mIHRoZSBtb3N0IHJlY2VudGx5IGFkZGVkIHNlbGVjdGlvbi5cbiAgI1xuICAjIFJldHVybnMgYSB7U3RyaW5nfS5cbiAgZ2V0U2VsZWN0ZWRUZXh0OiAtPlxuICAgIEBnZXRMYXN0U2VsZWN0aW9uKCkuZ2V0VGV4dCgpXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgdGV4dCBpbiB0aGUgZ2l2ZW4ge1JhbmdlfSBpbiBidWZmZXIgY29vcmRpbmF0ZXMuXG4gICNcbiAgIyByYW5nZSAtIEEge1JhbmdlfSBvciByYW5nZS1jb21wYXRpYmxlIHtBcnJheX0uXG4gICNcbiAgIyBSZXR1cm5zIGEge1N0cmluZ30uXG4gIGdldFRleHRJbkJ1ZmZlclJhbmdlOiAocmFuZ2UpIC0+XG4gICAgQGJ1ZmZlci5nZXRUZXh0SW5SYW5nZShyYW5nZSlcblxuICAjIFB1YmxpYzogU2V0IHRoZSB0ZXh0IGluIHRoZSBnaXZlbiB7UmFuZ2V9IGluIGJ1ZmZlciBjb29yZGluYXRlcy5cbiAgI1xuICAjIHJhbmdlIC0gQSB7UmFuZ2V9IG9yIHJhbmdlLWNvbXBhdGlibGUge0FycmF5fS5cbiAgIyB0ZXh0IC0gQSB7U3RyaW5nfVxuICAjXG4gICMgUmV0dXJucyB0aGUge1JhbmdlfSBvZiB0aGUgbmV3bHktaW5zZXJ0ZWQgdGV4dC5cbiAgc2V0VGV4dEluQnVmZmVyUmFuZ2U6IChyYW5nZSwgdGV4dCkgLT4gQGdldEJ1ZmZlcigpLnNldFRleHRJblJhbmdlKHJhbmdlLCB0ZXh0KVxuXG4gICMgUHVibGljOiBHZXQgdGhlIHtSYW5nZX0gb2YgdGhlIHBhcmFncmFwaCBzdXJyb3VuZGluZyB0aGUgbW9zdCByZWNlbnRseSBhZGRlZFxuICAjIGN1cnNvci5cbiAgI1xuICAjIFJldHVybnMgYSB7UmFuZ2V9LlxuICBnZXRDdXJyZW50UGFyYWdyYXBoQnVmZmVyUmFuZ2U6IC0+XG4gICAgQGdldEN1cnNvcigpLmdldEN1cnJlbnRQYXJhZ3JhcGhCdWZmZXJSYW5nZSgpXG5cbiAgIyBQdWJsaWM6IFJldHVybnMgdGhlIHdvcmQgc3Vycm91bmRpbmcgdGhlIG1vc3QgcmVjZW50bHkgYWRkZWQgY3Vyc29yLlxuICAjXG4gICMgb3B0aW9ucyAtIFNlZSB7Q3Vyc29yOjpnZXRCZWdpbm5pbmdPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb259LlxuICBnZXRXb3JkVW5kZXJDdXJzb3I6IChvcHRpb25zKSAtPlxuICAgIEBnZXRUZXh0SW5CdWZmZXJSYW5nZShAZ2V0Q3Vyc29yKCkuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZShvcHRpb25zKSlcblxuICAjIFB1YmxpYzogTW92ZSBldmVyeSBjdXJzb3IgdXAgb25lIHJvdyBpbiBzY3JlZW4gY29vcmRpbmF0ZXMuXG4gIG1vdmVDdXJzb3JVcDogKGxpbmVDb3VudCkgLT5cbiAgICBAbW92ZUN1cnNvcnMgKGN1cnNvcikgLT4gY3Vyc29yLm1vdmVVcChsaW5lQ291bnQsIG1vdmVUb0VuZE9mU2VsZWN0aW9uOiB0cnVlKVxuXG4gICMgUHVibGljOiBNb3ZlIGV2ZXJ5IGN1cnNvciBkb3duIG9uZSByb3cgaW4gc2NyZWVuIGNvb3JkaW5hdGVzLlxuICBtb3ZlQ3Vyc29yRG93bjogKGxpbmVDb3VudCkgLT5cbiAgICBAbW92ZUN1cnNvcnMgKGN1cnNvcikgLT4gY3Vyc29yLm1vdmVEb3duKGxpbmVDb3VudCwgbW92ZVRvRW5kT2ZTZWxlY3Rpb246IHRydWUpXG5cbiAgIyBQdWJsaWM6IE1vdmUgZXZlcnkgY3Vyc29yIGxlZnQgb25lIGNvbHVtbi5cbiAgbW92ZUN1cnNvckxlZnQ6IC0+XG4gICAgQG1vdmVDdXJzb3JzIChjdXJzb3IpIC0+IGN1cnNvci5tb3ZlTGVmdChtb3ZlVG9FbmRPZlNlbGVjdGlvbjogdHJ1ZSlcblxuICAjIFB1YmxpYzogTW92ZSBldmVyeSBjdXJzb3IgcmlnaHQgb25lIGNvbHVtbi5cbiAgbW92ZUN1cnNvclJpZ2h0OiAtPlxuICAgIEBtb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZVJpZ2h0KG1vdmVUb0VuZE9mU2VsZWN0aW9uOiB0cnVlKVxuXG4gICMgUHVibGljOiBNb3ZlIGV2ZXJ5IGN1cnNvciB0byB0aGUgdG9wIG9mIHRoZSBidWZmZXIuXG4gICNcbiAgIyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgY3Vyc29ycywgdGhleSB3aWxsIGJlIG1lcmdlZCBpbnRvIGEgc2luZ2xlIGN1cnNvci5cbiAgbW92ZUN1cnNvclRvVG9wOiAtPlxuICAgIEBtb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZVRvVG9wKClcblxuICAjIFB1YmxpYzogTW92ZSBldmVyeSBjdXJzb3IgdG8gdGhlIGJvdHRvbSBvZiB0aGUgYnVmZmVyLlxuICAjXG4gICMgSWYgdGhlcmUgYXJlIG11bHRpcGxlIGN1cnNvcnMsIHRoZXkgd2lsbCBiZSBtZXJnZWQgaW50byBhIHNpbmdsZSBjdXJzb3IuXG4gIG1vdmVDdXJzb3JUb0JvdHRvbTogLT5cbiAgICBAbW92ZUN1cnNvcnMgKGN1cnNvcikgLT4gY3Vyc29yLm1vdmVUb0JvdHRvbSgpXG5cbiAgIyBQdWJsaWM6IE1vdmUgZXZlcnkgY3Vyc29yIHRvIHRoZSBiZWdpbm5pbmcgb2YgaXRzIGxpbmUgaW4gc2NyZWVuIGNvb3JkaW5hdGVzLlxuICBtb3ZlQ3Vyc29yVG9CZWdpbm5pbmdPZlNjcmVlbkxpbmU6IC0+XG4gICAgQG1vdmVDdXJzb3JzIChjdXJzb3IpIC0+IGN1cnNvci5tb3ZlVG9CZWdpbm5pbmdPZlNjcmVlbkxpbmUoKVxuXG4gICMgUHVibGljOiBNb3ZlIGV2ZXJ5IGN1cnNvciB0byB0aGUgYmVnaW5uaW5nIG9mIGl0cyBsaW5lIGluIGJ1ZmZlciBjb29yZGluYXRlcy5cbiAgbW92ZUN1cnNvclRvQmVnaW5uaW5nT2ZMaW5lOiAtPlxuICAgIEBtb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZVRvQmVnaW5uaW5nT2ZMaW5lKClcblxuICAjIFB1YmxpYzogTW92ZSBldmVyeSBjdXJzb3IgdG8gdGhlIGZpcnN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlciBvZiBpdHMgbGluZS5cbiAgbW92ZUN1cnNvclRvRmlyc3RDaGFyYWN0ZXJPZkxpbmU6IC0+XG4gICAgQG1vdmVDdXJzb3JzIChjdXJzb3IpIC0+IGN1cnNvci5tb3ZlVG9GaXJzdENoYXJhY3Rlck9mTGluZSgpXG5cbiAgIyBQdWJsaWM6IE1vdmUgZXZlcnkgY3Vyc29yIHRvIHRoZSBlbmQgb2YgaXRzIGxpbmUgaW4gc2NyZWVuIGNvb3JkaW5hdGVzLlxuICBtb3ZlQ3Vyc29yVG9FbmRPZlNjcmVlbkxpbmU6IC0+XG4gICAgQG1vdmVDdXJzb3JzIChjdXJzb3IpIC0+IGN1cnNvci5tb3ZlVG9FbmRPZlNjcmVlbkxpbmUoKVxuXG4gICMgUHVibGljOiBNb3ZlIGV2ZXJ5IGN1cnNvciB0byB0aGUgZW5kIG9mIGl0cyBsaW5lIGluIGJ1ZmZlciBjb29yZGluYXRlcy5cbiAgbW92ZUN1cnNvclRvRW5kT2ZMaW5lOiAtPlxuICAgIEBtb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZVRvRW5kT2ZMaW5lKClcblxuICAjIFB1YmxpYzogTW92ZSBldmVyeSBjdXJzb3IgdG8gdGhlIGJlZ2lubmluZyBvZiBpdHMgc3Vycm91bmRpbmcgd29yZC5cbiAgbW92ZUN1cnNvclRvQmVnaW5uaW5nT2ZXb3JkOiAtPlxuICAgIEBtb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZVRvQmVnaW5uaW5nT2ZXb3JkKClcblxuICAjIFB1YmxpYzogTW92ZSBldmVyeSBjdXJzb3IgdG8gdGhlIGVuZCBvZiBpdHMgc3Vycm91bmRpbmcgd29yZC5cbiAgbW92ZUN1cnNvclRvRW5kT2ZXb3JkOiAtPlxuICAgIEBtb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZVRvRW5kT2ZXb3JkKClcblxuICAjIFB1YmxpYzogTW92ZSBldmVyeSBjdXJzb3IgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgbmV4dCB3b3JkLlxuICBtb3ZlQ3Vyc29yVG9CZWdpbm5pbmdPZk5leHRXb3JkOiAtPlxuICAgIEBtb3ZlQ3Vyc29ycyAoY3Vyc29yKSAtPiBjdXJzb3IubW92ZVRvQmVnaW5uaW5nT2ZOZXh0V29yZCgpXG5cbiAgIyBQdWJsaWM6IE1vdmUgZXZlcnkgY3Vyc29yIHRvIHRoZSBwcmV2aW91cyB3b3JkIGJvdW5kYXJ5LlxuICBtb3ZlQ3Vyc29yVG9QcmV2aW91c1dvcmRCb3VuZGFyeTogLT5cbiAgICBAbW92ZUN1cnNvcnMgKGN1cnNvcikgLT4gY3Vyc29yLm1vdmVUb1ByZXZpb3VzV29yZEJvdW5kYXJ5KClcblxuICAjIFB1YmxpYzogTW92ZSBldmVyeSBjdXJzb3IgdG8gdGhlIG5leHQgd29yZCBib3VuZGFyeS5cbiAgbW92ZUN1cnNvclRvTmV4dFdvcmRCb3VuZGFyeTogLT5cbiAgICBAbW92ZUN1cnNvcnMgKGN1cnNvcikgLT4gY3Vyc29yLm1vdmVUb05leHRXb3JkQm91bmRhcnkoKVxuXG4gIHNjcm9sbFRvQ3Vyc29yUG9zaXRpb246IC0+XG4gICAgQGdldEN1cnNvcigpLmF1dG9zY3JvbGwoKVxuXG4gIHBhZ2VVcDogLT5cbiAgICBAc2V0U2Nyb2xsVG9wKEBnZXRTY3JvbGxUb3AoKSAtIEBnZXRIZWlnaHQoKSlcblxuICBwYWdlRG93bjogLT5cbiAgICBAc2V0U2Nyb2xsVG9wKEBnZXRTY3JvbGxUb3AoKSArIEBnZXRIZWlnaHQoKSlcblxuICBtb3ZlQ3Vyc29yczogKGZuKSAtPlxuICAgIEBtb3ZpbmdDdXJzb3JzID0gdHJ1ZVxuICAgIEBiYXRjaFVwZGF0ZXMgPT5cbiAgICAgIGZuKGN1cnNvcikgZm9yIGN1cnNvciBpbiBAZ2V0Q3Vyc29ycygpXG4gICAgICBAbWVyZ2VDdXJzb3JzKClcbiAgICAgIEBtb3ZpbmdDdXJzb3JzID0gZmFsc2VcbiAgICAgIEBlbWl0ICdjdXJzb3JzLW1vdmVkJ1xuXG4gIGN1cnNvck1vdmVkOiAoZXZlbnQpIC0+XG4gICAgQGVtaXQgJ2N1cnNvci1tb3ZlZCcsIGV2ZW50XG4gICAgQGVtaXQgJ2N1cnNvcnMtbW92ZWQnIHVubGVzcyBAbW92aW5nQ3Vyc29yc1xuXG4gICMgUHVibGljOiBTZWxlY3QgZnJvbSB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb24gdG8gdGhlIGdpdmVuIHBvc2l0aW9uIGluXG4gICMgc2NyZWVuIGNvb3JkaW5hdGVzLlxuICAjXG4gICMgVGhpcyBtZXRob2QgbWF5IG1lcmdlIHNlbGVjdGlvbnMgdGhhdCBlbmQgdXAgaW50ZXNlY3RpbmcuXG4gICNcbiAgIyBwb3NpdGlvbiAtIEFuIGluc3RhbmNlIG9mIHtQb2ludH0sIHdpdGggYSBnaXZlbiBgcm93YCBhbmQgYGNvbHVtbmAuXG4gIHNlbGVjdFRvU2NyZWVuUG9zaXRpb246IChwb3NpdGlvbikgLT5cbiAgICBsYXN0U2VsZWN0aW9uID0gQGdldExhc3RTZWxlY3Rpb24oKVxuICAgIGxhc3RTZWxlY3Rpb24uc2VsZWN0VG9TY3JlZW5Qb3NpdGlvbihwb3NpdGlvbilcbiAgICBAbWVyZ2VJbnRlcnNlY3RpbmdTZWxlY3Rpb25zKHJldmVyc2VkOiBsYXN0U2VsZWN0aW9uLmlzUmV2ZXJzZWQoKSlcblxuICAjIFB1YmxpYzogTW92ZSB0aGUgY3Vyc29yIG9mIGVhY2ggc2VsZWN0aW9uIG9uZSBjaGFyYWN0ZXIgcmlnaHR3YXJkIHdoaWxlXG4gICMgcHJlc2VydmluZyB0aGUgc2VsZWN0aW9uJ3MgdGFpbCBwb3NpdGlvbi5cbiAgI1xuICAjIFRoaXMgbWV0aG9kIG1heSBtZXJnZSBzZWxlY3Rpb25zIHRoYXQgZW5kIHVwIGludGVzZWN0aW5nLlxuICBzZWxlY3RSaWdodDogLT5cbiAgICBAZXhwYW5kU2VsZWN0aW9uc0ZvcndhcmQgKHNlbGVjdGlvbikgPT4gc2VsZWN0aW9uLnNlbGVjdFJpZ2h0KClcblxuICAjIFB1YmxpYzogTW92ZSB0aGUgY3Vyc29yIG9mIGVhY2ggc2VsZWN0aW9uIG9uZSBjaGFyYWN0ZXIgbGVmdHdhcmQgd2hpbGVcbiAgIyBwcmVzZXJ2aW5nIHRoZSBzZWxlY3Rpb24ncyB0YWlsIHBvc2l0aW9uLlxuICAjXG4gICMgVGhpcyBtZXRob2QgbWF5IG1lcmdlIHNlbGVjdGlvbnMgdGhhdCBlbmQgdXAgaW50ZXNlY3RpbmcuXG4gIHNlbGVjdExlZnQ6IC0+XG4gICAgQGV4cGFuZFNlbGVjdGlvbnNCYWNrd2FyZCAoc2VsZWN0aW9uKSA9PiBzZWxlY3Rpb24uc2VsZWN0TGVmdCgpXG5cbiAgIyBQdWJsaWM6IE1vdmUgdGhlIGN1cnNvciBvZiBlYWNoIHNlbGVjdGlvbiBvbmUgY2hhcmFjdGVyIHVwd2FyZCB3aGlsZVxuICAjIHByZXNlcnZpbmcgdGhlIHNlbGVjdGlvbidzIHRhaWwgcG9zaXRpb24uXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBtYXkgbWVyZ2Ugc2VsZWN0aW9ucyB0aGF0IGVuZCB1cCBpbnRlc2VjdGluZy5cbiAgc2VsZWN0VXA6IChyb3dDb3VudCkgLT5cbiAgICBAZXhwYW5kU2VsZWN0aW9uc0JhY2t3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5zZWxlY3RVcChyb3dDb3VudClcblxuICAjIFB1YmxpYzogTW92ZSB0aGUgY3Vyc29yIG9mIGVhY2ggc2VsZWN0aW9uIG9uZSBjaGFyYWN0ZXIgZG93bndhcmQgd2hpbGVcbiAgIyBwcmVzZXJ2aW5nIHRoZSBzZWxlY3Rpb24ncyB0YWlsIHBvc2l0aW9uLlxuICAjXG4gICMgVGhpcyBtZXRob2QgbWF5IG1lcmdlIHNlbGVjdGlvbnMgdGhhdCBlbmQgdXAgaW50ZXNlY3RpbmcuXG4gIHNlbGVjdERvd246IChyb3dDb3VudCkgLT5cbiAgICBAZXhwYW5kU2VsZWN0aW9uc0ZvcndhcmQgKHNlbGVjdGlvbikgPT4gc2VsZWN0aW9uLnNlbGVjdERvd24ocm93Q291bnQpXG5cbiAgIyBQdWJsaWM6IFNlbGVjdCBmcm9tIHRoZSB0b3Agb2YgdGhlIGJ1ZmZlciB0byB0aGUgZW5kIG9mIHRoZSBsYXN0IHNlbGVjdGlvblxuICAjIGluIHRoZSBidWZmZXIuXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBtZXJnZXMgbXVsdGlwbGUgc2VsZWN0aW9ucyBpbnRvIGEgc2luZ2xlIHNlbGVjdGlvbi5cbiAgc2VsZWN0VG9Ub3A6IC0+XG4gICAgQGV4cGFuZFNlbGVjdGlvbnNCYWNrd2FyZCAoc2VsZWN0aW9uKSA9PiBzZWxlY3Rpb24uc2VsZWN0VG9Ub3AoKVxuXG4gICMgUHVibGljOiBTZWxlY3QgYWxsIHRleHQgaW4gdGhlIGJ1ZmZlci5cbiAgI1xuICAjIFRoaXMgbWV0aG9kIG1lcmdlcyBtdWx0aXBsZSBzZWxlY3Rpb25zIGludG8gYSBzaW5nbGUgc2VsZWN0aW9uLlxuICBzZWxlY3RBbGw6IC0+XG4gICAgQGV4cGFuZFNlbGVjdGlvbnNGb3J3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5zZWxlY3RBbGwoKVxuXG4gICMgUHVibGljOiBTZWxlY3RzIGZyb20gdGhlIHRvcCBvZiB0aGUgZmlyc3Qgc2VsZWN0aW9uIGluIHRoZSBidWZmZXIgdG8gdGhlIGVuZFxuICAjIG9mIHRoZSBidWZmZXIuXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBtZXJnZXMgbXVsdGlwbGUgc2VsZWN0aW9ucyBpbnRvIGEgc2luZ2xlIHNlbGVjdGlvbi5cbiAgc2VsZWN0VG9Cb3R0b206IC0+XG4gICAgQGV4cGFuZFNlbGVjdGlvbnNGb3J3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5zZWxlY3RUb0JvdHRvbSgpXG5cbiAgIyBQdWJsaWM6IE1vdmUgdGhlIGN1cnNvciBvZiBlYWNoIHNlbGVjdGlvbiB0byB0aGUgYmVnaW5uaW5nIG9mIGl0cyBsaW5lXG4gICMgd2hpbGUgcHJlc2VydmluZyB0aGUgc2VsZWN0aW9uJ3MgdGFpbCBwb3NpdGlvbi5cbiAgI1xuICAjIFRoaXMgbWV0aG9kIG1heSBtZXJnZSBzZWxlY3Rpb25zIHRoYXQgZW5kIHVwIGludGVzZWN0aW5nLlxuICBzZWxlY3RUb0JlZ2lubmluZ09mTGluZTogLT5cbiAgICBAZXhwYW5kU2VsZWN0aW9uc0JhY2t3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5zZWxlY3RUb0JlZ2lubmluZ09mTGluZSgpXG5cbiAgIyBQdWJsaWM6IE1vdmUgdGhlIGN1cnNvciBvZiBlYWNoIHNlbGVjdGlvbiB0byB0aGUgZmlyc3Qgbm9uLXdoaXRlc3BhY2VcbiAgIyBjaGFyYWN0ZXIgb2YgaXRzIGxpbmUgd2hpbGUgcHJlc2VydmluZyB0aGUgc2VsZWN0aW9uJ3MgdGFpbCBwb3NpdGlvbi4gSWYgdGhlXG4gICMgY3Vyc29yIGlzIGFscmVhZHkgb24gdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGUgbGluZSwgbW92ZSBpdCB0byB0aGVcbiAgIyBiZWdpbm5pbmcgb2YgdGhlIGxpbmUuXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBtYXkgbWVyZ2Ugc2VsZWN0aW9ucyB0aGF0IGVuZCB1cCBpbnRlc2VjdGluZy5cbiAgc2VsZWN0VG9GaXJzdENoYXJhY3Rlck9mTGluZTogLT5cbiAgICBAZXhwYW5kU2VsZWN0aW9uc0JhY2t3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5zZWxlY3RUb0ZpcnN0Q2hhcmFjdGVyT2ZMaW5lKClcblxuICAjIFB1YmxpYzogTW92ZSB0aGUgY3Vyc29yIG9mIGVhY2ggc2VsZWN0aW9uIHRvIHRoZSBlbmQgb2YgaXRzIGxpbmUgd2hpbGVcbiAgIyBwcmVzZXJ2aW5nIHRoZSBzZWxlY3Rpb24ncyB0YWlsIHBvc2l0aW9uLlxuICAjXG4gICMgVGhpcyBtZXRob2QgbWF5IG1lcmdlIHNlbGVjdGlvbnMgdGhhdCBlbmQgdXAgaW50ZXNlY3RpbmcuXG4gIHNlbGVjdFRvRW5kT2ZMaW5lOiAtPlxuICAgIEBleHBhbmRTZWxlY3Rpb25zRm9yd2FyZCAoc2VsZWN0aW9uKSA9PiBzZWxlY3Rpb24uc2VsZWN0VG9FbmRPZkxpbmUoKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIG1vdmUgaXRzIGN1cnNvciB0byB0aGUgcHJlY2VkaW5nIHdvcmQgYm91bmRhcnlcbiAgIyB3aGlsZSBtYWludGFpbmluZyB0aGUgc2VsZWN0aW9uJ3MgdGFpbCBwb3NpdGlvbi5cbiAgI1xuICAjIFRoaXMgbWV0aG9kIG1heSBtZXJnZSBzZWxlY3Rpb25zIHRoYXQgZW5kIHVwIGludGVzZWN0aW5nLlxuICBzZWxlY3RUb1ByZXZpb3VzV29yZEJvdW5kYXJ5OiAtPlxuICAgIEBleHBhbmRTZWxlY3Rpb25zQmFja3dhcmQgKHNlbGVjdGlvbikgPT4gc2VsZWN0aW9uLnNlbGVjdFRvUHJldmlvdXNXb3JkQm91bmRhcnkoKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIG1vdmUgaXRzIGN1cnNvciB0byB0aGUgbmV4dCB3b3JkIGJvdW5kYXJ5IHdoaWxlXG4gICMgbWFpbnRhaW5pbmcgdGhlIHNlbGVjdGlvbidzIHRhaWwgcG9zaXRpb24uXG4gICNcbiAgIyBUaGlzIG1ldGhvZCBtYXkgbWVyZ2Ugc2VsZWN0aW9ucyB0aGF0IGVuZCB1cCBpbnRlc2VjdGluZy5cbiAgc2VsZWN0VG9OZXh0V29yZEJvdW5kYXJ5OiAtPlxuICAgIEBleHBhbmRTZWxlY3Rpb25zRm9yd2FyZCAoc2VsZWN0aW9uKSA9PiBzZWxlY3Rpb24uc2VsZWN0VG9OZXh0V29yZEJvdW5kYXJ5KClcblxuICAjIFB1YmxpYzogRm9yIGVhY2ggY3Vyc29yLCBzZWxlY3QgdGhlIGNvbnRhaW5pbmcgbGluZS5cbiAgI1xuICAjIFRoaXMgbWV0aG9kIG1lcmdlcyBzZWxlY3Rpb25zIG9uIHN1Y2Nlc3NpdmUgbGluZXMuXG4gIHNlbGVjdExpbmU6IC0+XG4gICAgQGV4cGFuZFNlbGVjdGlvbnNGb3J3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5zZWxlY3RMaW5lKClcblxuICAjIFB1YmxpYzogQWRkIGEgc2ltaWxhcmx5LXNoYXBlZCBzZWxlY3Rpb24gdG8gdGhlIG5leHQgZWxpYmlibGUgbGluZSBiZWxvd1xuICAjIGVhY2ggc2VsZWN0aW9uLlxuICAjXG4gICMgT3BlcmF0ZXMgb24gYWxsIHNlbGVjdGlvbnMuIElmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksIGFkZHMgYW4gZW1wdHlcbiAgIyBzZWxlY3Rpb24gdG8gdGhlIG5leHQgZm9sbG93aW5nIG5vbi1lbXB0eSBsaW5lIGFzIGNsb3NlIHRvIHRoZSBjdXJyZW50XG4gICMgc2VsZWN0aW9uJ3MgY29sdW1uIGFzIHBvc3NpYmxlLiBJZiB0aGUgc2VsZWN0aW9uIGlzIG5vbi1lbXB0eSwgYWRkcyBhXG4gICMgc2VsZWN0aW9uIHRvIHRoZSBuZXh0IGxpbmUgdGhhdCBpcyBsb25nIGVub3VnaCBmb3IgYSBub24tZW1wdHkgc2VsZWN0aW9uXG4gICMgc3RhcnRpbmcgYXQgdGhlIHNhbWUgY29sdW1uIGFzIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byBiZSBhZGRlZCB0byBpdC5cbiAgYWRkU2VsZWN0aW9uQmVsb3c6IC0+XG4gICAgQGV4cGFuZFNlbGVjdGlvbnNGb3J3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5hZGRTZWxlY3Rpb25CZWxvdygpXG5cbiAgIyBQdWJsaWM6IEFkZCBhIHNpbWlsYXJseS1zaGFwZWQgc2VsZWN0aW9uIHRvIHRoZSBuZXh0IGVsaWJpYmxlIGxpbmUgYWJvdmVcbiAgIyBlYWNoIHNlbGVjdGlvbi5cbiAgI1xuICAjIE9wZXJhdGVzIG9uIGFsbCBzZWxlY3Rpb25zLiBJZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LCBhZGRzIGFuIGVtcHR5XG4gICMgc2VsZWN0aW9uIHRvIHRoZSBuZXh0IHByZWNlZGluZyBub24tZW1wdHkgbGluZSBhcyBjbG9zZSB0byB0aGUgY3VycmVudFxuICAjIHNlbGVjdGlvbidzIGNvbHVtbiBhcyBwb3NzaWJsZS4gSWYgdGhlIHNlbGVjdGlvbiBpcyBub24tZW1wdHksIGFkZHMgYVxuICAjIHNlbGVjdGlvbiB0byB0aGUgbmV4dCBsaW5lIHRoYXQgaXMgbG9uZyBlbm91Z2ggZm9yIGEgbm9uLWVtcHR5IHNlbGVjdGlvblxuICAjIHN0YXJ0aW5nIGF0IHRoZSBzYW1lIGNvbHVtbiBhcyB0aGUgY3VycmVudCBzZWxlY3Rpb24gdG8gYmUgYWRkZWQgdG8gaXQuXG4gIGFkZFNlbGVjdGlvbkFib3ZlOiAtPlxuICAgIEBleHBhbmRTZWxlY3Rpb25zQmFja3dhcmQgKHNlbGVjdGlvbikgPT4gc2VsZWN0aW9uLmFkZFNlbGVjdGlvbkFib3ZlKClcblxuICAjIFB1YmxpYzogU3BsaXQgbXVsdGktbGluZSBzZWxlY3Rpb25zIGludG8gb25lIHNlbGVjdGlvbiBwZXIgbGluZS5cbiAgI1xuICAjIE9wZXJhdGVzIG9uIGFsbCBzZWxlY3Rpb25zLiBUaGlzIG1ldGhvZCBicmVha3MgYXBhcnQgYWxsIG11bHRpLWxpbmVcbiAgIyBzZWxlY3Rpb25zIHRvIGNyZWF0ZSBtdWx0aXBsZSBzaW5nbGUtbGluZSBzZWxlY3Rpb25zIHRoYXQgY3VtdWxhdGl2ZWx5IGNvdmVyXG4gICMgdGhlIHNhbWUgb3JpZ2luYWwgYXJlYS5cbiAgc3BsaXRTZWxlY3Rpb25zSW50b0xpbmVzOiAtPlxuICAgIGZvciBzZWxlY3Rpb24gaW4gQGdldFNlbGVjdGlvbnMoKVxuICAgICAgcmFuZ2UgPSBzZWxlY3Rpb24uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgY29udGludWUgaWYgcmFuZ2UuaXNTaW5nbGVMaW5lKClcblxuICAgICAgc2VsZWN0aW9uLmRlc3Ryb3koKVxuICAgICAge3N0YXJ0LCBlbmR9ID0gcmFuZ2VcbiAgICAgIEBhZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShbc3RhcnQsIFtzdGFydC5yb3csIEluZmluaXR5XV0pXG4gICAgICB7cm93fSA9IHN0YXJ0XG4gICAgICB3aGlsZSArK3JvdyA8IGVuZC5yb3dcbiAgICAgICAgQGFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlKFtbcm93LCAwXSwgW3JvdywgSW5maW5pdHldXSlcbiAgICAgIEBhZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShbW2VuZC5yb3csIDBdLCBbZW5kLnJvdywgZW5kLmNvbHVtbl1dKVxuXG4gICMgUHVibGljOiBGb3IgZWFjaCBzZWxlY3Rpb24sIHRyYW5zcG9zZSB0aGUgc2VsZWN0ZWQgdGV4dC5cbiAgI1xuICAjIElmIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHksIHRoZSBjaGFyYWN0ZXJzIHByZWNlZGluZyBhbmQgZm9sbG93aW5nIHRoZSBjdXJzb3JcbiAgIyBhcmUgc3dhcHBlZC4gT3RoZXJ3aXNlLCB0aGUgc2VsZWN0ZWQgY2hhcmFjdGVycyBhcmUgcmV2ZXJzZWQuXG4gIHRyYW5zcG9zZTogLT5cbiAgICBAbXV0YXRlU2VsZWN0ZWRUZXh0IChzZWxlY3Rpb24pID0+XG4gICAgICBpZiBzZWxlY3Rpb24uaXNFbXB0eSgpXG4gICAgICAgIHNlbGVjdGlvbi5zZWxlY3RSaWdodCgpXG4gICAgICAgIHRleHQgPSBzZWxlY3Rpb24uZ2V0VGV4dCgpXG4gICAgICAgIHNlbGVjdGlvbi5kZWxldGUoKVxuICAgICAgICBzZWxlY3Rpb24uY3Vyc29yLm1vdmVMZWZ0KClcbiAgICAgICAgc2VsZWN0aW9uLmluc2VydFRleHQgdGV4dFxuICAgICAgZWxzZVxuICAgICAgICBzZWxlY3Rpb24uaW5zZXJ0VGV4dCBzZWxlY3Rpb24uZ2V0VGV4dCgpLnNwbGl0KCcnKS5yZXZlcnNlKCkuam9pbignJylcblxuICAjIFB1YmxpYzogQ29udmVydCB0aGUgc2VsZWN0ZWQgdGV4dCB0byB1cHBlciBjYXNlLlxuICAjXG4gICMgRm9yIGVhY2ggc2VsZWN0aW9uLCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LCBjb252ZXJ0cyB0aGUgY29udGFpbmluZyB3b3JkXG4gICMgdG8gdXBwZXIgY2FzZS4gT3RoZXJ3aXNlIGNvbnZlcnQgdGhlIHNlbGVjdGVkIHRleHQgdG8gdXBwZXIgY2FzZS5cbiAgdXBwZXJDYXNlOiAtPlxuICAgIEByZXBsYWNlU2VsZWN0ZWRUZXh0IHNlbGVjdFdvcmRJZkVtcHR5OnRydWUsICh0ZXh0KSA9PiB0ZXh0LnRvVXBwZXJDYXNlKClcblxuICAjIFB1YmxpYzogQ29udmVydCB0aGUgc2VsZWN0ZWQgdGV4dCB0byBsb3dlciBjYXNlLlxuICAjXG4gICMgRm9yIGVhY2ggc2VsZWN0aW9uLCBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LCBjb252ZXJ0cyB0aGUgY29udGFpbmluZyB3b3JkXG4gICMgdG8gdXBwZXIgY2FzZS4gT3RoZXJ3aXNlIGNvbnZlcnQgdGhlIHNlbGVjdGVkIHRleHQgdG8gdXBwZXIgY2FzZS5cbiAgbG93ZXJDYXNlOiAtPlxuICAgIEByZXBsYWNlU2VsZWN0ZWRUZXh0IHNlbGVjdFdvcmRJZkVtcHR5OnRydWUsICh0ZXh0KSA9PiB0ZXh0LnRvTG93ZXJDYXNlKClcblxuICAjIENvbnZlcnQgbXVsdGlwbGUgbGluZXMgdG8gYSBzaW5nbGUgbGluZS5cbiAgI1xuICAjIE9wZXJhdGVzIG9uIGFsbCBzZWxlY3Rpb25zLiBJZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LCBqb2lucyB0aGUgY3VycmVudFxuICAjIGxpbmUgd2l0aCB0aGUgbmV4dCBsaW5lLiBPdGhlcndpc2UgaXQgam9pbnMgYWxsIGxpbmVzIHRoYXQgaW50ZXJzZWN0IHRoZVxuICAjIHNlbGVjdGlvbi5cbiAgI1xuICAjIEpvaW5pbmcgYSBsaW5lIG1lYW5zIHRoYXQgbXVsdGlwbGUgbGluZXMgYXJlIGNvbnZlcnRlZCB0byBhIHNpbmdsZSBsaW5lIHdpdGhcbiAgIyB0aGUgY29udGVudHMgb2YgZWFjaCBvZiB0aGUgb3JpZ2luYWwgbm9uLWVtcHR5IGxpbmVzIHNlcGFyYXRlZCBieSBhIHNwYWNlLlxuICBqb2luTGluZXM6IC0+XG4gICAgQG11dGF0ZVNlbGVjdGVkVGV4dCAoc2VsZWN0aW9uKSAtPiBzZWxlY3Rpb24uam9pbkxpbmVzKClcblxuICAjIFB1YmxpYzogRXhwYW5kIHNlbGVjdGlvbnMgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGVpciBjb250YWluaW5nIHdvcmQuXG4gICNcbiAgIyBPcGVyYXRlcyBvbiBhbGwgc2VsZWN0aW9ucy4gTW92ZXMgdGhlIGN1cnNvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZVxuICAjIGNvbnRhaW5pbmcgd29yZCB3aGlsZSBwcmVzZXJ2aW5nIHRoZSBzZWxlY3Rpb24ncyB0YWlsIHBvc2l0aW9uLlxuICBzZWxlY3RUb0JlZ2lubmluZ09mV29yZDogLT5cbiAgICBAZXhwYW5kU2VsZWN0aW9uc0JhY2t3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5zZWxlY3RUb0JlZ2lubmluZ09mV29yZCgpXG5cbiAgIyBQdWJsaWM6IEV4cGFuZCBzZWxlY3Rpb25zIHRvIHRoZSBlbmQgb2YgdGhlaXIgY29udGFpbmluZyB3b3JkLlxuICAjXG4gICMgT3BlcmF0ZXMgb24gYWxsIHNlbGVjdGlvbnMuIE1vdmVzIHRoZSBjdXJzb3IgdG8gdGhlIGVuZCBvZiB0aGUgY29udGFpbmluZ1xuICAjIHdvcmQgd2hpbGUgcHJlc2VydmluZyB0aGUgc2VsZWN0aW9uJ3MgdGFpbCBwb3NpdGlvbi5cbiAgc2VsZWN0VG9FbmRPZldvcmQ6IC0+XG4gICAgQGV4cGFuZFNlbGVjdGlvbnNGb3J3YXJkIChzZWxlY3Rpb24pID0+IHNlbGVjdGlvbi5zZWxlY3RUb0VuZE9mV29yZCgpXG5cbiAgIyBQdWJsaWM6IEV4cGFuZCBzZWxlY3Rpb25zIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG5leHQgd29yZC5cbiAgI1xuICAjIE9wZXJhdGVzIG9uIGFsbCBzZWxlY3Rpb25zLiBNb3ZlcyB0aGUgY3Vyc29yIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG5leHRcbiAgIyB3b3JkIHdoaWxlIHByZXNlcnZpbmcgdGhlIHNlbGVjdGlvbidzIHRhaWwgcG9zaXRpb24uXG4gIHNlbGVjdFRvQmVnaW5uaW5nT2ZOZXh0V29yZDogLT5cbiAgICBAZXhwYW5kU2VsZWN0aW9uc0ZvcndhcmQgKHNlbGVjdGlvbikgPT4gc2VsZWN0aW9uLnNlbGVjdFRvQmVnaW5uaW5nT2ZOZXh0V29yZCgpXG5cbiAgIyBQdWJsaWM6IFNlbGVjdCB0aGUgd29yZCBjb250YWluaW5nIGVhY2ggY3Vyc29yLlxuICBzZWxlY3RXb3JkOiAtPlxuICAgIEBleHBhbmRTZWxlY3Rpb25zRm9yd2FyZCAoc2VsZWN0aW9uKSA9PiBzZWxlY3Rpb24uc2VsZWN0V29yZCgpXG5cbiAgIyBQdWJsaWM6IFNlbGVjdCB0aGUgcmFuZ2Ugb2YgdGhlIGdpdmVuIG1hcmtlciBpZiBpdCBpcyB2YWxpZC5cbiAgI1xuICAjIG1hcmtlciAtIEEge0Rpc3BsYXlCdWZmZXJNYXJrZXJ9XG4gICNcbiAgIyBSZXR1cm5zIHRoZSBzZWxlY3RlZCB7UmFuZ2V9IG9yIGB1bmRlZmluZWRgIGlmIHRoZSBtYXJrZXIgaXMgaW52YWxpZC5cbiAgc2VsZWN0TWFya2VyOiAobWFya2VyKSAtPlxuICAgIGlmIG1hcmtlci5pc1ZhbGlkKClcbiAgICAgIHJhbmdlID0gbWFya2VyLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIEBzZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKHJhbmdlKVxuICAgICAgcmFuZ2VcblxuICAjIE1lcmdlIGN1cnNvcnMgdGhhdCBoYXZlIHRoZSBzYW1lIHNjcmVlbiBwb3NpdGlvblxuICBtZXJnZUN1cnNvcnM6IC0+XG4gICAgcG9zaXRpb25zID0gW11cbiAgICBmb3IgY3Vyc29yIGluIEBnZXRDdXJzb3JzKClcbiAgICAgIHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCkudG9TdHJpbmcoKVxuICAgICAgaWYgcG9zaXRpb24gaW4gcG9zaXRpb25zXG4gICAgICAgIGN1cnNvci5kZXN0cm95KClcbiAgICAgIGVsc2VcbiAgICAgICAgcG9zaXRpb25zLnB1c2gocG9zaXRpb24pXG5cbiAgIyBDYWxscyB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCBlYWNoIHNlbGVjdGlvbiwgdGhlbiBtZXJnZXMgc2VsZWN0aW9uc1xuICBleHBhbmRTZWxlY3Rpb25zRm9yd2FyZDogKGZuKSAtPlxuICAgIEBtZXJnZUludGVyc2VjdGluZ1NlbGVjdGlvbnMgPT5cbiAgICAgIGZuKHNlbGVjdGlvbikgZm9yIHNlbGVjdGlvbiBpbiBAZ2V0U2VsZWN0aW9ucygpXG5cbiAgIyBDYWxscyB0aGUgZ2l2ZW4gZnVuY3Rpb24gd2l0aCBlYWNoIHNlbGVjdGlvbiwgdGhlbiBtZXJnZXMgc2VsZWN0aW9ucyBpbiB0aGVcbiAgIyByZXZlcnNlZCBvcmllbnRhdGlvblxuICBleHBhbmRTZWxlY3Rpb25zQmFja3dhcmQ6IChmbikgLT5cbiAgICBAbWVyZ2VJbnRlcnNlY3RpbmdTZWxlY3Rpb25zIHJldmVyc2VkOiB0cnVlLCA9PlxuICAgICAgZm4oc2VsZWN0aW9uKSBmb3Igc2VsZWN0aW9uIGluIEBnZXRTZWxlY3Rpb25zKClcblxuICBmaW5hbGl6ZVNlbGVjdGlvbnM6IC0+XG4gICAgc2VsZWN0aW9uLmZpbmFsaXplKCkgZm9yIHNlbGVjdGlvbiBpbiBAZ2V0U2VsZWN0aW9ucygpXG5cbiAgIyBNZXJnZXMgaW50ZXJzZWN0aW5nIHNlbGVjdGlvbnMuIElmIHBhc3NlZCBhIGZ1bmN0aW9uLCBpdCBleGVjdXRlc1xuICAjIHRoZSBmdW5jdGlvbiB3aXRoIG1lcmdpbmcgc3VwcHJlc3NlZCwgdGhlbiBtZXJnZXMgaW50ZXJzZWN0aW5nIHNlbGVjdGlvbnNcbiAgIyBhZnRlcndhcmQuXG4gIG1lcmdlSW50ZXJzZWN0aW5nU2VsZWN0aW9uczogKGFyZ3MuLi4pIC0+XG4gICAgZm4gPSBhcmdzLnBvcCgpIGlmIF8uaXNGdW5jdGlvbihfLmxhc3QoYXJncykpXG4gICAgb3B0aW9ucyA9IGFyZ3MucG9wKCkgPyB7fVxuXG4gICAgcmV0dXJuIGZuPygpIGlmIEBzdXBwcmVzc1NlbGVjdGlvbk1lcmdpbmdcblxuICAgIGlmIGZuP1xuICAgICAgQHN1cHByZXNzU2VsZWN0aW9uTWVyZ2luZyA9IHRydWVcbiAgICAgIHJlc3VsdCA9IGZuKClcbiAgICAgIEBzdXBwcmVzc1NlbGVjdGlvbk1lcmdpbmcgPSBmYWxzZVxuXG4gICAgcmVkdWNlciA9IChkaXNqb2ludFNlbGVjdGlvbnMsIHNlbGVjdGlvbikgLT5cbiAgICAgIGludGVyc2VjdGluZ1NlbGVjdGlvbiA9IF8uZmluZChkaXNqb2ludFNlbGVjdGlvbnMsIChzKSAtPiBzLmludGVyc2VjdHNXaXRoKHNlbGVjdGlvbikpXG4gICAgICBpZiBpbnRlcnNlY3RpbmdTZWxlY3Rpb24/XG4gICAgICAgIGludGVyc2VjdGluZ1NlbGVjdGlvbi5tZXJnZShzZWxlY3Rpb24sIG9wdGlvbnMpXG4gICAgICAgIGRpc2pvaW50U2VsZWN0aW9uc1xuICAgICAgZWxzZVxuICAgICAgICBkaXNqb2ludFNlbGVjdGlvbnMuY29uY2F0KFtzZWxlY3Rpb25dKVxuXG4gICAgXy5yZWR1Y2UoQGdldFNlbGVjdGlvbnMoKSwgcmVkdWNlciwgW10pXG5cbiAgcHJlc2VydmVDdXJzb3JQb3NpdGlvbk9uQnVmZmVyUmVsb2FkOiAtPlxuICAgIGN1cnNvclBvc2l0aW9uID0gbnVsbFxuICAgIEBzdWJzY3JpYmUgQGJ1ZmZlciwgXCJ3aWxsLXJlbG9hZFwiLCA9PlxuICAgICAgY3Vyc29yUG9zaXRpb24gPSBAZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIEBzdWJzY3JpYmUgQGJ1ZmZlciwgXCJyZWxvYWRlZFwiLCA9PlxuICAgICAgQHNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKGN1cnNvclBvc2l0aW9uKSBpZiBjdXJzb3JQb3NpdGlvblxuICAgICAgY3Vyc29yUG9zaXRpb24gPSBudWxsXG5cbiAgIyBQdWJsaWM6IEdldCB0aGUgY3VycmVudCB7R3JhbW1hcn0gb2YgdGhpcyBlZGl0b3IuXG4gIGdldEdyYW1tYXI6IC0+XG4gICAgQGRpc3BsYXlCdWZmZXIuZ2V0R3JhbW1hcigpXG5cbiAgIyBQdWJsaWM6IFNldCB0aGUgY3VycmVudCB7R3JhbW1hcn0gb2YgdGhpcyBlZGl0b3IuXG4gICNcbiAgIyBBc3NpZ25pbmcgYSBncmFtbWFyIHdpbGwgY2F1c2UgdGhlIGVkaXRvciB0byByZS10b2tlbml6ZSBiYXNlZCBvbiB0aGUgbmV3XG4gICMgZ3JhbW1hci5cbiAgc2V0R3JhbW1hcjogKGdyYW1tYXIpIC0+XG4gICAgQGRpc3BsYXlCdWZmZXIuc2V0R3JhbW1hcihncmFtbWFyKVxuXG4gICMgUmVsb2FkIHRoZSBncmFtbWFyIGJhc2VkIG9uIHRoZSBmaWxlIG5hbWUuXG4gIHJlbG9hZEdyYW1tYXI6IC0+XG4gICAgQGRpc3BsYXlCdWZmZXIucmVsb2FkR3JhbW1hcigpXG5cbiAgc2hvdWxkQXV0b0luZGVudDogLT5cbiAgICBhdG9tLmNvbmZpZy5nZXQoXCJlZGl0b3IuYXV0b0luZGVudFwiKVxuXG4gICMgUHVibGljOiBCYXRjaCBtdWx0aXBsZSBvcGVyYXRpb25zIGFzIGEgc2luZ2xlIHVuZG8vcmVkbyBzdGVwLlxuICAjXG4gICMgQW55IGdyb3VwIG9mIG9wZXJhdGlvbnMgdGhhdCBhcmUgbG9naWNhbGx5IGdyb3VwZWQgZnJvbSB0aGUgcGVyc3BlY3RpdmUgb2ZcbiAgIyB1bmRvaW5nIGFuZCByZWRvaW5nIHNob3VsZCBiZSBwZXJmb3JtZWQgaW4gYSB0cmFuc2FjdGlvbi4gSWYgeW91IHdhbnQgdG9cbiAgIyBhYm9ydCB0aGUgdHJhbnNhY3Rpb24sIGNhbGwgezo6YWJvcnRUcmFuc2FjdGlvbn0gdG8gdGVybWluYXRlIHRoZSBmdW5jdGlvbidzXG4gICMgZXhlY3V0aW9uIGFuZCByZXZlcnQgYW55IGNoYW5nZXMgcGVyZm9ybWVkIHVwIHRvIHRoZSBhYm9ydGlvbi5cbiAgI1xuICAjIGZuIC0gQSB7RnVuY3Rpb259IHRvIGNhbGwgaW5zaWRlIHRoZSB0cmFuc2FjdGlvbi5cbiAgdHJhbnNhY3Q6IChmbikgLT5cbiAgICBAYmF0Y2hVcGRhdGVzID0+XG4gICAgICBAYnVmZmVyLnRyYW5zYWN0KGZuKVxuXG4gICMgUHVibGljOiBTdGFydCBhbiBvcGVuLWVuZGVkIHRyYW5zYWN0aW9uLlxuICAjXG4gICMgQ2FsbCB7Ojpjb21taXRUcmFuc2FjdGlvbn0gb3Igezo6YWJvcnRUcmFuc2FjdGlvbn0gdG8gdGVybWluYXRlIHRoZVxuICAjIHRyYW5zYWN0aW9uLiBJZiB5b3UgbmVzdCBjYWxscyB0byB0cmFuc2FjdGlvbnMsIG9ubHkgdGhlIG91dGVybW9zdFxuICAjIHRyYW5zYWN0aW9uIGlzIGNvbnNpZGVyZWQuIFlvdSBtdXN0IG1hdGNoIGV2ZXJ5IGJlZ2luIHdpdGggYSBtYXRjaGluZ1xuICAjIGNvbW1pdCwgYnV0IGEgc2luZ2xlIGNhbGwgdG8gYWJvcnQgd2lsbCBjYW5jZWwgYWxsIG5lc3RlZCB0cmFuc2FjdGlvbnMuXG4gIGJlZ2luVHJhbnNhY3Rpb246IC0+IEBidWZmZXIuYmVnaW5UcmFuc2FjdGlvbigpXG5cbiAgIyBQdWJsaWM6IENvbW1pdCBhbiBvcGVuLWVuZGVkIHRyYW5zYWN0aW9uIHN0YXJ0ZWQgd2l0aCB7OjpiZWdpblRyYW5zYWN0aW9ufVxuICAjIGFuZCBwdXNoIGl0IHRvIHRoZSB1bmRvIHN0YWNrLlxuICAjXG4gICMgSWYgdHJhbnNhY3Rpb25zIGFyZSBuZXN0ZWQsIG9ubHkgdGhlIG91dGVybW9zdCBjb21taXQgdGFrZXMgZWZmZWN0LlxuICBjb21taXRUcmFuc2FjdGlvbjogLT4gQGJ1ZmZlci5jb21taXRUcmFuc2FjdGlvbigpXG5cbiAgIyBQdWJsaWM6IEFib3J0IGFuIG9wZW4gdHJhbnNhY3Rpb24sIHVuZG9pbmcgYW55IG9wZXJhdGlvbnMgcGVyZm9ybWVkIHNvIGZhclxuICAjIHdpdGhpbiB0aGUgdHJhbnNhY3Rpb24uXG4gIGFib3J0VHJhbnNhY3Rpb246IC0+IEBidWZmZXIuYWJvcnRUcmFuc2FjdGlvbigpXG5cbiAgYmF0Y2hVcGRhdGVzOiAoZm4pIC0+XG4gICAgQGVtaXQgJ2JhdGNoZWQtdXBkYXRlcy1zdGFydGVkJ1xuICAgIHJlc3VsdCA9IGZuKClcbiAgICBAZW1pdCAnYmF0Y2hlZC11cGRhdGVzLWVuZGVkJ1xuICAgIHJlc3VsdFxuXG4gIGluc3BlY3Q6IC0+XG4gICAgXCI8RWRpdG9yICN7QGlkfT5cIlxuXG4gIGxvZ1NjcmVlbkxpbmVzOiAoc3RhcnQsIGVuZCkgLT4gQGRpc3BsYXlCdWZmZXIubG9nTGluZXMoc3RhcnQsIGVuZClcblxuICBoYW5kbGVHcmFtbWFyQ2hhbmdlOiAtPlxuICAgIEB1bmZvbGRBbGwoKVxuICAgIEBlbWl0ICdncmFtbWFyLWNoYW5nZWQnXG5cbiAgaGFuZGxlTWFya2VyQ3JlYXRlZDogKG1hcmtlcikgPT5cbiAgICBpZiBtYXJrZXIubWF0Y2hlc0F0dHJpYnV0ZXMoQGdldFNlbGVjdGlvbk1hcmtlckF0dHJpYnV0ZXMoKSlcbiAgICAgIEBhZGRTZWxlY3Rpb24obWFya2VyKVxuXG4gIGdldFNlbGVjdGlvbk1hcmtlckF0dHJpYnV0ZXM6IC0+XG4gICAgdHlwZTogJ3NlbGVjdGlvbicsIGVkaXRvcklkOiBAaWQsIGludmFsaWRhdGU6ICduZXZlcidcblxuICBnZXRWZXJ0aWNhbFNjcm9sbE1hcmdpbjogLT4gQGRpc3BsYXlCdWZmZXIuZ2V0VmVydGljYWxTY3JvbGxNYXJnaW4oKVxuICBzZXRWZXJ0aWNhbFNjcm9sbE1hcmdpbjogKHZlcnRpY2FsU2Nyb2xsTWFyZ2luKSAtPiBAZGlzcGxheUJ1ZmZlci5zZXRWZXJ0aWNhbFNjcm9sbE1hcmdpbih2ZXJ0aWNhbFNjcm9sbE1hcmdpbilcblxuICBnZXRIb3Jpem9udGFsU2Nyb2xsTWFyZ2luOiAtPiBAZGlzcGxheUJ1ZmZlci5nZXRIb3Jpem9udGFsU2Nyb2xsTWFyZ2luKClcbiAgc2V0SG9yaXpvbnRhbFNjcm9sbE1hcmdpbjogKGhvcml6b250YWxTY3JvbGxNYXJnaW4pIC0+IEBkaXNwbGF5QnVmZmVyLnNldEhvcml6b250YWxTY3JvbGxNYXJnaW4oaG9yaXpvbnRhbFNjcm9sbE1hcmdpbilcblxuICBnZXRMaW5lSGVpZ2h0OiAtPiBAZGlzcGxheUJ1ZmZlci5nZXRMaW5lSGVpZ2h0KClcbiAgc2V0TGluZUhlaWdodDogKGxpbmVIZWlnaHQpIC0+IEBkaXNwbGF5QnVmZmVyLnNldExpbmVIZWlnaHQobGluZUhlaWdodClcblxuICBnZXRTY29wZWRDaGFyV2lkdGg6IChzY29wZU5hbWVzLCBjaGFyKSAtPiBAZGlzcGxheUJ1ZmZlci5nZXRTY29wZWRDaGFyV2lkdGgoc2NvcGVOYW1lcywgY2hhcilcbiAgc2V0U2NvcGVkQ2hhcldpZHRoOiAoc2NvcGVOYW1lcywgY2hhciwgd2lkdGgpIC0+IEBkaXNwbGF5QnVmZmVyLnNldFNjb3BlZENoYXJXaWR0aChzY29wZU5hbWVzLCBjaGFyLCB3aWR0aClcblxuICBnZXRTY29wZWRDaGFyV2lkdGhzOiAoc2NvcGVOYW1lcykgLT4gQGRpc3BsYXlCdWZmZXIuZ2V0U2NvcGVkQ2hhcldpZHRocyhzY29wZU5hbWVzKVxuXG4gIGNsZWFyU2NvcGVkQ2hhcldpZHRoczogLT4gQGRpc3BsYXlCdWZmZXIuY2xlYXJTY29wZWRDaGFyV2lkdGhzKClcblxuICBnZXREZWZhdWx0Q2hhcldpZHRoOiAtPiBAZGlzcGxheUJ1ZmZlci5nZXREZWZhdWx0Q2hhcldpZHRoKClcbiAgc2V0RGVmYXVsdENoYXJXaWR0aDogKGRlZmF1bHRDaGFyV2lkdGgpIC0+IEBkaXNwbGF5QnVmZmVyLnNldERlZmF1bHRDaGFyV2lkdGgoZGVmYXVsdENoYXJXaWR0aClcblxuICBzZXRIZWlnaHQ6IChoZWlnaHQpIC0+IEBkaXNwbGF5QnVmZmVyLnNldEhlaWdodChoZWlnaHQpXG4gIGdldEhlaWdodDogLT4gQGRpc3BsYXlCdWZmZXIuZ2V0SGVpZ2h0KClcblxuICBzZXRXaWR0aDogKHdpZHRoKSAtPiBAZGlzcGxheUJ1ZmZlci5zZXRXaWR0aCh3aWR0aClcbiAgZ2V0V2lkdGg6IC0+IEBkaXNwbGF5QnVmZmVyLmdldFdpZHRoKClcblxuICBnZXRTY3JvbGxUb3A6IC0+IEBkaXNwbGF5QnVmZmVyLmdldFNjcm9sbFRvcCgpXG4gIHNldFNjcm9sbFRvcDogKHNjcm9sbFRvcCkgLT4gQGRpc3BsYXlCdWZmZXIuc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcClcblxuICBnZXRTY3JvbGxCb3R0b206IC0+IEBkaXNwbGF5QnVmZmVyLmdldFNjcm9sbEJvdHRvbSgpXG4gIHNldFNjcm9sbEJvdHRvbTogKHNjcm9sbEJvdHRvbSkgLT4gQGRpc3BsYXlCdWZmZXIuc2V0U2Nyb2xsQm90dG9tKHNjcm9sbEJvdHRvbSlcblxuICBnZXRTY3JvbGxMZWZ0OiAtPiBAZGlzcGxheUJ1ZmZlci5nZXRTY3JvbGxMZWZ0KClcbiAgc2V0U2Nyb2xsTGVmdDogKHNjcm9sbExlZnQpIC0+IEBkaXNwbGF5QnVmZmVyLnNldFNjcm9sbExlZnQoc2Nyb2xsTGVmdClcblxuICBnZXRTY3JvbGxSaWdodDogLT4gQGRpc3BsYXlCdWZmZXIuZ2V0U2Nyb2xsUmlnaHQoKVxuICBzZXRTY3JvbGxSaWdodDogKHNjcm9sbFJpZ2h0KSAtPiBAZGlzcGxheUJ1ZmZlci5zZXRTY3JvbGxSaWdodChzY3JvbGxSaWdodClcblxuICBnZXRTY3JvbGxIZWlnaHQ6IC0+IEBkaXNwbGF5QnVmZmVyLmdldFNjcm9sbEhlaWdodCgpXG4gIGdldFNjcm9sbFdpZHRoOiAoc2Nyb2xsV2lkdGgpIC0+IEBkaXNwbGF5QnVmZmVyLmdldFNjcm9sbFdpZHRoKHNjcm9sbFdpZHRoKVxuXG4gIGdldFZpc2libGVSb3dSYW5nZTogLT4gQGRpc3BsYXlCdWZmZXIuZ2V0VmlzaWJsZVJvd1JhbmdlKClcblxuICBpbnRlcnNlY3RzVmlzaWJsZVJvd1JhbmdlOiAoc3RhcnRSb3csIGVuZFJvdykgLT4gQGRpc3BsYXlCdWZmZXIuaW50ZXJzZWN0c1Zpc2libGVSb3dSYW5nZShzdGFydFJvdywgZW5kUm93KVxuXG4gIHNlbGVjdGlvbkludGVyc2VjdHNWaXNpYmxlUm93UmFuZ2U6IChzZWxlY3Rpb24pIC0+IEBkaXNwbGF5QnVmZmVyLnNlbGVjdGlvbkludGVyc2VjdHNWaXNpYmxlUm93UmFuZ2Uoc2VsZWN0aW9uKVxuXG4gIHBpeGVsUG9zaXRpb25Gb3JTY3JlZW5Qb3NpdGlvbjogKHNjcmVlblBvc2l0aW9uKSAtPiBAZGlzcGxheUJ1ZmZlci5waXhlbFBvc2l0aW9uRm9yU2NyZWVuUG9zaXRpb24oc2NyZWVuUG9zaXRpb24pXG5cbiAgcGl4ZWxQb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uOiAoYnVmZmVyUG9zaXRpb24pIC0+IEBkaXNwbGF5QnVmZmVyLnBpeGVsUG9zaXRpb25Gb3JCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcblxuICBzY3JlZW5Qb3NpdGlvbkZvclBpeGVsUG9zaXRpb246IChwaXhlbFBvc2l0aW9uKSAtPiBAZGlzcGxheUJ1ZmZlci5zY3JlZW5Qb3NpdGlvbkZvclBpeGVsUG9zaXRpb24ocGl4ZWxQb3NpdGlvbilcblxuICBwaXhlbFJlY3RGb3JTY3JlZW5SYW5nZTogKHNjcmVlblJhbmdlKSAtPiBAZGlzcGxheUJ1ZmZlci5waXhlbFJlY3RGb3JTY3JlZW5SYW5nZShzY3JlZW5SYW5nZSlcblxuICBzY3JvbGxUb1NjcmVlblJhbmdlOiAoc2NyZWVuUmFuZ2UpIC0+IEBkaXNwbGF5QnVmZmVyLnNjcm9sbFRvU2NyZWVuUmFuZ2Uoc2NyZWVuUmFuZ2UpXG5cbiAgc2Nyb2xsVG9TY3JlZW5Qb3NpdGlvbjogKHNjcmVlblBvc2l0aW9uKSAtPiBAZGlzcGxheUJ1ZmZlci5zY3JvbGxUb1NjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uKVxuXG4gIHNjcm9sbFRvQnVmZmVyUG9zaXRpb246IChidWZmZXJQb3NpdGlvbikgLT4gQGRpc3BsYXlCdWZmZXIuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcblxuICAjIERlcHJlY2F0ZWQ6IENhbGwgezo6am9pbkxpbmVzfSBpbnN0ZWFkLlxuICBqb2luTGluZTogLT5cbiAgICBkZXByZWNhdGUoXCJVc2UgRWRpdG9yOjpqb2luTGluZXMoKSBpbnN0ZWFkXCIpXG4gICAgQGpvaW5MaW5lcygpXG4iXX0=
