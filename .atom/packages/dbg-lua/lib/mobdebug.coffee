fs = require 'fs'
path = require 'path'
net = require 'net'
{BufferedProcess, CompositeDisposable, Emitter} = require 'atom'

module.exports =

class MobDebug
  responseStatus:
    requestAccepted: '200'
    badRequest: '400'
    errorInExecution: '401'
    break: '202'
    watch: '203'
    output: '204'

  commands:
    continue: 'run'
    stepIn: 'step'
    stepOut: 'out'
    stepOver: 'over'
    pause: 'suspend'
    exit: 'exit'
    done: 'done'
    getStack: 'stack'
    setBaseDirectory: 'basedir'
    setBreakpoint: 'setb'
    removeBreakpoint: 'delb'
    addWatchExpression: 'setw'
    removeWatchExpression: 'delw'

  debugEvents:
    requestAccepted: 'requestAccepted'
    pausedAtBreakpoint: 'break'
    receivedStack: 'stack'
    startedListen: 'listen'
    connectionClosed: 'close'
    error: 'error'

  constructor: () ->
    @socket = null
    @requestQueue = []
    @emitter = new Emitter()
    @breakpoints = []
    @running = false

  escapePath: (filepath) ->
    return (filepath.replace /\\/g, '/').replace /[\s\t\n]/g, '\\ '

  start: (options) ->
    @listen(options.port||8172, options.host||'localhost')

  listen: (port, host) ->
    @server = net.createServer (socket) =>
      @socket = socket
      console.log 'CONNECTED:', @socket.remoteAddress+':'+@socket.remotePort
      @emitter.emit @debugEvents.startedListen, @socket

      @socket.on 'data' , @onReceive
      @socket.on 'close', (data) =>
        console.log 'CLOSED:', @socket.remoteAddress+':'+@socket.remotePort
        @emitter.emit @debugEvents.connectionClosed, @socket

    @server.listen port||8172, host||'localhost'

  onReceive: (data) =>
    response = data.toString()
    console.log 'DATA', @socket.remoteAddress+':'+@socket.remotePort, response
    messages = response.split '\n'
    for message in messages
      if message == "" || message == null then continue
      code = message.match(///^[0-9]+///g)[0]
      switch code
        when @responseStatus.requestAccepted
          request = @requestQueue.shift()
          switch request.command
            when @commands.continue then @running = true
            when @commands.pause then @running = false
            when @commands.getStack then @parseStack response
          @emitter.emit @debugEvents.requestAccepted, {request:request, response:response}
        when @responseStatus.badRequest
          if @requestQueue.length > 0
            @requestQueue.shift()
        when @responseStatus.break
          @running = false
          filepath = path.resolve atom.project.getPaths()[0], '.'+message.split(' ')[2]
          line = message.match(///[0-9]+$///g)[0]
          @emitter.emit @debugEvents.pausedAtBreakpoint, {path: filepath, line: line}

  stop: () ->
    @sendCommand @commands.done
    @socket?.end()
    @socket?.destroy()
    @server?.close()
    @emitter = new Emitter()
    @requestQueue = []
    @running = false


  parseStack: (dump) ->
    new Promise (resolve, reject) =>
      output = ''
      script = path.resolve __dirname, './lua_stack.lua'
      @process = new BufferedProcess
        command: 'lua'
        args: [script]
        options:
          cwd: atom.project.getPaths()[0]
        stdout: (data) =>
          output += data
        stderr: (data) =>
          output += data
          @emitter.emit @debugEvents.error, error
          reject output
        exit: (data) =>
          result = JSON.parse output
          @emitter.emit @debugEvents.receivedStack, result
          resolve result
      @process.process.stdin.write dump+@escapePath(atom.project.getPaths()[0])+'\r\n', binary: true


  sendCommand: (command, args = [''], waitResponse = true) ->
    if not @socket? or @socket.destroyed then return
    console.log command, args.join(" ")
    if waitResponse then @requestQueue.push {command:command, args:args}
    arg = args.join ' '
    @socket.write command.toUpperCase()+' '+arg+'\n'

  addBreakpoint: ({path, line}) ->
      @sendCommand @commands.setBreakpoint, [@escapePath(path), line], not @running


  removeBreakpoint: ({path, line}) ->
      @sendCommand @commands.removeBreakpoint, [@escapePath(path), line], not @running

  getStack: () ->
    if not @running then @sendCommand @commands.getStack

  stepIn: ->
    if not @running then @sendCommand @mdbg.commands.stepIn

  stepOut: ->
    if not @running then @sendCommand @mdbg.commands.stepOut

  stepOver: ->
    if not @running then @sendCommand @mdbg.commands.stepOver
