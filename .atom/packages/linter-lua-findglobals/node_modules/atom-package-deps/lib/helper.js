'use babel'

import {BufferedProcess} from 'atom'

export function installPackages(packageNames, callback, failedCallback) {
  const extractionRegex = /Installing (.*?) to .*? (.*)/
  return new Promise(function(resolve, reject) {

    let errorContents = []
    const parameters = ['install'].concat(packageNames)
    parameters.push('--production', '--color', 'false')

    new BufferedProcess({
      command: atom.packages.getApmPath(),
      args: parameters,
      options: {},
      stdout: function(contents) {
        const matches = extractionRegex.exec(contents)
        if (matches[2] === '✓' || matches[2] === 'done') {
          callback(matches[1])
        } else {
          errorContents.push("Error Installing " + matches[1] + "\n")
        }
      },
      stderr: function(contents) {
        errorContents.push(contents)
      },
      exit: function() {
        if (errorContents.length) {
          errorContents = errorContents.join('')
          failedCallback(errorContents)
          return reject(new Error(errorContents))
        } else resolve()
      }
    })
  })
}
