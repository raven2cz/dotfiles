MobDebug = require './mobdebug'
fs = require 'fs'
path = require 'path'
net = require 'net'
{BufferedProcess, CompositeDisposable, Emitter} = require 'atom'


module.exports = DbgLua =
  config:
    logToConsole:
      title: 'Log to developer console'
      description: 'For debugging Lua problems'
      type: 'boolean'
      default: true
  logToConsole: true
  dbg: null
  modalPanel: null
  outputPanel: null
  ui: null
  interactiveSession: null
  showOutputPanel: false
  unseenOutputPanelContent: false
  closedNaturally: false
  connected: false
  breakpoints: []
  mdbg: new MobDebug()
  variables: []

  activate: (state) ->
    #require('atom-package-deps').install('dbg-lua')

    atom.config.observe 'dbg-lua.logToConsole', (set) =>
      @logToConsole = set

  consumeOutputPanel: (outputPanel) ->
    @outputPanel = outputPanel

  debug:(options, api) ->
    @ui = api.ui
    @breakpoints = api.breakpoints
    @outputPanel?.clear()

    @mdbg.emitter.on @mdbg.debugEvents.startedListen, (socket) =>
      @outputPanel.print "Connected to #{socket.remoteAddress}:#{socket.remotePort}" if @outputPanel?
      dirs = atom.project.getDirectories()
      breakpoints = @breakpoints.filter((b) => dirs.filter((p) => b.path.match p)?)
      @addBreakpoint breakpoint for breakpoint in breakpoints

    @mdbg.emitter.on @mdbg.debugEvents.connectionClosed, (socket) =>
      @ui.stop()
      @stop()

    @mdbg.emitter.on @mdbg.debugEvents.requestAccepted, ({request, response}) =>
      switch request.command
        when @mdbg.commands.continue
          @ui.running()

    @mdbg.emitter.on @mdbg.debugEvents.pausedAtBreakpoint, (breakpoint) =>
      @ui.paused()
      @mdbg.getStack()

    @mdbg.emitter.on @mdbg.debugEvents.receivedStack, ({stack, variables}) =>
      stack.reverse()
      @variables = variables
      frame.file = frame.file.replace /\//g, '\\' for frame in stack
      @ui.setStack stack
      @ui.setVariables @variables[@variables.length-1]
      @ui.setFrame stack.length-1

    @mdbg.emitter.on @mdbg.debugEvents.error, (error) =>
      console.error error

    @start options

  cleanupFrame: ->
    @errorEncountered = null

  start: (options) ->
    @ui.paused()
    @showOutputPanel = true
    @unseenOutputPanelContent = false
    @outputPanel?.clear()

    if @outputPanel and @outputPanel.getInteractiveSession
      interactiveSession = @outputPanel.getInteractiveSession()
      if interactiveSession.pty then @interactiveSession = interactiveSession

    if @interactiveSession
      @interactiveSession.pty.on 'data', (data) =>
        if @showOutputPanelNext
          @showOutputPanelNext = false
          @outputPanel.show()
        @unseenOutputPanelContent = true

    @mdbg.start(options)

    @outputPanel.print "Run programm that need to debug" if @outputPanel?

  stop: ->
    @mdbg.stop()
    @cleanupFrame()

    @breakpoints = []
    @connected = false
    @running = false

    if @interactiveSession
      @interactiveSession.discard()
      @interactiveSession = null

    if !@closedNaturally or !@unseenOutputPanelContent
      @outputPanel?.hide()

  continue: ->
    @mdbg.sendCommand @mdbg.commands.continue

  pause: ->
    @mdbg.sendCommand @mdbg.commands.pause

  selectFrame: (index) ->
    @ui.setFrame index
    @ui.setVariables @variables[index]

  getVariableChildren: (name) ->
    return new Promise (fulfill) =>
      empty_variable = [
        name: ''
        type: ''
        value: ''
        expandable: false
      ]
      fulfill [empty_variable]

  stepIn: ->
    @mdbg.sendCommand @mdbg.commands.stepIn

  stepOut: ->
    @mdbg.sendCommand @mdbg.commands.stepOut

  stepOver: ->
    @mdbg.sendCommand @mdbg.commands.stepOver

  addBreakpoint: (breakpoint) ->
    filepath = '/'+atom.project.relativizePath(breakpoint.path)[1]
    @mdbg.addBreakpoint {path:filepath, line:breakpoint.line}

  removeBreakpoint: (breakpoint) ->
    filepath = '/'+atom.project.relativizePath(breakpoint.path)[1]
    @mdbg.removeBreakpoint {path:filepath, line:breakpoint.line}

  provideDbgProvider: ->
    name: 'dbg-lua'
    description: "Lua debugger"

    canHandleOptions: (options) =>
      return new Promise(fulfill, reject) =>
            fulfill true

    debug: @debug.bind this
    stop: @stop.bind this

    continue: @continue.bind this
    pause: @pause.bind this

    selectFrame: @selectFrame.bind this
    getVariableChildren: @getVariableChildren.bind this

    stepIn: @stepIn.bind this
    stepOver: @stepOver.bind this
    stepOut: @stepOut.bind this

    addBreakpoint: @addBreakpoint.bind this
    removeBreakpoint: @removeBreakpoint.bind this

  consumeDbg: (dbg) ->
    @dbg = dbg
