function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _sbEventKit = require('sb-event-kit');

var _jasmineFix = require('jasmine-fix');

var _libCommands = require('../lib/commands');

var _libCommands2 = _interopRequireDefault(_libCommands);

var _helpers = require('./helpers');

describe('Commands', function () {
  var commands = undefined;
  var editorView = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    commands = new _libCommands2['default']();
    commands.activate();
    yield atom.workspace.open(__filename);
    editorView = atom.views.getView(atom.workspace.getActiveTextEditor());
  }));
  afterEach(function () {
    atom.workspace.destroyActivePane();
    commands.dispose();
  });
  function dispatchEventOnBody(event) {
    // $FlowIgnore: Document.body is never null in our case
    document.body.dispatchEvent(event);
  }

  describe('Highlights', function () {
    (0, _jasmineFix.it)('does nothing if not activated and we try to deactivate', function () {
      commands.processHighlightsHide();
    });
    (0, _jasmineFix.it)('does not activate unless provider tells it to', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(false);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(0);
    }));
    (0, _jasmineFix.it)('activates when the provider tells it to', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('throws if already highlighted', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onHighlightsShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onHighlightsHide(function () {
        timesHide++;
      });
      yield commands.processHighlightsShow();
      try {
        yield commands.processHighlightsShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processHighlightsShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      commands.processHighlightsHide();
      commands.processHighlightsHide();
      commands.processHighlightsHide();

      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes list if available', _asyncToGenerator(function* () {
      var disposed = false;
      var active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      active.subscriptions.add(function () {
        disposed = true;
      });
      commands.active = active;
      expect(disposed).toBe(false);
      yield commands.processHighlightsShow();
      expect(disposed).toBe(true);
    }));
    (0, _jasmineFix.it)('adds and removes classes appropriately', _asyncToGenerator(function* () {
      commands.onHighlightsShow(function () {
        return Promise.resolve(true);
      });
      expect(editorView.classList.contains('intentions-highlights')).toBe(false);
      yield commands.processHighlightsShow();
      expect(editorView.classList.contains('intentions-highlights')).toBe(true);
      commands.processHighlightsHide();
      expect(editorView.classList.contains('intentions-highlights')).toBe(false);
    }));
    describe('command listener', function () {
      (0, _jasmineFix.it)('just activates if theres no keyboard event attached', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.commands.dispatch(editorView, 'intentions:highlight');
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('ignores more than one activation requests', _asyncToGenerator(function* () {
        var timesShow = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes the keyboard listener when we dispose it with the class function', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        spyOn(commands, 'processHighlightsHide').andCallThrough();
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        expect(commands.processHighlightsHide.calls.length).toBe(1);
      }));
      (0, _jasmineFix.it)('just activates if keyboard event is not keydown', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('does not deactivate if keyup is not same keycode', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup', 1));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('does deactivate if keyup is the same keycode', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onHighlightsShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onHighlightsHide(function () {
          timesHide++;
        });
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        commands.processHighlightsHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
    });
  });
  describe('Lists', function () {
    (0, _jasmineFix.it)('does nothing if deactivated and we try to activate it', function () {
      commands.processListHide();
    });
    (0, _jasmineFix.it)('does not pass on move events if not activated', function () {
      var callback = jasmine.createSpy('commands:list-move');
      commands.onListMove(callback);
      commands.processListMove('up');
      commands.processListMove('down');
      commands.processListMove('down');
      expect(callback).not.toHaveBeenCalled();
    });
    (0, _jasmineFix.it)('passes on move events if activated', function () {
      var callback = jasmine.createSpy('commands:list-move');
      commands.onListMove(callback);
      commands.processListMove('down');
      commands.processListMove('down');
      commands.processListMove('down');
      commands.active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.processListMove('down');
      commands.processListMove('down');
      commands.processListMove('down');
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.length).toBe(3);
    });
    (0, _jasmineFix.it)('ignores confirm if not activated', function () {
      var callback = jasmine.createSpy('commands:list-confirm');
      commands.onListConfirm(callback);
      commands.processListConfirm();
      commands.processListConfirm();
      commands.processListConfirm();
      commands.processListConfirm();
      expect(callback).not.toHaveBeenCalled();
    });
    (0, _jasmineFix.it)('passes on confirm if activated', function () {
      var callback = jasmine.createSpy('commands:list-confirm');
      commands.onListConfirm(callback);
      commands.processListConfirm();
      commands.processListConfirm();
      commands.active = { type: 'list', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.processListConfirm();
      commands.processListConfirm();
      expect(callback).toHaveBeenCalled();
      expect(callback.calls.length).toBe(2);
    });
    (0, _jasmineFix.it)('does not activate if listeners dont say that', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(false);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(0);
    }));
    (0, _jasmineFix.it)('activates when listeners allow', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('ignores if list is already active', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      try {
        yield commands.processListShow();
        expect(false).toBe(true);
      } catch (error) {
        expect(error.message).toBe('Already active');
      }
      commands.processListHide();
      commands.processListHide();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes if highlights are active', _asyncToGenerator(function* () {
      var disposed = false;
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
      commands.active = { type: 'highlight', subscriptions: new _sbEventKit.CompositeDisposable() };
      commands.active.subscriptions.add(function () {
        disposed = true;
      });
      expect(disposed).toBe(false);
      yield commands.processListShow();
      commands.processListHide();
      expect(disposed).toBe(true);
      expect(timesShow).toBe(2);
      expect(timesHide).toBe(2);
    }));
    (0, _jasmineFix.it)('adds and removes classes appropriately', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      expect(editorView.classList.contains('intentions-list')).toBe(false);
      yield commands.processListShow();
      expect(editorView.classList.contains('intentions-list')).toBe(true);
      commands.processListHide();
      expect(editorView.classList.contains('intentions-list')).toBe(false);
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
    }));
    (0, _jasmineFix.it)('disposes list on mouseup', _asyncToGenerator(function* () {
      var timesShow = 0;
      var timesHide = 0;
      commands.onListShow(function () {
        timesShow++;
        return Promise.resolve(true);
      });
      commands.onListHide(function () {
        timesHide++;
      });
      yield commands.processListShow();
      commands.processListHide();
      expect(timesShow).toBe(1);
      expect(timesHide).toBe(1);
      yield commands.processListShow();
      dispatchEventOnBody(new MouseEvent('mouseup'));
      yield (0, _jasmineFix.wait)(10);
      expect(timesShow).toBe(2);
      expect(timesHide).toBe(2);
    }));
    describe('command listener', function () {
      (0, _jasmineFix.it)('just enables when no keyboard event', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.commands.dispatch(editorView, 'intentions:show');
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('just enables when keyboard event is not keydown', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes the keyboard listener when we dispose it with the class function', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        spyOn(commands, 'processListHide').andCallThrough();
        expect(timesShow).toBe(0);
        expect(timesHide).toBe(0);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
        expect(commands.processListHide.calls.length).toBe(1);
      }));
      (0, _jasmineFix.it)('ignores more than one activation requests', _asyncToGenerator(function* () {
        var timesShow = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keypress'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
      }));
      (0, _jasmineFix.it)('disposes itself on any commands other than known', _asyncToGenerator(function* () {
        var timesShow = 0;
        var timesHide = 0;
        commands.onListShow(function () {
          timesShow++;
          return Promise.resolve(true);
        });
        commands.onListHide(function () {
          timesHide++;
        });
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, (0, _helpers.getKeyboardEvent)('keydown'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-up' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-down' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(0);

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-confirm' } });
        yield (0, _jasmineFix.wait)(10);
        dispatchEventOnBody((0, _helpers.getKeyboardEvent)('keyup'));
        yield (0, _jasmineFix.wait)(10);
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);

        commands.processListHide();
        expect(timesShow).toBe(1);
        expect(timesHide).toBe(1);
      }));
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2JveC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL3NwZWMvY29tbWFuZHMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OzBCQUVvQyxjQUFjOzswQkFDYixhQUFhOzsyQkFDN0IsaUJBQWlCOzs7O3VCQUNMLFdBQVc7O0FBRTVDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsWUFBVztBQUM5QixNQUFJLFFBQVEsWUFBQSxDQUFBO0FBQ1osTUFBSSxVQUFVLFlBQUEsQ0FBQTs7QUFFZCxnREFBVyxhQUFpQjtBQUMxQixZQUFRLEdBQUcsOEJBQWMsQ0FBQTtBQUN6QixZQUFRLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDbkIsVUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUNyQyxjQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUE7R0FDdEUsRUFBQyxDQUFBO0FBQ0YsV0FBUyxDQUFDLFlBQVc7QUFDbkIsUUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0FBQ2xDLFlBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUNuQixDQUFDLENBQUE7QUFDRixXQUFTLG1CQUFtQixDQUFDLEtBQUssRUFBRTs7QUFFbEMsWUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7R0FDbkM7O0FBRUQsVUFBUSxDQUFDLFlBQVksRUFBRSxZQUFXO0FBQ2hDLHdCQUFHLHdEQUF3RCxFQUFFLFlBQVc7QUFDdEUsY0FBUSxDQUFDLHFCQUFxQixFQUFFLENBQUE7S0FDakMsQ0FBQyxDQUFBO0FBQ0Ysd0JBQUcsK0NBQStDLG9CQUFFLGFBQWlCO0FBQ25FLFVBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtBQUNqQixVQUFJLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDakIsY0FBUSxDQUFD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cy9zcGVjL2NvbW1hbmRzLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnc2ItZXZlbnQta2l0J1xuaW1wb3J0IHsgaXQsIGJlZm9yZUVhY2gsIHdhaXQgfSBmcm9tICdqYXNtaW5lLWZpeCdcbmltcG9ydCBDb21tYW5kcyBmcm9tICcuLi9saWIvY29tbWFuZHMnXG5pbXBvcnQgeyBnZXRLZXlib2FyZEV2ZW50IH0gZnJvbSAnLi9oZWxwZXJzJ1xuXG5kZXNjcmliZSgnQ29tbWFuZHMnLCBmdW5jdGlvbigpIHtcbiAgbGV0IGNvbW1hbmRzXG4gIGxldCBlZGl0b3JWaWV3XG5cbiAgYmVmb3JlRWFjaChhc3luYyBmdW5jdGlvbigpIHtcbiAgICBjb21tYW5kcyA9IG5ldyBDb21tYW5kcygpXG4gICAgY29tbWFuZHMuYWN0aXZhdGUoKVxuICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oX19maWxlbmFtZSlcbiAgICBlZGl0b3JWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgfSlcbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lKClcbiAgICBjb21tYW5kcy5kaXNwb3NlKClcbiAgfSlcbiAgZnVuY3Rpb24gZGlzcGF0Y2hFdmVudE9uQm9keShldmVudCkge1xuICAgIC8vICRGbG93SWdub3JlOiBEb2N1bWVudC5ib2R5IGlzIG5ldmVyIG51bGwgaW4gb3VyIGNhc2VcbiAgICBkb2N1bWVudC5ib2R5LmRpc3BhdGNoRXZlbnQoZXZlbnQpXG4gIH1cblxuICBkZXNjcmliZSgnSGlnaGxpZ2h0cycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdkb2VzIG5vdGhpbmcgaWYgbm90IGFjdGl2YXRlZCBhbmQgd2UgdHJ5IHRvIGRlYWN0aXZhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgfSlcbiAgICBpdCgnZG9lcyBub3QgYWN0aXZhdGUgdW5sZXNzIHByb3ZpZGVyIHRlbGxzIGl0IHRvJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcblxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgIH0pXG4gICAgaXQoJ2FjdGl2YXRlcyB3aGVuIHRoZSBwcm92aWRlciB0ZWxscyBpdCB0bycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcblxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ3Rocm93cyBpZiBhbHJlYWR5IGhpZ2hsaWdodGVkJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzU2hvdygpXG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0JlKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuICAgICAgICBleHBlY3QoZmFsc2UpLnRvQmUodHJ1ZSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGV4cGVjdChlcnJvci5tZXNzYWdlKS50b0JlKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICB9XG4gICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG5cbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdkaXNwb3NlcyBsaXN0IGlmIGF2YWlsYWJsZScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IGRpc3Bvc2VkID0gZmFsc2VcbiAgICAgIGNvbnN0IGFjdGl2ZSA9IHsgdHlwZTogJ2xpc3QnLCBzdWJzY3JpcHRpb25zOiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpIH1cbiAgICAgIGFjdGl2ZS5zdWJzY3JpcHRpb25zLmFkZChmdW5jdGlvbigpIHtcbiAgICAgICAgZGlzcG9zZWQgPSB0cnVlXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMuYWN0aXZlID0gYWN0aXZlXG4gICAgICBleHBlY3QoZGlzcG9zZWQpLnRvQmUoZmFsc2UpXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuICAgICAgZXhwZWN0KGRpc3Bvc2VkKS50b0JlKHRydWUpXG4gICAgfSlcbiAgICBpdCgnYWRkcyBhbmQgcmVtb3ZlcyBjbGFzc2VzIGFwcHJvcHJpYXRlbHknLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtaGlnaGxpZ2h0cycpKS50b0JlKGZhbHNlKVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNTaG93KClcbiAgICAgIGV4cGVjdChlZGl0b3JWaWV3LmNsYXNzTGlzdC5jb250YWlucygnaW50ZW50aW9ucy1oaWdobGlnaHRzJykpLnRvQmUodHJ1ZSlcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NIaWdobGlnaHRzSGlkZSgpXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtaGlnaGxpZ2h0cycpKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gICAgZGVzY3JpYmUoJ2NvbW1hbmQgbGlzdGVuZXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGl0KCdqdXN0IGFjdGl2YXRlcyBpZiB0aGVyZXMgbm8ga2V5Ym9hcmQgZXZlbnQgYXR0YWNoZWQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzU2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25IaWdobGlnaHRzSGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDApXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChlZGl0b3JWaWV3LCAnaW50ZW50aW9uczpoaWdobGlnaHQnKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2lnbm9yZXMgbW9yZSB0aGFuIG9uZSBhY3RpdmF0aW9uIHJlcXVlc3RzJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpoaWdobGlnaHQnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnZGlzcG9zZXMgdGhlIGtleWJvYXJkIGxpc3RlbmVyIHdoZW4gd2UgZGlzcG9zZSBpdCB3aXRoIHRoZSBjbGFzcyBmdW5jdGlvbicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIHNweU9uKGNvbW1hbmRzLCAncHJvY2Vzc0hpZ2hsaWdodHNIaWRlJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDApXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOmhpZ2hsaWdodCcsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleWRvd24nKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICAgIGV4cGVjdChjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUuY2FsbHMubGVuZ3RoKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2p1c3QgYWN0aXZhdGVzIGlmIGtleWJvYXJkIGV2ZW50IGlzIG5vdCBrZXlkb3duJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgwKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpoaWdobGlnaHQnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2RvZXMgbm90IGRlYWN0aXZhdGUgaWYga2V5dXAgaXMgbm90IHNhbWUga2V5Y29kZScsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgICB9KVxuICAgICAgICBjb21tYW5kcy5vbkhpZ2hsaWdodHNIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6aGlnaGxpZ2h0JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5ZG93bicpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcsIDEpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2RvZXMgZGVhY3RpdmF0ZSBpZiBrZXl1cCBpcyB0aGUgc2FtZSBrZXljb2RlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c1Nob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uSGlnaGxpZ2h0c0hpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgwKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpoaWdobGlnaHQnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlkb3duJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbiAgZGVzY3JpYmUoJ0xpc3RzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2RvZXMgbm90aGluZyBpZiBkZWFjdGl2YXRlZCBhbmQgd2UgdHJ5IHRvIGFjdGl2YXRlIGl0JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IHBhc3Mgb24gbW92ZSBldmVudHMgaWYgbm90IGFjdGl2YXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY29tbWFuZHM6bGlzdC1tb3ZlJylcbiAgICAgIGNvbW1hbmRzLm9uTGlzdE1vdmUoY2FsbGJhY2spXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ3VwJylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgICBpdCgncGFzc2VzIG9uIG1vdmUgZXZlbnRzIGlmIGFjdGl2YXRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgnY29tbWFuZHM6bGlzdC1tb3ZlJylcbiAgICAgIGNvbW1hbmRzLm9uTGlzdE1vdmUoY2FsbGJhY2spXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBjb21tYW5kcy5hY3RpdmUgPSB7IHR5cGU6ICdsaXN0Jywgc3Vic2NyaXB0aW9uczogbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKSB9XG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdE1vdmUoJ2Rvd24nKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RNb3ZlKCdkb3duJylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICBleHBlY3QoY2FsbGJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KGNhbGxiYWNrLmNhbGxzLmxlbmd0aCkudG9CZSgzKVxuICAgIH0pXG4gICAgaXQoJ2lnbm9yZXMgY29uZmlybSBpZiBub3QgYWN0aXZhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGphc21pbmUuY3JlYXRlU3B5KCdjb21tYW5kczpsaXN0LWNvbmZpcm0nKVxuICAgICAgY29tbWFuZHMub25MaXN0Q29uZmlybShjYWxsYmFjaylcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBleHBlY3QoY2FsbGJhY2spLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICAgIGl0KCdwYXNzZXMgb24gY29uZmlybSBpZiBhY3RpdmF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gamFzbWluZS5jcmVhdGVTcHkoJ2NvbW1hbmRzOmxpc3QtY29uZmlybScpXG4gICAgICBjb21tYW5kcy5vbkxpc3RDb25maXJtKGNhbGxiYWNrKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0Q29uZmlybSgpXG4gICAgICBjb21tYW5kcy5hY3RpdmUgPSB7IHR5cGU6ICdsaXN0Jywgc3Vic2NyaXB0aW9uczogbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKSB9XG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RDb25maXJtKClcbiAgICAgIGV4cGVjdChjYWxsYmFjaykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QoY2FsbGJhY2suY2FsbHMubGVuZ3RoKS50b0JlKDIpXG4gICAgfSlcbiAgICBpdCgnZG9lcyBub3QgYWN0aXZhdGUgaWYgbGlzdGVuZXJzIGRvbnQgc2F5IHRoYXQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShmYWxzZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgIH0pXG4gICAgaXQoJ2FjdGl2YXRlcyB3aGVuIGxpc3RlbmVycyBhbGxvdycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICBjb21tYW5kcy5vbkxpc3RTaG93KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICB9KVxuICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNIaWRlKytcbiAgICAgIH0pXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdpZ25vcmVzIGlmIGxpc3QgaXMgYWxyZWFkeSBhY3RpdmUnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICAgIGV4cGVjdChmYWxzZSkudG9CZSh0cnVlKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvQmUoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICAgIGV4cGVjdChmYWxzZSkudG9CZSh0cnVlKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvQmUoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICAgIGV4cGVjdChmYWxzZSkudG9CZSh0cnVlKVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXhwZWN0KGVycm9yLm1lc3NhZ2UpLnRvQmUoJ0FscmVhZHkgYWN0aXZlJylcbiAgICAgIH1cbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdkaXNwb3NlcyBpZiBoaWdobGlnaHRzIGFyZSBhY3RpdmUnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBkaXNwb3NlZCA9IGZhbHNlXG4gICAgICBsZXQgdGltZXNTaG93ID0gMFxuICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzU2hvdysrXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgICBjb21tYW5kcy5vbkxpc3RIaWRlKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgfSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgxKVxuICAgICAgY29tbWFuZHMuYWN0aXZlID0geyB0eXBlOiAnaGlnaGxpZ2h0Jywgc3Vic2NyaXB0aW9uczogbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKSB9XG4gICAgICBjb21tYW5kcy5hY3RpdmUuc3Vic2NyaXB0aW9ucy5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGRpc3Bvc2VkID0gdHJ1ZVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChkaXNwb3NlZCkudG9CZShmYWxzZSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgZXhwZWN0KGRpc3Bvc2VkKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDIpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDIpXG4gICAgfSlcbiAgICBpdCgnYWRkcyBhbmQgcmVtb3ZlcyBjbGFzc2VzIGFwcHJvcHJpYXRlbHknLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgZXhwZWN0KGVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnRlbnRpb25zLWxpc3QnKSkudG9CZShmYWxzZSlcbiAgICAgIGF3YWl0IGNvbW1hbmRzLnByb2Nlc3NMaXN0U2hvdygpXG4gICAgICBleHBlY3QoZWRpdG9yVmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ2ludGVudGlvbnMtbGlzdCcpKS50b0JlKHRydWUpXG4gICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgZXhwZWN0KGVkaXRvclZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCdpbnRlbnRpb25zLWxpc3QnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdkaXNwb3NlcyBsaXN0IG9uIG1vdXNldXAnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICBsZXQgdGltZXNIaWRlID0gMFxuICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0cnVlKVxuICAgICAgfSlcbiAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzSGlkZSsrXG4gICAgICB9KVxuICAgICAgYXdhaXQgY29tbWFuZHMucHJvY2Vzc0xpc3RTaG93KClcbiAgICAgIGNvbW1hbmRzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICBhd2FpdCBjb21tYW5kcy5wcm9jZXNzTGlzdFNob3coKVxuICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShuZXcgTW91c2VFdmVudCgnbW91c2V1cCcpKVxuICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMilcbiAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMilcbiAgICB9KVxuICAgIGRlc2NyaWJlKCdjb21tYW5kIGxpc3RlbmVyJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnanVzdCBlbmFibGVzIHdoZW4gbm8ga2V5Ym9hcmQgZXZlbnQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGVkaXRvclZpZXcsICdpbnRlbnRpb25zOnNob3cnKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2p1c3QgZW5hYmxlcyB3aGVuIGtleWJvYXJkIGV2ZW50IGlzIG5vdCBrZXlkb3duJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOnNob3cnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2Rpc3Bvc2VzIHRoZSBrZXlib2FyZCBsaXN0ZW5lciB3aGVuIHdlIGRpc3Bvc2UgaXQgd2l0aCB0aGUgY2xhc3MgZnVuY3Rpb24nLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVzU2hvdyA9IDBcbiAgICAgICAgbGV0IHRpbWVzSGlkZSA9IDBcbiAgICAgICAgY29tbWFuZHMub25MaXN0U2hvdyhmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc1Nob3crK1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodHJ1ZSlcbiAgICAgICAgfSlcbiAgICAgICAgY29tbWFuZHMub25MaXN0SGlkZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB0aW1lc0hpZGUrK1xuICAgICAgICB9KVxuICAgICAgICBzcHlPbihjb21tYW5kcywgJ3Byb2Nlc3NMaXN0SGlkZScpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgwKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDApXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpzaG93JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgY29tbWFuZHMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICAgIGRpc3BhdGNoRXZlbnRPbkJvZHkoZ2V0S2V5Ym9hcmRFdmVudCgna2V5dXAnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZXhwZWN0KHRpbWVzU2hvdykudG9CZSgxKVxuICAgICAgICBleHBlY3QodGltZXNIaWRlKS50b0JlKDEpXG4gICAgICAgIGV4cGVjdChjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUuY2FsbHMubGVuZ3RoKS50b0JlKDEpXG4gICAgICB9KVxuICAgICAgaXQoJ2lnbm9yZXMgbW9yZSB0aGFuIG9uZSBhY3RpdmF0aW9uIHJlcXVlc3RzJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGF0b20ua2V5bWFwcy5kaXNwYXRjaENvbW1hbmRFdmVudCgnaW50ZW50aW9uczpzaG93JywgZWRpdG9yVmlldywgZ2V0S2V5Ym9hcmRFdmVudCgna2V5cHJlc3MnKSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOnNob3cnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlwcmVzcycpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBhdG9tLmtleW1hcHMuZGlzcGF0Y2hDb21tYW5kRXZlbnQoJ2ludGVudGlvbnM6c2hvdycsIGVkaXRvclZpZXcsIGdldEtleWJvYXJkRXZlbnQoJ2tleXByZXNzJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBpdCgnZGlzcG9zZXMgaXRzZWxmIG9uIGFueSBjb21tYW5kcyBvdGhlciB0aGFuIGtub3duJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGxldCB0aW1lc1Nob3cgPSAwXG4gICAgICAgIGxldCB0aW1lc0hpZGUgPSAwXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdFNob3coZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNTaG93KytcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRydWUpXG4gICAgICAgIH0pXG4gICAgICAgIGNvbW1hbmRzLm9uTGlzdEhpZGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNIaWRlKytcbiAgICAgICAgfSlcbiAgICAgICAgYXRvbS5rZXltYXBzLmRpc3BhdGNoQ29tbWFuZEV2ZW50KCdpbnRlbnRpb25zOnNob3cnLCBlZGl0b3JWaWV3LCBnZXRLZXlib2FyZEV2ZW50KCdrZXlkb3duJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuICAgICAgICBkaXNwYXRjaEV2ZW50T25Cb2R5KGdldEtleWJvYXJkRXZlbnQoJ2tleXVwJykpXG4gICAgICAgIGF3YWl0IHdhaXQoMTApXG4gICAgICAgIGV4cGVjdCh0aW1lc1Nob3cpLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KHRpbWVzSGlkZSkudG9CZSgwKVxuXG4gICAgICAgIGF0b20ua2V5bWFwcy5lbWl0dGVyLmVtaXQoJ2RpZC1tYXRjaC1iaW5kaW5nJywgeyBiaW5kaW5nOiB7IGNvbW1hbmQ6ICdjb3JlOm1vdmUtdXAnIH0gfSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcblxuICAgICAgICBhdG9tLmtleW1hcHMuZW1pdHRlci5lbWl0KCdkaWQtbWF0Y2gtYmluZGluZycsIHsgYmluZGluZzogeyBjb21tYW5kOiAnY29yZTptb3ZlLWRvd24nIH0gfSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMClcblxuICAgICAgICBhdG9tLmtleW1hcHMuZW1pdHRlci5lbWl0KCdkaWQtbWF0Y2gtYmluZGluZycsIHsgYmluZGluZzogeyBjb21tYW5kOiAnY29yZTptb3ZlLWNvbmZpcm0nIH0gfSlcbiAgICAgICAgYXdhaXQgd2FpdCgxMClcbiAgICAgICAgZGlzcGF0Y2hFdmVudE9uQm9keShnZXRLZXlib2FyZEV2ZW50KCdrZXl1cCcpKVxuICAgICAgICBhd2FpdCB3YWl0KDEwKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcblxuICAgICAgICBjb21tYW5kcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICBleHBlY3QodGltZXNTaG93KS50b0JlKDEpXG4gICAgICAgIGV4cGVjdCh0aW1lc0hpZGUpLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=