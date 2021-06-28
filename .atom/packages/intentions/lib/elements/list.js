/* @flow */

/** @jsx jsx */
// eslint-disable-next-line no-unused-vars
import { createClass, jsx } from 'vanilla-jsx'
import { $class } from '../helpers'
import type { ListMovement } from '../types'

export default createClass({
  renderView(suggestions, selectCallback) {
    let className = 'select-list popover-list'
    if (suggestions.length > 7) {
      className += ' intentions-scroll'
    }

    this.suggestions = suggestions
    this.suggestionsCount = suggestions.length
    this.suggestionsIndex = -1
    this.selectCallback = selectCallback

    return <intentions-list class={className} id="intentions-list">
      <ol class="list-group" ref="list">
        {suggestions.map(function(suggestion) {
          return <li>
            <span class={suggestion[$class]} on-click={function() {
              selectCallback(suggestion)
            }}>{suggestion.title}</span>
          </li>
        })}
      </ol>
    </intentions-list>
  },
  move(movement: ListMovement) {
    let newIndex = this.suggestionsIndex

    if (movement === 'up') {
      newIndex--
    } else if (movement === 'down') {
      newIndex++
    } else if (movement === 'move-to-top') {
      newIndex = 0
    } else if (movement === 'move-to-bottom') {
      newIndex = this.suggestionsCount
    }
    // TODO: Implement page up/down
    newIndex %= this.suggestionsCount
    if (newIndex < 0) {
      newIndex = this.suggestionsCount + newIndex
    }
    this.selectIndex(newIndex)
  },
  selectIndex(index) {
    if (this.refs.active) {
      this.refs.active.classList.remove('selected')
    }

    this.refs.active = this.refs.list.children[index]
    this.refs.active.classList.add('selected')

    this.refs.active.scrollIntoViewIfNeeded(false)
    this.suggestionsIndex = index
  },
  select() {
    this.selectCallback(this.suggestions[this.suggestionsIndex])
  },
})
