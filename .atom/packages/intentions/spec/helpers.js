'use babel'

import { processListItems } from '../lib/helpers'

export function createSuggestion(text, selected, className = '', icon = '', process = true) {
  const suggestion = {
    icon,
    title: text,
    class: className,
    priority: 100,
    selected,
  }
  if (process) {
    return processListItems([suggestion])[0]
  }
  return suggestion
}

export function getKeyboardEvent(name = 'keydown', code = 0): KeyboardEvent {
  const event = new KeyboardEvent(name)
  Object.defineProperty(event, 'keyCode', {
    value: code,
  })
  return event
}
