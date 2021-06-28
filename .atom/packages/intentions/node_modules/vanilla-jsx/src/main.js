'use babel';

(function() {
  'use strict'

  let escapeHTML = null

  class Component {
    constructor() {
      this._element = null
      this.refs = {}
    }
    get element() {
      if (this._element === null) {
        this.render()
      }
      return this._element
    }
    render(...params) {
      let element = null
      if (params.length === 1) {
        element = this.renderView(params[0])
      } else if (params.length === 2) {
        element = this.renderView(params[0], params[1])
      } else if (params.length === 3) {
        element = this.renderView(params[0], params[1], params[2])
      } else if (params.length === 4) {
        element = this.renderView(params[0], params[1], params[2])
      } else {
        element = this.renderView.apply(this, params)
      }
      if (typeof element !== 'object' || !Array.isArray(element.children)) {
        throw new Error('renderView method returned invalid result')
      }
      element = createDOMElements(element)
      element.refs = {}
      const childrenRefs = element.querySelectorAll('[ref]')
      const childrenRefsLength = childrenRefs.length
      if (childrenRefs) {
        for (let i = 0; i < childrenRefsLength; ++i) {
          const child = childrenRefs[i]
          element.refs[child.getAttribute('ref')] = child
          child.removeAttribute('ref')
        }
      }
      if (this._element && this._element.parentNode) {
        this._element.parentNode.replaceChild(element, this._element)
      }
      this._element = element
      this.refs = element.refs
      return element
    }
    renderToString(...params) {
      if (escapeHTML === null) {
        escapeHTML = require('escape-html')
      }
      let element = null
      if (params.length === 1) {
        element = this.renderView(params[0])
      } else if (params.length === 2) {
        element = this.renderView(params[0], params[1])
      } else if (params.length === 3) {
        element = this.renderView(params[0], params[1], params[2])
      } else if (params.length === 4) {
        element = this.renderView(params[0], params[1], params[2])
      } else {
        element = this.renderView.apply(this, params)
      }
      if (typeof element !== 'object' || !Array.isArray(element.children)) {
        throw new Error('renderView method returned invalid result')
      }
      return createStringElements(element)
    }
    dispose() {
      this._element = null
    }
  }

  function createStringElements(element) {
    if (typeof element !== 'object' || element === null || !Array.isArray(element.children)) {
      throw new Error('Invalid element provided', element)
    }
    const content = []
    const attributes = []
    if (element.attributes !== null) {
      for (let key in element.attributes) {
        if (key.length > 4 && key.substr(0, 3) === 'on-') {
          continue
        }
        if (key === 'className') {
          key = 'class'
        }
        const value = element.attributes[key]
        attributes.push(escapeHTML(key) + '="' + escapeHTML(value) + '"')
      }
    }
    const childrenLength = element.children.length
    if (childrenLength) {
      for (let i = 0; i < childrenLength; ++i) {
        const nestedChildren = [].concat(element.children[i])
        const nestedChildrenLength = nestedChildren.length
        if (nestedChildrenLength === 1) {
          const nestedChild = nestedChildren[0]
          content.push(typeof nestedChild === 'object' ? createStringElements(nestedChild) : escapeHTML(nestedChild))
        } else {
          for (let n = 0; n < nestedChildrenLength; ++n) {
            const nestedChild = nestedChildren[n]
            content.push(typeof nestedChild === 'object' ? createStringElements(nestedChild) : escapeHTML(nestedChild))
          }
        }
      }
    }
    return `<${element.name}${attributes.length ? ' ' + attributes.join(' ') : ''}>${content.join('')}</${element.name}>`
  }
  function createDOMElements(element) {
    if (typeof element !== 'object' || element === null || !Array.isArray(element.children)) {
      throw new Error('Invalid element provided', element)
    }
    const domElement = document.createElement(element.name)
    if (element.attributes !== null) {
      for (let key in element.attributes) {
        const value = element.attributes[key]
        if (key.length > 4 && key.substr(0, 3) === 'on-') {
          domElement.addEventListener(key.substr(3).toLocaleLowerCase(), value)
          continue
        }
        if (key === 'className') {
          key = 'class'
        }
        domElement.setAttribute(key, typeof value === 'function' ? value() : value)
      }
    }
    const childrenLength = element.children.length
    if (childrenLength) {
      for (let i = 0; i < childrenLength; ++i) {
        const nestedChildren = [].concat(element.children[i])
        const nestedChildrenLength = nestedChildren.length
        if (nestedChildrenLength === 1) {
          const nestedChild = nestedChildren[0]
          domElement.appendChild(typeof nestedChild === 'object' ? createDOMElements(nestedChild) : document.createTextNode(nestedChild))
        } else {
          for (let n = 0; n < nestedChildrenLength; ++n) {
            const nestedChild = nestedChildren[n]
            domElement.appendChild(typeof nestedChild === 'object' ? createDOMElements(nestedChild) : document.createTextNode(nestedChild))
          }
        }
      }
    }
    return domElement
  }

  function createClass(component) {
    if (typeof component !== 'object') {
      throw new Error('Invalid component params provided')
    }
    if (typeof component.renderView !== 'function') {
      throw new Error('renderView must be a function')
    }
    class CurrentComponent extends Component { }
    for (let key in component) {
      if (CurrentComponent.prototype[key]) {
        throw new Error(`Key '${key}' not allowed in component`)
      } else CurrentComponent.prototype[key] = component[key]
    }
    return CurrentComponent
  }

  function jsx(name, attributes, ...children) {
    return {name, attributes, children}
  }

  if (typeof module !== 'undefined') {
    module.exports.createClass = createClass
    module.exports.jsx = jsx
  } else if (typeof window !== 'undefined') {
    window.vanilla = {createClass, jsx}
  } else if (typeof self !== 'undefined') {
    self.vanilla = {createClass, jsx}
  }

})()
