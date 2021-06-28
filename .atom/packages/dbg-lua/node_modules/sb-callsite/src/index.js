const extractionRegex = /at (\S+) \(([\S ]+):(\d+):(\d+)\)/

export function fromStack(stack) {
  const stackChunks = stack.split('\n')
  const traces = []

  stackChunks.forEach(function(entry) {
    const matches = extractionRegex.exec(entry)
    if (matches !== null) {
      traces.push({
        function: matches[1],
        file: matches[2],
        line: parseInt(matches[3], 10) || 1,
        col: parseInt(matches[4], 10) || 1,
      })
    }
  })

  return traces
}

export function capture() {
  const traces = fromStack(new Error().stack)
  // Remove self from the stack
  traces.shift()
  return traces
}
