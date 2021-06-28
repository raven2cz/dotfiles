# Changelog

## 4.7.0

* Use `sb-exec` for process execution, to include a bugfix for Atom 1.7.0

## 4.6.1

*  Republish because of an unknown deployment issue

## 4.6.0

*   Add `timeout` option to exec, with a default value of 10 seconds
*   Use `consistent-env` instead of `consistent-path`

## 4.5.1

*   Fix for runtimes which don't have the `atom` module

## 4.5.0

*   Internal cleanup

*   Fix a bug with findCachedAsync where it would throw error if requested file
    wasn't found (#105)

*   Fix a bug where text editors won't be validated properly for Atom
    versions < 1.4.0

*   Trim outputs of exec commands

## 4.4.0

*   Highlight the whole first line when no line is given

## 4.3.4

*   Do not add `g` flag to regex if it already exists

## 4.3.3

*   Switch to `named-js-regexp` instead of `xregexp` for `parse` method

## 4.3.2

*   Fix a bug where linter execution modifies `process.env`

## 4.3.1

*   Remove `createElement` helper, reason is nobody was using it (according to
    GitHub code search)

*   Upgrade `consistent-path` version to include fix for critical typo

## 4.3.0

*   Add `tempFiles` helper

## 4.2.0

*   Use `consistent-path` package to determine `$PATH` correctly on OSX

## 4.1.1

*   Export `FindCache`, now you can do `Helper.FindCache.clear()` to clear find
    cache

## 4.1.0

*   Add `findCachedAsync` helper
*   Add `findCached` helper

## 4.0.1

*   Upgrade dependencies

## 4.0.0

*   Use ES6 exports instead of commonjs

*   Remove `Helpers.findFile$` in favor of `Helpers.find$`

*   Use XRegExp.forEach instead of splitting given input by lines and applying
    regex over each line (mostly backward compatible, but no guarantee)

## 3.4.1

*   Revert ES6 exports to use commonjs again (broke compatibility with babel
    packages)

*   Rename `Helpers.findFile$` to `Helpers.find$` (also exported with previous
    names for backward compatibility)

*   Fix a non-critical bug in `Helpers.find$` where it won't search in drive
    root

## 3.4.0

*   Add `Helpers.findFileAsync`
*   Add dist files for inclusion in non-babel envs

## 3.3.9

*   Revert the changes in 3.3.2, `Range()`'s end point is exclusive, not
    inclusive.

## 3.3.8

*   Fix `rangeFromLineNumber` on files with mixed indentation

## 3.3.7

*   Force lineNumber in `rangeFromLineNumber` to be within buffer range

## 3.3.6

*   Handle column start in `rangeFromLineNumber`, when it is greater than line
    length

*   Handle negative column start values and invalid line numbers

## 3.3.5

*   Add `Helpers.createElement`

## 3.3.4

*   Handle invalid `lineNumber` and return a valid range

## 3.3.3

*   Fix an API deprecation with TextEditor

## 3.3.2

*   Fix a bug in `Helpers.rangeFromLineNumber`

## 3.3.1

*   Future proof a check

## 3.3.0

*   Add `flags` option to `parse` method

## 3.2.2

*   Show a nicer message for `EACCES` errors

## 3.2.1

*   Couple of fixes for `findFile`
*   Correct npm `test` script

## 3.2.0

*   Add support for third-argument to `rangeFromLineNumber`

## 3.1.4

*   Fixed an undefined variable reference

## 3.1.3

*   Added `tempFile` method

## 3.1.2

*   Added support for `both` streams

## 3.1.1

*   Pass the options on to `BufferedProcess`

## 3.1.0

*   Add `rangeFromLineNumber(textEditor, lineNumber)`

## 3.0.1

*   Reject with an Error, instead of a string if `stderr` encountered
    unexpectedly

## 3.0.0

*   Throw an error if something is seen on `stderr` when `throwOnStdErr` is true

## 2.0.5

*   Add `options.throwOnStdErr` to the `exec()` options, defaulting to false

## 2.0.4

*   Remove `OS` key properly on all platforms

## 2.0.3

*   Remove `OS` key from the environment

## 2.0.2

*   Use Atom's `BufferedProcess` instead of `child_process`
*   Throw an error if output is seen on `stderr`, unless stream is `stderr`

## 2.0.1

*   Copy Atom's environment to the spawned process

## 2.0.0

*   `execFilePath()` replaced by `execNode()`

## 1.0.3

*   Verify the data passed to `parse()` is a string

## 1.0.2

*   Add `findFile(startDir, names)`

## 1.0.1

*   Initial release
