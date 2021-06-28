'use babel'

import {guessFromFilePath} from '../'

describe('Atom Package Path', function() {
  it('works for packages in correct place', function() {
    expect(guessFromFilePath('/home/steel/.atom/packages/linter/lib/main.js')).toBe('linter')
    expect(guessFromFilePath('C:\\Users\\Steel Brain\\.atom\\packages\\linter\\lib\\main.js')).toBe('linter')
  })
  it('works for packages that use lib or src folder', function() {
    expect(guessFromFilePath('/home/steel/github/linter/lib/main.js')).toBe('linter')
    expect(guessFromFilePath('C:\\Users\\Steel Brain\\github\\linter\\lib\\main.js')).toBe('linter')
  })
  it('works for packages that have the main file in root folder', function() {
    expect(guessFromFilePath('/home/steel/github/linter/main.js')).toBe('linter')
    expect(guessFromFilePath('C:\\Users\\Steel Brain\\github\\linter\\main.js')).toBe('linter')
  })
})
