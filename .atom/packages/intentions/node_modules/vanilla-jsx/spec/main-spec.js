'use babel'

/** @jsx jsx */

import {createClass, jsx} from '../'

describe('Vanilla-JSX', function() {
  it('cries if no parameter is given', function() {
    expect(function() {
      createClass()
    }).toThrow()
  })
  it('cries if no renderView method is given', function() {
    expect(function() {
      createClass({})
    }).toThrow()
  })
  it('cries if invalid renderView method is given', function() {
    expect(function() {
      createClass({
        renderView: true
      })
    }).toThrow()
  })
  it('cries if renderView doesnt return valid JSX', function() {
    expect(function() {
      new (createClass({
        renderView: function() {
          return {}
        }
      }))().render()
    }).toThrow()
    expect(function() {
      new (createClass({
        renderView: function() {
          return null
        }
      }))().render()
    }).toThrow()
    expect(function() {
      new (createClass({
        renderView: function() {
          return false
        }
      }))().render()
    }).toThrow()
    expect(function() {
      new (createClass({
        renderView: function() {
          return []
        }
      }))().render()
    }).toThrow()
  })

  describe('rendering', function() {
    it('triggers render', function() {
      let triggered = false
      const Component = createClass({
        renderView: function() {
          triggered = true
          return (<div></div>)
        }
      })
      const inst = new Component()
      expect(triggered).toBe(false)
      inst.element
      expect(triggered).toBe(true)
    })
    it('gives zero parameters to render', function() {
      let argumentsCount = null
      const Component = createClass({
        renderView: function() {
          argumentsCount = arguments.length
          return (<div></div>)
        }
      })
      const inst = new Component()
      expect(argumentsCount).toBe(null)
      inst.element
      expect(argumentsCount).toBe(0)
    })
  })
  it('does not trigger render if its already rendered', function() {
    let triggered = 0
    const Component = createClass({
      renderView: function() {
        triggered++
        return (<div></div>)
      }
    })
    const inst = new Component()
    expect(triggered).toBe(0)
    inst.render()
    inst.element
    expect(triggered).toBe(1)
  })
  it('is an html element with correct nested children', function() {
    const Component = createClass({
      renderView: function() {
        return <div>
          <span>
            <a href="#">Hey</a>
          </span>
          <span>
            <a href="#">Yo</a>
          </span>
        </div>
      }
    })
    const inst = new Component()
    expect(inst.element.childNodes.length).toBe(2)
    expect(inst.element.childNodes[0].tagName).toBe('SPAN')
    expect(inst.element.childNodes[1].tagName).toBe('SPAN')
    expect(inst.element.childNodes[0].childNodes.length).toBe(1)
    expect(inst.element.childNodes[0].childNodes[0].tagName).toBe('A')
    expect(inst.element.childNodes[1].childNodes.length).toBe(1)
    expect(inst.element.childNodes[1].childNodes[0].tagName).toBe('A')
  })
  it('has correct attributes', function() {
    const Component = createClass({
      renderView: function() {
        return <div data-a="a" data-b="b"></div>
      }
    })
    const inst = new Component()
    expect(inst.element.hasAttribute('data-a')).toBe(true)
    expect(inst.element.getAttribute('data-a')).toBe('a')
    expect(inst.element.hasAttribute('data-b')).toBe(true)
    expect(inst.element.getAttribute('data-b')).toBe('b')
  })
  it('translates className attribute into class', function() {
    const Component = createClass({
      renderView: function() {
        return <div className="test"></div>
      }
    })
    const inst = new Component()
    expect(inst.element.className).toBe('test')
  })
  it('attaches event listeners', function() {
    const listener = jasmine.createSpy('vanilla-jsx-event-listener')
    const Component = createClass({
      renderView: function() {
        return <div on-click={listener}></div>
      }
    })
    const inst = new Component()
    inst.element.dispatchEvent(new MouseEvent('click'))
    expect(listener).toHaveBeenCalled()
  })
  it('works with array children', function() {
    const Component = createClass({
      renderView: function() {
        const items = [1, 2,3]
        return <div>{items.map(i => <span>{i}</span>)}</div>
      }
    })
    const inst = new Component()
    expect(inst.element.childNodes.length).toBe(3)
    expect(inst.element.childNodes[0].tagName).toBe('SPAN')
    expect(inst.element.childNodes[0].textContent).toBe('1')
    expect(inst.element.childNodes[1].tagName).toBe('SPAN')
    expect(inst.element.childNodes[1].textContent).toBe('2')
    expect(inst.element.childNodes[2].tagName).toBe('SPAN')
    expect(inst.element.childNodes[2].textContent).toBe('3')
  })
  it('supports ref attribute', function() {
    const Component = createClass({
      renderView: function() {
        return <div><span><a ref="link" href="#">Wow</a></span></div>
      }
    })
    const inst = new Component()
    expect(inst.element.refs.link).toBe(inst.element.childNodes[0].childNodes[0])
    expect(inst.element.refs.link.hasAttribute('ref')).toBe(false)
  })
  it('proxifies refs from element to instance', function() {
    const Component = createClass({
      renderView: function() {
        return <div><span><a ref="link" href="#">Wow</a></span></div>
      }
    })
    const inst = new Component()
    expect(inst.element.refs).toBe(inst.refs)
  })
  it('passes parameters from render to renderView', function() {
    const params = [{}, {}, {}]
    let wasCalled = false
    const Component = createClass({
      renderView: function(param1, param2, param3) {
        wasCalled = true
        expect(param1).toBe(params[0])
        expect(param2).toBe(params[1])
        expect(param3).toBe(params[2])
        return <div></div>
      }
    })
    const inst = new Component()
    inst.render(params[0], params[1], params[2])
    expect(wasCalled).toBe(true)
  })
  it('produces same HTML and string results', function() {
    const Component = createClass({
      renderView: function() {
        return <div>
          <span>
            <a href="#">Hey</a>
          </span>
          <span>
            <a href="#">Yo</a>
          </span>
        </div>
      }
    })
    const inst = new Component()
    expect(inst.element.outerHTML).toBe(inst.renderToString())
  })
  it('passes all parameters from renderToString to renderView', function() {
    const params = [{}, {}, {}]
    let wasCalled = false
    const Component = createClass({
      renderView: function(param1, param2, param3) {
        wasCalled = true
        expect(param1).toBe(params[0])
        expect(param2).toBe(params[1])
        expect(param3).toBe(params[2])
        return <div></div>
      }
    })
    const inst = new Component()
    inst.renderToString(params[0], params[1], params[2])
    expect(wasCalled).toBe(true)
  })
  it('passes parameters from given object to view prototype', function() {
    let num = 0
    const Component = createClass({
      renderView: function() {
        this.add(2)
        return <div></div>
      },
      add: function(addition) {
        num += addition
      }
    })
    const inst = new Component()
    inst.element
    expect(num).toBe(2)
  })
  it('cries if we try to overwrite base properties', function() {
    expect(function() {
      const Component = createClass({
        renderView: function() {
          return <div></div>
        },
        dispose: function() {

        }
      })
    }).toThrow()
  })
})
