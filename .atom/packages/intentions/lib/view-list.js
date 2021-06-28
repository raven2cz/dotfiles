/* @flow */

import { CompositeDisposable, Emitter } from 'sb-event-kit'
import type { Disposable } from 'sb-event-kit'
import type { TextEditor } from 'atom'

import ListElement from './elements/list'
import type { ListItem, ListMovement } from './types'

export default class ListView {
  emitter: Emitter;
  element: ListElement;
  subscriptions: CompositeDisposable;

  constructor() {
    this.emitter = new Emitter()
    this.element = new ListElement()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.emitter)
    this.subscriptions.add(this.element)
  }
  activate(editor: TextEditor, suggestions: Array<ListItem>) {
    this.element.render(suggestions, (selected) => {
      this.emitter.emit('did-select', selected)
      this.dispose()
    })
    this.element.move('move-to-top')

    const bufferPosition = editor.getCursorBufferPosition()
    const marker = editor.markBufferRange([bufferPosition, bufferPosition], { invalidate: 'never' })
    editor.decorateMarker(marker, {
      type: 'overlay',
      item: this.element,
    })
    this.subscriptions.add(function() {
      marker.destroy()
    })
  }
  move(movement: ListMovement) {
    this.element.move(movement)
  }
  select() {
    this.element.select()
  }
  onDidSelect(callback: Function): Disposable {
    return this.emitter.on('did-select', callback)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
