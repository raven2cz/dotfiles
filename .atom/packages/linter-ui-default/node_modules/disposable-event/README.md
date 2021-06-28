# Disposable-Event

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/disposable-event.svg)](https://greenkeeper.io/)

`disposable-event` is an npm module built to normalize event registration and disposal. We have often dealt with situations where there are inconsistent ways to add or remove event listeners in different APIs, `disposable-event` normalizes them all and gives authors a beautiful API

## Installation

```
npm install --save disposable-event
```

## API

```
function disposableEvent(target, eventName, callback, options): Disposable
```

## Usage

```js
import disposableEvent from 'disposable-event'
import {Server} from 'ws'

// Adding listeners
const eventListeners = []
eventListeners.push(disposableEvent(document, 'click', function() {
  console.log('document was clicked')
}))
eventListeners.push(disposableEvent(document, 'keydown', function() {
  console.log('key was pressed')
}))

const server = new Server()
eventListeners.push(disposableEvent(server, 'error', function(error) {
  console.log('error occured', error)
}))

// Disposing listeners
eventListeners.forEach(disposable => disposable.dispose())
```

## License

This project is licensed under the terms of MIT License, see the LICENSE file for more info
