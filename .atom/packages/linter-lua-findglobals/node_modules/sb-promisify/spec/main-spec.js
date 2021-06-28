'use babel'

import promisify from '..'

describe('Promisify', function() {
  it('succeeds properly', function() {
    const callback = function(arg1, arg2) {
      expect(arg1).toBe('something')
      arg2(null, 'wow')
    }
    waitsForPromise(function() {
      return promisify(callback)('something').then(function(retVal) {
        expect(retVal).toBe(retVal)
      })
    })
  })

  it('throws properly', function() {
    const callback = function(arg1, arg2) {
      expect(arg1).toBe('something')
      arg2('wow')
    }
    waitsForPromise(function() {
      return promisify(callback)('something').then(function() {
        expect(false).toBe(true)
      }, function(error) {
        expect(error).toBe('wow')
      })
    })
  })
  it('works when Array.from is available', function() {
    const _ = Array.from
    Array.from = function(array) {
      return Array.prototype.slice.call(array)
    }
    const callback = function(arg1, arg2) {
      expect(arg1).toBe('something')
      arg2(null, 'wow')
    }
    waitsForPromise(function() {
      return promisify(callback)('something').then(function(retVal) {
        expect(retVal).toBe(retVal)
        Array.from = _
      })
    })
  })
  it('works when Array.from is not available', function() {
    const _ = Array.from
    Array.from = null
    const callback = function(arg1, arg2) {
      expect(arg1).toBe('something')
      arg2(null, 'wow')
    }
    waitsForPromise(function() {
      return promisify(callback)('something').then(function(retVal) {
        expect(retVal).toBe(retVal)
        Array.from = _
      })
    })
  })
  it('has an option to disable the throw behavior', function() {
    function callback(beep, callback) {
      if (beep === true) {
        callback(null, true)
      }
      throw new Error('Hello')
    }
    waitsForPromise(function() {
      return promisify(callback, false)(true).then(function(result) {
        expect(result).toBe(true)
      })
    })
    waitsForPromise(function() {
      return promisify(callback, false)().then(function(result) {
        expect(result).toBe(null)
      })
    })
  })

  describe('promisifyAll', function() {
    it('promifies all the functions available on that object', function() {
      const promisifiedFS = promisify.promisifyAll(require('fs'))
      waitsForPromise(function() {
        return promisifiedFS.readFile(__filename).then(function(contents) {
          return Buffer.isBuffer(contents)
        })
      })
      waitsForPromise(function() {
        return promisifiedFS.realpath(__filename).then(function(realpath) {
          expect(realpath).toBe(__filename)
        })
      })
    })
    it('preserves all the non-function stuff', function() {
      expect(promisify.promisifyAll({ a: true })).toEqual({ a: true })
    })
  })
})
