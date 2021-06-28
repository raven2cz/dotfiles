helpers = null
fs = require 'fs'
{CompositeDisposable} = require 'atom'
{XRegExp} = require 'xregexp'
stds = require './stds'

module.exports =
  config:
    luac:
      type: 'string'
      default: 'luac'
      description: 'The executable path to luac.'
    levelGet:
      type: 'string'
      enum: ['trace', 'info', 'warning', 'error']
      default: 'warning'
      title: 'Error Level for GETGLOBAL Messages'
    levelSet:
      type: 'string'
      enum: ['trace', 'info', 'warning', 'error']
      default: 'warning'
      title: 'Error Level for SETGLOBAL Messages'
    ignoreStandardGlobals:
      type: 'string'
      enum: ['none', 'lua51', 'lua52', 'lua53', 'luajit', 'min', 'max']
      default: 'none'
      description: '\'min\' is the intersection and \'max\' is the union of globals for the different versions.'
    whitelist:
      type: 'array'
      default: []
      description: 'Path to a text file with global names one per line to exclude from messages. (You may include multiple files separated with a comma)'
    SETGLOBALFILE:
      type: 'boolean'
      default: true
      title: 'SETGLOBALFILE'
      description: 'Enable/disable SETGLOBAL checks in the global scope.'
    SETGLOBALFUNC:
      type: 'boolean'
      default: true
      title: 'SETGLOBALFUNC'
      description: 'Enable/disable SETGLOBAL checks in functions.'
    GETGLOBALFILE:
      type: 'boolean'
      default: false
      title: 'GETGLOBALFILE'
      description: 'Enable/disable GETGLOBAL checks in the global scope.'
    GETGLOBALFUNC:
      type: 'boolean'
      default: true
      title: 'GETGLOBALFUNC'
      description: 'Enable/disable GETGLOBAL checks in functions.'

  activate: ->
    require('atom-package-deps').install('linter-lua-findglobals')

    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.config.observe 'linter-lua-findglobals.luac', (executable) =>
      @executable = executable
      @parameters = ['-p', '-l', '-']
    @subscriptions.add atom.config.observe 'linter-lua-findglobals.whitelist', (files) =>
      return unless files?
      @whitelist = {}
      for file in files
        fs.readFile file, (err, data) =>
          return if err
          for name in data.toString().split('\n')
            name = name.trim()
            @whitelist[name] = true if name.length > 0

  deactivate: ->
    @subscriptions.dispose()

  provideLinter: ->
    provider =
      grammarScopes: ['source.lua']
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) =>
        helpers ?= require('atom-linter')
        filePath = textEditor.getPath()
        source = textEditor.getText() or '\n'

        stdGlobals = stds[atom.config.get 'linter-lua-findglobals.ignoreStandardGlobals']
        globals = {}

        # check for excluded globals in the source file
        XRegExp.forEach source, /^\s*\-\-\s*GLOBALS:\s*(.*)$/gm, (match, i) ->
          XRegExp.forEach match[1...], /[\w_]+/, (match, j) -> # don't include 'GLOBALS:' from the first capture
            globals[match[0]] = true

        # set directives from the source file
        GETGLOBALFILE = atom.config.get 'linter-lua-findglobals.GETGLOBALFILE'
        result = /^\s*\-\-\s*GETGLOBALFILE\s+(ON|OFF)$/m.exec source
        if result?
          if result[1] == 'ON' then GETGLOBALFILE = true
          if result[1] == 'OFF' then GETGLOBALFILE = false

        GETGLOBALFUNC = atom.config.get 'linter-lua-findglobals.GETGLOBALFUNC'
        result = /^\s*\-\-\s*GETGLOBALFUNC\s+(ON|OFF)$/m.exec source
        if result?
          if result[1] == 'ON' then GETGLOBALFUNC = true
          if result[1] == 'OFF' then GETGLOBALFUNC = false

        SETGLOBALFILE = atom.config.get 'linter-lua-findglobals.SETGLOBALFILE'
        result = /^\s*\-\-\s*SETGLOBALFILE\s+(ON|OFF)$/m.exec source
        if result?
          if result[1] == 'ON' then SETGLOBALFILE = true
          if result[1] == 'OFF' then SETGLOBALFILE = false

        SETGLOBALFUNC = atom.config.get 'linter-lua-findglobals.SETGLOBALFUNC'
        result = /^\s*\-\-\s*SETGLOBALFUNC\s+(ON|OFF)$/m.exec source
        if result?
          if result[1] == 'ON' then SETGLOBALFUNC = true
          if result[1] == 'OFF' then SETGLOBALFUNC = false

        # run the linter
        return helpers.exec(@executable, @parameters, { stdin: source, throwOnStdErr: false }).then (output) =>
          messages = []
          funcScope = false

          # grep the bytecode output for GETGLOBAL and SETGLOBAL
          for line in output.split("\n")
            if /^main </.test line
              funcScope = false
            else if /^function </.test line
              funcScope = true
            else if ((/SETGLOBAL/.test(line) or /SETTABUP.+; _ENV/.test(line)) and ((funcScope and SETGLOBALFUNC) or (not funcScope and SETGLOBALFILE))) or
                    ((/GETGLOBAL/.test(line) or /GETTABUP.+; _ENV/.test(line)) and ((funcScope and GETGLOBALFUNC) or (not funcScope and GETGLOBALFILE)))
              result = /\[(\d+)\]\s+(?:(GET|SET)(?:GLOBAL|TABUP)).+; (?:_ENV ")?(\w+)/.exec line
              [_, lineNumber, op, name] = result if result?
              if name? and not globals[name] and not @whitelist[name] and not stdGlobals[name]
                lineNumber = +lineNumber - 1
                text = textEditor.lineTextForBufferRow(lineNumber)
                colStart = text.search(name) or 0
                colEnd = if colStart == -1 then text.length else colStart + name.length
                level = if op is 'GET' then atom.config.get 'linter-lua-findglobals.levelGet' else atom.config.get 'linter-lua-findglobals.levelSet'

                messages.push({
                  type: level
                  text: "#{op}GLOBAL #{name}"
                  filePath: filePath
                  range: [
                    [lineNumber, colStart],
                    [lineNumber, colEnd]
                  ]
                })

          return messages
