'use babel'

/* @flow */

import Path from 'path'
import npmPath from '../'

describe('npm-path', function() {
  function join(...params) {
    return params.join(':')
  }

  const DIR = Path.join(__dirname, 'fixtures')
  const DEEP_DIR = Path.join(DIR, 'test')
  const BIN_DIR = Path.join(DIR, 'node_modules', '.bin')
  const DEEP_BIN_DIR = Path.join(DEEP_DIR, 'node_modules', '.bin')
  const ROOT_BIN = Path.normalize(Path.join(__dirname, '..', 'node_modules', '.bin'))

  describe('::getPATH', function() {
    it('works', function() {
      expect(npmPath(DIR)).toBe(join(BIN_DIR, ROOT_BIN))
    })
    it('works deep', function() {
      expect(npmPath(DEEP_DIR)).toBe(join(DEEP_BIN_DIR, BIN_DIR, ROOT_BIN))
    })
  })

  describe('::getPATHAsync', function() {
    it('works', function() {
      waitsForPromise(function() {
        return npmPath.async(DIR).then(function(result) {
          expect(result).toBe(join(BIN_DIR, ROOT_BIN))
        })
      })
    })
    it('works deep', function() {
      waitsForPromise(function() {
        return npmPath.async(DEEP_DIR).then(function(result) {
          expect(result).toBe(join(DEEP_BIN_DIR, BIN_DIR, ROOT_BIN))
        })
      })
    })
  })
})
