'use babel'

import disposify from '../'

describe('Disposify', function() {
  it('makes no changes to disposables', function() {
    const dispose = function() {}
    const disposable = { dispose }
    disposify(disposable)
    expect(disposable.dispose).toBe(dispose)
  })

  it('maps to destroy if available', function() {
    const disposable = { destroy: jasmine.createSpy('dispose') }
    disposify(disposable)
    disposable.dispose()
    expect(disposable.destroy).toHaveBeenCalled()
  })

  it('maps to stop if available', function() {
    const disposable = { stop: jasmine.createSpy('dispose') }
    disposify(disposable)
    disposable.dispose()
    expect(disposable.stop).toHaveBeenCalled()
  })

  it('maps to kill if available', function() {
    const disposable = { kill: jasmine.createSpy('dispose') }
    disposify(disposable)
    disposable.dispose()
    expect(disposable.kill).toHaveBeenCalled()
  })

  it('maps to end if available', function() {
    const disposable = { end: jasmine.createSpy('dispose') }
    disposify(disposable)
    disposable.dispose()
    expect(disposable.end).toHaveBeenCalled()
  })

  it('throws error if no valid destroy function is fond', function() {
    const disposable = { }
    disposify(disposable)
    expect(function() {
      disposable.dispose()
    }).toThrow('Unable to dispose object')
  })
})
