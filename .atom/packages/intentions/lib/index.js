/* @flow */

import { Disposable } from 'atom'
import Intentions from './main'
import type { ListProvider, HighlightProvider } from './types'

export default {
  activate() {
    this.intentions = new Intentions()
    this.intentions.activate()
  },
  deactivate() {
    this.intentions.dispose()
  },
  consumeListIntentions(provider: ListProvider | Array<ListProvider>) {
    const providers = [].concat(provider)
    providers.forEach((entry) => {
      this.intentions.consumeListProvider(entry)
    })
    return new Disposable(() => {
      providers.forEach((entry) => {
        this.intentions.deleteListProvider(entry)
      })
    })
  },
  consumeHighlightIntentions(provider: HighlightProvider | Array<HighlightProvider>) {
    const providers = [].concat(provider)
    providers.forEach((entry) => {
      this.intentions.consumeHighlightProvider(entry)
    })
    return new Disposable(() => {
      providers.forEach((entry) => {
        this.intentions.deleteHighlightProvider(entry)
      })
    })
  },
}
