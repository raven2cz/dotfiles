'use babel'

import SpacePenDSL from '../../src/mixins/space-pen-dsl'

export default class DummyElement extends HTMLElement {
  static content () {
    this.div({outlet: 'main', class: 'foo'}, () => {
      this.tag('span', {outlet: 'span', class: 'bar'})
    })
  }

  createdCallback () {
    this.buildContent()
    this.created = true
  }
}

SpacePenDSL.Babel.includeInto(DummyElement)
