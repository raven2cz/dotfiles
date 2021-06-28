atom-linter
===========

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/atom-linter.svg)](https://greenkeeper.io/)

atom-linter is an npm helper module that you can import in your Linter Providers
and make things easier for yourself.

#### API

For full documentation of `exec` and `execNode` API, please refer to [`sb-exec README`](https://github.com/steelbrain/exec/blob/master/README.md)

```js
export const FindCache: Map
export function exec(command: String, args: Array<string> = [], options: Object): Promise
export function execNode(filePath: String, args: Array<string> = [], options: Object): Promise
export function parse(data: String, regex: String, options: Object = {flags: 'g'}): Array<Linter$Message>
export function generateRange(textEditor: TextEditor, lineNumber: Number = 0, colStart: Number = <firstTextColumn>): Array
export function find(directory: String, names: String | Array<string>): ?String
export function findCached(directory: String, names: String | Array<string>): ?String
export function findAsync(directory: String, names: String | Array<string>): Promise<?String>
export function findCachedAsync(directory: String, names: String | Array<string>): Promise<?String>
export function tempFile<T>(fileName: String, fileContents: String, callback: Function<T>): Promise<T>
export function tempFiles<T>(filesNames: Array<{ name: String, contents: String }>, callback: Function<T>): Promise<T>
```

#### Unique Spawning

To make sure that old processes spawned by your linter provider are terminated on a newer invocation, you can specify `uniqueKey: "my-linter"` in `exec` or `execNode` options. Please note that killed processes will return `null` as return value, so make sure to handle that.

Example:

```js
import atomLinter from 'atom-linter'

const myLinter = {
  // ...
  async lint(textEditor) {
    const output = atomLinter.exec('myprogram', ['parameter1', 'parameter2'], { uniqueKey: 'my-linter' })
    // NOTE: Providers should also return null if they get null from exec
    // Returning null from provider will tell base linter to keep existing messages
    if (output === null) {
      return null
    }
    // ... parse output and return messages
    return []
  }
}
```

#### License

This project is licensed under the terms of MIT License, see the LICENSE file for more info
