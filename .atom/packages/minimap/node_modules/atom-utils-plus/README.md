## atom-utils-plus

![CI](https://github.com/atom-ide-community/atom-utils-plus/workflows/CI/badge.svg)

A bunch of general purpose utilities for Atom packages.

### requirePackages(packageNames...)

Returns a promise that is only resolved when all the requested packages have been activated.

```coffee
{requirePackages} = require 'atom-utils'

requirePackages('tree-view', 'find-and-replace', 'snippets')
.then ([treeView, findAndReplace, snippets]) ->
  # Do something with the required packages
```

### registerOrUpdateElement(elementName, options)

Registers or updates a custom element whose name is `elementName`.

```coffee
{registerOrUpdateElement} = require 'atom-utils'

class MyElement
  @staticMethod: ->
    console.log 'in static method'

  createdCallback: ->
    console.log 'element created'

MyElement = registerOrUpdateElement('my-element', class: MyElement)
```

The update is performed by copying the properties from the passed-in class and its prototype in the registered element class. As a node's callback methods can't be override once the element have been registered, a generic version is created that will invoke the concrete callback when called, that way even the node's callback methods can be updated.

Only the class' prototype can be passed using the `prototype` option instead of `class`.

### Ancestors (previously AncestorsMethods)

A mixin that provides jQuery a like method to retrieve a node's parents:

```coffee
{Ancestors} = require 'atom-utils'

class DummyNode extends HTMLElement
  Ancestors.includeInto(this)

  attachedCallback: ->
    # Returns all the ancestors to the html element
    parents = @parents()

    # Returns all the ancestors that matches the selector
    filteredParents = @parents('selector')

# It creates the custom element and register it as the `dummy-node` tag.
DummyNode = document.registerElement 'dummy-node', prototype: DummyNode.prototype
```

#### ::parents(selector)

Can be called with or without the selector argument.

If called without argument, the method will return every parents of the current
node.

If called with an argument, the method will return only the parent elements that match the passed-in selector.

Parents in the returned array are sorted by their distance from the node.

#### ::queryParentSelectorAll(selector)

An alias of `::parents` except it throw an error if called without a selector.

#### ::queryParentSelector(selector)

Returns only the first parent element that matches the passed-in selector.

Throws an error when called without a selector.

### ::eachParent(iterator)

Iterates over each parent the node and calls `iterator` with the current parent node.

### DisposableEvents

A mixin that provides a `addDisposableEventListener` method that registers an event listener on an element and returns a `Disposable` to unregister it:

```coffee
{DisposableEvents} = require 'atom-utils'
{CompositeDisposable} = require 'atom'

class DummyNode extends HTMLElement
  DisposableEvents.includeInto(this)

  createdCallback: ->
    @subscriptions = new CompositeDisposable

    @subscriptions.add @addDisposableEventListener this, 'click', (e) =>
      # ...

# It creates the custom element and register it as the `dummy-node` tag.
DummyNode = document.registerElement 'dummy-node', prototype: DummyNode.prototype
```

### EventsDelegation

A mixin that provides events delegation ala jQuery without jQuery.
Use it by including it into your custom element:

```coffee
{EventsDelegation} = require 'atom-utils'
{CompositeDisposable} = require 'atom'

class DummyNode extends HTMLElement
  # It includes the mixin on the class prototype.
  EventsDelegation.includeInto(this)

  # Custom element's callback on creation.
  createdCallback: ->
    @subscriptions = new CompositeDisposable

    @appendChild(document.createElement('div'))
    @firstChild.appendChild(document.createElement('span'))

    # Without a target and a selector, it registers to the event on the
    # element itself.
    # The `subscribeTo` method returns a disposable that unsubscribe from
    # all the events that was added by this call.
    @subscriptions.add @subscribeTo
      click: (e) ->
        console.log("won't be called if the click is done on the child div")

    # With just a selector, it registers to the event on the elements children
    # matching the passed-in selector.
    @subscriptions.add @subscribeTo 'div',
      click: (e) ->
        console.log("won't be called if the click is done on the child span")
        # Events propagation can be used to prevents the delegated handlers
        # to catch the events in continuation.
        e.stopPropagation()

    # By passing a node and a selector, it registers to the event on the
    # elements children matching the passed-in selector.
    @subscriptions.add @subscribeTo @firstChild, 'span',
      click: (e) ->
        e.stopPropagation()

# It creates the custom element and register it as the `dummy-node` tag.
DummyNode = document.registerElement 'dummy-node', prototype: DummyNode.prototype
```

### SpacePenDSL

A mixin that provides the same content creation mechanism as `space-pen` but for custom elements:

```coffee
{SpacePenDSL} = require 'atom-utils'

class DummyNode extends HTMLElement
  SpacePenDSL.includeInto(this)

  @content: ->
    @div outlet: 'container', class: 'container', =>
      @span outlet: 'label', class: 'label'

  createdCallback: ->
    # Content is available in the created callback

# It creates the custom element and register it as the `dummy-node` tag.
DummyNode = document.registerElement 'dummy-node', prototype: DummyNode.prototype
```
