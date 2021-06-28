/* @flow */

import { CompositeDisposable, Disposable } from 'sb-event-kit'

import Commands from './commands'
import ListView from './view-list'
import ProvidersList from './providers-list'
import ProvidersHighlight from './providers-highlight'
import type { ListProvider, HighlightProvider } from './types'

export default class Intentions {
  active: ?Disposable;
  commands: Commands;
  providersList: ProvidersList;
  providersHighlight: ProvidersHighlight;
  subscriptions: CompositeDisposable;
  constructor() {
    this.active = null
    this.commands = new Commands()
    this.providersList = new ProvidersList()
    this.providersHighlight = new ProvidersHighlight()
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(this.commands)
    this.subscriptions.add(this.providersList)
    this.subscriptions.add(this.providersHighlight)

    // eslint-disable-next-line arrow-parens
    this.commands.onListShow(async (textEditor) => {
      const results = await this.providersList.trigger(textEditor)
      if (!results.length) {
        return false
      }

      const listView = new ListView()
      const subscriptions = new CompositeDisposable()

      listView.activate(textEditor, results)
      listView.onDidSelect(function(intention) {
        intention.selected()
        subscriptions.dispose()
      })

      subscriptions.add(listView)
      subscriptions.add(() => {
        if (this.active === subscriptions) {
          this.active = null
        }
      })
      subscriptions.add(this.commands.onListMove(function(movement) {
        listView.move(movement)
      }))
      subscriptions.add(this.commands.onListConfirm(function() {
        listView.select()
      }))
      subscriptions.add(this.commands.onListHide(function() {
        subscriptions.dispose()
      }))
      this.active = subscriptions
      return true
    })
    // eslint-disable-next-line arrow-parens
    this.commands.onHighlightsShow(async (textEditor) => {
      const results = await this.providersHighlight.trigger(textEditor)
      if (!results.length) {
        return false
      }

      const painted = this.providersHighlight.paint(textEditor, results)
      const subscriptions = new CompositeDisposable()

      subscriptions.add(() => {
        if (this.active === subscriptions) {
          this.active = null
        }
      })
      subscriptions.add(this.commands.onHighlightsHide(function() {
        subscriptions.dispose()
      }))
      subscriptions.add(painted)
      this.active = subscriptions

      return true
    })
  }
  activate() {
    this.commands.activate()
  }
  consumeListProvider(provider: ListProvider) {
    this.providersList.addProvider(provider)
  }
  deleteListProvider(provider: ListProvider) {
    this.providersList.deleteProvider(provider)
  }
  consumeHighlightProvider(provider: HighlightProvider) {
    this.providersHighlight.addProvider(provider)
  }
  deleteHighlightProvider(provider: HighlightProvider) {
    this.providersHighlight.deleteProvider(provider)
  }
  dispose() {
    this.subscriptions.dispose()
    if (this.active) {
      this.active.dispose()
    }
  }
}
