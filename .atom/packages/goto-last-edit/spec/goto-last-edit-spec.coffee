describe "GotoLastEdit", ->
  [workspaceElement, promise, thisPackage] = []

  beforeEach ->
    workspaceElement = atom.views.getView(atom.workspace)
    atom.project.setPaths([__dirname])
    spyOn(atom.workspace, 'open').andCallThrough()
    promise = atom.packages.activatePackage('goto-last-edit').then ({mainModule}) ->
      thisPackage = mainModule
      atom.workspace.open('../lib/goto-last-edit.coffee')
      atom.workspace.open('../keymaps/goto-last-edit.cson')

  describe "when user writes text", ->
    it "inserts into the last edit history", ->
      waitsForPromise ->
        promise

      runs ->
        activeEditor = atom.workspace.getActiveTextEditor()
        # Write something
        activeEditor.insertText('Edit')
        window.advanceClock(1000)
        expect(thisPackage.history.length).toBe 1
        expect(thisPackage.historyPosition).toBe 1


        # Change editor
        atom.workspace.getActivePane().activatePreviousItem()
        activeEditor = atom.workspace.getActiveTextEditor()

        # Write something
        activeEditor.insertText('Another Edit')
        window.advanceClock(1000)
        expect(thisPackage.history.length).toBe 2
        expect(thisPackage.historyPosition).toBe 2
        expect(thisPackage.history.pop().position).toEqual [0, 12]

    it "does not insert more element than history size", ->
      atom.config.set('goto-last-edit.historySize', 1)

      waitsForPromise ->
        promise

      runs ->
        thisPackage.history = []
        activeEditor = atom.workspace.getActiveTextEditor()
        # Write something
        activeEditor.insertText('Edit')
        window.advanceClock(1000)
        expect(thisPackage.history.length).toBe 1

        # Change editor
        atom.workspace.getActivePane().activatePreviousItem()
        activeEditor = atom.workspace.getActiveTextEditor()

        # Write something
        activeEditor.insertText('Another Edit')
        window.advanceClock(1000)
        expect(thisPackage.history.length).toBe 1
        expect(thisPackage.history.pop().position).toEqual [0, 12]

  describe "when the goto-last-edit:back then goto-last-edit:forward are triggered", ->
    it "goes to the last edit then returns", ->
      waitsForPromise ->
        promise

      runs ->
        thisPackage.history = []
        thisPackage.historyPosition = 0
        activeEditor = atom.workspace.getActiveTextEditor()
        expect(activeEditor.getPath()).toContain 'goto-last-edit.cson'
        # Change cursor position
        activeEditor.moveDown(2)
        activeEditor.moveRight(2)

        # Write something
        activeEditor.insertText('Edit')
        window.advanceClock(1000)
        expect(activeEditor.getCursorBufferPosition()).toEqual [2, 6]
        expect(thisPackage.lastEditPosition.position).toEqual [2, 6]

        # Change cursor position
        activeEditor.moveUp(1)
        activeEditor.moveLeft(1)

        # Write something
        activeEditor.insertText('Another Edit')
        window.advanceClock(1000)

        # Change editor
        atom.workspace.getActivePane().activatePreviousItem()
        activeEditor = atom.workspace.getActiveTextEditor()
        expect(activeEditor.getPath()).toContain 'goto-last-edit.coffee'
        expect(activeEditor.getCursorBufferPosition()).toEqual [0, 0]

        # Run the goto last edit command
        atom.commands.dispatch workspaceElement, 'goto-last-edit:back'
        options = {
          initialLine: 1,
          initialColumn: 17,
          activatePane: true,
          searchAllPanes: true
        }
        expect(atom.workspace.open.callCount).toBe 3
        spyCall = atom.workspace.open.mostRecentCall
        expect(spyCall.args[0]).toContain('goto-last-edit.cson')
        expect(spyCall.args[1]).toEqual options

        # Run the goto last edit command again
        atom.commands.dispatch workspaceElement, 'goto-last-edit:back'
        options = {
          initialLine: 2,
          initialColumn: 6,
          activatePane: true,
          searchAllPanes: true
        }
        expect(atom.workspace.open.callCount).toBe 4
        spyCall = atom.workspace.open.mostRecentCall
        expect(spyCall.args[0]).toContain('goto-last-edit.cson')
        expect(spyCall.args[1]).toEqual options

        # Run the goto last edit (forward) command
        atom.commands.dispatch workspaceElement, 'goto-last-edit:forward'
        options = {
          initialLine: 1,
          initialColumn: 17,
          activatePane: true,
          searchAllPanes: true
        }
        expect(atom.workspace.open.callCount).toBe 5
        spyCall = atom.workspace.open.mostRecentCall
        expect(spyCall.args[0]).toContain('goto-last-edit.cson')
        expect(spyCall.args[1]).toEqual options
