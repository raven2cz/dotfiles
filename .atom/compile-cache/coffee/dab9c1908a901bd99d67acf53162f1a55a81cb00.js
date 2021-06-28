(function() {
  var BufferedProcess, CompositeDisposable, Emitter, MobDebug, fs, net, path, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  path = require('path');

  net = require('net');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, CompositeDisposable = ref.CompositeDisposable, Emitter = ref.Emitter;

  module.exports = MobDebug = (function() {
    MobDebug.prototype.responseStatus = {
      requestAccepted: '200',
      badRequest: '400',
      errorInExecution: '401',
      "break": '202',
      watch: '203',
      output: '204'
    };

    MobDebug.prototype.commands = {
      "continue": 'run',
      stepIn: 'step',
      stepOut: 'out',
      stepOver: 'over',
      pause: 'suspend',
      exit: 'exit',
      done: 'done',
      getStack: 'stack',
      setBaseDirectory: 'basedir',
      setBreakpoint: 'setb',
      removeBreakpoint: 'delb',
      addWatchExpression: 'setw',
      removeWatchExpression: 'delw'
    };

    MobDebug.prototype.debugEvents = {
      requestAccepted: 'requestAccepted',
      pausedAtBreakpoint: 'break',
      receivedStack: 'stack',
      startedListen: 'listen',
      connectionClosed: 'close',
      error: 'error'
    };

    function MobDebug() {
      this.onReceive = bind(this.onReceive, this);
      this.socket = null;
      this.requestQueue = [];
      this.emitter = new Emitter();
      this.breakpoints = [];
      this.running = false;
    }

    MobDebug.prototype.escapePath = function(filepath) {
      return (filepath.replace(/\\/g, '/')).replace(/[\s\t\n]/g, '\\ ');
    };

    MobDebug.prototype.start = function(options) {
      return this.listen(options.port || 8172, options.host || 'localhost');
    };

    MobDebug.prototype.listen = function(port, host) {
      this.server = net.createServer((function(_this) {
        return function(socket) {
          _this.socket = socket;
          console.log('CONNECTED:', _this.socket.remoteAddress + ':' + _this.socket.remotePort);
          _this.emitter.emit(_this.debugEvents.startedListen, _this.socket);
          _this.socket.on('data', _this.onReceive);
          return _this.socket.on('close', function(data) {
            console.log('CLOSED:', _this.socket.remoteAddress + ':' + _this.socket.remotePort);
            return _this.emitter.emit(_this.debugEvents.connectionClosed, _this.socket);
          });
        };
      })(this));
      return this.server.listen(port || 8172, host || 'localhost');
    };

    MobDebug.prototype.onReceive = function(data) {
      var code, filepath, i, len, line, message, messages, request, response, results;
      response = data.toString();
      console.log('DATA', this.socket.remoteAddress + ':' + this.socket.remotePort, response);
      messages = response.split('\n');
      results = [];
      for (i = 0, len = messages.length; i < len; i++) {
        message = messages[i];
        if (message === "" || message === null) {
          continue;
        }
        code = message.match(/^[0-9]+/g)[0];
        switch (code) {
          case this.responseStatus.requestAccepted:
            request = this.requestQueue.shift();
            switch (request.command) {
              case this.commands["continue"]:
                this.running = true;
                break;
              case this.commands.pause:
                this.running = false;
                break;
              case this.commands.getStack:
                this.parseStack(response);
            }
            results.push(this.emitter.emit(this.debugEvents.requestAccepted, {
              request: request,
              response: response
            }));
            break;
          case this.responseStatus.badRequest:
            if (this.requestQueue.length > 0) {
              results.push(this.requestQueue.shift());
            } else {
              results.push(void 0);
            }
            break;
          case this.responseStatus["break"]:
            this.running = false;
            filepath = path.resolve(atom.project.getPaths()[0], '.' + message.split(' ')[2]);
            line = message.match(/[0-9]+$/g)[0];
            results.push(this.emitter.emit(this.debugEvents.pausedAtBreakpoint, {
              path: filepath,
              line: line
            }));
            break;
          default:
            results.push(void 0);
        }
      }
      return results;
    };

    MobDebug.prototype.stop = function() {
      var ref1, ref2, ref3;
      this.sendCommand(this.commands.done);
      if ((ref1 = this.socket) != null) {
        ref1.end();
      }
      if ((ref2 = this.socket) != null) {
        ref2.destroy();
      }
      if ((ref3 = this.server) != null) {
        ref3.close();
      }
      this.emitter = new Emitter();
      this.requestQueue = [];
      return this.running = false;
    };

    MobDebug.prototype.parseStack = function(dump) {
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var output, script;
          output = '';
          script = path.resolve(__dirname, './lua_stack.lua');
          _this.process = new BufferedProcess({
            command: 'lua',
            args: [script],
            options: {
              cwd: atom.project.getPaths()[0]
            },
            stdout: function(data) {
              return output += data;
            },
            stderr: function(data) {
              output += data;
              _this.emitter.emit(_this.debugEvents.error, error);
              return reject(output);
            },
            exit: function(data) {
              var result;
              result = JSON.parse(output);
              _this.emitter.emit(_this.debugEvents.receivedStack, result);
              return resolve(result);
            }
          });
          return _this.process.process.stdin.write(dump + _this.escapePath(atom.project.getPaths()[0]) + '\r\n', {
            binary: true
          });
        };
      })(this));
    };

    MobDebug.prototype.sendCommand = function(command, args, waitResponse) {
      var arg;
      if (args == null) {
        args = [''];
      }
      if (waitResponse == null) {
        waitResponse = true;
      }
      if ((this.socket == null) || this.socket.destroyed) {
        return;
      }
      console.log(command, args.join(" "));
      if (waitResponse) {
        this.requestQueue.push({
          command: command,
          args: args
        });
      }
      arg = args.join(' ');
      return this.socket.write(command.toUpperCase() + ' ' + arg + '\n');
    };

    MobDebug.prototype.addBreakpoint = function(arg1) {
      var line, path;
      path = arg1.path, line = arg1.line;
      return this.sendCommand(this.commands.setBreakpoint, [this.escapePath(path), line], !this.running);
    };

    MobDebug.prototype.removeBreakpoint = function(arg1) {
      var line, path;
      path = arg1.path, line = arg1.line;
      return this.sendCommand(this.commands.removeBreakpoint, [this.escapePath(path), line], !this.running);
    };

    MobDebug.prototype.getStack = function() {
      if (!this.running) {
        return this.sendCommand(this.commands.getStack);
      }
    };

    MobDebug.prototype.stepIn = function() {
      if (!this.running) {
        return this.sendCommand(this.mdbg.commands.stepIn);
      }
    };

    MobDebug.prototype.stepOut = function() {
      if (!this.running) {
        return this.sendCommand(this.mdbg.commands.stepOut);
      }
    };

    MobDebug.prototype.stepOver = function() {
      if (!this.running) {
        return this.sendCommand(this.mdbg.commands.stepOver);
      }
    };

    return MobDebug;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvYm94Ly5hdG9tL3BhY2thZ2VzL2RiZy1sdWEvbGliL21vYmRlYnVnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMkVBQUE7SUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUjs7RUFDTixNQUFrRCxPQUFBLENBQVEsTUFBUixDQUFsRCxFQUFDLHFDQUFELEVBQWtCLDZDQUFsQixFQUF1Qzs7RUFFdkMsTUFBTSxDQUFDLE9BQVAsR0FFTTt1QkFDSixjQUFBLEdBQ0U7TUFBQSxlQUFBLEVBQWlCLEtBQWpCO01BQ0EsVUFBQSxFQUFZLEtBRFo7TUFFQSxnQkFBQSxFQUFrQixLQUZsQjtNQUdBLENBQUEsS0FBQSxDQUFBLEVBQU8sS0FIUDtNQUlBLEtBQUEsRUFBTyxLQUpQO01BS0EsTUFBQSxFQUFRLEtBTFI7Ozt1QkFPRixRQUFBLEdBQ0U7TUFBQSxDQUFBLFFBQUEsQ0FBQSxFQUFVLEtBQVY7TUFDQSxNQUFBLEVBQVEsTUFEUjtNQUVBLE9BQUEsRUFBUyxLQUZUO01BR0EsUUFBQSxFQUFVLE1BSFY7TUFJQSxLQUFBLEVBQU8sU0FKUDtNQUtBLElBQUEsRUFBTSxNQUxOO01BTUEsSUFBQSxFQUFNLE1BTk47TUFPQSxRQUFBLEVBQVUsT0FQVjtNQVFBLGdCQUFBLEVBQWtCLFNBUmxCO01BU0EsYUFBQSxFQUFlLE1BVGY7TUFVQSxnQkFBQSxFQUFrQixNQVZsQjtNQVdBLGtCQUFBLEVBQW9CLE1BWHBCO01BWUEscUJBQUEsRUFBdUIsTUFadkI7Ozt1QkFjRixXQUFBLEdBQ0U7TUFBQSxlQUFBLEVBQWlCLGlCQUFqQjtNQUNBLGtCQUFBLEVBQW9CLE9BRHBCO01BRUEsYUFBQSxFQUFlLE9BRmY7TUFHQSxhQUFBLEVBQWUsUUFIZjtNQUlBLGdCQUFBLEVBQWtCLE9BSmxCO01BS0EsS0FBQSxFQUFPLE9BTFA7OztJQU9XLGtCQUFBOztNQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFDVixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUNoQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksT0FBSixDQUFBO01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFMQTs7dUJBT2IsVUFBQSxHQUFZLFNBQUMsUUFBRDtBQUNWLGFBQU8sQ0FBQyxRQUFRLENBQUMsT0FBVCxDQUFpQixLQUFqQixFQUF3QixHQUF4QixDQUFELENBQTZCLENBQUMsT0FBOUIsQ0FBc0MsV0FBdEMsRUFBbUQsS0FBbkQ7SUFERzs7dUJBR1osS0FBQSxHQUFPLFNBQUMsT0FBRDthQUNMLElBQUMsQ0FBQSxNQUFELENBQVEsT0FBTyxDQUFDLElBQVIsSUFBYyxJQUF0QixFQUE0QixPQUFPLENBQUMsSUFBUixJQUFjLFdBQTFDO0lBREs7O3VCQUdQLE1BQUEsR0FBUSxTQUFDLElBQUQsRUFBTyxJQUFQO01BQ04sSUFBQyxDQUFBLE1BQUQsR0FBVSxHQUFHLENBQUMsWUFBSixDQUFpQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtVQUN6QixLQUFDLENBQUEsTUFBRCxHQUFVO1VBQ1YsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaLEVBQTBCLEtBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixHQUFzQixHQUF0QixHQUEwQixLQUFDLENBQUEsTUFBTSxDQUFDLFVBQTVEO1VBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsS0FBQyxDQUFBLFdBQVcsQ0FBQyxhQUEzQixFQUEwQyxLQUFDLENBQUEsTUFBM0M7VUFFQSxLQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxNQUFYLEVBQW9CLEtBQUMsQ0FBQSxTQUFyQjtpQkFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLEVBQVIsQ0FBVyxPQUFYLEVBQW9CLFNBQUMsSUFBRDtZQUNsQixPQUFPLENBQUMsR0FBUixDQUFZLFNBQVosRUFBdUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLEdBQXNCLEdBQXRCLEdBQTBCLEtBQUMsQ0FBQSxNQUFNLENBQUMsVUFBekQ7bUJBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsS0FBQyxDQUFBLFdBQVcsQ0FBQyxnQkFBM0IsRUFBNkMsS0FBQyxDQUFBLE1BQTlDO1VBRmtCLENBQXBCO1FBTnlCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjthQVVWLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixDQUFlLElBQUEsSUFBTSxJQUFyQixFQUEyQixJQUFBLElBQU0sV0FBakM7SUFYTTs7dUJBYVIsU0FBQSxHQUFXLFNBQUMsSUFBRDtBQUNULFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBQTtNQUNYLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWixFQUFvQixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsR0FBc0IsR0FBdEIsR0FBMEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxVQUF0RCxFQUFrRSxRQUFsRTtNQUNBLFFBQUEsR0FBVyxRQUFRLENBQUMsS0FBVCxDQUFlLElBQWY7QUFDWDtXQUFBLDBDQUFBOztRQUNFLElBQUcsT0FBQSxLQUFXLEVBQVgsSUFBaUIsT0FBQSxLQUFXLElBQS9CO0FBQXlDLG1CQUF6Qzs7UUFDQSxJQUFBLEdBQU8sT0FBTyxDQUFDLEtBQVIsQ0FBYyxVQUFkLENBQThCLENBQUEsQ0FBQTtBQUNyQyxnQkFBTyxJQUFQO0FBQUEsZUFDTyxJQUFDLENBQUEsY0FBYyxDQUFDLGVBRHZCO1lBRUksT0FBQSxHQUFVLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxDQUFBO0FBQ1Ysb0JBQU8sT0FBTyxDQUFDLE9BQWY7QUFBQSxtQkFDTyxJQUFDLENBQUEsUUFBUSxFQUFDLFFBQUQsRUFEaEI7Z0JBQytCLElBQUMsQ0FBQSxPQUFELEdBQVc7QUFBbkM7QUFEUCxtQkFFTyxJQUFDLENBQUEsUUFBUSxDQUFDLEtBRmpCO2dCQUU0QixJQUFDLENBQUEsT0FBRCxHQUFXO0FBQWhDO0FBRlAsbUJBR08sSUFBQyxDQUFBLFFBQVEsQ0FBQyxRQUhqQjtnQkFHK0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaO0FBSC9CO3lCQUlBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLElBQUMsQ0FBQSxXQUFXLENBQUMsZUFBM0IsRUFBNEM7Y0FBQyxPQUFBLEVBQVEsT0FBVDtjQUFrQixRQUFBLEVBQVMsUUFBM0I7YUFBNUM7QUFORztBQURQLGVBUU8sSUFBQyxDQUFBLGNBQWMsQ0FBQyxVQVJ2QjtZQVNJLElBQUcsSUFBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLEdBQXVCLENBQTFCOzJCQUNFLElBQUMsQ0FBQSxZQUFZLENBQUMsS0FBZCxDQUFBLEdBREY7YUFBQSxNQUFBO21DQUFBOztBQURHO0FBUlAsZUFXTyxJQUFDLENBQUEsY0FBYyxFQUFDLEtBQUQsRUFYdEI7WUFZSSxJQUFDLENBQUEsT0FBRCxHQUFXO1lBQ1gsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXJDLEVBQXlDLEdBQUEsR0FBSSxPQUFPLENBQUMsS0FBUixDQUFjLEdBQWQsQ0FBbUIsQ0FBQSxDQUFBLENBQWhFO1lBQ1gsSUFBQSxHQUFPLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBZCxDQUE4QixDQUFBLENBQUE7eUJBQ3JDLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLElBQUMsQ0FBQSxXQUFXLENBQUMsa0JBQTNCLEVBQStDO2NBQUMsSUFBQSxFQUFNLFFBQVA7Y0FBaUIsSUFBQSxFQUFNLElBQXZCO2FBQS9DO0FBSkc7QUFYUDs7QUFBQTtBQUhGOztJQUpTOzt1QkF3QlgsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBO01BQUEsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQXZCOztZQUNPLENBQUUsR0FBVCxDQUFBOzs7WUFDTyxDQUFFLE9BQVQsQ0FBQTs7O1lBQ08sQ0FBRSxLQUFULENBQUE7O01BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJLE9BQUosQ0FBQTtNQUNYLElBQUMsQ0FBQSxZQUFELEdBQWdCO2FBQ2hCLElBQUMsQ0FBQSxPQUFELEdBQVc7SUFQUDs7dUJBVU4sVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLElBQUksT0FBSixDQUFZLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNWLGNBQUE7VUFBQSxNQUFBLEdBQVM7VUFDVCxNQUFBLEdBQVMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLGlCQUF4QjtVQUNULEtBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxlQUFKLENBQ1Q7WUFBQSxPQUFBLEVBQVMsS0FBVDtZQUNBLElBQUEsRUFBTSxDQUFDLE1BQUQsQ0FETjtZQUVBLE9BQUEsRUFDRTtjQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBN0I7YUFIRjtZQUlBLE1BQUEsRUFBUSxTQUFDLElBQUQ7cUJBQ04sTUFBQSxJQUFVO1lBREosQ0FKUjtZQU1BLE1BQUEsRUFBUSxTQUFDLElBQUQ7Y0FDTixNQUFBLElBQVU7Y0FDVixLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxLQUFDLENBQUEsV0FBVyxDQUFDLEtBQTNCLEVBQWtDLEtBQWxDO3FCQUNBLE1BQUEsQ0FBTyxNQUFQO1lBSE0sQ0FOUjtZQVVBLElBQUEsRUFBTSxTQUFDLElBQUQ7QUFDSixrQkFBQTtjQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQVg7Y0FDVCxLQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxLQUFDLENBQUEsV0FBVyxDQUFDLGFBQTNCLEVBQTBDLE1BQTFDO3FCQUNBLE9BQUEsQ0FBUSxNQUFSO1lBSEksQ0FWTjtXQURTO2lCQWVYLEtBQUMsQ0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUF2QixDQUE2QixJQUFBLEdBQUssS0FBQyxDQUFBLFVBQUQsQ0FBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBcEMsQ0FBTCxHQUE2QyxNQUExRSxFQUFrRjtZQUFBLE1BQUEsRUFBUSxJQUFSO1dBQWxGO1FBbEJVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBRFU7O3VCQXNCWixXQUFBLEdBQWEsU0FBQyxPQUFELEVBQVUsSUFBVixFQUF1QixZQUF2QjtBQUNYLFVBQUE7O1FBRHFCLE9BQU8sQ0FBQyxFQUFEOzs7UUFBTSxlQUFlOztNQUNqRCxJQUFPLHFCQUFKLElBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBM0I7QUFBMEMsZUFBMUM7O01BQ0EsT0FBTyxDQUFDLEdBQVIsQ0FBWSxPQUFaLEVBQXFCLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQUFyQjtNQUNBLElBQUcsWUFBSDtRQUFxQixJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBbUI7VUFBQyxPQUFBLEVBQVEsT0FBVDtVQUFrQixJQUFBLEVBQUssSUFBdkI7U0FBbkIsRUFBckI7O01BQ0EsR0FBQSxHQUFNLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVjthQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixDQUFjLE9BQU8sQ0FBQyxXQUFSLENBQUEsQ0FBQSxHQUFzQixHQUF0QixHQUEwQixHQUExQixHQUE4QixJQUE1QztJQUxXOzt1QkFPYixhQUFBLEdBQWUsU0FBQyxJQUFEO0FBQ1gsVUFBQTtNQURhLGtCQUFNO2FBQ25CLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxhQUF2QixFQUFzQyxDQUFDLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixDQUFELEVBQW9CLElBQXBCLENBQXRDLEVBQWlFLENBQUksSUFBQyxDQUFBLE9BQXRFO0lBRFc7O3VCQUlmLGdCQUFBLEdBQWtCLFNBQUMsSUFBRDtBQUNkLFVBQUE7TUFEZ0Isa0JBQU07YUFDdEIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsUUFBUSxDQUFDLGdCQUF2QixFQUF5QyxDQUFDLElBQUMsQ0FBQSxVQUFELENBQVksSUFBWixDQUFELEVBQW9CLElBQXBCLENBQXpDLEVBQW9FLENBQUksSUFBQyxDQUFBLE9BQXpFO0lBRGM7O3VCQUdsQixRQUFBLEdBQVUsU0FBQTtNQUNSLElBQUcsQ0FBSSxJQUFDLENBQUEsT0FBUjtlQUFxQixJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxRQUFRLENBQUMsUUFBdkIsRUFBckI7O0lBRFE7O3VCQUdWLE1BQUEsR0FBUSxTQUFBO01BQ04sSUFBRyxDQUFJLElBQUMsQ0FBQSxPQUFSO2VBQXFCLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBNUIsRUFBckI7O0lBRE07O3VCQUdSLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBRyxDQUFJLElBQUMsQ0FBQSxPQUFSO2VBQXFCLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBNUIsRUFBckI7O0lBRE87O3VCQUdULFFBQUEsR0FBVSxTQUFBO01BQ1IsSUFBRyxDQUFJLElBQUMsQ0FBQSxPQUFSO2VBQXFCLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBNUIsRUFBckI7O0lBRFE7Ozs7O0FBaEpaIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xubmV0ID0gcmVxdWlyZSAnbmV0J1xue0J1ZmZlcmVkUHJvY2VzcywgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIE1vYkRlYnVnXG4gIHJlc3BvbnNlU3RhdHVzOlxuICAgIHJlcXVlc3RBY2NlcHRlZDogJzIwMCdcbiAgICBiYWRSZXF1ZXN0OiAnNDAwJ1xuICAgIGVycm9ySW5FeGVjdXRpb246ICc0MDEnXG4gICAgYnJlYWs6ICcyMDInXG4gICAgd2F0Y2g6ICcyMDMnXG4gICAgb3V0cHV0OiAnMjA0J1xuXG4gIGNvbW1hbmRzOlxuICAgIGNvbnRpbnVlOiAncnVuJ1xuICAgIHN0ZXBJbjogJ3N0ZXAnXG4gICAgc3RlcE91dDogJ291dCdcbiAgICBzdGVwT3ZlcjogJ292ZXInXG4gICAgcGF1c2U6ICdzdXNwZW5kJ1xuICAgIGV4aXQ6ICdleGl0J1xuICAgIGRvbmU6ICdkb25lJ1xuICAgIGdldFN0YWNrOiAnc3RhY2snXG4gICAgc2V0QmFzZURpcmVjdG9yeTogJ2Jhc2VkaXInXG4gICAgc2V0QnJlYWtwb2ludDogJ3NldGInXG4gICAgcmVtb3ZlQnJlYWtwb2ludDogJ2RlbGInXG4gICAgYWRkV2F0Y2hFeHByZXNzaW9uOiAnc2V0dydcbiAgICByZW1vdmVXYXRjaEV4cHJlc3Npb246ICdkZWx3J1xuXG4gIGRlYnVnRXZlbnRzOlxuICAgIHJlcXVlc3RBY2NlcHRlZDogJ3JlcXVlc3RBY2NlcHRlZCdcbiAgICBwYXVzZWRBdEJyZWFrcG9pbnQ6ICdicmVhaydcbiAgICByZWNlaXZlZFN0YWNrOiAnc3RhY2snXG4gICAgc3RhcnRlZExpc3RlbjogJ2xpc3RlbidcbiAgICBjb25uZWN0aW9uQ2xvc2VkOiAnY2xvc2UnXG4gICAgZXJyb3I6ICdlcnJvcidcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAc29ja2V0ID0gbnVsbFxuICAgIEByZXF1ZXN0UXVldWUgPSBbXVxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIEBicmVha3BvaW50cyA9IFtdXG4gICAgQHJ1bm5pbmcgPSBmYWxzZVxuXG4gIGVzY2FwZVBhdGg6IChmaWxlcGF0aCkgLT5cbiAgICByZXR1cm4gKGZpbGVwYXRoLnJlcGxhY2UgL1xcXFwvZywgJy8nKS5yZXBsYWNlIC9bXFxzXFx0XFxuXS9nLCAnXFxcXCAnXG5cbiAgc3RhcnQ6IChvcHRpb25zKSAtPlxuICAgIEBsaXN0ZW4ob3B0aW9ucy5wb3J0fHw4MTcyLCBvcHRpb25zLmhvc3R8fCdsb2NhbGhvc3QnKVxuXG4gIGxpc3RlbjogKHBvcnQsIGhvc3QpIC0+XG4gICAgQHNlcnZlciA9IG5ldC5jcmVhdGVTZXJ2ZXIgKHNvY2tldCkgPT5cbiAgICAgIEBzb2NrZXQgPSBzb2NrZXRcbiAgICAgIGNvbnNvbGUubG9nICdDT05ORUNURUQ6JywgQHNvY2tldC5yZW1vdGVBZGRyZXNzKyc6JytAc29ja2V0LnJlbW90ZVBvcnRcbiAgICAgIEBlbWl0dGVyLmVtaXQgQGRlYnVnRXZlbnRzLnN0YXJ0ZWRMaXN0ZW4sIEBzb2NrZXRcblxuICAgICAgQHNvY2tldC5vbiAnZGF0YScgLCBAb25SZWNlaXZlXG4gICAgICBAc29ja2V0Lm9uICdjbG9zZScsIChkYXRhKSA9PlxuICAgICAgICBjb25zb2xlLmxvZyAnQ0xPU0VEOicsIEBzb2NrZXQucmVtb3RlQWRkcmVzcysnOicrQHNvY2tldC5yZW1vdGVQb3J0XG4gICAgICAgIEBlbWl0dGVyLmVtaXQgQGRlYnVnRXZlbnRzLmNvbm5lY3Rpb25DbG9zZWQsIEBzb2NrZXRcblxuICAgIEBzZXJ2ZXIubGlzdGVuIHBvcnR8fDgxNzIsIGhvc3R8fCdsb2NhbGhvc3QnXG5cbiAgb25SZWNlaXZlOiAoZGF0YSkgPT5cbiAgICByZXNwb25zZSA9IGRhdGEudG9TdHJpbmcoKVxuICAgIGNvbnNvbGUubG9nICdEQVRBJywgQHNvY2tldC5yZW1vdGVBZGRyZXNzKyc6JytAc29ja2V0LnJlbW90ZVBvcnQsIHJlc3BvbnNlXG4gICAgbWVzc2FnZXMgPSByZXNwb25zZS5zcGxpdCAnXFxuJ1xuICAgIGZvciBtZXNzYWdlIGluIG1lc3NhZ2VzXG4gICAgICBpZiBtZXNzYWdlID09IFwiXCIgfHwgbWVzc2FnZSA9PSBudWxsIHRoZW4gY29udGludWVcbiAgICAgIGNvZGUgPSBtZXNzYWdlLm1hdGNoKC8vL15bMC05XSsvLy9nKVswXVxuICAgICAgc3dpdGNoIGNvZGVcbiAgICAgICAgd2hlbiBAcmVzcG9uc2VTdGF0dXMucmVxdWVzdEFjY2VwdGVkXG4gICAgICAgICAgcmVxdWVzdCA9IEByZXF1ZXN0UXVldWUuc2hpZnQoKVxuICAgICAgICAgIHN3aXRjaCByZXF1ZXN0LmNvbW1hbmRcbiAgICAgICAgICAgIHdoZW4gQGNvbW1hbmRzLmNvbnRpbnVlIHRoZW4gQHJ1bm5pbmcgPSB0cnVlXG4gICAgICAgICAgICB3aGVuIEBjb21tYW5kcy5wYXVzZSB0aGVuIEBydW5uaW5nID0gZmFsc2VcbiAgICAgICAgICAgIHdoZW4gQGNvbW1hbmRzLmdldFN0YWNrIHRoZW4gQHBhcnNlU3RhY2sgcmVzcG9uc2VcbiAgICAgICAgICBAZW1pdHRlci5lbWl0IEBkZWJ1Z0V2ZW50cy5yZXF1ZXN0QWNjZXB0ZWQsIHtyZXF1ZXN0OnJlcXVlc3QsIHJlc3BvbnNlOnJlc3BvbnNlfVxuICAgICAgICB3aGVuIEByZXNwb25zZVN0YXR1cy5iYWRSZXF1ZXN0XG4gICAgICAgICAgaWYgQHJlcXVlc3RRdWV1ZS5sZW5ndGggPiAwXG4gICAgICAgICAgICBAcmVxdWVzdFF1ZXVlLnNoaWZ0KClcbiAgICAgICAgd2hlbiBAcmVzcG9uc2VTdGF0dXMuYnJlYWtcbiAgICAgICAgICBAcnVubmluZyA9IGZhbHNlXG4gICAgICAgICAgZmlsZXBhdGggPSBwYXRoLnJlc29sdmUgYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sICcuJyttZXNzYWdlLnNwbGl0KCcgJylbMl1cbiAgICAgICAgICBsaW5lID0gbWVzc2FnZS5tYXRjaCgvLy9bMC05XSskLy8vZylbMF1cbiAgICAgICAgICBAZW1pdHRlci5lbWl0IEBkZWJ1Z0V2ZW50cy5wYXVzZWRBdEJyZWFrcG9pbnQsIHtwYXRoOiBmaWxlcGF0aCwgbGluZTogbGluZX1cblxuICBzdG9wOiAoKSAtPlxuICAgIEBzZW5kQ29tbWFuZCBAY29tbWFuZHMuZG9uZVxuICAgIEBzb2NrZXQ/LmVuZCgpXG4gICAgQHNvY2tldD8uZGVzdHJveSgpXG4gICAgQHNlcnZlcj8uY2xvc2UoKVxuICAgIEBlbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIEByZXF1ZXN0UXVldWUgPSBbXVxuICAgIEBydW5uaW5nID0gZmFsc2VcblxuXG4gIHBhcnNlU3RhY2s6IChkdW1wKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBvdXRwdXQgPSAnJ1xuICAgICAgc2NyaXB0ID0gcGF0aC5yZXNvbHZlIF9fZGlybmFtZSwgJy4vbHVhX3N0YWNrLmx1YSdcbiAgICAgIEBwcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzc1xuICAgICAgICBjb21tYW5kOiAnbHVhJ1xuICAgICAgICBhcmdzOiBbc2NyaXB0XVxuICAgICAgICBvcHRpb25zOlxuICAgICAgICAgIGN3ZDogYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICAgICAgc3Rkb3V0OiAoZGF0YSkgPT5cbiAgICAgICAgICBvdXRwdXQgKz0gZGF0YVxuICAgICAgICBzdGRlcnI6IChkYXRhKSA9PlxuICAgICAgICAgIG91dHB1dCArPSBkYXRhXG4gICAgICAgICAgQGVtaXR0ZXIuZW1pdCBAZGVidWdFdmVudHMuZXJyb3IsIGVycm9yXG4gICAgICAgICAgcmVqZWN0IG91dHB1dFxuICAgICAgICBleGl0OiAoZGF0YSkgPT5cbiAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlIG91dHB1dFxuICAgICAgICAgIEBlbWl0dGVyLmVtaXQgQGRlYnVnRXZlbnRzLnJlY2VpdmVkU3RhY2ssIHJlc3VsdFxuICAgICAgICAgIHJlc29sdmUgcmVzdWx0XG4gICAgICBAcHJvY2Vzcy5wcm9jZXNzLnN0ZGluLndyaXRlIGR1bXArQGVzY2FwZVBhdGgoYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0pKydcXHJcXG4nLCBiaW5hcnk6IHRydWVcblxuXG4gIHNlbmRDb21tYW5kOiAoY29tbWFuZCwgYXJncyA9IFsnJ10sIHdhaXRSZXNwb25zZSA9IHRydWUpIC0+XG4gICAgaWYgbm90IEBzb2NrZXQ/IG9yIEBzb2NrZXQuZGVzdHJveWVkIHRoZW4gcmV0dXJuXG4gICAgY29uc29sZS5sb2cgY29tbWFuZCwgYXJncy5qb2luKFwiIFwiKVxuICAgIGlmIHdhaXRSZXNwb25zZSB0aGVuIEByZXF1ZXN0UXVldWUucHVzaCB7Y29tbWFuZDpjb21tYW5kLCBhcmdzOmFyZ3N9XG4gICAgYXJnID0gYXJncy5qb2luICcgJ1xuICAgIEBzb2NrZXQud3JpdGUgY29tbWFuZC50b1VwcGVyQ2FzZSgpKycgJythcmcrJ1xcbidcblxuICBhZGRCcmVha3BvaW50OiAoe3BhdGgsIGxpbmV9KSAtPlxuICAgICAgQHNlbmRDb21tYW5kIEBjb21tYW5kcy5zZXRCcmVha3BvaW50LCBbQGVzY2FwZVBhdGgocGF0aCksIGxpbmVdLCBub3QgQHJ1bm5pbmdcblxuXG4gIHJlbW92ZUJyZWFrcG9pbnQ6ICh7cGF0aCwgbGluZX0pIC0+XG4gICAgICBAc2VuZENvbW1hbmQgQGNvbW1hbmRzLnJlbW92ZUJyZWFrcG9pbnQsIFtAZXNjYXBlUGF0aChwYXRoKSwgbGluZV0sIG5vdCBAcnVubmluZ1xuXG4gIGdldFN0YWNrOiAoKSAtPlxuICAgIGlmIG5vdCBAcnVubmluZyB0aGVuIEBzZW5kQ29tbWFuZCBAY29tbWFuZHMuZ2V0U3RhY2tcblxuICBzdGVwSW46IC0+XG4gICAgaWYgbm90IEBydW5uaW5nIHRoZW4gQHNlbmRDb21tYW5kIEBtZGJnLmNvbW1hbmRzLnN0ZXBJblxuXG4gIHN0ZXBPdXQ6IC0+XG4gICAgaWYgbm90IEBydW5uaW5nIHRoZW4gQHNlbmRDb21tYW5kIEBtZGJnLmNvbW1hbmRzLnN0ZXBPdXRcblxuICBzdGVwT3ZlcjogLT5cbiAgICBpZiBub3QgQHJ1bm5pbmcgdGhlbiBAc2VuZENvbW1hbmQgQG1kYmcuY29tbWFuZHMuc3RlcE92ZXJcbiJdfQ==
