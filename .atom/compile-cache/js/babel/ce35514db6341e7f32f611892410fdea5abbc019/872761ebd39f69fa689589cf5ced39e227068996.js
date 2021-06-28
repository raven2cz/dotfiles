Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _sbEventKit = require('sb-event-kit');

var _helpers = require('./helpers');

// NOTE:
// We don't *need* to add the intentions:hide command
// But we're doing it anyway because it helps us keep the code clean
// And can also be used by any other package to fully control this package

// List of core commands we allow during the list, everything else closes it
var CORE_COMMANDS = new Set(['core:move-up', 'core:move-down', 'core:page-up', 'core:page-down', 'core:move-to-top', 'core:move-to-bottom']);

var Commands = (function () {
  function Commands() {
    _classCallCheck(this, Commands);

    this.active = null;
    this.emitter = new _sbEventKit.Emitter();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(Commands, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
        'intentions:show': function intentionsShow(e) {
          if (_this.active && _this.active.type === 'list') {
            return;
          }
          var subscriptions = new _sbEventKit.CompositeDisposable();
          _this.processListShow(subscriptions);

          if (!e.originalEvent || e.originalEvent.type !== 'keydown') {
            return;
          }

          setImmediate(function () {
            var matched = true;

            subscriptions.add(atom.keymaps.onDidMatchBinding(function (_ref) {
              var binding = _ref.binding;

              matched = matched && CORE_COMMANDS.has(binding.command);
            }));
            subscriptions.add((0, _disposableEvent2['default'])(document.body, 'keyup', function () {
              if (matched) {
                return;
              }
              subscriptions.dispose();
              _this.processListHide();
            }));
          });
        },
        'intentions:hide': function intentionsHide() {
          _this.processListHide();
        },
        'intentions:highlight': function intentionsHighlight(e) {
          if (_this.active && _this.active.type === 'highlight') {
            return;
          }
          var subscriptions = new _sbEventKit.CompositeDisposable();
          _this.processHighlightsShow(subscriptions);

          if (!e.originalEvent || e.originalEvent.type !== 'keydown') {
            return;
          }
          var keyCode = e.originalEvent.keyCode;
          subscriptions.add((0, _disposableEvent2['default'])(document.body, 'keyup', function (upE) {
            if (upE.keyCode !== keyCode) {
              return;
            }
            subscriptions.dispose();
            _this.processHighlightsHide();
          }));
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor.intentions-list:not([mini])', {
        'intentions:confirm': (0, _helpers.stoppingEvent)(function () {
          _this.processListConfirm();
        }),
        'core:move-up': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('up');
        }),
        'core:move-down': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('down');
        }),
        'core:page-up': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('page-up');
        }),
        'core:page-down': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('page-down');
        }),
        'core:move-to-top': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('move-to-top');
        }),
        'core:move-to-bottom': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('move-to-bottom');
        })
      }));
    }
  }, {
    key: 'processListShow',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      var subscription = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.active) {
        switch (this.active.type) {
          case 'list':
            throw new Error('Already active');
          case 'highlight':
            this.processHighlightsHide();
            break;
          default:
        }
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) return;
      var editorElement = atom.views.getView(editor);
      var subscriptions = new _sbEventKit.CompositeDisposable();
      if (subscription) {
        subscriptions.add(subscription);
      }

      if (!(yield this.shouldListShow(editor))) {
        return;
      }
      this.active = { type: 'list', subscriptions: subscriptions };
      subscriptions.add(function () {
        if (_this2.active && _this2.active.type === 'list' && _this2.active.subscriptions === subscriptions) {
          _this2.processListHide();
          _this2.active = null;
        }
        editorElement.classList.remove('intentions-list');
      });
      subscriptions.add((0, _disposableEvent2['default'])(document.body, 'mouseup', function () {
        setTimeout(function () {
          subscriptions.dispose();
        }, 10);
      }));
      editorElement.classList.add('intentions-list');
    })
  }, {
    key: 'processListHide',
    value: function processListHide() {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      var subscriptions = this.active.subscriptions;
      this.active = null;
      subscriptions.dispose();
      this.emitter.emit('list-hide');
    }
  }, {
    key: 'processListMove',
    value: function processListMove(movement) {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      this.emitter.emit('list-move', movement);
    }
  }, {
    key: 'processListConfirm',
    value: function processListConfirm() {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      this.emitter.emit('list-confirm');
    }
  }, {
    key: 'processHighlightsShow',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      var subscription = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (this.active) {
        switch (this.active.type) {
          case 'highlight':
            throw new Error('Already active');
          case 'list':
            this.processListHide();
            break;
          default:
        }
      }
      var editor = atom.workspace.getActiveTextEditor();
      if (!editor) return;
      var editorElement = atom.views.getView(editor);
      var subscriptions = new _sbEventKit.CompositeDisposable();
      var shouldProcess = yield this.shouldHighlightsShow(editor);
      if (subscription) {
        subscriptions.add(subscription);
      }

      if (!shouldProcess) {
        return;
      }
      this.active = { type: 'highlight', subscriptions: subscriptions };
      subscriptions.add(function () {
        if (_this3.active && _this3.active.type === 'highlight' && _this3.active.subscriptions === subscriptions) {
          _this3.processHighlightsHide();
        }
        editorElement.classList.remove('intentions-highlights');
      });
      editorElement.classList.add('intentions-highlights');
    })
  }, {
    key: 'processHighlightsHide',
    value: function processHighlightsHide() {
      if (!this.active || this.active.type !== 'highlight') {
        return;
      }
      var subscriptions = this.active.subscriptions;
      this.active = null;
      subscriptions.dispose();
      this.emitter.emit('highlights-hide');
    }
  }, {
    key: 'shouldListShow',
    value: _asyncToGenerator(function* (editor) {
      var event = { show: false, editor: editor };
      yield this.emitter.emit('list-show', event);
      return event.show;
    })
  }, {
    key: 'shouldHighlightsShow',
    value: _asyncToGenerator(function* (editor) {
      var event = { show: false, editor: editor };
      yield this.emitter.emit('highlights-show', event);
      return event.show;
    })
  }, {
    key: 'onListShow',
    value: function onListShow(callback) {
      return this.emitter.on('list-show', function (event) {
        return callback(event.editor).then(function (result) {
          event.show = !!result;
        });
      });
    }
  }, {
    key: 'onListHide',
    value: function onListHide(callback) {
      return this.emitter.on('list-hide', callback);
    }
  }, {
    key: 'onListMove',
    value: function onListMove(callback) {
      return this.emitter.on('list-move', callback);
    }
  }, {
    key: 'onListConfirm',
    value: function onListConfirm(callback) {
      return this.emitter.on('list-confirm', callback);
    }
  }, {
    key: 'onHighlightsShow',
    value: function onHighlightsShow(callback) {
      return this.emitter.on('highlights-show', function (event) {
        return callback(event.editor).then(function (result) {
          event.show = !!result;
        });
      });
    }
  }, {
    key: 'onHighlightsHide',
    value: function onHighlightsHide(callback) {
      return this.emitter.on('highlights-hide', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.active) {
        this.active.subscriptions.dispose();
      }
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9jb21tYW5kcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7K0JBRTRCLGtCQUFrQjs7OzswQkFDVyxjQUFjOzt1QkFHekMsV0FBVzs7Ozs7Ozs7QUFTekMsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQTs7SUFFekgsUUFBUTtBQVFoQixXQVJRLFFBQVEsR0FRYjswQkFSSyxRQUFROztBQVN6QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQWRrQixRQUFROztXQWVuQixvQkFBRzs7O0FBQ1QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUU7QUFDdkUseUJBQWlCLEVBQUUsd0JBQUMsQ0FBQyxFQUFLO0FBQ3hCLGNBQUksTUFBSyxNQUFNLElBQUksTUFBSyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUM5QyxtQkFBTTtXQUNQO0FBQ0QsY0FBTSxhQUFhLEdBQUcscUNBQXlCLENBQUE7QUFDL0MsZ0JBQUssZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFBOztBQUVuQyxjQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7QUFDMUQsbUJBQU07V0FDUDs7QUFFRCxzQkFBWSxDQUFDLFlBQU07QUFDakIsZ0JBQUksT0FBTyxHQUFHLElBQUksQ0FBQTs7QUFFbEIseUJBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFTLElBQVcsRUFBRTtrQkFBWCxPQUFPLEdBQVQsSUFBVyxDQUFULE9BQU87O0FBQ2pFLHFCQUFPLEdBQUcsT0FBTyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2FBQ3hELENBQUMsQ0FBQyxDQUFBO0FBQ0gseUJBQWEsQ0FBQyxHQUFHLENBQUMsa0NBQWdCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFlBQU07QUFDOUQsa0JBQUksT0FBTyxFQUFFO0FBQ1gsdUJBQU07ZUFDUDtBQUNELDJCQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdkIsb0JBQUssZUFBZSxFQUFFLENBQUE7YUFDdkIsQ0FBQyxDQUFDLENBQUE7V0FDSixDQUFDLENBQUE7U0FDSDtBQUNELHlCQUFpQixFQUFFLDBCQUFNO0FBQ3ZCLGdCQUFLLGVBQWUsRUFBRSxDQUFBO1NBQ3ZCO0FBQ0QsOEJBQXNCLEVBQUUsNkJBQUMsQ0FBQyxFQUFLO0FBQzdCLGNBQUksTUFBSyxNQUFNLElBQUksTUFBSyxNQUFNLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtBQUNuRCxtQkFBTTtXQUNQO0FBQ0QsY0FBTSxhQUFhLEdBQUcscUNBQXlCLENBQUE7QUFDL0MsZ0JBQUsscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUE7O0FBRXpDLGNBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUMxRCxtQkFBTTtXQUNQO0FBQ0QsY0FBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUE7QUFDdkMsdUJBQWEsQ0FBQyxHQUFHLENBQUMsa0NBQWdCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQUMsR0FBRyxFQUFLO0FBQ2pFLGdCQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssT0FBTyxFQUFFO0FBQzNCLHFCQUFNO2FBQ1A7QUFDRCx5QkFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3ZCLGtCQUFLLHFCQUFxQixFQUFFLENBQUE7V0FDN0IsQ0FBQyxDQUFDLENBQUE7U0FDSjtPQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsOENBQThDLEVBQUU7QUFDdkYsNEJBQW9CLEVBQUUsNEJBQWMsWUFBTTtBQUN4QyxnQkFBSyxrQkFBa0IsRUFBRSxDQUFBO1NBQzFCLENBQUM7QUFDRixzQkFBYyxFQUFFLDRCQUFjLFlBQU07QUFDbEMsZ0JBQUssZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzNCLENBQUM7QUFDRix3QkFBZ0IsRUFBRSw0QkFBYyxZQUFNO0FBQ3BDLGdCQUFLLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQTtTQUM3QixDQUFDO0FBQ0Ysc0JBQWMsRUFBRSw0QkFBYyxZQUFNO0FBQ2xDLGdCQUFLLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtTQUNoQyxDQUFDO0FBQ0Ysd0JBQWdCLEVBQUUsNEJBQWMsWUFBTTtBQUNwQyxnQkFBSyxlQUFlLENBQUMsV0FBVyxDQUFDLENBQUE7U0FDbEMsQ0FBQztBQUNGLDBCQUFrQixFQUFFLDRCQUFjLFlBQU07QUFDdEMsZ0JBQUssZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1NBQ3BDLENBQUM7QUFDRiw2QkFBcUIsRUFBRSw0QkFBYyxZQUFNO0FBQ3pDLGdCQUFLLGVBQWUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO1NBQ3ZDLENBQUM7T0FDSCxDQUFDLENBQUMsQ0FBQTtLQUNKOzs7NkJBQ29CLGFBQTJEOzs7VUFBMUQsWUFBaUQseURBQUcsSUFBSTs7QUFDNUUsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsZ0JBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO0FBQ3RCLGVBQUssTUFBTTtBQUNULGtCQUFNLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFBQSxBQUNuQyxlQUFLLFdBQVc7QUFDZCxnQkFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUE7QUFDNUIsa0JBQUs7QUFBQSxBQUNQLGtCQUFRO1NBQ1Q7T0FDRjtBQUNELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUNuRCxVQUFJLENBQUMsTUFBTSxFQUFFLE9BQU07QUFDbkIsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEQsVUFBTSxhQUFhLEdBQUcscUNBQXlCLENBQUE7QUFDL0MsVUFBSSxZQUFZLEVBQUU7QUFDaEIscUJBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7T0FDaEM7O0FBRUQsVUFBSSxFQUFDLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQSxFQUFFO0FBQ3RDLGVBQU07T0FDUDtBQUNELFVBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBYixhQUFhLEVBQUUsQ0FBQTtBQUM3QyxtQkFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ3RCLFlBQUksT0FBSyxNQUFNLElBQUksT0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sSUFBSSxPQUFLLE1BQU0sQ0FBQyxhQUFhLEtBQUssYUFBYSxFQUFFO0FBQzdGLGlCQUFLLGVBQWUsRUFBRSxDQUFBO0FBQ3RCLGlCQUFLLE1BQU0sR0FBRyxJQUFJLENBQUE7U0FDbkI7QUFDRCxxQkFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtPQUNsRCxDQUFDLENBQUE7QUFDRixtQkFBYSxDQUFDLEdBQUcsQ0FBQyxrQ0FBZ0IsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsWUFBVztBQUNyRSxrQkFBVSxDQUFDLFlBQVc7QUFDcEIsdUJBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUN4QixFQUFFLEVBQUUsQ0FBQyxDQUFBO09BQ1AsQ0FBQyxDQUFDLENBQUE7QUFDSCxtQkFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtLQUMvQzs7O1dBQ2MsMkJBQUc7QUFDaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO0FBQy9DLGVBQU07T0FDUDtBQUNELFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFBO0FBQy9DLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2xCLG1CQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7S0FDL0I7OztXQUNjLHlCQUFDLFFBQXNCLEVBQUU7QUFDdEMsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO0FBQy9DLGVBQU07T0FDUDtBQUNELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN6Qzs7O1dBQ2lCLDhCQUFHO0FBQ25CLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUMvQyxlQUFNO09BQ1A7QUFDRCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtLQUNsQzs7OzZCQUMwQixhQUEyRDs7O1VBQTFELFlBQWlELHlEQUFHLElBQUk7O0FBQ2xGLFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLGdCQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTtBQUN0QixlQUFLLFdBQVc7QUFDZCxrQkFBTSxJQUFJLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQUEsQUFDbkMsZUFBSyxNQUFNO0FBQ1QsZ0JBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUN0QixrQkFBSztBQUFBLEFBQ1Asa0JBQVE7U0FDVDtPQUNGO0FBQ0QsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ25ELFVBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTTtBQUNuQixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoRCxVQUFNLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTtBQUMvQyxVQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM3RCxVQUFJLFlBQVksRUFBRTtBQUNoQixxQkFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtPQUNoQzs7QUFFRCxVQUFJLENBQUMsYUFBYSxFQUFFO0FBQ2xCLGVBQU07T0FDUDtBQUNELFVBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBYixhQUFhLEVBQUUsQ0FBQTtBQUNsRCxtQkFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFNO0FBQ3RCLFlBQUksT0FBSyxNQUFNLElBQUksT0FBSyxNQUFNLENBQUMsSUFBSSxLQUFLLFdBQVcsSUFBSSxPQUFLLE1BQU0sQ0FBQyxhQUFhLEtBQUssYUFBYSxFQUFFO0FBQ2xHLGlCQUFLLHFCQUFxQixFQUFFLENBQUE7U0FDN0I7QUFDRCxxQkFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtPQUN4RCxDQUFDLENBQUE7QUFDRixtQkFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtLQUNyRDs7O1dBQ29CLGlDQUFHO0FBQ3RCLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtBQUNwRCxlQUFNO09BQ1A7QUFDRCxVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQTtBQUMvQyxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixtQkFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ3ZCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7S0FDckM7Ozs2QkFDbUIsV0FBQyxNQUFrQixFQUFvQjtBQUN6RCxVQUFNLEtBQUssR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFBO0FBQ3JDLFlBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzNDLGFBQU8sS0FBSyxDQUFDLElBQUksQ0FBQTtLQUNsQjs7OzZCQUN5QixXQUFDLE1BQWtCLEVBQW9CO0FBQy9ELFVBQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUE7QUFDckMsWUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUNqRCxhQUFPLEtBQUssQ0FBQyxJQUFJLENBQUE7S0FDbEI7OztXQUNTLG9CQUFDLFFBQW9ELEVBQUU7QUFDL0QsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBUyxLQUFLLEVBQUU7QUFDbEQsZUFBTyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUNsRCxlQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUE7U0FDdEIsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBO0tBQ0g7OztXQUNTLG9CQUFDLFFBQXFCLEVBQUU7QUFDaEMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDOUM7OztXQUNTLG9CQUFDLFFBQTJDLEVBQUU7QUFDdEQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDOUM7OztXQUNZLHVCQUFDLFFBQXFCLEVBQUU7QUFDbkMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDakQ7OztXQUNlLDBCQUFDLFFBQW9ELEVBQUU7QUFDckUsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFTLEtBQUssRUFBRTtBQUN4RCxlQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsTUFBTSxFQUFFO0FBQ2xELGVBQUssQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQTtTQUN0QixDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7S0FDSDs7O1dBQ2UsMEJBQUMsUUFBcUIsRUFBRTtBQUN0QyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3BEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsWUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDcEM7S0FDRjs7O1NBdE9rQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgZGlzcG9zYWJsZUV2ZW50IGZyb20gJ2Rpc3Bvc2FibGUtZXZlbnQnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnc2ItZXZlbnQta2l0J1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IHsgc3RvcHBpbmdFdmVudCB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGlzdE1vdmVtZW50IH0gZnJvbSAnLi90eXBlcydcblxuLy8gTk9URTpcbi8vIFdlIGRvbid0ICpuZWVkKiB0byBhZGQgdGhlIGludGVudGlvbnM6aGlkZSBjb21tYW5kXG4vLyBCdXQgd2UncmUgZG9pbmcgaXQgYW55d2F5IGJlY2F1c2UgaXQgaGVscHMgdXMga2VlcCB0aGUgY29kZSBjbGVhblxuLy8gQW5kIGNhbiBhbHNvIGJlIHVzZWQgYnkgYW55IG90aGVyIHBhY2thZ2UgdG8gZnVsbHkgY29udHJvbCB0aGlzIHBhY2thZ2VcblxuLy8gTGlzdCBvZiBjb3JlIGNvbW1hbmRzIHdlIGFsbG93IGR1cmluZyB0aGUgbGlzdCwgZXZlcnl0aGluZyBlbHNlIGNsb3NlcyBpdFxuY29uc3QgQ09SRV9DT01NQU5EUyA9IG5ldyBTZXQoWydjb3JlOm1vdmUtdXAnLCAnY29yZTptb3ZlLWRvd24nLCAnY29yZTpwYWdlLXVwJywgJ2NvcmU6cGFnZS1kb3duJywgJ2NvcmU6bW92ZS10by10b3AnLCAnY29yZTptb3ZlLXRvLWJvdHRvbSddKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kcyB7XG4gIGFjdGl2ZTogP3tcbiAgICB0eXBlOiAnbGlzdCcgfCAnaGlnaGxpZ2h0JyxcbiAgICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlLFxuICB9O1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJywge1xuICAgICAgJ2ludGVudGlvbnM6c2hvdyc6IChlKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiB0aGlzLmFjdGl2ZS50eXBlID09PSAnbGlzdCcpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0U2hvdyhzdWJzY3JpcHRpb25zKVxuXG4gICAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50IHx8IGUub3JpZ2luYWxFdmVudC50eXBlICE9PSAna2V5ZG93bicpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgICAgICAgbGV0IG1hdGNoZWQgPSB0cnVlXG5cbiAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmtleW1hcHMub25EaWRNYXRjaEJpbmRpbmcoZnVuY3Rpb24oeyBiaW5kaW5nIH0pIHtcbiAgICAgICAgICAgIG1hdGNoZWQgPSBtYXRjaGVkICYmIENPUkVfQ09NTUFORFMuaGFzKGJpbmRpbmcuY29tbWFuZClcbiAgICAgICAgICB9KSlcbiAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChkaXNwb3NhYmxlRXZlbnQoZG9jdW1lbnQuYm9keSwgJ2tleXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICAgIH0pKVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgICdpbnRlbnRpb25zOmhpZGUnOiAoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIH0sXG4gICAgICAnaW50ZW50aW9uczpoaWdobGlnaHQnOiAoZSkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmUgJiYgdGhpcy5hY3RpdmUudHlwZSA9PT0gJ2hpZ2hsaWdodCcpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgICB0aGlzLnByb2Nlc3NIaWdobGlnaHRzU2hvdyhzdWJzY3JpcHRpb25zKVxuXG4gICAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50IHx8IGUub3JpZ2luYWxFdmVudC50eXBlICE9PSAna2V5ZG93bicpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBrZXlDb2RlID0gZS5vcmlnaW5hbEV2ZW50LmtleUNvZGVcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoZGlzcG9zYWJsZUV2ZW50KGRvY3VtZW50LmJvZHksICdrZXl1cCcsICh1cEUpID0+IHtcbiAgICAgICAgICBpZiAodXBFLmtleUNvZGUgIT09IGtleUNvZGUpIHtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgfSkpXG4gICAgICB9LFxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3IuaW50ZW50aW9ucy1saXN0Om5vdChbbWluaV0pJywge1xuICAgICAgJ2ludGVudGlvbnM6Y29uZmlybSc6IHN0b3BwaW5nRXZlbnQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOm1vdmUtdXAnOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdE1vdmUoJ3VwJylcbiAgICAgIH0pLFxuICAgICAgJ2NvcmU6bW92ZS1kb3duJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIH0pLFxuICAgICAgJ2NvcmU6cGFnZS11cCc6IHN0b3BwaW5nRXZlbnQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0TW92ZSgncGFnZS11cCcpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOnBhZ2UtZG93bic6IHN0b3BwaW5nRXZlbnQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0TW92ZSgncGFnZS1kb3duJylcbiAgICAgIH0pLFxuICAgICAgJ2NvcmU6bW92ZS10by10b3AnOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdE1vdmUoJ21vdmUtdG8tdG9wJylcbiAgICAgIH0pLFxuICAgICAgJ2NvcmU6bW92ZS10by1ib3R0b20nOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdE1vdmUoJ21vdmUtdG8tYm90dG9tJylcbiAgICAgIH0pLFxuICAgIH0pKVxuICB9XG4gIGFzeW5jIHByb2Nlc3NMaXN0U2hvdyhzdWJzY3JpcHRpb246ID8oQ29tcG9zaXRlRGlzcG9zYWJsZSB8IERpc3Bvc2FibGUpID0gbnVsbCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgc3dpdGNoICh0aGlzLmFjdGl2ZS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQWxyZWFkeSBhY3RpdmUnKVxuICAgICAgICBjYXNlICdoaWdobGlnaHQnOlxuICAgICAgICAgIHRoaXMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoIWVkaXRvcikgcmV0dXJuXG4gICAgY29uc3QgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb24pXG4gICAgfVxuXG4gICAgaWYgKCFhd2FpdCB0aGlzLnNob3VsZExpc3RTaG93KGVkaXRvcikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IHsgdHlwZTogJ2xpc3QnLCBzdWJzY3JpcHRpb25zIH1cbiAgICBzdWJzY3JpcHRpb25zLmFkZCgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUgJiYgdGhpcy5hY3RpdmUudHlwZSA9PT0gJ2xpc3QnICYmIHRoaXMuYWN0aXZlLnN1YnNjcmlwdGlvbnMgPT09IHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICAgIH1cbiAgICAgIGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaW50ZW50aW9ucy1saXN0JylcbiAgICB9KVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkKGRpc3Bvc2FibGVFdmVudChkb2N1bWVudC5ib2R5LCAnbW91c2V1cCcsIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0sIDEwKVxuICAgIH0pKVxuICAgIGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaW50ZW50aW9ucy1saXN0JylcbiAgfVxuICBwcm9jZXNzTGlzdEhpZGUoKSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSB8fCB0aGlzLmFjdGl2ZS50eXBlICE9PSAnbGlzdCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gdGhpcy5hY3RpdmUuc3Vic2NyaXB0aW9uc1xuICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xpc3QtaGlkZScpXG4gIH1cbiAgcHJvY2Vzc0xpc3RNb3ZlKG1vdmVtZW50OiBMaXN0TW92ZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlIHx8IHRoaXMuYWN0aXZlLnR5cGUgIT09ICdsaXN0Jykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsaXN0LW1vdmUnLCBtb3ZlbWVudClcbiAgfVxuICBwcm9jZXNzTGlzdENvbmZpcm0oKSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSB8fCB0aGlzLmFjdGl2ZS50eXBlICE9PSAnbGlzdCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGlzdC1jb25maXJtJylcbiAgfVxuICBhc3luYyBwcm9jZXNzSGlnaGxpZ2h0c1Nob3coc3Vic2NyaXB0aW9uOiA/KENvbXBvc2l0ZURpc3Bvc2FibGUgfCBEaXNwb3NhYmxlKSA9IG51bGwpIHtcbiAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgIHN3aXRjaCAodGhpcy5hY3RpdmUudHlwZSkge1xuICAgICAgICBjYXNlICdoaWdobGlnaHQnOlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQWxyZWFkeSBhY3RpdmUnKVxuICAgICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgKCFlZGl0b3IpIHJldHVyblxuICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgY29uc3Qgc2hvdWxkUHJvY2VzcyA9IGF3YWl0IHRoaXMuc2hvdWxkSGlnaGxpZ2h0c1Nob3coZWRpdG9yKVxuICAgIGlmIChzdWJzY3JpcHRpb24pIHtcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKHN1YnNjcmlwdGlvbilcbiAgICB9XG5cbiAgICBpZiAoIXNob3VsZFByb2Nlc3MpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IHsgdHlwZTogJ2hpZ2hsaWdodCcsIHN1YnNjcmlwdGlvbnMgfVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiB0aGlzLmFjdGl2ZS50eXBlID09PSAnaGlnaGxpZ2h0JyAmJiB0aGlzLmFjdGl2ZS5zdWJzY3JpcHRpb25zID09PSBzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgIH1cbiAgICAgIGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaW50ZW50aW9ucy1oaWdobGlnaHRzJylcbiAgICB9KVxuICAgIGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaW50ZW50aW9ucy1oaWdobGlnaHRzJylcbiAgfVxuICBwcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSB8fCB0aGlzLmFjdGl2ZS50eXBlICE9PSAnaGlnaGxpZ2h0Jykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmFjdGl2ZS5zdWJzY3JpcHRpb25zXG4gICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnaGlnaGxpZ2h0cy1oaWRlJylcbiAgfVxuICBhc3luYyBzaG91bGRMaXN0U2hvdyhlZGl0b3I6IFRleHRFZGl0b3IpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBldmVudCA9IHsgc2hvdzogZmFsc2UsIGVkaXRvciB9XG4gICAgYXdhaXQgdGhpcy5lbWl0dGVyLmVtaXQoJ2xpc3Qtc2hvdycsIGV2ZW50KVxuICAgIHJldHVybiBldmVudC5zaG93XG4gIH1cbiAgYXN5bmMgc2hvdWxkSGlnaGxpZ2h0c1Nob3coZWRpdG9yOiBUZXh0RWRpdG9yKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZXZlbnQgPSB7IHNob3c6IGZhbHNlLCBlZGl0b3IgfVxuICAgIGF3YWl0IHRoaXMuZW1pdHRlci5lbWl0KCdoaWdobGlnaHRzLXNob3cnLCBldmVudClcbiAgICByZXR1cm4gZXZlbnQuc2hvd1xuICB9XG4gIG9uTGlzdFNob3coY2FsbGJhY2s6ICgoZWRpdG9yOiBUZXh0RWRpdG9yKSA9PiBQcm9taXNlPGJvb2xlYW4+KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2xpc3Qtc2hvdycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZXZlbnQuZWRpdG9yKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBldmVudC5zaG93ID0gISFyZXN1bHRcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICBvbkxpc3RIaWRlKGNhbGxiYWNrOiAoKCkgPT4gYW55KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2xpc3QtaGlkZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uTGlzdE1vdmUoY2FsbGJhY2s6ICgobW92ZW1lbnQ6IExpc3RNb3ZlbWVudCkgPT4gYW55KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2xpc3QtbW92ZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uTGlzdENvbmZpcm0oY2FsbGJhY2s6ICgoKSA9PiBhbnkpKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignbGlzdC1jb25maXJtJywgY2FsbGJhY2spXG4gIH1cbiAgb25IaWdobGlnaHRzU2hvdyhjYWxsYmFjazogKChlZGl0b3I6IFRleHRFZGl0b3IpID0+IFByb21pc2U8Ym9vbGVhbj4pKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignaGlnaGxpZ2h0cy1zaG93JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhldmVudC5lZGl0b3IpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGV2ZW50LnNob3cgPSAhIXJlc3VsdFxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIG9uSGlnaGxpZ2h0c0hpZGUoY2FsbGJhY2s6ICgoKSA9PiBhbnkpKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignaGlnaGxpZ2h0cy1oaWRlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICB0aGlzLmFjdGl2ZS5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuIl19