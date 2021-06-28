/* @flow */

import invariant from 'assert'
import ProvidersList from '../lib/providers-list'

describe('ProvidersList', function() {
  let providersList
  let editor

  beforeEach(function() {
    if (providersList) {
      providersList.dispose()
    }
    providersList = new ProvidersList()
    atom.workspace.destroyActivePane()
    waitsForPromise(function() {
      return atom.workspace.open(__filename).then(function() {
        editor = atom.workspace.getActiveTextEditor()
      })
    })
    atom.packages.activatePackage('language-javascript')
  })
  function addProvider(provider: any) {
    return providersList.addProvider(provider)
  }
  function deleteProvider(provider: any) {
    providersList.deleteProvider(provider)
  }

  describe('addProvider', function() {
    it('validates parameters properly', function() {
      expect(function() {
        addProvider()
      }).toThrow()
      expect(function() {
        addProvider(null)
      }).toThrow()
      expect(function() {
        addProvider(1)
      }).toThrow()
      expect(function() {
        addProvider(false)
      }).toThrow()
      expect(function() {
        addProvider(true)
      }).toThrow()

      expect(function() {
        addProvider({
          grammarScopes: false,
        })
      }).toThrow()
      expect(function() {
        addProvider({
          grammarScopes: null,
        })
      }).toThrow()
      expect(function() {
        addProvider({
          grammarScopes: true,
        })
      }).toThrow()
      expect(function() {
        addProvider({
          grammarScopes: 5,
        })
      }).toThrow()

      expect(function() {
        addProvider({
          grammarScopes: [],
          getIntentions: false,
        })
      }).toThrow()
      expect(function() {
        addProvider({
          grammarScopes: [],
          getIntentions: null,
        })
      }).toThrow()
      expect(function() {
        addProvider({
          grammarScopes: [],
          getIntentions: true,
        })
      }).toThrow()
      expect(function() {
        addProvider({
          grammarScopes: [],
          getIntentions: 20,
        })
      }).toThrow()
      addProvider({
        grammarScopes: [],
        getIntentions() {},
      })
    })
  })
  describe('hasProvider', function() {
    it('works properly', function() {
      const provider = {
        grammarScopes: [],
        getIntentions() {
          throw new Error()
        },
      }
      expect(providersList.hasProvider(provider)).toBe(false)
      addProvider(provider)
      expect(providersList.hasProvider(provider)).toBe(true)
    })
  })
  describe('deleteProvider', function() {
    it('works properly', function() {
      deleteProvider(true)
      deleteProvider(null)
      deleteProvider(false)
      deleteProvider(50)
      const provider = {
        grammarScopes: [],
        getIntentions() {
          throw new Error()
        },
      }
      expect(providersList.hasProvider(provider)).toBe(false)
      addProvider(provider)
      expect(providersList.hasProvider(provider)).toBe(true)
      providersList.deleteProvider(provider)
      expect(providersList.hasProvider(provider)).toBe(false)
    })
  })
  describe('trigger', function() {
    it('works properly', function() {
      const intention = {
        priority: 100,
        icon: 'bucket',
        class: 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected() {
          console.log('You clicked the color picker option')
        },
      }
      addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return [intention]
        },
      })
      waitsForPromise(function() {
        return providersList.trigger(editor).then(function(results) {
          invariant(Array.isArray(results))
          expect(results[0]).toBe(intention)
        })
      })
    })
    it('ignores previous result from executed twice instantly', function() {
      let count = 0
      const intentionFirst = {
        priority: 100,
        icon: 'bucket',
        class: 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected() {
          console.log('You clicked the color picker option')
        },
      }
      const intentionSecond = {
        priority: 100,
        icon: 'bucket',
        class: 'custom-icon-class',
        title: 'Choose color from colorpicker',
        selected() {
          console.log('You clicked the color picker option')
        },
      }
      addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          if (++count === 1) {
            return [intentionFirst]
          }
          return [intentionSecond]
        },
      })
      const promiseFirst = providersList.trigger(editor)
      const promiseSecond = providersList.trigger(editor)

      waitsForPromise(function() {
        return promiseFirst.then(function(results) {
          expect(results).toEqual([])
        })
      })
      waitsForPromise(function() {
        return promiseSecond.then(function(results) {
          invariant(Array.isArray(results))
          expect(results[0]).toBe(intentionSecond)
        })
      })
    })
    it('does not enable it if providers return no results, including non-array ones', function() {
      addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return []
        },
      })
      addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return null
        },
      })
      addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return false
        },
      })
      addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return 50
        },
      })
      waitsForPromise(function() {
        return providersList.trigger(editor).then(function(results) {
          expect(results).toEqual([])
        })
      })
    })
    it('emits an error if provider throws an error', function() {
      addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          throw new Error('test from provider')
        },
      })
      waitsForPromise(function() {
        return providersList.trigger(editor).then(function() {
          expect(false).toBe(true)
        }, function(e) {
          expect(e.message).toBe('test from provider')
        })
      })
    })
    it('validates suggestions properly', function() {
      addProvider({
        grammarScopes: ['*'],
        getIntentions() {
          return [{}]
        },
      })
      waitsForPromise(function() {
        return providersList.trigger(editor).then(function() {
          expect(false).toBe(true)
        }, function(e) {
          expect(e instanceof Error).toBe(true)
        })
      })
    })
    it('triggers providers based on scope', function() {
      let coffeeCalled = false
      let jsCalled = false
      addProvider({
        grammarScopes: ['source.js'],
        getIntentions() {
          jsCalled = true
        },
      })
      addProvider({
        grammarScopes: ['source.coffee'],
        getIntentions() {
          coffeeCalled = true
        },
      })
      waitsForPromise(function() {
        return providersList.trigger(editor).then(function() {
          expect(jsCalled).toBe(true)
          expect(coffeeCalled).toBe(false)
        })
      })
    })
  })
})
