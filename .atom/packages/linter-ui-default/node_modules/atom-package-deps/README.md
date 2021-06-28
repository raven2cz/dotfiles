# Atom-Package-Deps

Atom-Package-Deps is a module that lets your atom package depend on other atom packages, It's quite simple and shows a nice progress bar as a notification as the packages are installed.

#### How it works?

You need to have an array of package deps in your package manifest, like

```js
{
  "name": "linter-ruby",
  ...
  "package-deps": [{ "name": "linter" }]
}
```

If only the name of the package is needed, you can specify the name directly as a string instead of an object for that entry:

```js
  "package-deps": ["linter"]
```

You can also specify the minimum required version (version not semver-range!) of the package, or give users a choice by specifying multiple ones.

```js
{
  "name": "linter-ruby",
  ...
  "package-deps": [
    // Add a dependency on a package:
    { "name": "linter", "minimumVersion": "2.0.0" },
    // Add a dependency in any of the following packages,
    // so if one is already installed, user is not prompted to install the other
    [ { "name": "linter" }, { "name": "atom-ide-ui" } ]
  ]
}
```

Because the package installation is async, it returns a promise that resolves when all the dependencies have been installed.

```js
'use babel'

module.exports = {
  activate() {
    // replace the example argument 'linter-ruby' with the name of this Atom package
    require('atom-package-deps')
      .install('linter-ruby')
      // ^ NOTE: This is the name of YOUR package, NOT the package you want to install.
      .then(function() {
        console.log('All dependencies installed, good to go')
      })
  },
}
```

#### API

You can use this package programatically via this exported interface:

```js
export function install(packageName: string, hideUserPrompt: boolean = false)
```

Alternatively, if you want to install dependencies via CLI, this package exposes a bin for that

```
Usage: atom-package-deps <directory> <hideUserPrompt = true>
```

#### Screenshots

Installation Prompt

<img src="https://cloud.githubusercontent.com/assets/4278113/22874485/10df8086-f1e8-11e6-8270-9b9823ba07f3.png">

Installation Prompt with choices:

<img src="https://user-images.githubusercontent.com/4278113/90339581-26e49c80-e00b-11ea-9488-fb5d64ee3f28.png">

Installation Progress

<img src="https://cloud.githubusercontent.com/assets/4278113/22874527/59b37c22-f1e8-11e6-968e-dfa857db7664.png">

Installation Complete

<img src="https://cloud.githubusercontent.com/assets/4278113/22874504/32294a88-f1e8-11e6-8741-81e368bb1649.png">

#### License

This project is licensed under the terms of MIT license, See the LICENSE file for more info.
