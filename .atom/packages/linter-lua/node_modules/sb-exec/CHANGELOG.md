# Changelog

## 4.0.0

- Rename `throwOnStdErr` to `throwOnStderr`
- Support `Buffer`s in `options.stdin`
- Kill all subprocesses properly on windows

## 3.1.0

- Provide a `.kill()` on spawned processes

## 3.0.3

- Handle `ENOENT` errors properly on Windows coming from `cmd.exe`

## 3.0.2

- Fix a bug where spawning `cmd.exe` would result in inception

## 3.0.1

- Correctly handle spaces in the program path

## 3.0.0

- Upgrade to `sb-npm-path@2.x` ( API BREAKING )
- Fix a bug on Windows where it would run certain programs incorrectly

## 2.0.5

- Remove `.flowconfig` from NPM package

## 2.0.4

- Fix a possible error where timeout would be passed to node
- Add support for non-string parameters ( Fixes #27 )

## 2.0.3

- Bump `consistent-env` version to include bug fixes

## 2.0.2

- Add `ignoreExitCode` option to ignore exit code when the stdout stream is empty

## 2.0.1

- Workaround several bugs on windows

## 2.0.0

- Add `exitCode` to return output when stream is `both`
- Throw if `stream` is `stderr` and there is no output, you can disable this by setting `allowEmptyStderr` option
- Throw if `stream` is `stdout` and exit code is non-zero

## 1.0.5

- Add fix for EXTPATH on windows

## 1.0.4

- Fix for Atom 1.7.0+ by setting env vars properly

## 1.0.3

- Fix a typo in Electron run as node var

## 1.0.2

- Add `local` option

## 1.0.1

- Make it work with `stdio: inherit`

## 1.0.0

- Initial release
