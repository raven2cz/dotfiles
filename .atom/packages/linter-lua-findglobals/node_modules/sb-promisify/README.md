# Promisify
A node module to help you convert callback-style functions to promises

## Installation

```js
npm install --save sb-promisify
```

## API

```js
export function promisifyAll(object, throwError = true)
export default function promisify(callback, throwError = true)
```

## Example Usage

Here's the default behavior

```js
'use babel'

import promisify from 'sb-promisify'
import fs from 'fs'

const readFile = promisify(fs.readFile)

readFile('/etc/passwd').then(function(contents) {
  console.log(contents.toString('utf8'))
}, function() {
  console.error('Unable to read file')
})
```

But if you set throwError to false, here's how it would react

```js
'use babel'

import promisify from 'sb-promisify'
import fs from 'fs'

const readFile = promisify(fs.readFile, false)

readFile('/etc/passwd').then(function(contents) {
  if (contents === null) {
    console.error('Unable to read file')
  } else {
    console.log(contents.toString('utf8'))
  }
})
```

## License
This module is licensed under the terms of MIT License. Check the LICENSE file for more info.
