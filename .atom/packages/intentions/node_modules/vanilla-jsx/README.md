Vanilla-JSX
=========

Vanilla-JSX is a library that converts JSX into vanilla HTML Elements.

#### Features

 - Converts JSX to vanilla HTMLElements
 - Translates className attribute into class
 - Supports event listeners as attributes like `<div on-click={someFunction}></div>`
 - Supports `ref` attribute with `process` helper

#### API

```js
class Component {
  get element(): HTMLElement
  get refs(): Object<string, HTMLElement>
  render(...args): HTMLElement
  renderToString(...args): string
  dispose(): void
}
export function jsx(name, attributes, ...children)
export function createClass(object): Component
```

#### Example
```js
'use babel'

import {createClass as createJSXClass, jsx} from 'vanilla-jsx'
/** @jsx jsx */
// ^ the above comment is required for babel

const Message = createJSXClass({
  renderView: function(message) {
    this.logMessageCreation(message)
    return <div>
      <span>{message.time}</span>
      <span>{message.from}</span>
      <span ref="text">{message.text}</span>
    </div>
  },
  changeText(text) {
    this.refs.text.textContent = text
  }
  logMessageCreation: function(message) {
    // do something with `message`
  }
})

const messageFromBob = new Message()
messageFromBob.render({
  time: Date.now() - (1000 * 60 * 60),
  from: 'Bob',
  text: 'Hey'
})
document.body.appendChild(messageFromBob.element)
messageFromBob.changeText("I'm the new text!")

const messageFromJohn = new Message()
messageFromJohn.render({
  time: Date.now() - (1000 * 60 * 60 * 2),
  from: 'John',
  text: 'Hey'
})
document.body.appendChild(messageFromJohn.element)
```

#### LICENSE
This project is licensed under the terms of MIT License, See the LICENSE file for more info
