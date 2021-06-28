/* @flow */

import { CompositeDisposable } from 'sb-event-kit'
import { it, beforeEach, wait } from 'jasmine-fix'
import Commands from '../lib/commands'
import { getKeyboardEvent } from './helpers'

describe('Commands', function() {
  let commands
  let editorView

  beforeEach(async function() {
    commands = new Commands()
    commands.activate()
    await atom.workspace.open(__filename)
    editorView = atom.views.getView(atom.workspace.getActiveTextEditor())
  })
  afterEach(function() {
    atom.workspace.destroyActivePane()
    commands.dispose()
  })
  function dispatchEventOnBody(event) {
    // $FlowIgnore: Document.body is never null in our case
    document.body.dispatchEvent(event)
  }

  describe('Highlights', function() {
    it('does nothing if not activated and we try to deactivate', function() {
      commands.processHighlightsHide()
    })
    it('does not activate unless provider tells it to', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onHighlightsShow(function() {
        timesShow++
        return Promise.resolve(false)
      })
      commands.onHighlightsHide(function() {
        timesHide++
      })
      await commands.processHighlightsShow()
      commands.processHighlightsHide()

      expect(timesShow).toBe(1)
      expect(timesHide).toBe(0)
    })
    it('activates when the provider tells it to', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onHighlightsShow(function() {
        timesShow++
        return Promise.resolve(true)
      })
      commands.onHighlightsHide(function() {
        timesHide++
      })
      await commands.processHighlightsShow()
      commands.processHighlightsHide()

      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
    })
    it('throws if already highlighted', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onHighlightsShow(function() {
        timesShow++
        return Promise.resolve(true)
      })
      commands.onHighlightsHide(function() {
        timesHide++
      })
      await commands.processHighlightsShow()
      try {
        await commands.processHighlightsShow()
        expect(false).toBe(true)
      } catch (error) {
        expect(error.message).toBe('Already active')
      }
      try {
        await commands.processHighlightsShow()
        expect(false).toBe(true)
      } catch (error) {
        expect(error.message).toBe('Already active')
      }
      commands.processHighlightsHide()
      commands.processHighlightsHide()
      commands.processHighlightsHide()

      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
    })
    it('disposes list if available', async function() {
      let disposed = false
      const active = { type: 'list', subscriptions: new CompositeDisposable() }
      active.subscriptions.add(function() {
        disposed = true
      })
      commands.active = active
      expect(disposed).toBe(false)
      await commands.processHighlightsShow()
      expect(disposed).toBe(true)
    })
    it('adds and removes classes appropriately', async function() {
      commands.onHighlightsShow(function() {
        return Promise.resolve(true)
      })
      expect(editorView.classList.contains('intentions-highlights')).toBe(false)
      await commands.processHighlightsShow()
      expect(editorView.classList.contains('intentions-highlights')).toBe(true)
      commands.processHighlightsHide()
      expect(editorView.classList.contains('intentions-highlights')).toBe(false)
    })
    describe('command listener', function() {
      it('just activates if theres no keyboard event attached', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          timesHide++
        })
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.commands.dispatch(editorView, 'intentions:highlight')
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
      it('ignores more than one activation requests', async function() {
        let timesShow = 0
        commands.onHighlightsShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        expect(timesShow).toBe(1)
      })
      it('disposes the keyboard listener when we dispose it with the class function', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          timesHide++
        })
        spyOn(commands, 'processHighlightsHide').andCallThrough()
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keydown'))
        await wait(10)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
        expect(commands.processHighlightsHide.calls.length).toBe(1)
      })
      it('just activates if keyboard event is not keydown', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          timesHide++
        })
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
      it('does not deactivate if keyup is not same keycode', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          timesHide++
        })
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keydown'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        dispatchEventOnBody(getKeyboardEvent('keyup', 1))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
      it('does deactivate if keyup is the same keycode', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onHighlightsShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onHighlightsHide(function() {
          timesHide++
        })
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.keymaps.dispatchCommandEvent('intentions:highlight', editorView, getKeyboardEvent('keydown'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
        commands.processHighlightsHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
    })
  })
  describe('Lists', function() {
    it('does nothing if deactivated and we try to activate it', function() {
      commands.processListHide()
    })
    it('does not pass on move events if not activated', function() {
      const callback = jasmine.createSpy('commands:list-move')
      commands.onListMove(callback)
      commands.processListMove('up')
      commands.processListMove('down')
      commands.processListMove('down')
      expect(callback).not.toHaveBeenCalled()
    })
    it('passes on move events if activated', function() {
      const callback = jasmine.createSpy('commands:list-move')
      commands.onListMove(callback)
      commands.processListMove('down')
      commands.processListMove('down')
      commands.processListMove('down')
      commands.active = { type: 'list', subscriptions: new CompositeDisposable() }
      commands.processListMove('down')
      commands.processListMove('down')
      commands.processListMove('down')
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(3)
    })
    it('ignores confirm if not activated', function() {
      const callback = jasmine.createSpy('commands:list-confirm')
      commands.onListConfirm(callback)
      commands.processListConfirm()
      commands.processListConfirm()
      commands.processListConfirm()
      commands.processListConfirm()
      expect(callback).not.toHaveBeenCalled()
    })
    it('passes on confirm if activated', function() {
      const callback = jasmine.createSpy('commands:list-confirm')
      commands.onListConfirm(callback)
      commands.processListConfirm()
      commands.processListConfirm()
      commands.active = { type: 'list', subscriptions: new CompositeDisposable() }
      commands.processListConfirm()
      commands.processListConfirm()
      expect(callback).toHaveBeenCalled()
      expect(callback.calls.length).toBe(2)
    })
    it('does not activate if listeners dont say that', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onListShow(function() {
        timesShow++
        return Promise.resolve(false)
      })
      commands.onListHide(function() {
        timesHide++
      })
      await commands.processListShow()
      commands.processListHide()
      expect(timesShow).toBe(1)
      expect(timesHide).toBe(0)
    })
    it('activates when listeners allow', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onListShow(function() {
        timesShow++
        return Promise.resolve(true)
      })
      commands.onListHide(function() {
        timesHide++
      })
      await commands.processListShow()
      commands.processListHide()
      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
    })
    it('ignores if list is already active', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onListShow(function() {
        timesShow++
        return Promise.resolve(true)
      })
      commands.onListHide(function() {
        timesHide++
      })
      await commands.processListShow()
      try {
        await commands.processListShow()
        expect(false).toBe(true)
      } catch (error) {
        expect(error.message).toBe('Already active')
      }
      try {
        await commands.processListShow()
        expect(false).toBe(true)
      } catch (error) {
        expect(error.message).toBe('Already active')
      }
      try {
        await commands.processListShow()
        expect(false).toBe(true)
      } catch (error) {
        expect(error.message).toBe('Already active')
      }
      commands.processListHide()
      commands.processListHide()
      commands.processListHide()
      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
    })
    it('disposes if highlights are active', async function() {
      let disposed = false
      let timesShow = 0
      let timesHide = 0
      commands.onListShow(function() {
        timesShow++
        return Promise.resolve(true)
      })
      commands.onListHide(function() {
        timesHide++
      })
      await commands.processListShow()
      commands.processListHide()
      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
      commands.active = { type: 'highlight', subscriptions: new CompositeDisposable() }
      commands.active.subscriptions.add(function() {
        disposed = true
      })
      expect(disposed).toBe(false)
      await commands.processListShow()
      commands.processListHide()
      expect(disposed).toBe(true)
      expect(timesShow).toBe(2)
      expect(timesHide).toBe(2)
    })
    it('adds and removes classes appropriately', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onListShow(function() {
        timesShow++
        return Promise.resolve(true)
      })
      commands.onListHide(function() {
        timesHide++
      })
      expect(editorView.classList.contains('intentions-list')).toBe(false)
      await commands.processListShow()
      expect(editorView.classList.contains('intentions-list')).toBe(true)
      commands.processListHide()
      expect(editorView.classList.contains('intentions-list')).toBe(false)
      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
    })
    it('disposes list on mouseup', async function() {
      let timesShow = 0
      let timesHide = 0
      commands.onListShow(function() {
        timesShow++
        return Promise.resolve(true)
      })
      commands.onListHide(function() {
        timesHide++
      })
      await commands.processListShow()
      commands.processListHide()
      expect(timesShow).toBe(1)
      expect(timesHide).toBe(1)
      await commands.processListShow()
      dispatchEventOnBody(new MouseEvent('mouseup'))
      await wait(10)
      expect(timesShow).toBe(2)
      expect(timesHide).toBe(2)
    })
    describe('command listener', function() {
      it('just enables when no keyboard event', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onListShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onListHide(function() {
          timesHide++
        })
        atom.commands.dispatch(editorView, 'intentions:show')
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        commands.processListHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
      it('just enables when keyboard event is not keydown', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onListShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onListHide(function() {
          timesHide++
        })
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        commands.processListHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
      it('disposes the keyboard listener when we dispose it with the class function', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onListShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onListHide(function() {
          timesHide++
        })
        spyOn(commands, 'processListHide').andCallThrough()
        expect(timesShow).toBe(0)
        expect(timesHide).toBe(0)
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        commands.processListHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
        expect(commands.processListHide.calls.length).toBe(1)
      })
      it('ignores more than one activation requests', async function() {
        let timesShow = 0
        commands.onListShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, getKeyboardEvent('keypress'))
        await wait(10)
        expect(timesShow).toBe(1)
      })
      it('disposes itself on any commands other than known', async function() {
        let timesShow = 0
        let timesHide = 0
        commands.onListShow(function() {
          timesShow++
          return Promise.resolve(true)
        })
        commands.onListHide(function() {
          timesHide++
        })
        atom.keymaps.dispatchCommandEvent('intentions:show', editorView, getKeyboardEvent('keydown'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-up' } })
        await wait(10)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-down' } })
        await wait(10)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(0)

        atom.keymaps.emitter.emit('did-match-binding', { binding: { command: 'core:move-confirm' } })
        await wait(10)
        dispatchEventOnBody(getKeyboardEvent('keyup'))
        await wait(10)
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)

        commands.processListHide()
        expect(timesShow).toBe(1)
        expect(timesHide).toBe(1)
      })
    })
  })
})
