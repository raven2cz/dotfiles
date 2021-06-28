/* @flow */

import ListElement from '../lib/elements/list'
import { createSuggestion } from './helpers'

describe('Intentions list element', function() {
  it('has a complete working lifecycle', function() {
    const element = new ListElement()
    const suggestions = [
      createSuggestion('Suggestion 1', jasmine.createSpy('suggestion.selected.0'), 'someClass', 'someIcon'),
      createSuggestion('Suggestion 2', jasmine.createSpy('suggestion.selected.1')),
      createSuggestion('Suggestion 3', jasmine.createSpy('suggestion.selected.2'), 'anotherClass'),
    ]

    const selected = jasmine.createSpy('suggestion.selected')
    const rendered = element.render(suggestions, selected)

    expect(rendered.refs.list.children.length).toBe(3)
    expect(rendered.refs.list.children[0].textContent).toBe('Suggestion 1')
    expect(rendered.refs.list.children[1].textContent).toBe('Suggestion 2')
    expect(rendered.refs.list.children[2].textContent).toBe('Suggestion 3')
    expect(rendered.refs.list.children[0].children[0].className).toBe('someClass icon icon-someIcon')
    expect(rendered.refs.list.children[2].children[0].className).toBe('anotherClass')
    expect(element.suggestionsIndex).toBe(-1)

    element.move('down')

    expect(element.suggestionsIndex).toBe(0)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[0].textContent)

    element.move('down')

    expect(element.suggestionsIndex).toBe(1)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[1].textContent)

    element.move('down')

    expect(element.suggestionsIndex).toBe(2)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[2].textContent)

    element.move('up')

    expect(element.suggestionsIndex).toBe(1)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[1].textContent)

    element.move('up')

    expect(element.suggestionsIndex).toBe(0)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[0].textContent)

    element.move('up')

    expect(element.suggestionsIndex).toBe(2)
    expect(element.suggestions[element.suggestionsIndex].title).toBe(rendered.refs.list.children[2].textContent)

    rendered.refs.list.children[1].children[0].dispatchEvent(new MouseEvent('click', {
      bubbles: true,
    }))
    expect(selected).toHaveBeenCalledWith(suggestions[1])
  })
})
