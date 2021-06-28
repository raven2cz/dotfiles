/* @flow */

import { Range } from 'atom'
import type { TextEditor } from 'atom'
import { provider as validateProvider, suggestionsShow as validateSuggestions } from './validate'
import { create as createElement, PADDING_CHARACTER } from './elements/highlight'
import type { HighlightProvider, HighlightItem } from './types'

export default class ProvidersHighlight {
  number: number;
  providers: Set<HighlightProvider>;

  constructor() {
    this.number = 0
    this.providers = new Set()
  }
  addProvider(provider: HighlightProvider) {
    if (!this.hasProvider(provider)) {
      validateProvider(provider)
      this.providers.add(provider)
    }
  }
  hasProvider(provider: HighlightProvider): boolean {
    return this.providers.has(provider)
  }
  deleteProvider(provider: HighlightProvider) {
    if (this.hasProvider(provider)) {
      this.providers.delete(provider)
    }
  }
  async trigger(textEditor: TextEditor): Promise<Array<HighlightItem>> {
    const editorPath = textEditor.getPath()
    const bufferPosition = textEditor.getCursorBufferPosition()

    if (!editorPath) {
      return []
    }

    const scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray()
    scopes.push('*')

    const visibleRange = Range.fromObject([
      textEditor.bufferPositionForScreenPosition([textEditor.getFirstVisibleScreenRow(), 0]),
      textEditor.bufferPositionForScreenPosition([textEditor.getLastVisibleScreenRow(), 0]),
    ])
    // Setting this to infinity on purpose, cause the buffer position just marks visible column
    // according to element width
    visibleRange.end.column = Infinity

    const promises = []
    this.providers.forEach(function(provider) {
      if (scopes.some(scope => provider.grammarScopes.indexOf(scope) !== -1)) {
        promises.push(new Promise(function(resolve) {
          resolve(provider.getIntentions({ textEditor, visibleRange }))
        }).then(function(results) {
          if (atom.inDevMode()) {
            validateSuggestions(results)
          }
          return results
        }))
      }
    })

    const number = ++this.number
    const results = (await Promise.all(promises)).reduce(function(items, item) {
      if (Array.isArray(item)) {
        return items.concat(item)
      }
      return items
    }, [])

    if (number !== this.number || !results.length) {
      // If has been executed one more time, ignore these results
      // Or we just don't have any results
      return []
    }

    return results
  }
  paint(textEditor: TextEditor, intentions: Array<HighlightItem>): (() => void) {
    const markers = []
    for (const intention of (intentions: Array<HighlightItem>)) {
      const matchedText = textEditor.getTextInBufferRange(intention.range)
      const marker = textEditor.markBufferRange(intention.range)
      const element = createElement(intention, matchedText.length)
      intention.created({ textEditor, element, marker, matchedText })
      textEditor.decorateMarker(marker, {
        type: 'overlay',
        position: 'tail',
        item: element,
      })
      marker.onDidChange(function({ newHeadBufferPosition: start, oldTailBufferPosition: end }) {
        element.textContent = PADDING_CHARACTER.repeat(textEditor.getTextInBufferRange([start, end]).length)
      })
      markers.push(marker)
    }
    return function() {
      markers.forEach(function(marker) {
        try {
          marker.destroy()
        } catch (_) { /* No Op */ }
      })
    }
  }
  dispose() {
    this.providers.clear()
  }
}
