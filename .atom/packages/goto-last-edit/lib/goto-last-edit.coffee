{CompositeDisposable} = require 'atom'

module.exports =
  config:
    historySize:
      description: 'Number of edit location to keep in history.'
      type: 'integer'
      default: 50

  subscriptions: null
  lastEditPosition: null
  historyPosition: 0
  history: []

  activate: (state) ->
    @subscriptions = new CompositeDisposable
    @historyMaxSize = atom.config.get('goto-last-edit.historySize')

    @subscriptions.add atom.commands.add 'atom-workspace',
      'goto-last-edit:back': => @run(true)
    @subscriptions.add atom.commands.add 'atom-workspace',
      'goto-last-edit:forward': => @run(false)

    @subscriptions.add atom.workspace.observeTextEditors (editor) =>
      editor.onDidStopChanging => @saveCursorPosition(editor)

  saveCursorPosition: (editor) ->
    if editor.buffer.previousModifiedStatus or editor.isModified()

      @lastEditPosition = {
        pane: atom.workspace.getActivePane(),
        editor: editor,
        position: editor.cursors[0]?.getBufferPosition()
      }
      #add position to history only if different
      @pushInHistory(@lastEditPosition) unless @hasNotChangedPosition()

  pushInHistory: () ->
    #if user is in the middle of the history, splice the forward elements
    if (@historyPosition < @history.length - 1)
      @history.splice(@historyPosition)
    #if user is at the end of the history, remove firsts elements (FIFO)
    if (@history.length >= @historyMaxSize)
      elementsToRemove = @history.length - @historyMaxSize + 1
      @history.splice(0, elementsToRemove)
      @historyPosition -= elementsToRemove
    @history.push(@lastEditPosition)
    @historyPosition++

  #convenient method to check if the change was made on a separate line
  #compared to the latest entry in the history
  hasNotChangedPosition: ->
    if @history.length > 0
      last = @history[@history.length - 1]
      return last.editor is @lastEditPosition.editor and last.position?.row is @lastEditPosition.position?.row
    else
      false

  run: (goBack)->
    if @history.length > 0
      @lastEditPosition = if goBack then @history[@historyPosition - 1] else @history[@historyPosition + 1]
      if @lastEditPosition
        @historyPosition = if goBack then @historyPosition - 1 else @historyPosition + 1
        if @lastEditPosition.editor.buffer.file?.path and @lastEditPosition.position
          options = {
            initialLine: @lastEditPosition.position.row,
            initialColumn: @lastEditPosition.position.column,
            activatePane: true,
            searchAllPanes: true
          }
          atom.workspace.open(@lastEditPosition.editor.buffer.file?.path, options)
        else
          if @lastEditPosition.editor not in atom.workspace.getTextEditors()
            return
          if @lastEditPosition.pane isnt atom.workspace.getActivePane()
            @lastEditPosition.pane.activate()
          if @lastEditPosition.editor isnt atom.workspace.getActiveTextEditor()
            atom.workspace.getActivePane().activateItem(@lastEditPosition.editor)
          atom.workspace.getActiveTextEditor().setCursorBufferPosition(
            @lastEditPosition.position,
            autoscroll: false
          )
          atom.workspace.getActiveTextEditor().scrollToCursorPosition(center: true)
      else if not goBack and @historyPosition == @history.length - 1
        @historyPosition++

  deactivate: ->
    @subscriptions.dispose()
