(function() {
  var BufferedProcess, CompositeDisposable, DbgLua, Emitter, MobDebug, fs, net, path, ref;

  MobDebug = require('./mobdebug');

  fs = require('fs');

  path = require('path');

  net = require('net');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  module.exports = DbgLua = {
    config: {
      logToConsole: {
        title: 'Log to developer console',
        description: 'For debugging Lua problems',
        type: 'boolean',
        "default": true
      }
    },
    logToConsole: true,
    dbg: null,
    modalPanel: null,
    outputPanel: null,
    ui: null,
    interactiveSession: null,
    showOutputPanel: false,
    unseenOutputPanelContent: false,
    closedNaturally: false,
    connected: false,
    breakpoints: [],
    mdbg: new MobDebug(),
    variables: [],
    activate: function(state) {
      return atom.config.observe('dbg-lua.logToConsole', (function(_this) {
        return function(set) {
          return _this.logToConsole = set;
        };
      })(this));
    },
    consumeOutputPanel: function(outputPanel) {
      return this.outputPanel = outputPanel;
    },
    debug: function(options, api) {
      var ref1;
      this.ui = api.ui;
      this.breakpoints = api.breakpoints;
      if ((ref1 = this.outputPanel) != null) {
        ref1.clear();
      }
      this.mdbg.emitter.on(this.mdbg.debugEvents.startedListen, (function(_this) {
        return function(socket) {
          var breakpoint, breakpoints, dirs, i, len, results;
          if (_this.outputPanel != null) {
            _this.outputPanel.print("Connected to " + socket.remoteAddress + ":" + socket.remotePort);
          }
          dirs = atom.project.getDirectories();
          breakpoints = _this.breakpoints.filter(function(b) {
            return dirs.filter(function(p) {
              return b.path.match(p);
            }) != null;
          });
          results = [];
          for (i = 0, len = breakpoints.length; i < len; i++) {
            breakpoint = breakpoints[i];
            results.push(_this.addBreakpoint(breakpoint));
          }
          return results;
        };
      })(this));
      this.mdbg.emitter.on(this.mdbg.debugEvents.connectionClosed, (function(_this) {
        return function(socket) {
          _this.ui.stop();
          return _this.stop();
        };
      })(this));
      this.mdbg.emitter.on(this.mdbg.debugEvents.requestAccepted, (function(_this) {
        return function(arg) {
          var request, response;
          request = arg.request, response = arg.response;
          switch (request.command) {
            case _this.mdbg.commands["continue"]:
              return _this.ui.running();
          }
        };
      })(this));
      this.mdbg.emitter.on(this.mdbg.debugEvents.pausedAtBreakpoint, (function(_this) {
        return function(breakpoint) {
          _this.ui.paused();
          return _this.mdbg.getStack();
        };
      })(this));
      this.mdbg.emitter.on(this.mdbg.debugEvents.receivedStack, (function(_this) {
        return function(arg) {
          var frame, i, len, stack, variables;
          stack = arg.stack, variables = arg.variables;
          stack.reverse();
          _this.variables = variables;
          for (i = 0, len = stack.length; i < len; i++) {
            frame = stack[i];
            frame.file = frame.file.replace(/\//g, '\\');
          }
          _this.ui.setStack(stack);
          _this.ui.setVariables(_this.variables[_this.variables.length - 1]);
          return _this.ui.setFrame(stack.length - 1);
        };
      })(this));
      this.mdbg.emitter.on(this.mdbg.debugEvents.error, (function(_this) {
        return function(error) {
          return console.error(error);
        };
      })(this));
      return this.start(options);
    },
    cleanupFrame: function() {
      return this.errorEncountered = null;
    },
    start: function(options) {
      var interactiveSession, ref1;
      this.ui.paused();
      this.showOutputPanel = true;
      this.unseenOutputPanelContent = false;
      if ((ref1 = this.outputPanel) != null) {
        ref1.clear();
      }
      if (this.outputPanel && this.outputPanel.getInteractiveSession) {
        interactiveSession = this.outputPanel.getInteractiveSession();
        if (interactiveSession.pty) {
          this.interactiveSession = interactiveSession;
        }
      }
      if (this.interactiveSession) {
        this.interactiveSession.pty.on('data', (function(_this) {
          return function(data) {
            if (_this.showOutputPanelNext) {
              _this.showOutputPanelNext = false;
              _this.outputPanel.show();
            }
            return _this.unseenOutputPanelContent = true;
          };
        })(this));
      }
      this.mdbg.start(options);
      if (this.outputPanel != null) {
        return this.outputPanel.print("Run programm that need to debug");
      }
    },
    stop: function() {
      var ref1;
      this.mdbg.stop();
      this.cleanupFrame();
      this.breakpoints = [];
      this.connected = false;
      this.running = false;
      if (this.interactiveSession) {
        this.interactiveSession.discard();
        this.interactiveSession = null;
      }
      if (!this.closedNaturally || !this.unseenOutputPanelContent) {
        return (ref1 = this.outputPanel) != null ? ref1.hide() : void 0;
      }
    },
    "continue": function() {
      return this.mdbg.sendCommand(this.mdbg.commands["continue"]);
    },
    pause: function() {
      return this.mdbg.sendCommand(this.mdbg.commands.pause);
    },
    selectFrame: function(index) {
      this.ui.setFrame(index);
      return this.ui.setVariables(this.variables[index]);
    },
    getVariableChildren: function(name) {
      return new Promise((function(_this) {
        return function(fulfill) {
          var empty_variable;
          empty_variable = [
            {
              name: '',
              type: '',
              value: '',
              expandable: false
            }
          ];
          return fulfill([empty_variable]);
        };
      })(this));
    },
    stepIn: function() {
      return this.mdbg.sendCommand(this.mdbg.commands.stepIn);
    },
    stepOut: function() {
      return this.mdbg.sendCommand(this.mdbg.commands.stepOut);
    },
    stepOver: function() {
      return this.mdbg.sendCommand(this.mdbg.commands.stepOver);
    },
    addBreakpoint: function(breakpoint) {
      var filepath;
      filepath = '/' + atom.project.relativizePath(breakpoint.path)[1];
      return this.mdbg.addBreakpoint({
        path: filepath,
        line: breakpoint.line
      });
    },
    removeBreakpoint: function(breakpoint) {
      var filepath;
      filepath = '/' + atom.project.relativizePath(breakpoint.path)[1];
      return this.mdbg.removeBreakpoint({
        path: filepath,
        line: breakpoint.line
      });
    },
    provideDbgProvider: function() {
      return {
        name: 'dbg-lua',
        description: "Lua debugger",
        canHandleOptions: (function(_this) {
          return function(options) {
            return new Promise(fulfill, reject)(function() {
              return fulfill(true);
            });
          };
        })(this),
        debug: this.debug.bind(this),
        stop: this.stop.bind(this),
        "continue": this["continue"].bind(this),
        pause: this.pause.bind(this),
        selectFrame: this.selectFrame.bind(this),
        getVariableChildren: this.getVariableChildren.bind(this),
        stepIn: this.stepIn.bind(this),
        stepOver: this.stepOver.bind(this),
        stepOut: this.stepOut.bind(this),
        addBreakpoint: this.addBreakpoint.bind(this),
        removeBreakpoint: this.removeBreakpoint.bind(this)
      };
    },
    consumeDbg: function(dbg) {
      return this.dbg = dbg;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2RiZy1sdWEvbGliL2RiZy1sdWEuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBQ1gsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxHQUFBLEdBQU0sT0FBQSxDQUFRLEtBQVI7O0VBQ04sTUFBa0QsT0FBQSxDQUFRLE1BQVIsQ0FBbEQsRUFBQyxxQ0FBRCxFQUFrQiw2Q0FBbEIsRUFBdUM7O0VBR3ZDLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLE1BQUEsR0FDZjtJQUFBLE1BQUEsRUFDRTtNQUFBLFlBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTywwQkFBUDtRQUNBLFdBQUEsRUFBYSw0QkFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO09BREY7S0FERjtJQU1BLFlBQUEsRUFBYyxJQU5kO0lBT0EsR0FBQSxFQUFLLElBUEw7SUFRQSxVQUFBLEVBQVksSUFSWjtJQVNBLFdBQUEsRUFBYSxJQVRiO0lBVUEsRUFBQSxFQUFJLElBVko7SUFXQSxrQkFBQSxFQUFvQixJQVhwQjtJQVlBLGVBQUEsRUFBaUIsS0FaakI7SUFhQSx3QkFBQSxFQUEwQixLQWIxQjtJQWNBLGVBQUEsRUFBaUIsS0FkakI7SUFlQSxTQUFBLEVBQVcsS0FmWDtJQWdCQSxXQUFBLEVBQWEsRUFoQmI7SUFpQkEsSUFBQSxFQUFNLElBQUksUUFBSixDQUFBLENBakJOO0lBa0JBLFNBQUEsRUFBVyxFQWxCWDtJQW9CQSxRQUFBLEVBQVUsU0FBQyxLQUFEO2FBR1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHNCQUFwQixFQUE0QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtpQkFD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QUExQixDQWRyQjtRQWdCQSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsSUFBYixDQWhCUjtRQWlCQSxRQUFBLEVBQVUsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQWUsSUFBZixDQWpCVjtRQWtCQSxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsSUFBZCxDQWxCVDtRQW9CQSxhQUFBLEVBQWUsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLElBQXBCLENBcEJmO1FBcUJBLGdCQUFBLEVBQWtCLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxJQUFsQixDQUF1QixJQUF2QixDQXJCbEI7O0lBRGtCLENBOUlwQjtJQXNLQSxVQUFBLEVBQVksU0FBQyxHQUFEO2FBQ1YsSUFBQyxDQUFBLEdBQUQsR0FBTztJQURHLENBdEtaOztBQVJGIiwic291cmNlc0NvbnRlbnQiOlsiTW9iRGVidWcgPSByZXF1aXJlICcuL21vYmRlYnVnJ1xuZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xubmV0ID0gcmVxdWlyZSAnbmV0J1xue0J1ZmZlcmVkUHJvY2VzcywgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRGJnTHVhID1cbiAgY29uZmlnOlxuICAgIGxvZ1RvQ29uc29sZTpcbiAgICAgIHRpdGxlOiAnTG9nIHRvIGRldmVsb3BlciBjb25zb2xlJ1xuICAgICAgZGVzY3JpcHRpb246ICdGb3IgZGVidWdnaW5nIEx1YSBwcm9ibGVtcydcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICBsb2dUb0NvbnNvbGU6IHRydWVcbiAgZGJnOiBudWxsXG4gIG1vZGFsUGFuZWw6IG51bGxcbiAgb3V0cHV0UGFuZWw6IG51bGxcbiAgdWk6IG51bGxcbiAgaW50ZXJhY3RpdmVTZXNzaW9uOiBudWxsXG4gIHNob3dPdXRwdXRQYW5lbDogZmFsc2VcbiAgdW5zZWVuT3V0cHV0UGFuZWxDb250ZW50OiBmYWxzZVxuICBjbG9zZWROYXR1cmFsbHk6IGZhbHNlXG4gIGNvbm5lY3RlZDogZmFsc2VcbiAgYnJlYWtwb2ludHM6IFtdXG4gIG1kYmc6IG5ldyBNb2JEZWJ1ZygpXG4gIHZhcmlhYmxlczogW11cblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICNyZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2RiZy1sdWEnKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnZGJnLWx1YS5sb2dUb0NvbnNvbGUnLCAoc2V0KSA9PlxuICAgICAgQGxvZ1RvQ29uc29sZSA9IHNldFxuXG4gIGNvbnN1bWVPdXRwdXRQYW5lbDogKG91dHB1dFBhbmVsKSAtPlxuICAgIEBvdXRwdXRQYW5lbCA9IG91dHB1dFBhbmVsXG5cbiAgZGVidWc6KG9wdGlvbnMsIGFwaSkgLT5cbiAgICBAdWkgPSBhcGkudWlcbiAgICBAYnJlYWtwb2ludHMgPSBhcGkuYnJlYWtwb2ludHNcbiAgICBAb3V0cHV0UGFuZWw/LmNsZWFyKClcblxuICAgIEBtZGJnLmVtaXR0ZXIub24gQG1kYmcuZGVidWdFdmVudHMuc3RhcnRlZExpc3RlbiwgKHNvY2tldCkgPT5cbiAgICAgIEBvdXRwdXRQYW5lbC5wcmludCBcIkNvbm5lY3RlZCB0byAje3NvY2tldC5yZW1vdGVBZGRyZXNzfToje3NvY2tldC5yZW1vdGVQb3J0fVwiIGlmIEBvdXRwdXRQYW5lbD9cbiAgICAgIGRpcnMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgYnJlYWtwb2ludHMgPSBAYnJlYWtwb2ludHMuZmlsdGVyKChiKSA9PiBkaXJzLmZpbHRlcigocCkgPT4gYi5wYXRoLm1hdGNoIHApPylcbiAgICAgIEBhZGRCcmVha3BvaW50IGJyZWFrcG9pbnQgZm9yIGJyZWFrcG9pbnQgaW4gYnJlYWtwb2ludHNcblxuICAgIEBtZGJnLmVtaXR0ZXIub24gQG1kYmcuZGVidWdFdmVudHMuY29ubmVjdGlvbkNsb3NlZCwgKHNvY2tldCkgPT5cbiAgICAgIEB1aS5zdG9wKClcbiAgICAgIEBzdG9wKClcblxuICAgIEBtZGJnLmVtaXR0ZXIub24gQG1kYmcuZGVidWdFdmVudHMucmVxdWVzdEFjY2VwdGVkLCAoe3JlcXVlc3QsIHJlc3BvbnNlfSkgPT5cbiAgICAgIHN3aXRjaCByZXF1ZXN0LmNvbW1hbmRcbiAgICAgICAgd2hlbiBAbWRiZy5jb21tYW5kcy5jb250aW51ZVxuICAgICAgICAgIEB1aS5ydW5uaW5nKClcblxuICAgIEBtZGJnLmVtaXR0ZXIub24gQG1kYmcuZGVidWdFdmVudHMucGF1c2VkQXRCcmVha3BvaW50LCAoYnJlYWtwb2ludCkgPT5cbiAgICAgIEB1aS5wYXVzZWQoKVxuICAgICAgQG1kYmcuZ2V0U3RhY2soKVxuXG4gICAgQG1kYmcuZW1pdHRlci5vbiBAbWRiZy5kZWJ1Z0V2ZW50cy5yZWNlaXZlZFN0YWNrLCAoe3N0YWNrLCB2YXJpYWJsZXN9KSA9PlxuICAgICAgc3RhY2sucmV2ZXJzZSgpXG4gICAgICBAdmFyaWFibGVzID0gdmFyaWFibGVzXG4gICAgICBmcmFtZS5maWxlID0gZnJhbWUuZmlsZS5yZXBsYWNlIC9cXC8vZywgJ1xcXFwnIGZvciBmcmFtZSBpbiBzdGFja1xuICAgICAgQHVpLnNldFN0YWNrIHN0YWNrXG4gICAgICBAdWkuc2V0VmFyaWFibGVzIEB2YXJpYWJsZXNbQHZhcmlhYmxlcy5sZW5ndGgtMV1cbiAgICAgIEB1aS5zZXRGcmFtZSBzdGFjay5sZW5ndGgtMVxuXG4gICAgQG1kYmcuZW1pdHRlci5vbiBAbWRiZy5kZWJ1Z0V2ZW50cy5lcnJvciwgKGVycm9yKSA9PlxuICAgICAgY29uc29sZS5lcnJvciBlcnJvclxuXG4gICAgQHN0YXJ0IG9wdGlvbnNcblxuICBjbGVhbnVwRnJhbWU6IC0+XG4gICAgQGVycm9yRW5jb3VudGVyZWQgPSBudWxsXG5cbiAgc3RhcnQ6IChvcHRpb25zKSAtPlxuICAgIEB1aS5wYXVzZWQoKVxuICAgIEBzaG93T3V0cHV0UGFuZWwgPSB0cnVlXG4gICAgQHVuc2Vlbk91dHB1dFBhbmVsQ29udGVudCA9IGZhbHNlXG4gICAgQG91dHB1dFBhbmVsPy5jbGVhcigpXG5cbiAgICBpZiBAb3V0cHV0UGFuZWwgYW5kIEBvdXRwdXRQYW5lbC5nZXRJbnRlcmFjdGl2ZVNlc3Npb25cbiAgICAgIGludGVyYWN0aXZlU2Vzc2lvbiA9IEBvdXRwdXRQYW5lbC5nZXRJbnRlcmFjdGl2ZVNlc3Npb24oKVxuICAgICAgaWYgaW50ZXJhY3RpdmVTZXNzaW9uLnB0eSB0aGVuIEBpbnRlcmFjdGl2ZVNlc3Npb24gPSBpbnRlcmFjdGl2ZVNlc3Npb25cblxuICAgIGlmIEBpbnRlcmFjdGl2ZVNlc3Npb25cbiAgICAgIEBpbnRlcmFjdGl2ZVNlc3Npb24ucHR5Lm9uICdkYXRhJywgKGRhdGEpID0+XG4gICAgICAgIGlmIEBzaG93T3V0cHV0UGFuZWxOZXh0XG4gICAgICAgICAgQHNob3dPdXRwdXRQYW5lbE5leHQgPSBmYWxzZVxuICAgICAgICAgIEBvdXRwdXRQYW5lbC5zaG93KClcbiAgICAgICAgQHVuc2Vlbk91dHB1dFBhbmVsQ29udGVudCA9IHRydWVcblxuICAgIEBtZGJnLnN0YXJ0KG9wdGlvbnMpXG5cbiAgICBAb3V0cHV0UGFuZWwucHJpbnQgXCJSdW4gcHJvZ3JhbW0gdGhhdCBuZWVkIHRvIGRlYnVnXCIgaWYgQG91dHB1dFBhbmVsP1xuXG4gIHN0b3A6IC0+XG4gICAgQG1kYmcuc3RvcCgpXG4gICAgQGNsZWFudXBGcmFtZSgpXG5cbiAgICBAYnJlYWtwb2ludHMgPSBbXVxuICAgIEBjb25uZWN0ZWQgPSBmYWxzZVxuICAgIEBydW5uaW5nID0gZmFsc2VcblxuICAgIGlmIEBpbnRlcmFjdGl2ZVNlc3Npb25cbiAgICAgIEBpbnRlcmFjdGl2ZVNlc3Npb24uZGlzY2FyZCgpXG4gICAgICBAaW50ZXJhY3RpdmVTZXNzaW9uID0gbnVsbFxuXG4gICAgaWYgIUBjbG9zZWROYXR1cmFsbHkgb3IgIUB1bnNlZW5PdXRwdXRQYW5lbENvbnRlbnRcbiAgICAgIEBvdXRwdXRQYW5lbD8uaGlkZSgpXG5cbiAgY29udGludWU6IC0+XG4gICAgQG1kYmcuc2VuZENvbW1hbmQgQG1kYmcuY29tbWFuZHMuY29udGludWVcblxuICBwYXVzZTogLT5cbiAgICBAbWRiZy5zZW5kQ29tbWFuZCBAbWRiZy5jb21tYW5kcy5wYXVzZVxuXG4gIHNlbGVjdEZyYW1lOiAoaW5kZXgpIC0+XG4gICAgQHVpLnNldEZyYW1lIGluZGV4XG4gICAgQHVpLnNldFZhcmlhYmxlcyBAdmFyaWFibGVzW2luZGV4XVxuXG4gIGdldFZhcmlhYmxlQ2hpbGRyZW46IChuYW1lKSAtPlxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAoZnVsZmlsbCkgPT5cbiAgICAgIGVtcHR5X3ZhcmlhYmxlID0gW1xuICAgICAgICBuYW1lOiAnJ1xuICAgICAgICB0eXBlOiAnJ1xuICAgICAgICB2YWx1ZTogJydcbiAgICAgICAgZXhwYW5kYWJsZTogZmFsc2VcbiAgICAgIF1cbiAgICAgIGZ1bGZpbGwgW2VtcHR5X3ZhcmlhYmxlXVxuXG4gIHN0ZXBJbjogLT5cbiAgICBAbWRiZy5zZW5kQ29tbWFuZCBAbWRiZy5jb21tYW5kcy5zdGVwSW5cblxuICBzdGVwT3V0OiAtPlxuICAgIEBtZGJnLnNlbmRDb21tYW5kIEBtZGJnLmNvbW1hbmRzLnN0ZXBPdXRcblxuICBzdGVwT3ZlcjogLT5cbiAgICBAbWRiZy5zZW5kQ29tbWFuZCBAbWRiZy5jb21tYW5kcy5zdGVwT3ZlclxuXG4gIGFkZEJyZWFrcG9pbnQ6IChicmVha3BvaW50KSAtPlxuICAgIGZpbGVwYXRoID0gJy8nK2F0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChicmVha3BvaW50LnBhdGgpWzFdXG4gICAgQG1kYmcuYWRkQnJlYWtwb2ludCB7cGF0aDpmaWxlcGF0aCwgbGluZTpicmVha3BvaW50LmxpbmV9XG5cbiAgcmVtb3ZlQnJlYWtwb2ludDogKGJyZWFrcG9pbnQpIC0+XG4gICAgZmlsZXBhdGggPSAnLycrYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGJyZWFrcG9pbnQucGF0aClbMV1cbiAgICBAbWRiZy5yZW1vdmVCcmVha3BvaW50IHtwYXRoOmZpbGVwYXRoLCBsaW5lOmJyZWFrcG9pbnQubGluZX1cblxuICBwcm92aWRlRGJnUHJvdmlkZXI6IC0+XG4gICAgbmFtZTogJ2RiZy1sdWEnXG4gICAgZGVzY3JpcHRpb246IFwiTHVhIGRlYnVnZ2VyXCJcblxuICAgIGNhbkhhbmRsZU9wdGlvbnM6IChvcHRpb25zKSA9PlxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bGZpbGwsIHJlamVjdCkgPT5cbiAgICAgICAgICAgIGZ1bGZpbGwgdHJ1ZVxuXG4gICAgZGVidWc6IEBkZWJ1Zy5iaW5kIHRoaXNcbiAgICBzdG9wOiBAc3RvcC5iaW5kIHRoaXNcblxuICAgIGNvbnRpbnVlOiBAY29udGludWUuYmluZCB0aGlzXG4gICAgcGF1c2U6IEBwYXVzZS5iaW5kIHRoaXNcblxuICAgIHNlbGVjdEZyYW1lOiBAc2VsZWN0RnJhbWUuYmluZCB0aGlzXG4gICAgZ2V0VmFyaWFibGVDaGlsZHJlbjogQGdldFZhcmlhYmxlQ2hpbGRyZW4uYmluZCB0aGlzXG5cbiAgICBzdGVwSW46IEBzdGVwSW4uYmluZCB0aGlzXG4gICAgc3RlcE92ZXI6IEBzdGVwT3Zlci5iaW5kIHRoaXNcbiAgICBzdGVwT3V0OiBAc3RlcE91dC5iaW5kIHRoaXNcblxuICAgIGFkZEJyZWFrcG9pbnQ6IEBhZGRCcmVha3BvaW50LmJpbmQgdGhpc1xuICAgIHJlbW92ZUJyZWFrcG9pbnQ6IEByZW1vdmVCcmVha3BvaW50LmJpbmQgdGhpc1xuXG4gIGNvbnN1bWVEYmc6IChkYmcpIC0+XG4gICAgQGRiZyA9IGRiZ1xuIl19
