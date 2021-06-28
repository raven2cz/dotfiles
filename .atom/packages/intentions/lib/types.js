/* @flow */

import type { Point, Range, TextEditor, TextEditorMarker } from 'atom'

export type ListItem = {
  // Automatically added
  __$sb_intentions_class: string,

  // From providers
  icon?: string,
  class?: string,
  title: string,
  priority: number,
  selected(): void;
}

export type HighlightItem = {
  // Automatically added
  __$sb_intentions_class: string,

  // From providers
  range: Range,
  class?: string,
  created: ((parameters: {
    marker: TextEditorMarker,
    element: HTMLElement,
    textEditor: TextEditor,
    matchedText: string
  }) => any)
}

export type ListProvider = {
  grammarScopes: Array<string>,
  getIntentions(parameters: {
    textEditor: TextEditor,
    bufferPosition: Point
  }): Array<ListItem> | Promise<Array<ListItem>>
}

export type HighlightProvider = {
  grammarScopes: Array<string>,
  getIntentions(parameters: {
    textEditor: TextEditor,
    visibleRange: Range
  }): Array<HighlightItem> | Promise<Array<HighlightItem>>
}

export type ListMovement = 'up' | 'down' | 'page-up' | 'page-down' | 'move-to-top' | 'move-to-bottom'
