# Exec

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/exec.svg)](https://greenkeeper.io/)

Node's Process spawning APIs beautified

## Installation

```sh
npm install --save sb-exec
```

## API

```js
type $OptionsAccepted = {
  timeout?: number | Infinity, // In milliseconds
  stream?: 'stdout' | 'stderr'  | 'both',
  env: Object,
  stdin?: string | Buffer,
  local?: {
    directory: string,
    prepend?: boolean
  },
  throwOnStderr?: boolean = true,
  allowEmptyStderr?: boolean = false,
  ignoreExitCode?: boolean
} // Also supports all options of child_process::spawn

type PromisedProcess = {
  then(callback: Function): Promise
  catch(callback: Function): Promise
  kill(signal: number)
}

export function exec(filePath: string, parameters: array, options: $OptionsAccepted): PromisedProcess
export function execNode(filePath: string, parameters: array, options: $OptionsAccepted): PromisedProcess
```

## Explanation

### Promise callbacks

* `then` callback is supposed to accept one of these results, depending on `options.stream`:
  * `stdout` and `stderr` will result in a string, representing an stdout or stderr stream, respectively.
  * `both` will result in an object of `{stdout, stderr, exitCode}` representing their respective streams and an exit code of a process.
  * If `options.stream` is not provided it is assumed to be `stdout`, so a promise will result in a string representing an stdout stream.

### `options.local`

`options.local` adds node executables in `node_modules` relative to
`options.local.directory` to `PATH` like in npm scripts.

`options.local.prepend` prioritizes local executables over ones already in `PATH`.

## License

This project is licensed under the terms of MIT License, see the LICENSE file
for more info
