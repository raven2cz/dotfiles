# Atom-Package-Deps

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/package-deps.svg)](https://greenkeeper.io/)

Atom-Package-Deps is a module that lets your atom package depend on other atom packages, It's quite simple and shows a nice progress bar as a notification as the packages are installed.

#### How it works?

You need to have an array of package deps in your package manifest, like

```js
{
  "name": "linter-ruby",
  ...
  "package-deps": ["linter"]
}
```

If you need to install package deps from a source other than https://atom.io, suffix a `#` character followed by a git remote (in any format supported by `apm install`):

```js
{
  "name": "linter-ruby",
  ...
  "package-deps": ["linter#steelbrain/linter"]
}
```

If you need to install specific version of a package, you can add the minimum required version to the package name (semver doesn't work!), separated by `:`:

```js
{
  "name": "linter-ruby",
  ...
  "package-deps": ["linter:2.0.0"]
}
```

Because the package installation is async, it returns a promise that resolves when all the dependencies have been installed.

```js
'use babel'

module.exports = {
  activate() {
    // replace the example argument 'linter-ruby' with the name of this Atom package
    require('atom-package-deps').install('linter-ruby')
      .then(function() {
        console.log('All dependencies installed, good to go')
      })
  }
}
```

While the package name argument of the `install()` function is optional it is recommended to pass it explicitly since otherwise the lookup of the package name inflicts an overhead of roughly a few milliseconds.

#### API

```js
function install(packageName = null, showPrompt = true)
```

#### Screenshots

Installation Prompt

<img src="https://cloud.githubusercontent.com/assets/4278113/22874485/10df8086-f1e8-11e6-8270-9b9823ba07f3.png">

Installation Progress

<img src="https://cloud.githubusercontent.com/assets/4278113/22874527/59b37c22-f1e8-11e6-968e-dfa857db7664.png">

Installation Complete

<img src="https://cloud.githubusercontent.com/assets/4278113/22874504/32294a88-f1e8-11e6-8741-81e368bb1649.png">


#### License
This project is licensed under the terms of MIT license, See the license file or contact me for more info.
