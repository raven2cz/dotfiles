/* @flow */

import type { TextEditor } from 'atom'
import { processListItems } from './helpers'
import { provider as validateProvider, suggestionsList as validateSuggestions } from './validate'
import type { ListProvider, ListItem } from './types'

export default class ProvidersList {
  number: number;
  providers: Set<ListProvider>;

  constructor() {
    this.number = 0
    this.providers = new Set()
  }
  addProvider(provider: ListProvider) {
    if (!this.hasProvider(provider)) {
      validateProvider(provider)
      this.providers.add(provider)
    }
  }
  hasProvider(provider: ListProvider): boolean {
    return this.providers.has(provider)
  }
  deleteProvider(provider: ListProvider) {
    if (this.hasProvider(provider)) {
      this.providers.delete(provider)
    }
  }
  async trigger(textEditor: TextEditor): Promise<Array<ListItem>> {
    const editorPath = textEditor.getPath()
    const bufferPosition = textEditor.getCursorBufferPosition()

    if (!editorPath) {
      return []
    }

    const scopes = textEditor.scopeDescriptorForBufferPosition(bufferPosition).getScopesArray()
    scopes.push('*')

    const promises = []
    this.providers.forEach(function(provider) {
      if (scopes.some(scope => provider.grammarScopes.indexOf(scope) !== -1)) {
        promises.push(new Promise(function(resolve) {
          resolve(provider.getIntentions({ textEditor, bufferPosition }))
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
      // Or we don't have any results
      return []
    }

    return processListItems(results)
  }
  dispose() {
    this.providers.clear()
  }
}
