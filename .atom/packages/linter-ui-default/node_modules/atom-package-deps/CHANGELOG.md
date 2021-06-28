# Changelog

## 7.2.3

- Fix ungrouped dependencies not being installed in no-interaction/skip-groups mode. (Thanks @lierdakil)

## 7.2.2

- Another attempt to fix Windows usages - #332 (Thanks @UziTech)

## 7.2.1

- Fix compatibility with Windows usernames with spaces - #331 (Thanks @deankevorkian)

## 7.2.0

- Add Typescript definitions
- Fix installing dependencies in CI on Windows
- Allow purely string entries for name in dependencies

## 7.1.0

- Readd ability to hide user prompt

## 7.0.3

- Fix support for `notifications-plus` package (Thanks @UziTech)

## 7.0.2

- Fix a bug where error would be thrown if user already had one of the packages installed (Thanks @lierdakil)

## 7.0.1

- Fix a dev dependency accidentally slipping into `post-install` script

## 7.0.0

- **BREAKING** Change function signature to get rid of `promptUser`
- **BREAKING** Change format of `package-deps` in manifest from `"my-name:my-version"` to be `{ "name": "my-name", "minimumVersion": "my-version" }`
- **BREAKING** Instead of accepting a semver-range for version, you can now only specify a minimum version in `x.y.z` format, instead of for example `>=2`
- Add support for optional/group packages where users only have to install one of many, and are given a choice at runtime. Signature becomes `Dependency[][]` instead of `Dependency[]`
- Add support for using through CLI for CI and similar purposes

## 6.0.0

- Fix progress bar on newer Atom versions
- Use rollup to bundle dependencies to decrease load times (Thanks @aminya)

While there's no API breaking change, the distribution format and internal code has changed signficiantly enough that it
MAY have some bugs left despite our testing. Therefore, to not break existing expectations, I (@steelbrain) am pushing this
out as semver-major.

## 5.0.1

- Upgrade dependencies

## 5.0.0

- Name is now required
- When version is specified and package-deps determines currently installed to be outdated, latest version will be installed instead of the specified one

## 4.6.2

- Fix progress bar not showing up in newer versions of Atom

## 4.6.1

- Remove `sb-exec` in favor of `BufferedProcess` from Atom builtins
- Do not automatically enable `notifications` package if disabled. Instead log a warning to the console

## 4.6.0

- Remove config file usage, configs are now stored in Atom config store

## 4.5.0

- Enable prompting user by default
- Add `:$version` support to package dependencies

## 4.4.1

- Upgrade to latest `sb-config-file` that includes async getters so we don't avoid the event loop

## 4.4.0

- Add second parameter `showPrompt` to allow package authors to give user the choice to install dependencies

## 4.3.1

- Bump `sb-exec` from `2.x` to `3.x`. This should fix any flow related bugs in dependent packages

## 4.3.0

- Fix support for upcoming Atom versions
- Use babel style exports (backward compatible)

## 4.2.0

- Support git-based packages without repeatedly reinstalling

## 4.1.0

- Allow parallel installation of packages
- Better track success of package installs
- Handle packages installed from repositories
- Handle info message from apm during installs
- Stop hiding the first error message in some cases
- Support importing this module in babel with `import x from 'y'` instead of `import * as x from 'y'`

Thanks to @joelbarker2011 for helping out with his PRs!

## 4.0.1

- Remove outdated API from README

## 4.0.0

- Remove second parameter to `.install` (API breaking)
- Show a nice error notification when installation fails
- Make progress bar implementation more robust

## 3.0.9

- Bump `atom-package-path` minimum version

## 3.0.8

- Use `atom-package-path` to determine caller package name

## 3.0.7

- Simplify the regex used (reduce more than 50% regex steps)

## 3.0.6

- Supports guessing names of packages outside of main root

## 3.0.5

- Replace Linux-specific dependency `callsite` with cross-platform
  `sb-callsite`

## 3.0.4

- Fix a scenario when error would be thrown if package name guessing fails

## 3.0.3

- Use a more reliable way of guessing parent packages

## 3.0.2

- A few fixes for windows compatibility

## 3.0.1

- Workaround atom package activation race condition

## 3.0.0

- Internal cleanup
- Make name optional

## 2.1.3

- Don't enable already installed packages by default

## 2.1.2

- Fix progress bar for multiple dependencies
- Invoke apm just one time even for multiple dependencies

## 2.1.1

- Invoke apm with `--production`

## 2.1.0

- Introduced second parameter to install method

## 2.0.x

- Made some API breaking changes

## 1.x.x

- Basic API Introduced
