Event-Kit
===========

Event-Kit is an Application architecture inspired from [Atom's EventKit][1]

#### API

```js
export class CompositeDisposable {
  disposed: boolean;

  constructor(...disposables)
  add(...disposables)
  delete(...disposables)
  clear()
  dispose()
}
export class Disposable {
  disposed: boolean;

  constructor(callback)
  dispose()
}
export class Emitter {
  disposed: boolean;

  constructor()
  on(eventName, handler): Disposable
  off(eventName, handler): void
  clear(): void
  emit(eventName, ...params): Promise<Array<any>>
  dispose(): void
}
```

#### Introduction

Disposable architecture has several benefits, the most important one being simplicity and increase in developer productivity.
This architecture is something that works everywhere™, you can hot-reload themes, plugins or even the entire app if you follow it.

##### Disposable

Disposables are the base of this architecture, they are objects that have a `dispose` function on them. It is called whenever a
parent object is being disposed, all of the cleanup code should go there.

##### Emitter

Emitters of this architecture are just like every other emitter but the one thing they have different is that they return
disposables when you bind an event, you won't have to call `.removeListener` or `.off` anymore, just dispose the disposable you get
from `.on`.

##### ComositeDisposable

CompositeDisposables are containers of disposables. They implement the disposable interface themselves, so when we do
`compositedisposable.dispose()` they iterate over all of their disposables and dispose them as well.

##### Named Events

This is more of a method naming convention than an interface but it's still important. Traditional event emitters have APIs
like this

```js
class SomeEmitter {
  on(eventName, callback)
}
```

that `eventName` can be any string, therefore it breeds confusion, developers sometimes make a typo somewhere and spend hours
finding it, they also "accidently" type one letter uppercase or all letters uppercase and it doesn't work.

It also makes it difficult to find all available event names and we end up digging the docs.

Disposable architecture solves this with functions that act as event handlers, like

```js
class App {
  onDidLoad(callback): Disposable
  onDidReload(callback): Disposable
  OnWillBlowUp(callback): Disposable
}
```


#### Example

Here's an example app using the Disposable Architecture

```js
// app.js
import App from './lib/app'

const app = App.create()

App.activate().catch(function(e) {
  console.log(e.stack)
  app.dispose()
})
```

```js
// lib/app.js
import { Disposable, CompositeDisposable } from 'sb-event-kit'
import { Server } from './server'
import Database from './db'

const debug = require('debug')('APP:MAIN')

export class App {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.db = new Database()
    this.server = new Server()

    this.subscriptions.add(this.db)
    this.subscriptions.add(this.server)

    this.server.onDidClientConnect(function() {
      debug('Client :: Connected')
    })
  }
  activate() {
    return Promise.all([
      this.db.activate(),
      this.server.activate()
    ])
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
```
```js
// lib/db.js
import MongoDB from 'some-mongo-library'
import { Database as DatabaseConfig } from '../config'

export class Database {
  constructor() {
    this.connection = new MongoDB()
  }
  activate() {
    return this.connection.connect(DatabaseConfig)
  }
  query(query) {
    return this.connection.query(query)
  }
  dispose() {
    this.connection.unref()
  }
}
```
```js
// lib/server.js
import { Emitter, Disposable, CompositeDisposable } from 'sb-event-kit'
import HTTPServer from 'some-server-library'
import { Server as ServerConfig } from '../config'

export class Server {
  constructor() {
    this.subscriptions = new CompositeDisposable()
    this.emitter = new Emitter()
    this.connection = new HTTPServer()

    this.subscriptions.add(this.emitter)
    this.subscriptions.add(() => {
      this.connection.unref()
    })

    this.connection.on('client', connection => {
      this.emitter.emit('did-client-connect', connection)
    })
  }
  activate() {
    return this.connection.listen(ServerConfig)
  }
  onDidClientConnect(callback) {
    return this.emitter.on('did-client-connect', callback)
  }
  dispose() {
    this.subscriptions.dispose()
  }
}
```

#### License
This project is licensed under the terms of MIT License. See the License file for more info.

[1]:https://github.com/atom/event-kit
